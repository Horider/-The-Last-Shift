(function(root){
 'use strict';
 const z=(id,ru,en,box,items,noteRu,noteEn)=>({id,name:[ru,en],box,items,note:[noteRu,noteEn]});
 const ZONES={
 kitchen:[
 z('stove','Электрическая плита','Electric hob',[0,40,24,60],[],'Герметичная индукционная поверхность. Чайник закреплён: в космосе даже чай любит улетать. Открытого огня здесь нет.','A sealed induction hob. The kettle is secured: in space even tea wants to fly away. No open flame here.'),
 z('coffee','Кофейная станция','Coffee station',[10,26,34,44],['coffee','thermos'],'Кофеварка, термос и тесный уголок рабочей поверхности. Здесь начиналась каждая утренняя вахта.','A coffee maker, thermos and a crowded worktop. Every morning watch started here.'),
 z('shelves','Верхние полки','Upper shelves',[20,0,60,28],['mug'],'На полках стоят похожие кружки и банки. Одна кружка принадлежала капитану, но принадлежность ещё не делает её источником энергии.','Similar mugs and tins line the shelves. One mug belonged to the captain; ownership does not make it a source of energy.'),
 z('sink','Раковина','Sink',[73,27,27,47],['coffeeTin'],'Кран, сушилка и банки вдоль бортика. Пакет с надписью «кофе» легко принять за обычную кухонную мелочь.','A tap, drying rack and tins along the rim. A coffee container can look like ordinary kitchen clutter.'),
 z('stores','Запасы и шкафчики','Supplies and cupboards',[56,40,24,60],['ration'],'Над шкафчиками оставили последний паёк. Шкафчики закрыты: станция готовилась к долгому тихому отдыху.','The last ration was left above the cupboards. Their doors are shut: the station was preparing for a long quiet rest.')
 ],
 captain:[
 z('navigation','Навигационный стол','Navigation desk',[10,34,35,35],['map','compass'],'Разложенный маршрут и маленький резервный компас. Капитан отмечал дорогу домой от руки.','A route chart and small backup compass. The captain marked the way home by hand.'),
 z('personal','Личные вещи','Personal belongings',[36,25,30,36],['photo','logbook'],'Фотография стоит рядом с общим журналом станции. В этой комнате не всё автоматически становится личной вещью капитана.','A photograph sits beside the station log. Not everything in this cabin belongs personally to the captain.'),
 z('wall','Стена с открытками','Postcard wall',[30,0,40,26],['postcard'],'Красивые звёзды на открытке и тихие заметки на стене. Не каждая картинка показывает настоящий курс.','Pretty stars on a postcard and quiet wall notes. Not every picture shows a real course.'),
 z('souvenirs','Кровать и талисман','Berth and mascot',[74,18,26,45],['toy'],'Мягкий космонавт устроился на одеяле. Отважный сотрудник, но дыхание у него исключительно декоративное.','A plush astronaut sits on the blanket. A brave employee, whose breathing is entirely decorative.'),
 z('chair','Кресло и сундук','Chair and chest',[0,60,65,40],[],'На кресле осталось пальто, а на сундуке — книги. Капитан был уверен, что вернётся сюда ещё раз.','A coat remains on the chair, with books on the chest. The captain expected to return here once more.')
 ],
 lab:[
 z('plants','Зелёный уголок','Plant corner',[13,19,24,40],['plant'],'У живого сотрудника влажная земля и настоящие листья. Переносной горшок подготовлен для эвакуации.','The living employee has damp soil and real leaves. Its portable pot is ready for evacuation.'),
 z('samples','Шкаф образцов','Specimen cabinet',[35,22,29,32],['mossJar'],'Баночки похожи друг на друга. Зелёный цвет ещё не гарантирует, что образец жив.','The specimen jars look alike. Green colour does not guarantee that a specimen is alive.'),
 z('bench','Рабочий стол','Work bench',[27,50,40,38],['seeds'],'На столе лежит учебный пакет семян. Перед эвакуацией стоит прочитать, что с ними сделали.','A teaching seed packet lies on the bench. Before evacuation, read what was done to those seeds.'),
 z('terrarium','Террариум и макеты','Terrarium and models',[61,23,19,37],['plastic'],'Рядом с зеленью есть демонстрационные модели. Они выглядят бодро и никогда не просят воды.','Demonstration models sit beside the greenery. They look healthy and never ask for water.'),
 z('glassware','Стеклянные культуры','Glass cultures',[77,31,23,38],['algae'],'Герметичные колбы, небольшие культуры и приборы. Некоторые живые сотрудники помещаются в одной ладони.','Sealed flasks, small cultures and instruments. Some living employees fit in one hand.')
 ],
 technical:[
 z('tools','Инструменты','Tools',[0,22,22,50],['flashlight'],'Фонарь стоит среди инструмента. Красный корпус и хороший заряд не превращают его в аварийную батарею станции.','A flashlight stands among the tools. A red case and good charge do not make it the station emergency battery.'),
 z('power','Аварийное питание','Emergency power',[22,25,38,40],['battery','empty'],'Два почти одинаковых красных аккумулятора. Проверяй заряд каждого отдельно: оптимизм электричество не заменяет.','Two almost identical red batteries. Check each charge separately: optimism does not replace electricity.'),
 z('computer','Диагностический пост','Diagnostics',[47,7,29,44],[],'Монитор и контрольные приборы. Последняя проверка показала: станция устала, но старается.','A monitor and diagnostic instruments. The last check showed that the station is tired but trying.'),
 z('modules','Правый верстак','Right-hand bench',[60,24,40,48],['blueBattery','memory'],'Здесь лежат резервные компоненты и съёмная память. Доступ к памяти ЛУЧа откроется только после поручений.','Spare components and removable memory are kept here. LUCH memory becomes accessible after the assignments.'),
 z('chargers','Кабели и зарядники','Cables and chargers',[44,45,23,44],['powerbank'],'Планшетный зарядник и кабели лежат на рабочей поверхности. У каждого источника питания своё назначение.','A tablet power bank and cables lie on the bench. Every power source has its own purpose.')
 ],
 luch:[
 z('desk','Рабочий стол ЛУЧа','LUCH desk',[27,18,41,40],[],'Собственный стол, лампа и улыбающийся монитор. Здесь ЛУЧ выдаёт поручения и терпеливо отвечает на вопросы.','A private desk, lamp and smiling monitor. LUCH gives assignments and patiently answers questions here.'),
 z('archive','Личный архив','Private archive',[0,4,28,83],[],'Семь лет смен, аккуратно разложенных по полкам. Между журналами есть особенно толстый том о кофеварке.','Seven years of watches, neatly filed. Among the logs is a particularly thick volume about the coffee maker.'),
 z('window','Иллюминатор','Porthole',[65,0,35,49],[],'ЛУЧ смотрит на планету даже тогда, когда никто не просит прокладывать курс.','LUCH watches the planet even when nobody asks him to plot a course.'),
 z('rest','Тихий уголок','Quiet corner',[71,42,29,56],[],'Плед, подушка и растение. По инструкции это зона ожидания. ЛУЧ называет её местом для друзей.','A blanket, cushion and plant. Officially a waiting area. LUCH calls it a place for friends.')
 ]};
 function frame(vw,vh,iw,ih,box=[0,0,100,100]){const [l,t,w,h]=box,bw=iw*w/100,bh=ih*h/100,scale=Math.min(vw/bw,vh/bh);return {width:bw*scale,height:bh*scale,planeWidth:iw*scale,planeHeight:ih*scale,x:-iw*l/100*scale,y:-ih*t/100*scale,scale};}
 function owner(room,item){return ZONES[room]?.find(z=>z.items.includes(item))?.id||null;}
 function cargo(saved){const count=Math.min(4,saved.filter(id=>id!=='memory').length);return {count,percent:count*25,ready:count===4};}
 function attach(layout,canvas,plane,controls,iw,ih,box){function update(){const rect=layout.getBoundingClientRect(),space=rect.height,g=frame(rect.width,space,iw,ih,box);canvas.style.width=g.width+'px';canvas.style.height=g.height+'px';plane.style.width=g.planeWidth+'px';plane.style.height=g.planeHeight+'px';plane.style.transform=`translate(${g.x}px,${g.y}px)`;}const observer=new ResizeObserver(update);observer.observe(layout);window.addEventListener('resize',update);window.visualViewport?.addEventListener('resize',update);update();return {destroy(){observer.disconnect();window.removeEventListener('resize',update);window.visualViewport?.removeEventListener('resize',update);}};}
 root.RoomExplore={ZONES,frame,owner,cargo,attach};if(typeof module!=='undefined'&&module.exports)module.exports={ZONES,frame,owner,cargo};
})(typeof window!=='undefined'?window:globalThis);
