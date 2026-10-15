(function(root){
 'use strict';
 const sprites={battery:'battery-red-table',blueBattery:'battery-blue',empty:'battery-red-table',powerbank:'battery-red-table',body:'tester-body',module:'tester-module',assembled:'tester-assembled',leads:'leads'};
 function create(){return {box:false,drawer:false,module:false,body:false,leads:false,turns:0,assembled:false,found:[]};}
 function collect(s,id){if(!['empty','powerbank','body','module','leads'].includes(id))return false;if(id==='empty'&&!s.box||['powerbank','body','leads'].includes(id)&&!s.drawer)return false;if(id==='module'&&s.turns<3)return false;if(['body','module','leads'].includes(id)){if(s[id])return false;s[id]=true;}else{if(s.found.includes(id))return false;s.found.push(id);}return true;}
 function turn(s){if(s.turns>=3)return false;s.turns++;return true;}
 function assemble(s){if(!s.body||!s.module||!s.leads||s.assembled)return false;s.assembled=true;return true;}
 function render(o){
 const {state:s,game,zone,portrait:p,D,t,inspect,change,approach,test,notify}=o,fmt=p?'tall':'wide';
 const asset=n=>D['eng_'+n],pos=(a,b)=>p?b:a;
 let stem=!zone?'overview-clean':zone==='tools'?(s.box?'left-clean':'left-closed'):zone==='right'?(s.turns<3?'right-clamped':'right-empty'):zone==='drawer'?(s.drawer?'drawer-clean':'drawer-closed'):'table-empty';
 const image=asset(stem+'-'+fmt),commands=[],layers=[];
 function button(label,box,fn,art){const n=commands.push(fn)-1;const [x,y,w,h]=box;layers.push('<button class="'+(art?'eng-object':'native-item')+'" data-eng="'+n+'" aria-label="'+label+'" style="left:'+x+'%;top:'+y+'%;width:'+w+'%;height:'+h+'%">'+(art?'<img alt="" src="'+asset(art)+'">':'')+'</button>');}
 function available(id){const it=game.items.find(i=>i.id===id);return it&&!it.shipped&&game.carry!==id;}
 function item(id,box){if(available(id))button(game.items.find(i=>i.id===id).name,box,()=>inspect(id),sprites[id]);}
 function crank(){if(turn(s)){game.history.push({event:'vise-turn',turn:s.turns});change();notify(t('Поворот рычага: ','Handle turn: ')+s.turns+'/3');}}
 function take(id){if(collect(s,id)){game.history.push({event:'engineering-collect',item:id});notify(t('Находка перенесена на центральный стол.','The find is now on the central worktop.'));change();}}
 if(!zone){
 const points=p?[[18,45],[86,48],[32,58],[50,49]]:[[17,51],[86,55],[32,79],[49,55]];
 ['tools','right','drawer','center'].forEach((id,i)=>{const [x,y]=points[i];const n=commands.push(()=>approach(id))-1;layers.push('<button class="zone-entry" data-eng="'+n+'" aria-label="'+t('Подойти к зоне ','Approach area ')+(i+1)+'" style="left:'+x+'%;top:'+y+'%">'+(i+1)+'</button>')});
 item('battery',pos([40,46,8,12],[40,44,10,6]));item('blueBattery',pos([51,46,8,12],[52,44,10,6]));
 }else if(zone==='tools'){
 button(t(s.box?'Закрыть красный ящик':'Открыть красный ящик',s.box?'Close red toolbox':'Open red toolbox'),pos([12,21,44,42],[6,36,59,26]),()=>{s.box=!s.box;change()});
 if(s.box&&!s.found.includes('empty'))button(t('Достать красный аккумулятор','Retrieve red battery'),pos([26,35,20,22],[25,43,30,12]),()=>take('empty'),sprites.empty);
 if(available('flashlight'))button(t('Осмотреть фонарь','Inspect flashlight'),pos([50,46,7,19],[52,53,9,12]),()=>inspect('flashlight'));
 }else if(zone==='right'){
 if(!s.module)button(t(s.turns===3?'Забрать насадку':'Насадка зажата',s.turns===3?'Take attachment':'Attachment clamped'),pos([49,29,28,25],[37,43,43,15]),()=>s.turns===3?take('module'):notify(t('Нажми три раза на рычаг тисков.','Turn the vise handle three times.')),sprites.module);
 if(s.turns<3)button(t('Повернуть рычаг тисков','Turn vise handle'),pos([53,76,38,16],[40,66,57,10]),crank);
 if(available('memory')&&game.phase==='epilogue')button(t('Память ЛУЧа','LUCH memory'),pos([12,58,25,13],[0,54,30,7]),()=>inspect('memory'));
 }else if(zone==='drawer'){
 button(t(s.drawer?'Закрыть ящик':'Открыть ящик',s.drawer?'Close drawer':'Open drawer'),pos(s.drawer?[5,57,89,21]:[12,27,76,25],s.drawer?[5,51,88,14]:[15,26,67,19]),()=>{s.drawer=!s.drawer;change()});
 if(s.drawer){if(!s.found.includes('powerbank'))button(t('Достать аккумулятор','Retrieve battery'),pos([39,29,20,22],[44,30,30,12]),()=>take('powerbank'),sprites.powerbank);
 if(!s.leads)button(t('Забрать провода','Take test leads'),pos([16,32,22,19],[17,29,29,12]),()=>take('leads'),sprites.leads);
 if(!s.body)button(t('Достать корпус тестера','Retrieve tester body'),pos([56,37,26,19],[46,41,37,10]),()=>take('body'),sprites.body);}
 }else{
 item('battery',pos([13,46,20,22],[8,48,30,12]));item('blueBattery',pos([31,46,20,22],[38,48,30,12]));
 if(s.found.includes('empty'))item('empty',pos([13,59,20,22],[8,63,30,12]));
 if(s.found.includes('powerbank'))item('powerbank',pos([31,59,20,22],[38,63,30,12]));
 if(s.body)button(t(s.assembled?'Проверить заряд':'Корпус тестера',s.assembled?'Test charge':'Tester body'),pos([59,46,37,34],[53,61,45,19]),()=>s.assembled?test():notify(t('Нужны насадка из тисков и провода из ящика.','Find the attachment in the vise and leads in the drawer.')),sprites[s.assembled?'assembled':'body']);
 if(s.leads&&!s.assembled)button(t('Провода тестера','Tester leads'),pos([66,65,25,18],[5,77,34,11]),()=>notify(t('Провода готовы к сборке.','Leads ready for assembly.')),sprites.leads);
 if(s.module&&!s.assembled)button(t('Измерительный модуль','Measuring module'),pos([63,43,28,20],[64,52,34,12]),()=>notify(t('Соедини модуль с корпусом тестера.','Connect the module to the tester body.')),sprites.module);
 }
 const action=(label,fn)=>{let n=commands.push(fn)-1;return '<button data-eng="'+n+'">'+label+'</button>'};
 let toolbar=zone?action(t('← Общий план','← Room overview'),()=>approach(null)):'';
 if(zone==='tools')toolbar+=action(t(s.box?'Закрыть ящик':'Открыть ящик',s.box?'Close toolbox':'Open toolbox'),()=>{s.box=!s.box;change()});
 if(zone==='drawer')toolbar+=action(t(s.drawer?'Закрыть ящик':'Открыть ящик',s.drawer?'Close drawer':'Open drawer'),()=>{s.drawer=!s.drawer;change()});
 if(zone==='right'&&!s.module)toolbar+='<span class=vise-status>'+t(s.turns===3?'Насадка свободна':'Нажми на рычаг',s.turns===3?'Attachment released':'Tap the handle')+' · '+s.turns+'/3</span>';
 if(zone==='center')toolbar+=action(t(s.assembled?'Проверить заряд':'Собрать тестер',s.assembled?'Test charge':'Assemble tester'),()=>{if(s.assembled)test();else if(assemble(s)){game.history.push({event:'assemble-tester'});change();}else notify(t('Найди корпус и провода в нижнем ящике, насадку освободи из тисков.','Find body and leads in the drawer; release the attachment from the vise.'))});
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

