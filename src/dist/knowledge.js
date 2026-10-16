(function(root){
 'use strict';
 const pages=[
  ['Проверка аварийного аккумулятора','Регламент перевозки аварийного питания: аккумулятор должен быть непустым, с зарядом ниже 50%. Полностью заряженный блок к отправке не допускается. Для измерения соедините корпус тестера, провода и контактную насадку в инвентаре. Поставьте собранный прибор и выбранный аккумулятор на рабочий стол, затем выполните измерение. Назначение корпуса сверяйте с маркировкой станции.'],
  ['Маркировка и индикатор','Аварийные аккумуляторы станции имеют красный корпус. Синие блоки предназначены для служебного оборудования и в аварийный комплект не входят. На обратной стороне корпуса расположен индикатор остаточного питания. Зелёный свет означает, что питание сохранилось. Погасший индикатор означает, что аккумулятор пуст. Индикатор не показывает точный процент. Пустой аккумулятор измерять незачем.']
 ];
 const note='Перед отлётом оставьте нам привычный запас бодрости. Только без сладкого — после прошлой смены даже запах ванили не переношу. Кружки мы уже забрали.';
 const questions=[['Нужна еда или напиток?','Напиток. Под «энергией экипажа» они подразумевали кофе.','Кофе'],['Кружки уже забрали. Кофе нужно приготовить?','Нет. Нужна закрытая упаковка для дороги.','Закрытая упаковка'],['Без сладкого — значит, без добавок?','Верно. Обычный кофе, без ароматизаторов.','Без добавок']];
 function initialize(s){s.knowledge={pages:[],note:false,answers:0,engineerNote:false,blanketMoved:false};s.powerSeen=[];s.measuredCharges={};return s;}
 const COFFEE_TINS=[{id:'vanillaCoffee',color:['Красная банка','Red tin']},{id:'plainCoffee',color:['Зелёная банка','Green tin']}];
 function tinBox(id,portrait,detail){const i=id==='vanillaCoffee'?0:1;return detail?(portrait?[[32,19,11,6],[44,19,13,6]]:[[28,8,12,15],[41,5,13,18]])[i]:(portrait?[[30,19,7,4],[37,18,9,5]]:[[31,3,7,8],[38,1,9,10]])[i];}
 function coffeeAvailable(s,id){return COFFEE_TINS.some(t=>t.id===id)&&!s.items.find(i=>i.id===id)?.shipped&&!s.inventory.includes(id);}
 function takeCoffee(s,id){return coffeeAvailable(s,id)&&root.ShiftInventory.add(s,id);}
 function order(s,base,index){if(index!==0||!base)return base;const k=s.knowledge,charge=k.pages.includes(0),color=k.engineerNote;return {...base,text:'Доставьте '+(color?'красный ':'')+'аварийный аккумулятор. '+(charge?'Заряд — выше 0% и ниже 50%.':'Требуемый заряд: [данные повреждены].')+(color?'':' Цвет корпуса: [данные повреждены].'),intro:'В архиве сбой. Помню, что нужен аварийный аккумулятор, но часть требований не читается. Придётся восстановить их по документации станции.',hint:'Неполные данные можно восстановить по найденным документам. Сопоставляй требования и свойства предметов.'};}
 function read(s,page){if(page!==0)return false;if(!s.knowledge.pages.includes(page))s.knowledge.pages.push(page);return true;}
 function moveBlanket(s){s.knowledge.blanketMoved=!s.knowledge.blanketMoved;return s.knowledge.blanketMoved;}
 function readCrew(s){if(!s.knowledge.blanketMoved)return false;s.knowledge.note=true;return true;}
 function readEngineer(s){s.knowledge.engineerNote=true;s.canFlipBattery=true;return true;}
 function ask(s){if(!s.knowledge.note||s.knowledge.answers>=questions.length)return null;return questions[s.knowledge.answers++];}
 function sprite(id,D){const i={manual:0,note:1,plainCoffee:2,vanillaCoffee:3}[id];return '<svg class="clue-sprite" viewBox="0 0 627 627" aria-hidden="true"><svg width="627" height="627" overflow="hidden" viewBox="'+(i%2*627)+' '+(Math.floor(i/2)*627)+' 627 627" aria-hidden="true"><image href="'+D.clueAtlas+'" width="1254" height="1254"/></svg></svg>';}
 function install(C,R){const create=C.createState;C.createState=()=>initialize(create());
  const current=C.currentOrder;C.currentOrder=s=>order(s,current(s),s.orderIndex);
  const hint=C.hint;C.hint=s=>{const text=hint(s);return s.orderIndex===0?C.currentOrder(s).hint:text;};
  for(const [id,name,description,facts] of [
   ['plainCoffee','Обычный кофе','Запечатанный пакет молотого кофе. Состав: кофе. Без сахара и ароматизаторов.',['Кофе','Упаковка закрыта','Без добавок']],
   ['vanillaCoffee','Ванильный кофе','Запечатанный пакет кофе с ванилью и сахаром.',['Кофе','Упаковка закрыта','Сладкий · ваниль']]]){
   const box=tinBox(id,false,false);C.ITEMS.push({id,name,description,facts,kind:'coffee',x:box[0]+box[2]/2,y:box[1]+box[3]/2});R.PLACEMENTS[id]={room:'kitchen',box,x:box[0]+box[2]/2,y:box[1]+box[3]/2};
  }
  Object.assign(C.ORDERS[1],{accept:['plainCoffee'],hint:'Нужно понять, какой запас просил экипаж. Осматривай вещи и сопоставляй найденные сведения.',replies:{plainCoffee:'Закрытая упаковка обычного кофе. Именно этот запас просил экипаж. Спасибо за внимательность.'}});
  // Core submission uses its private reason; the wrapper supplies task-specific feedback.
  const submit=C.submit;C.submit=s=>{const index=s.orderIndex,id=s.carry;const r=submit(s);if(r.type==='wrong'&&index===0){const measured=s.measuredCharges[id];r.text=id==='blueBattery'?'Это служебный аккумулятор, а нужен аварийный. '+(measured===undefined?'Его заряд также ещё не измерен.':'Измеренный заряд: '+measured+'%.'):measured===0?'Аккумулятор пуст. Для отправки нужен остаток питания.':measured!==undefined?'Заряд '+measured+'% не соответствует регламенту перевозки аварийного питания.':'Этот предмет не подходит. Сверь назначение и требования по документации; результат измерения ещё не записан.';}if(index===1&&r.type==='wrong')r.text='Эта вещь не соответствует пожеланиям экипажа. Сверь её свойства с запиской и уточнениями ЛУЧа.';return r;};
 }
 const api={pages,note,questions,COFFEE_TINS,tinBox,coffeeAvailable,takeCoffee,initialize,order,read,moveBlanket,readCrew,readEngineer,ask,sprite,install};root.ShiftKnowledge=api;if(root.ShiftCore)install(root.ShiftCore,root.ShiftRooms);if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
