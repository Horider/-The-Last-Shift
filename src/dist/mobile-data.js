(function(root){
 const C=root.ShiftCore,R=root.ShiftRooms;
 const extra=[
 ['thermos','Термос «Орбита»','kitchen','Термос экипажа. Внутри горячий сладкий кофе: запас человеческого топлива.',['Кухня','Для экипажа','Кофе внутри'],[16.5,31.5,2.2,10.2]],
 ['mug','Кружка капитана','kitchen','На дне только засохшее пятно кофе. Капитанская кружка с кухни; одна посуда не питает экипаж.',['Кухня','Пустая','Личная вещь капитана'],[46.2,16.7,4.1,5.2]],
 ['coffeeTin','Банка «Космо-кофе»','kitchen','Сухой кофе для экипажа. Сам по себе не обед, но источник утренней энергии.',['Кухня','Кофе','Для экипажа'],[80.9,46.9,4,9.6]],
 ['compass','Компас капитана','captain','Личный резервный навигационный компас. В космосе требовал калибровки; капитан сверял с ним курс.',['Принадлежит капитану','Навигация','Помогал держать курс'],[16.1,51,5.2,6.2]],
 ['logbook','Бортовой журнал','captain','Общий технический журнал станции. Здесь ремонты и дежурства. Лежит в каюте, но не является личной вещью капитана.',['Общая собственность','Технические записи','Не личная вещь'],[49.2,46,8.2,5.7]],
 ['postcard','Открытка со звёздами','captain','Рекламная открытка из туристического набора. Красивые звёзды, но ни маршрута, ни личного послания.',['Сувенир станции','Реклама','Не навигация'],[42.9,10.8,4.2,8.9]],
 ['mossJar','Мох в банке','lab','Зелёный гербарный образец в консервирующей жидкости. Мох сохранил цвет, но уже не живой.',['Лаборатория','Консервант','Не живое'],[41.5,33.4,3.3,7.8]],
 ['seeds','Пакет семян','lab','Учебные семена в бумажном пакете. На обороте: «Стерилизовано». Взойти им уже не удастся.',['Лаборатория','Стерилизовано','Не живое'],[41.1,57,8.3,5.8]],
 ['algae','Колба с водорослями','lab','Живая культура водорослей в герметичной переносной колбе. Тоже сотрудник, просто коллективный.',['Лаборатория','Живое','Переносная колба'],[81.1,46.6,4.1,10.6]],
 ['blueBattery','Синий аккумулятор','technical','Аварийная батарея заряжена на 92%, но корпус синий. Даже отличная батарея должна соответствовать цвету в команде.',['Аварийный','Заряд 92%','Синий'],[78.5,38.4,3.6,7.8]],
 ['flashlight','Красный фонарь','technical','Фонарь в красном корпусе. Заряд 74%. Источник света, а не аварийный аккумулятор.',['Красный','Заряд 74%','Фонарь'],[7.1,41,3.4,10]],
 ['powerbank','Зарядник «Резерв»','technical','Жёлтый внешний аккумулятор для планшетов, 65%. Не предназначен для аварийного питания станции.',['Жёлтый','Заряд 65%','Для планшетов'],[51.7,48.8,13.6,8.5]]
 ];
 for(const [id,name,room,description,facts,box] of extra){C.ITEMS.push({id,name,description,facts,kind:id,x:box[0],y:box[1]});R.PLACEMENTS[id]={room,box,x:box[0]+box[2]/2,y:box[1]+box[3]/2};}
 for(const room of Object.keys(R.ROOMS)){R.ROOMS[room].image=`assets/${room}-v4.png`;R.ROOMS[room].clean=`assets/${room}-clean-v4.png`;}
 R.patchBox=id=>{const [l,t,w,h]=R.PLACEMENTS[id].box;return [l-.8,t-.8,w+1.6,h+1.6];};
 R.ROOMS.kitchen.image='assets/kitchen-v9.png';R.ROOMS.kitchen.clean='assets/kitchen-clean-v9.png';
 C.ORDERS[1].accept.push('thermos','coffeeTin');Object.assign(C.ORDERS[1].replies,{thermos:'Горячий кофе сохранён. Переносной запуск экипажа.',coffeeTin:'Утренний запас сохранён. Осталось найти воду и человека.'});
 C.ORDERS[2].accept.push('compass');C.ORDERS[2].replies.compass='Резервный компас капитана сохранён. Он доверял ему после калибровки.';
 C.ORDERS[3].accept.push('algae');C.ORDERS[3].replies.algae='Живой коллектив водорослей эвакуирован. Один билет на всех.';
 C.ORDERS[1].hint='Нужно что-то с кухни, что питает людей: еда или кофе. Пустая кружка не подходит.';
 C.ORDERS[2].hint='Проверь владельца и назначение. Не всякая вещь в каюте принадлежит капитану.';
 C.ORDERS[3].hint='Проверь, живое ли это сейчас и можно ли перенести. Цвет листьев сам по себе ничего не доказывает.';
 root.ShiftMobileData={extraIds:extra.map(i=>i[0]),hub:'assets/hub-office-tall-v8.png',luch:'assets/luch-office-tall-v8.png',cargoOld:'assets/items-v2.png',cargoExtra:'assets/extras-v5.png',crate:'assets/crate-tall-v7.png',hubWide:'assets/hub-office-wide-v8.png',luchWide:'assets/luch-office-wide-v8.png',crateWide:'assets/crate-wide-v7.png'};
 if(root.ShiftAssets){for(const room of Object.values(R.ROOMS)){room.image=root.ShiftAssets[room.image];room.clean=root.ShiftAssets[room.clean];}for(const key of ['hub','luch','cargoOld','cargoExtra','crate','hubWide','luchWide','crateWide'])root.ShiftMobileData[key]=root.ShiftAssets[root.ShiftMobileData[key]];}
 if(typeof module!=='undefined'&&module.exports)module.exports=root.ShiftMobileData;
})(typeof window!=='undefined'?window:globalThis);
