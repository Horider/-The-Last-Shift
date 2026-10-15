(function(root){
 'use strict';
 const sprites={battery:'battery-red-table',blueBattery:'battery-blue',empty:'battery-red-table',powerbank:'battery-red-table',body:'tester-body',module:'tester-module',assembled:'tester-assembled',leads:'leads'};
 function create(){return {box:false,drawer:false,module:false,body:false,leads:false,turns:0,assembled:false,found:[]};}
 function collect(s,id){if(!['empty','powerbank','body','module','leads'].includes(id))return false;if(id==='empty'&&!s.box||['powerbank','body','leads'].includes(id)&&!s.drawer)return false;if(id==='module'&&s.turns<3)return false;if(['body','module','leads'].includes(id)){if(s[id])return false;s[id]=true;}else{if(s.found.includes(id))return false;s.found.push(id);}return true;}
 function turn(s){if(s.turns>=3)return false;s.turns++;return true;}
 function assemble(s){if(!s.body||!s.module||!s.leads||s.assembled)return false;s.assembled=true;return true;}
 function render(o){
 const {state:s,game,zone,portrait:p,D,t,inspect,change,approach,test,notify,storeItem,openInventory,inspectTester,readManual,readEngineeringNote}=o,fmt=p?'tall':'wide';
 const asset=n=>D['eng_'+n],pos=(a,b)=>p?b:a;
 let stem=!zone?'overview-clean':zone==='tools'?(s.box?'left-clean':'left-closed'):zone==='right'?(s.turns>=3?'right-empty':'right-clamped'):zone==='drawer'?(s.drawer?'drawer-clean':'drawer-closed'):'table-empty';
 const image=asset(stem+'-'+fmt),commands=[],layers=[];
 if(!zone||zone==='center'){
  const box=pos(!zone?[26,50,17,13]:[6,45,23,17],!zone?[14,46,27,7]:[7,40,36,11]);
  const n=commands.push(()=>zone?readManual(0):approach('center'))-1;
  layers.push('<button class="native-item scene-approach" data-eng="'+n+'" aria-label="'+t(zone?'Прочитать книгу инженера':'Подойти к книге и аккумуляторам',zone?'Read engineer handbook':'Approach handbook and batteries')+'" style="left:'+box[0]+'%;top:'+box[1]+'%;width:'+box[2]+'%;height:'+box[3]+'%"></button>');
 }

 function button(label,box,fn,art){const n=commands.push(fn)-1;const [x,y,w,h]=box;layers.push('<button class="'+(art?'eng-object':'native-item')+'" data-eng="'+n+'" aria-label="'+label+'" style="left:'+x+'%;top:'+y+'%;width:'+w+'%;height:'+h+'%">'+(art?'<img alt="" src="'+asset(art)+'">':'')+'</button>');}
 function available(id){const it=game.items.find(i=>i.id===id);return it&&!it.shipped&&!game.inventory?.includes(id)&&game.carry!==id;}
 function item(id,box){if(available(id))button(game.items.find(i=>i.id===id).name,box,()=>zone?inspect(id):approach('center'),sprites[id]);}
 function crank(){if(turn(s)){game.history.push({event:'vise-turn',turn:s.turns});change();notify(t('Рычаг повернулся.','The handle turned.'));}}
 function take(id){if(game.inventory.length>=6){notify(t('Инвентарь заполнен: 6/6.','Inventory full: 6/6.'));return;}if(collect(s,id)){game.history.push({event:'engineering-collect',item:id});storeItem(id);notify(t('Предмет в инвентаре.','Item stored.'));change();}}
 if(!zone){
 const patches=[{on:s.box,box:pos([0,22,15,33],[0,35,23,14])},{on:s.drawer,box:pos([8,70,49,25],[8,55,46,12])},{on:s.turns>=3,box:pos([80,45,20,29],[72,43,28,15])}];
 for(const patch of patches)if(patch.on){const [x,y,w,h]=patch.box;layers.push('<img class="engineering-state-patch" alt="" src="'+asset('overview-open-'+fmt)+'" style="clip-path:inset('+y+'% '+(100-x-w)+'% '+(100-y-h)+'% '+x+'%)">');}

 const regions=pos([[0,22,26,46],[75,30,25,43],[7,69,52,27],[26,42,49,26]],[[0,36,30,17],[75,37,25,18],[8,55,46,11],[30,45,43,9]]);
 ['tools','right','drawer','center'].forEach((id,i)=>button(t(['Инструменты','Тиски','Выдвижной ящик','Рабочий стол'][i],['Tools','Vise','Drawer','Worktop'][i]),regions[i],()=>approach(id)));
 button(t('Прочитать записку на стуле','Read note on stool'),pos([89,76,11,13],[85,60,15,10]),readEngineeringNote);
 ['battery','blueBattery','empty','powerbank'].forEach((id,i)=>{if(game.table.includes(id))item(id,pos([47+i*8,49,8,11],[52+i*10,46,10,6]));});
 if(game.table.includes('assembled'))button(t('Тестер','Tester'),pos([66,51,16,14],[66,48,20,8]),()=>approach('center'),sprites.assembled);
 }else if(zone==='tools'){
 button(t(s.box?'Закрыть красный ящик':'Открыть красный ящик',s.box?'Close red toolbox':'Open red toolbox'),pos([12,21,44,42],[6,36,59,26]),()=>{s.box=!s.box;change()});
 if(s.box&&!s.found.includes('empty'))button(t('Достать красный аккумулятор','Retrieve red battery'),pos([26,31,20,22],[25,39,30,12]),()=>take('empty'),sprites.empty);layers.push('<style>.eng-object[aria-label="Достать красный аккумулятор"],.eng-object[aria-label="Retrieve red battery"]{clip-path:inset(0 0 18% 0);filter:brightness(.82)}</style>');
 if(available('flashlight'))button(t('Осмотреть фонарь','Inspect flashlight'),pos([50,46,7,19],[52,53,9,12]),()=>inspect('flashlight'));
 }else if(zone==='right'){
 if(!s.module&&s.turns>=3)button(t('Забрать насадку','Take attachment'),pos([54,33,16,16],[50,42,29,8]),()=>take('module'),sprites.module);
 if(!s.module&&s.turns<3)button(t(s.turns===3?'Забрать насадку':'Насадка зажата',s.turns===3?'Take attachment':'Attachment clamped'),pos([54,31,16,16],[50,42,29,8]),()=>s.turns===3?take('module'):notify(t('Деталь зажата.','The part is clamped.')));
 if(s.turns<3)button(t('Повернуть рычаг тисков','Turn vise handle'),pos([53,76,38,16],[40,66,57,10]),crank);
 if(available('memory')&&game.phase==='epilogue')button(t('Память ЛУЧа','LUCH memory'),pos([12,58,25,13],[0,54,30,7]),()=>inspect('memory'));
 }else if(zone==='drawer'){
 button(t(s.drawer?'Закрыть ящик':'Открыть ящик',s.drawer?'Close drawer':'Open drawer'),pos(s.drawer?[5,57,89,21]:[12,27,76,25],s.drawer?[5,51,88,14]:[15,26,67,19]),()=>{s.drawer=!s.drawer;change()});
 if(s.drawer){if(!s.found.includes('powerbank'))button(t('Достать аккумулятор','Retrieve battery'),pos([39,29,20,22],[44,30,30,12]),()=>take('powerbank'),sprites.powerbank);
 if(!s.leads)button(t('Забрать провода','Take test leads'),pos([16,32,22,19],[17,29,29,12]),()=>take('leads'),sprites.leads);
 if(!s.body)button(t('Достать корпус тестера','Retrieve tester body'),pos([56,37,26,19],[46,41,37,10]),()=>take('body'),sprites.body);}
 }else{
 const boxes=pos([[30,48,16,22],[47,48,16,22],[30,65,16,22],[47,65,16,22]],[[4,49,25,12],[29,49,25,12],[4,63,25,12],[29,63,25,12]]);
 ['battery','blueBattery','empty','powerbank'].forEach((id,i)=>{if(game.table.includes(id))item(id,boxes[i]);});
 if(game.table.includes('assembled'))button(t('Тестер','Tester'),pos([68,50,28,29],[55,62,43,19]),inspectTester,sprites.assembled);
 }
 const action=(label,fn)=>{let n=commands.push(fn)-1;return '<button data-eng="'+n+'">'+label+'</button>'};
 let toolbar=zone?action(t('← Общий план','← Room overview'),()=>approach(null)):'';
 if(zone==='tools')toolbar+=action(t(s.box?'Закрыть ящик':'Открыть ящик',s.box?'Close toolbox':'Open toolbox'),()=>{s.box=!s.box;change()});
 if(zone==='drawer')toolbar+=action(t(s.drawer?'Закрыть ящик':'Открыть ящик',s.drawer?'Close drawer':'Open drawer'),()=>{s.drawer=!s.drawer;change()});


 if(zone==='center')toolbar+=action(t('Выложить предметы','Place items'),openInventory)+(game.table.includes('assembled')?action(t('Проверить заряд','Test charge'),test):'');
 if(zone)toolbar+='<button id="scene-zoom-out">−</button><button id="scene-zoom-in">+</button>';
 const screen=document.getElementById('screen');screen.classList.add('explore-screen');screen.innerHTML='<h1 class="screen-title">'+t('Инженерный кабинет','Engineering workshop')+'</h1><div class="explore-layout" id="explore-layout"><div class="explore-canvas" id="explore-canvas"><div class="explore-plane" id="explore-plane"><img src="'+image+'" alt="'+t('Инженерный кабинет','Engineering workshop')+'">'+layers.join('')+'</div></div><div class="explore-controls" id="explore-controls"><div class="explore-toolbar">'+toolbar+'</div></div></div>';
 screen.querySelectorAll('[data-eng]').forEach(b=>b.onclick=commands[+b.dataset.eng]);
 const img=screen.querySelector('.explore-plane>img');
 let view;const attach=()=>{if(!img.isConnected)return;view?.destroy();FrameViewport.set(img.naturalWidth/img.naturalHeight,false);view=RoomExplore.attach(document.getElementById('explore-layout'),document.getElementById('explore-canvas'),document.getElementById('explore-plane'),document.getElementById('explore-controls'),img.naturalWidth,img.naturalHeight,[0,0,100,100]);};
 img.onload=attach;if(img.complete&&img.naturalWidth)attach();
 screen.querySelector('#scene-zoom-out')?.addEventListener('click',()=>view?.zoom(view.getZoom()/1.25));screen.querySelector('#scene-zoom-in')?.addEventListener('click',()=>view?.zoom(view.getZoom()*1.25));
 return {destroy(){view?.destroy();img.onload=null;}};
 }
 root.Engineering={create,collect,turn,assemble,render,sprites};if(typeof module!=='undefined')module.exports=root.Engineering;
})(typeof window!=='undefined'?window:globalThis);

