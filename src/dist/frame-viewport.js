(function(root){
 function fit(w,h,ratio){return w/h>ratio?{width:h*ratio,height:h}:{width:w,height:w/ratio};}
 let ratio=2,adaptive=false;
 function update(){const w=document.documentElement.clientWidth,h=window.visualViewport?.height||window.innerHeight,wide=w>=h,tabletPortrait=!wide&&w>600,r=adaptive?(wide||tabletPortrait?1672/941:910/1729):ratio,g=fit(w,h,r),view=document.getElementById('game');view.style.width=g.width+'px';view.style.height=g.height+'px';view.classList.toggle('compact-frame',g.height<480);view.classList.toggle('rotate-hint',tabletPortrait);}
 function set(r,isMap=false){ratio=r;adaptive=isMap;update();}
 if(typeof window!=='undefined'){window.addEventListener('resize',update);window.visualViewport?.addEventListener('resize',update);}
 root.FrameViewport={fit,set};if(typeof module!=='undefined'&&module.exports)module.exports={fit};
})(typeof window!=='undefined'?window:globalThis);
