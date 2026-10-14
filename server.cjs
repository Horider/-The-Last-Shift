const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=__dirname,project=crypto.createHash('sha256').update(root).digest('hex').slice(0,16),stateDir=path.join(root,'.local');
const server=http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(name==='/')name='/index.html';}catch{res.writeHead(400);return res.end();}
 if(name==='/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify({app:'last-shift-versions',project,port:server.address().port,pid:process.pid}));}
 if(!(name==='/index.html'||/^\/releases\/[^/]+\/assets\/[a-z0-9-]+\.png$/.test(name)||/^\/releases\/[^/]+\/index\.html$/.test(name))){res.writeHead(404);return res.end('Not found');}
 const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 // Stream the large offline bundles instead of buffering all versions in memory.
 fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':name.endsWith('.png')?'image/png':'text/html; charset=utf-8','Content-Length':stat.size,'Cache-Control':'no-store'});const stream=fs.createReadStream(file);stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);});
});
let retried=false;server.on('error',err=>{if(err.code==='EADDRINUSE'&&!retried){retried=true;return server.listen(0,'127.0.0.1');}console.error(err.message);process.exitCode=1;});
server.on('listening',()=>{const port=server.address().port,url=`http://127.0.0.1:${port}/`;fs.mkdirSync(stateDir,{recursive:true});fs.writeFileSync(path.join(stateDir,'server.json'),JSON.stringify({app:'last-shift-versions',project,port,pid:process.pid,url}));console.log('Version selector: '+url);});
server.listen(Number(process.argv[2]||4174),'127.0.0.1');
