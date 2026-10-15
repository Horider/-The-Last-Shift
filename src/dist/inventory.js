(function(root){
 'use strict';
 const RED=['battery','empty','powerbank'],PARTS=['body','module','leads'];
 function initialize(s,rng=Math.random){
  s.inventory=[];const values=[86,65,3];for(let i=values.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[values[i],values[j]]=[values[j],values[i]];}
  s.batteryCharges={blueBattery:92,...Object.fromEntries(RED.map((id,i)=>[id,values[i]]))};
  for(const id of [...RED,'blueBattery']){const it=s.items.find(x=>x.id===id);if(it){it.description=(id==='blueBattery'?'Синий':'Красный')+' аварийный аккумулятор. Металлический корпус с двумя клеммами.';it.facts=[id==='blueBattery'?'Синий':'Красный','Аварийный'];}}
  return s;
 }
 function add(s,id){if(!['playing','epilogue'].includes(s.phase)||s.inventory.includes(id))return false;const it=s.items.find(x=>x.id===id);if(it?.shipped||!it&&!PARTS.includes(id))return false;s.inventory.push(id);return true;}
 function remove(s,id){const n=s.inventory.indexOf(id);if(n<0)return false;s.inventory.splice(n,1);if(s.carry===id)s.carry=null;return true;}
 function combine(s,selected){if(selected.length!==3||!PARTS.every(id=>selected.includes(id)&&s.inventory.includes(id)))return false;PARTS.forEach(id=>remove(s,id));s.inventory.push('assembled');return true;}
 function install(C){const create=C.createState,submit=C.submit;C.createState=()=>initialize(create());C.pickup=(s,id)=>add(s,id);C.submit=s=>{const id=s.carry;const r=submit(s);if(r.type==='accepted')remove(s,id);return r;};}
 const api={RED,PARTS,initialize,add,remove,combine,install};root.ShiftInventory=api;if(root.ShiftCore)install(root.ShiftCore);if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
