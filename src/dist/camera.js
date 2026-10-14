(function(root){
 'use strict';
 function fit(viewWidth,viewHeight,zoom=1,panX=0,panY=0){const base=Math.max(viewWidth/1536,viewHeight/1024),scale=base*Math.max(1,Math.min(1.22,zoom)),width=1536*scale,height=1024*scale;return {width,height,x:(viewWidth-width)/2+Math.max(-(width-viewWidth)/2,Math.min((width-viewWidth)/2,panX)),y:(viewHeight-height)/2+Math.max(-(height-viewHeight)/2,Math.min((height-viewHeight)/2,panY))};}
 function attach(view,plane,initial={}){let zoom=initial.zoom||1,panX=initial.panX||0,panY=initial.panY||0,origin=null,moved=false;const points=new Map();let pinch=null;
  function update(){const g=fit(view.clientWidth,view.clientHeight,zoom,panX,panY);panX=g.x-(view.clientWidth-g.width)/2;panY=g.y-(view.clientHeight-g.height)/2;plane.style.width=g.width+'px';plane.style.height=g.height+'px';plane.style.transform=`translate(${g.x}px,${g.y}px)`;return g;}
  function set(next){zoom=Math.max(1,Math.min(1.22,next));update();document.querySelectorAll('[data-camera-zoom]').forEach(b=>b.disabled=b.dataset.cameraZoom==='in'?zoom>=1.22:zoom<=1);}
  function down(e){points.set(e.pointerId,{x:e.clientX,y:e.clientY});origin={x:e.clientX,y:e.clientY,px:panX,py:panY};moved=false;if(points.size===2){const [a,b]=[...points.values()];pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom};}}
  function move(e){if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size>=2&&pinch){const [a,b]=[...points.values()];moved=true;set(pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,pinch.distance));e.preventDefault();return;}if(origin){const dx=e.clientX-origin.x,dy=e.clientY-origin.y;if(moved||Math.hypot(dx,dy)>7){moved=true;view.setPointerCapture(e.pointerId);panX=origin.px+dx;panY=origin.py+dy;update();origin.px=panX-dx;origin.py=panY-dy;e.preventDefault();}}}
  function up(e){points.delete(e.pointerId);if(!points.size)origin=null;else if(points.size===1){const p=[...points.values()][0];origin={x:p.x,y:p.y,px:panX,py:panY};}if(points.size<2)pinch=null;}
  function click(e){if(moved){e.stopImmediatePropagation();e.preventDefault();moved=false;}}
  view.addEventListener('pointerdown',down);view.addEventListener('pointermove',move,{passive:false});view.addEventListener('pointerup',up);view.addEventListener('pointercancel',up);view.addEventListener('click',click,true);const resize=()=>update();window.addEventListener('resize',resize);update();
  return {set,getZoom:()=>zoom,getState:()=>({zoom,panX,panY}),destroy(){window.removeEventListener('resize',resize);view.removeEventListener('pointerdown',down);view.removeEventListener('pointermove',move);view.removeEventListener('pointerup',up);view.removeEventListener('pointercancel',up);view.removeEventListener('click',click,true);}};
 }
 root.RoomCamera={fit,attach};if(typeof module!=='undefined'&&module.exports)module.exports={fit};
})(typeof window!=='undefined'?window:globalThis);
