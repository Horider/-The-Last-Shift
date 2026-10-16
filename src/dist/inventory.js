(function(root){
 'use strict';
 const RED=['battery','empty','powerbank'],PARTS=['body','module','leads'];
 function initialize(s,rng=Math.random){
  s.inventory=[];s.table=['battery','blueBattery'];s.canFlipBattery=false;s.emptyBatteries=[];const values=[86,28,0];for(let i=values.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[values[i],values[j]]=[values[j],values[i]];}
  s.batteryCharges={blueBattery:92,...Object.fromEntries(RED.map((id,i)=>[id,values[i]]))};
  for(const id of [...RED,'blueBattery']){const it=s.items.find(x=>x.id===id);if(it){const blue=id==='blueBattery';it.name=blue?'Синий аккумулятор':'Красный аккумулятор';it.description=(blue?'Синий':'Красный')+' аккумулятор. Металлический корпус с двумя клеммами. Назначение требует уточнения по документации станции.';it.facts=[blue?'Синий':'Красный','Назначение не установлено'];}}
  return s;
 }
 function add(s,id){if(!['playing','epilogue'].includes(s.phase)||s.inventory.includes(id)||s.inventory.length>=6)return false;const it=s.items.find(x=>x.id===id);if(it?.shipped||!it&&!PARTS.includes(id)&&id!=='assembled')return false;s.inventory.push(id);s.table=s.table.filter(x=>x!==id);return true;}
 function remove(s,id){const n=s.inventory.indexOf(id);if(n<0)return false;s.inventory.splice(n,1);if(s.carry===id)s.carry=null;return true;}
 function combine(s,selected){if(selected.length!==3||!PARTS.every(id=>selected.includes(id)&&s.inventory.includes(id)))return false;PARTS.forEach(id=>remove(s,id));s.inventory.push('assembled');return true;}
 function place(s,ids){if(!ids.length||!ids.every(id=>s.inventory.includes(id)&&[...RED,'blueBattery','assembled'].includes(id)))return false;ids.forEach(id=>{remove(s,id);if(!s.table.includes(id))s.table.push(id);});return true;}
 function canTest(s){return s.table.includes('assembled')&&[...RED,'blueBattery'].some(id=>s.table.includes(id));}
 function recordBack(s,id){if(!s.canFlipBattery||!(id in s.batteryCharges))return false;if(s.batteryCharges[id]===0&&!s.emptyBatteries.includes(id))s.emptyBatteries.push(id);if(s.powerSeen&&!s.powerSeen.includes(id))s.powerSeen.push(id);return true;}
 function recordMeasurement(s,id){if(!canTest(s)||!s.table.includes(id)||!(id in s.batteryCharges))return false;(s.measuredCharges??={})[id]=s.batteryCharges[id];if(s.batteryCharges[id]===0&&!s.emptyBatteries.includes(id))s.emptyBatteries.push(id);return true;}
 function batteryInfo(s,id){if(!(id in s.batteryCharges))return null;const measured=s.measuredCharges?.[id]??null,known=measured!==null||!!s.powerSeen?.includes(id);return {known,charged:known?s.batteryCharges[id]>0:null,measured};}
 function statusLabel(s,id,t=r=>r){const info=batteryInfo(s,id);if(!info?.known)return '';return t(info.charged?'Заряжен':'Не заряжен',info.charged?'Charged':'Not charged')+(info.measured===null?'':' · '+info.measured+'%');}
 function batteryFacts(s,id,t=r=>r){const info=batteryInfo(s,id);if(!info)return [];return [t(id==='blueBattery'?'Синий':'Красный',id==='blueBattery'?'Blue':'Red'),info.known?t(info.charged?'Заряжен':'Не заряжен',info.charged?'Charged':'Not charged'):t('Состояние не проверено','State not checked'),info.measured===null?t('Заряд не измерен','Charge not measured'):t('Заряд: ','Charge: ')+info.measured+'%'];}
 function install(C){const create=C.createState,submit=C.submit;C.createState=()=>initialize(create());C.pickup=(s,id)=>add(s,id);C.submit=s=>{const id=s.carry;const r=submit(s);if(r.type==='accepted')remove(s,id);return r;};}
 const api={RED,PARTS,initialize,add,remove,combine,place,canTest,recordBack,recordMeasurement,batteryInfo,batteryFacts,statusLabel,install};root.ShiftInventory=api;if(root.ShiftCore)install(root.ShiftCore);if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
