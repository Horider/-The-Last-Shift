(function(root){
 'use strict';
 const nodes={
 tall:{start:[46,83],dock:[50,76],lower:[50,70],center:[50,42],luch:[50,12],ll:[33,42],la:[21,34],lab:[21,25],tr:[67,42],ta:[80,34],technical:[80,25],kl:[34,70],ka:[22,65],kitchen:[22,54],cr:[66,70],ca:[80,65],captain:[80,54],crate:[54,81],send:[49,90]},
 wide:{start:[47.5,87],dock:[50,69],lower:[50,53],center:[50,41],luch:[50,18],ll:[32,33],la:[14.5,33],lab:[14.5,24],tr:[68,33],ta:[85,33],technical:[85,24],kl:[30,70],ka:[14.5,70],kitchen:[14.5,61],cr:[70,70],ca:[85,70],captain:[85,61],crate:[56,86],send:[49,96]}
 };
 const edges=[['start','dock'],['dock','lower'],['lower','center'],['center','luch'],['center','ll'],['ll','la'],['la','lab'],['center','tr'],['tr','ta'],['ta','technical'],['lower','kl'],['kl','ka'],['ka','kitchen'],['lower','cr'],['cr','ca'],['ca','captain'],['start','crate'],['start','send']];
 function route(from,to){const queue=[[from]],seen=new Set([from]);while(queue.length){const p=queue.shift(),n=p.at(-1);if(n===to)return p;for(const e of edges){const next=e[0]===n?e[1]:e[1]===n?e[0]:null;if(next&&!seen.has(next)){seen.add(next);queue.push([...p,next]);}}}return [];}
 function direction(dx,dy){return (Math.round(Math.atan2(dx,-dy)/(Math.PI/4))+8)%8;}
 function attach(plane,src,start,paused){const sprite=document.createElement('span');sprite.className='walking-robot';sprite.setAttribute('aria-hidden','true');sprite.style.backgroundImage=`url('${src}')`;plane.appendChild(sprite);let node=start,way=[],progress=0,raf=0,last=0,done=null,dead=false;const layout=()=>plane.parentElement.classList.contains('wide-map')?'wide':'tall';let facing=0;
 function draw(){const ns=nodes[layout()],a=ns[node],b=way.length?ns[way[0]]:a,x=a[0]+(b[0]-a[0])*progress,y=a[1]+(b[1]-a[1])*progress;if(way.length)facing=direction((b[0]-a[0])*plane.clientWidth,(b[1]-a[1])*plane.clientHeight);sprite.style.left=x+'%';sprite.style.top=y+'%';sprite.style.backgroundPosition=`${facing%4/3*100}% ${Math.floor(facing/4)*100}%`;sprite.dataset.direction=String(facing);sprite.dataset.node=node;}
 function tick(now){if(dead)return;const dt=last?Math.min(.25,(now-last)/1000):0;last=now;if(way.length&&!paused()){const ns=nodes[layout()],a=ns[node],b=ns[way[0]],dist=Math.hypot((b[0]-a[0])*plane.clientWidth/100,(b[1]-a[1])*plane.clientHeight/100);progress+=dt*Math.max(110,plane.clientHeight*.38)/Math.max(1,dist);if(progress>=1){node=way.shift();progress=0;if(!way.length){plane.classList.remove('robot-travelling');draw();const fn=done;done=null;fn?.(node);return;}}}draw();raf=requestAnimationFrame(tick);}
 draw();const ro=new ResizeObserver(draw);ro.observe(plane);return {go(target,callback){if(way.length)return;way=route(node,target).slice(1);done=callback;progress=0;last=0;if(!way.length){callback(node);return;}plane.classList.add('robot-travelling');raf=requestAnimationFrame(tick);},destroy(){dead=true;cancelAnimationFrame(raf);ro.disconnect();sprite.remove();}};
 }
 root.RobotRoute={nodes,edges,route,direction,attach};if(typeof module!=='undefined'&&module.exports)module.exports={nodes,edges,route,direction};
})(typeof window!=='undefined'?window:globalThis);
