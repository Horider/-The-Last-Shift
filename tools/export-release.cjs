const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'src/dist'),version=process.argv[2],description=process.argv[3]||'Новая сохранённая сборка';
if(!version||!/^\d+\.\d+(?:\.\d+)?(?:-[a-z0-9]+)?$/.test(version))throw Error('Usage: node tools/export-release.cjs 0.6 "Description"');
const preview=process.argv.includes('--preview'),dir=path.join(root,'releases',preview?'preview':version);if(!preview&&fs.existsSync(dir))throw Error('Version '+version+' already exists. Choose a NEW version. Existing snapshots are never overwritten.');
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
html=html.replace(/<link rel="stylesheet" href="([a-z0-9-]+\.css)">/g,(_,f)=>'<style>'+fs.readFileSync(path.join(dist,f),'utf8')+'</style>');
const files=[...html.matchAll(/<script defer src="([a-z0-9-]+\.js)"><\/script>/g)].map(m=>m[1]);
const sandbox={};vm.createContext(sandbox);for(const f of ['core.js','rooms.js','mobile-data.js'])vm.runInContext(fs.readFileSync(path.join(dist,f),'utf8'),sandbox,{timeout:1500});
const needed=new Set(Object.values(sandbox.ShiftRooms.ROOMS).flatMap(r=>[r.image,r.clean]));for(const [k,v]of Object.entries(sandbox.ShiftMobileData))if(typeof v==='string'&&v.startsWith('assets/'))needed.add(v);
const assets={};for(const n of needed){const absolute=path.resolve(dist,n);if(!absolute.startsWith(dist+path.sep)||!n.endsWith('.png'))throw Error('Invalid asset: '+n);assets[n]='data:image/png;base64,'+fs.readFileSync(absolute).toString('base64');}
let code='window.ShiftAssets='+JSON.stringify(assets)+';\n';for(const f of files){code+=fs.readFileSync(path.join(dist,f),'utf8')+'\n';html=html.replace(`<script defer src="${f}"></script>`,'');}new vm.Script(code);
html=html.replace('</body>',()=>'<script>'+code.replace(/<\/script/gi,'<\\/script')+'</script></body>');
fs.mkdirSync(dir,{recursive:preview});fs.writeFileSync(path.join(dir,'index.html'),html,{flag:preview?'w':'wx'});
if(preview){console.log('Built temporary preview for browser QA');}else{fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify({version,description,sha256:crypto.createHash('sha256').update(html).digest('hex'),createdAt:new Date().toISOString(),standalone:true},null,2),{flag:'wx'});require('./update-menu.cjs');console.log('Saved immutable release '+version);}
