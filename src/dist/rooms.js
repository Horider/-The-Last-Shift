(function(root){
 'use strict';
 const ROOMS={
  kitchen:{name:'Кухня',note:'Здесь ещё пахнет утренним кофе.',image:'assets/kitchen-v3.png',clean:'assets/kitchen-clean-v3.png'},
  captain:{name:'Каюта капитана',note:'Курс домой начинается с маленьких вещей.',image:'assets/captain-v3.png',clean:'assets/captain-clean-v3.png'},
  lab:{name:'Лаборатория',note:'Тихий шелест. Почти все сотрудники на месте.',image:'assets/lab-v3.png',clean:'assets/lab-clean-v3.png'},
  technical:{name:'Технический отдел',note:'Всё работает. Просто немного устало.',image:'assets/technical-v3.png',clean:'assets/technical-clean-v3.png'}
 };
 // Bottom-centre anchors match the actual painted work surfaces.
 const PLACEMENTS={
  battery:{room:'technical',x:31,y:60,w:7.4,atlas:0},
  empty:{room:'technical',x:51,y:59,w:7.4,atlas:1},
  coffee:{room:'kitchen',x:32,y:63,w:9.5,atlas:2},
  ration:{room:'kitchen',x:68,y:61,w:5.8,atlas:3},
  map:{room:'captain',x:30,y:56,w:11,atlas:4},
  photo:{room:'captain',x:58,y:49,w:5.8,atlas:5},
  plant:{room:'lab',x:33,y:68,w:10,atlas:6},
  plastic:{room:'lab',x:69,y:66,w:9,atlas:7},
  toy:{room:'captain',x:80,y:48,w:8.5,atlas:8},
  memory:{room:'technical',x:70,y:55,w:7.4,atlas:9}
 };
 function visible(s,room){return s.items.filter(i=>PLACEMENTS[i.id].room===room&&!i.shipped&&s.carry!==i.id&&(i.id!=='memory'||s.phase==='epilogue')&&(s.phase!=='epilogue'||i.id==='memory'));}
 function returnHome(s){if(!s.carry)return false;const p=PLACEMENTS[s.carry];return root.ShiftCore.drop(s,p.x,p.y);}
 const BOUNDS={battery:[25.5,38.4,4.1,9.5],empty:[49.5,38.6,4.6,9.6],coffee:[28.9,42.2,7.8,14.8],ration:[64.7,47.2,4.4,10],map:[20.8,47,14.6,7.4],photo:[40.7,36.6,4.8,9.6],plant:[22.2,29.7,7.3,11.6],plastic:[67.7,34.6,8.6,15.2],toy:[83,31.6,8,10.8],memory:[67.2,48,8.8,5.8]};
 for(const [id,box] of Object.entries(BOUNDS)){const p=PLACEMENTS[id];p.box=box;p.x=box[0]+box[2]/2;p.y=box[1]+box[3]/2;}
 function patchBox(id){const [l,t,w,h]=BOUNDS[id];return [l-.8,t-.8,w+1.6,h+1.6];}
 const api={ROOMS,PLACEMENTS,patchBox,visible,returnHome};root.ShiftRooms=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
