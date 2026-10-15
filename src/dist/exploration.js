(function(root){
 'use strict';
 const z=(id,ru,en,box,items,noteRu,noteEn)=>({id,name:[ru,en],box,items,note:[noteRu,noteEn]});
 const ZONES={
 kitchen:[
 z('stove','Электрическая плита','Electric hob',[0,40,24,60],[],'Герметичная индукционная поверхность. Чайник закреплён: в космосе даже чай любит улетать. Открытого огня здесь нет.','A sealed induction hob. The kettle is secured: in space even tea wants to fly away. No open flame here.'),
 z('coffee','Кофейная станция','Coffee station',[10,26,34,44],['coffee','thermos'],'Кофеварка, термос и тесный уголок рабочей поверхности. Здесь начиналась каждая утренняя вахта.','A coffee maker, thermos and a crowded worktop. Every morning watch started here.'),
 z('shelves','Верхние полки','Upper shelves',[20,0,60,28],['mug'],'На полках стоят похожие кружки и банки. Одна кружка принадлежала капитану, но принадлежность ещё не делает её источником энергии.','Similar mugs and tins line the shelves. One mug belonged to the captain; ownership does not make it a source of energy.'),
 z('sink','Раковина и запасы','Sink and supplies',[63,27,37,60],['coffeeTin','ration'],'Кран, сушилка, кофе и последний паёк экипажа стоят рядом. Шкафчики закрыты: станция готовилась к долгому тихому отдыху.','The tap, drying rack, coffee and last crew ration sit together. The cupboards are shut as the station prepares for a long rest.')
 ],
 captain:[
 z('navigation','Навигационный стол','Navigation desk',[10,34,35,35],['map','compass'],'Разложенный маршрут и маленький резервный компас. Капитан отмечал дорогу домой от руки.','A route chart and small backup compass. The captain marked the way home by hand.'),
 z('personal','Личные вещи','Personal belongings',[36,25,30,36],['photo','logbook'],'Фотография стоит рядом с общим журналом станции. В этой комнате не всё автоматически становится личной вещью капитана.','A photograph sits beside the station log. Not everything in this cabin belongs personally to the captain.'),
 z('wall','Стена с открытками','Postcard wall',[30,0,40,26],['postcard'],'Красивые звёзды на открытке и тихие заметки на стене. Не каждая картинка показывает настоящий курс.','Pretty stars on a postcard and quiet wall notes. Not every picture shows a real course.'),
 z('berth','Кровать и талисман','Berth and mascot',[74,18,26,55],['toy'],'Мягкий космонавт устроился на одеяле. Отважный сотрудник, но дыхание у него исключительно декоративное.','A plush astronaut sits on the blanket. A brave employee, whose breathing is entirely decorative.')
 ],
 lab:[
 z('left','Пробирки и микроскоп','Test tubes and microscope',[0,26,28,57],[],'Слева стоят микроскоп и пробирки; на столе лежат книга, лупа и пинцет. Здесь удобно сверять похожие образцы.','The microscope and test tubes are on the left, with a book, magnifier and tweezers on the bench. This is where similar specimens are compared.'),
 z('shelves','Полки с образцами','Specimen shelves',[26,17,30,53],['mossJar'],'За стеклянными банками — ящики и ботанические плакаты. Зелёный мох в консервирующей жидкости уже не живой.','Behind the glass jars are specimen drawers and botanical posters. Green moss in preservative is no longer alive.'),
 z('bench','Книга и семена','Book and seeds',[34,56,34,30],['seeds'],'На столе по центру лежат открытая книга, пробирка и учебный пакет семян. Прочитай, что сделали с семенами.','At the center of the worktop lie an open book, a test tube and a teaching seed packet. Read what was done to the seeds.'),
 z('habitat','Террариум и культуры','Terrarium and cultures',[59,12,41,66],['plant','plastic','algae'],'Живое растение, макет и культура водорослей соседствуют у террариума. Справа лежат книга и чашка Петри.','A living plant, a model and an algae culture share the space by the terrarium. A book and Petri dish lie on the right.')
 ],
 technical:[
 z('tools','Инструменты слева','Left-hand tools',[0,22,24,50],['flashlight'],'Фонарь стоит среди инструмента. Красный корпус ещё не делает его аварийной батареей станции.','A flashlight stands among the tools. A red case does not make it the station emergency battery.'),
 z('right','Верстак у окна','Window workbench',[68,22,32,58],['blueBattery','memory'],'У иллюминатора стоят лампа и тиски. Рядом — синий аккумулятор и съёмная память ЛУЧа.','A lamp and vise sit beneath the porthole, beside a blue battery and LUCH removable memory.'),
 z('drawer','Нижний ящик','Lower drawer',[20,63,48,34],[],'Широкий ящик под верстаком. Пока внутри пусто; позже здесь появятся инструменты.','A wide drawer beneath the workbench. Empty for now; tools will come later.'),
 z('center','Центральный стол','Central worktop',[30,23,42,51],['battery','empty','powerbank'],'Два красных аккумулятора и жёлтый зарядник лежат рядом с тестером. Сначала проверь заряд тестером, потом выбирай.','Two red batteries and a yellow power bank sit by a tester. Check the charge before choosing.')
 ],
 luch:[
 z('desk','Рабочий стол ЛУЧа','LUCH desk',[27,18,41,40],[],'Собственный стол, лампа и улыбающийся монитор. Здесь ЛУЧ выдаёт поручения и терпеливо отвечает на вопросы.','A private desk, lamp and smiling monitor. LUCH gives assignments and patiently answers questions here.'),
 z('archive','Личный архив','Private archive',[0,4,28,83],[],'Семь лет смен, аккуратно разложенных по полкам. Между журналами есть особенно толстый том о кофеварке.','Seven years of watches, neatly filed. Among the logs is a particularly thick volume about the coffee maker.'),
 z('window','Иллюминатор','Porthole',[65,0,35,49],[],'ЛУЧ смотрит на планету даже тогда, когда никто не просит прокладывать курс.','LUCH watches the planet even when nobody asks him to plot a course.'),
 z('rest','Тихий уголок','Quiet corner',[71,42,29,56],[],'Плед, подушка и растение. По инструкции это зона ожидания. ЛУЧ называет её местом для друзей.','A blanket, cushion and plant. Officially a waiting area. LUCH calls it a place for friends.')
 ]};
 // Portrait overviews are independently composed artwork, so their clickable
 // regions follow the portrait composition rather than the landscape source.
 const PORTRAIT_BOXES={
  luch:{desk:[21,32,49,27],archive:[0,10,26,52],window:[63,21,34,27],rest:[69,43,31,36]},
  kitchen:{stove:[0,35,25,26],coffee:[23,37,28,18],shelves:[20,14,52,27],sink:[62,36,38,30]},
  captain:{navigation:[0,28,58,24],personal:[36,30,39,20],wall:[50,5,40,26],berth:[67,26,33,42]},
  lab:{left:[0,29,30,30],shelves:[28,25,33,26],bench:[37,39,26,20],habitat:[59,20,41,40]},
  technical:{tools:[0,23,33,34],right:[68,29,32,28],drawer:[15,46,48,15],center:[32,31,35,21]}
 };
 const PORTRAIT_SIZES={luch:[852,1846],kitchen:[863,1823],captain:[863,1823],lab:[862,1824],technical:[863,1823]};
 // Every approach is its own illustration in both orientations. Hotspots are
 // measured on those illustrations, never inherited from an overview crop.
 const DETAIL_SIZES={
  kitchen:{stove:[863,1823],coffee:[863,1822],shelves:[863,1823],sink:[862,1824]},
  captain:{navigation:[864,1821],personal:[863,1823],wall:[863,1823],berth:[863,1823]},
  lab:{left:[863,1823],shelves:[863,1823],bench:[863,1823],habitat:[863,1823]},
  technical:{tools:[863,1823],right:[910,1729],drawer:[911,1727],center:[912,1725]}
 };
 const DETAIL_HOTSPOTS={
  kitchen:{coffee:{coffee:[[41,42,22,24],[42,42,30,16]],thermos:[[16,36,13,26],[10,28,19,27]]},shelves:{mug:[[35,38,18,22],[40,18,23,17]]},sink:{coffeeTin:[[17,42,18,21],[15,40,22,16]],ration:[[36,60,16,14],[23,49,25,15]]}},
  captain:{navigation:{map:[[27,57,36,17],[34,39,45,18]],compass:[[13,64,17,14],[25,49,18,12]]},personal:{photo:[[53,32,18,23],[43,30,25,15]],logbook:[[29,53,30,18],[20,41,45,17]]},wall:{postcard:[[68,18,19,26],[67,22,26,19]]},berth:{toy:[[63,35,18,25],[46,34,24,18]]}},
  lab:{shelves:{mossJar:[[57,31,13,23],[56,34,17,17]]},bench:{seeds:[[40,61,19,19],[39,56,27,14]]},habitat:{plant:[[34,36,23,29],[40,34,23,22]],plastic:[[85,12,14,29],[81,22,18,22]],algae:[[54,49,12,20],[61,45,15,17]]}},
  technical:{tools:{flashlight:[[8,38,12,22],[13,34,17,16]]},right:{blueBattery:[[64,49,10,17],[86,51,13,11]],memory:[[41,69,16,12],[61,64,20,9]]},center:{battery:[[25,44,13,24],[23,48,16,17]],empty:[[56,44,13,24],[37,48,16,17]],powerbank:[[57,65,26,18],[19,62,29,13]]}}
 };
 function detail(room,zone,portrait){const size=DETAIL_SIZES[room]?.[zone];if(!size)return null;return {key:`${room}_${zone}_${portrait?'tall':'wide'}`,size:portrait?size:[1536,1024]};}
 function hotspot(room,zone,item,portrait){return DETAIL_HOTSPOTS[room]?.[zone]?.[item]?.[portrait?1:0]||null;}
 function frame(vw,vh,iw,ih,box=[0,0,100,100]){const [l,t,w,h]=box,bw=iw*w/100,bh=ih*h/100,scale=Math.min(vw/bw,vh/bh);return {width:bw*scale,height:bh*scale,planeWidth:iw*scale,planeHeight:ih*scale,x:-iw*l/100*scale,y:-ih*t/100*scale,scale};}
 function owner(room,item){return ZONES[room]?.find(z=>z.items.includes(item))?.id||null;}
 function cargo(saved){const count=Math.min(4,saved.filter(id=>id!=='memory').length);return {count,percent:count*25,ready:count===4};}
 function attach(layout,canvas,plane,controls,iw,ih,box){
  let base=null,zoom=1,panX=0,panY=0,drag=null;const fingers=new Map();
  function draw(){if(!base)return;const maxX=Math.max(0,(base.width*zoom-base.width)/2),maxY=Math.max(0,(base.height*zoom-base.height)/2);panX=Math.max(-maxX,Math.min(maxX,panX));panY=Math.max(-maxY,Math.min(maxY,panY));plane.style.transform=`translate(${base.x*zoom+(1-zoom)*base.width/2+panX}px,${base.y*zoom+(1-zoom)*base.height/2+panY}px) scale(${zoom})`;}
  function update(){const rect=layout.getBoundingClientRect(),g=frame(rect.width,rect.height,iw,ih,box);base=g;canvas.style.width=g.width+'px';canvas.style.height=g.height+'px';plane.style.width=g.planeWidth+'px';plane.style.height=g.planeHeight+'px';draw();}
  function setZoom(value){zoom=Math.max(1,Math.min(2.5,value));if(zoom===1)panX=panY=0;draw();}
  function wheel(e){if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();setZoom(zoom*(e.deltaY<0?1.12:1/1.12));}
  function pointerDown(e){if(e.target.closest('button'))return;canvas.setPointerCapture(e.pointerId);fingers.set(e.pointerId,[e.clientX,e.clientY]);if(fingers.size===1)drag=[e.clientX,e.clientY];}
  function pointerMove(e){if(!fingers.has(e.pointerId))return;const old=fingers.get(e.pointerId);fingers.set(e.pointerId,[e.clientX,e.clientY]);if(fingers.size===2){const pts=[...fingers.values()];if(pointerMove.distance){const d=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]);setZoom(zoom*d/pointerMove.distance);}pointerMove.distance=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]);drag=null;}else if(drag&&zoom>1){panX+=e.clientX-old[0];panY+=e.clientY-old[1];draw();}}
  function pointerUp(e){fingers.delete(e.pointerId);pointerMove.distance=null;drag=null;}
  canvas.addEventListener('wheel',wheel,{passive:false});canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerUp);
  const observer=new ResizeObserver(update);observer.observe(layout);window.addEventListener('resize',update);window.visualViewport?.addEventListener('resize',update);update();return {zoom:setZoom,getZoom:()=>zoom,destroy(){observer.disconnect();window.removeEventListener('resize',update);window.visualViewport?.removeEventListener('resize',update);canvas.removeEventListener('wheel',wheel);canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('pointercancel',pointerUp);}};
 }
 root.RoomExplore={ZONES,PORTRAIT_BOXES,PORTRAIT_SIZES,DETAIL_SIZES,DETAIL_HOTSPOTS,detail,hotspot,frame,owner,cargo,attach};if(typeof module!=='undefined'&&module.exports)module.exports={ZONES,PORTRAIT_BOXES,PORTRAIT_SIZES,DETAIL_SIZES,DETAIL_HOTSPOTS,detail,hotspot,frame,owner,cargo};
})(typeof window!=='undefined'?window:globalThis);
