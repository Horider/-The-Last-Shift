(function(root){
 'use strict';
 // One uniform scale for art and its interactive objects. Never scale X and Y separately.
 function fit(vw,vh,iw,ih){const scale=Math.max(vw/iw,vh/ih);return {scale,width:iw*scale,height:ih*scale,x:(vw-iw*scale)/2,y:(vh-ih*scale)/2};}
 function attach(view,bg,screen,kind,data){
  const plane=document.createElement('div');plane.className='scene-art';
  if(kind==='hub'||kind==='crate'){for(const child of [...screen.children])if(!child.classList.contains('screen-title'))plane.appendChild(child);screen.appendChild(plane);}
  function update(){const wide=view.clientWidth/view.clientHeight>=1,src=data[kind+(wide?'Wide':'')],g=fit(view.clientWidth,view.clientHeight,wide?1774:852,wide?887:1846);screen.classList.toggle('wide-art',wide);if(bg.getAttribute('src')!==src)bg.src=src;bg.style.width=g.width+'px';bg.style.height=g.height+'px';bg.style.transform=`translate(${g.x}px,${g.y}px)`;const ph=wide?g.height:g.width*1.5,py=wide?g.y:g.y+(kind==='crate'?g.height*.228:(g.height-ph)/2);plane.style.width=g.width+'px';plane.style.height=ph+'px';plane.style.transform=`translate(${g.x}px,${py}px)`;screen.dataset.artScale=String(g.scale);}
  window.addEventListener('resize',update);update();
  return {destroy(){window.removeEventListener('resize',update);bg.removeAttribute('style');}};
 }
 root.SceneArt={fit,attach};if(typeof module!=='undefined'&&module.exports)module.exports={fit};
})(typeof window!=='undefined'?window:globalThis);
