(function(root){
 'use strict';
 const pages=[
  ['Проверка аварийного аккумулятора','Найдите измеритель, провода и контактную насадку. Соедините три детали в инвентаре. Поставьте собранный прибор и выбранный аккумулятор на рабочий стол. Выполните измерение. Для эвакуационного комплекта нужен красный аккумулятор с зарядом не ниже 50%.'],
  ['Перед измерением','На обратной стороне корпуса расположен индикатор остаточного питания. Зелёный свет означает, что питание сохранилось. Погасший индикатор означает, что аккумулятор пуст. Индикатор не показывает точный процент. Пустой аккумулятор измерять незачем.']
 ];
 const note='Перед отлётом оставьте нам привычный запас бодрости. Только без сладкого — после прошлой смены даже запах ванили не переношу. Кружки мы уже забрали.';
 const questions=[['Нужна еда или напиток?','Напиток. Под «энергией экипажа» они подразумевали кофе.','Кофе'],['Кружки уже забрали. Кофе нужно приготовить?','Нет. Нужна закрытая упаковка для дороги.','Закрытая упаковка'],['Без сладкого — значит, без добавок?','Верно. Обычный кофе, без ароматизаторов.','Без добавок']];
 function initialize(s){s.knowledge={pages:[],note:false,answers:0};s.kitchenCupboard=false;s.powerSeen=[];return s;}
 function read(s,page){if(![0,1].includes(page))return false;if(!s.knowledge.pages.includes(page))s.knowledge.pages.push(page);if(page===1)s.canFlipBattery=true;return true;}
 function ask(s){if(!s.knowledge.note||s.knowledge.answers>=questions.length)return null;return questions[s.knowledge.answers++];}
 function sprite(id,D){const i={manual:0,note:1,plainCoffee:2,vanillaCoffee:3}[id];return '<svg class="clue-sprite" viewBox="0 0 627 627" aria-hidden="true"><svg width="627" height="627" viewBox="'+(i%2*627)+' '+(Math.floor(i/2)*627)+' 627 627" aria-hidden="true"><image href="'+D.clueAtlas+'" width="1254" height="1254"/></svg></svg>';}
 function install(C,R){const create=C.createState;C.createState=()=>initialize(create());
  for(const [id,name,description,facts] of [
   ['plainCoffee','Обычный кофе','Запечатанный пакет молотого кофе. Состав: кофе. Без сахара и ароматизаторов.',['Кофе','Упаковка закрыта','Без добавок']],
   ['vanillaCoffee','Ванильный кофе','Запечатанный пакет кофе с ванилью и сахаром.',['Кофе','Упаковка закрыта','Сладкий · ваниль']]]){
   C.ITEMS.push({id,name,description,facts,kind:'coffee',x:50,y:35});R.PLACEMENTS[id]={room:'kitchen',box:[44,15,6,10],x:47,y:20};
  }
  Object.assign(C.ORDERS[1],{accept:['plainCoffee'],hint:'У экипажа были свои привычки. В тихом уголке кабинета ЛУЧа могла остаться записка. Прочти её и уточни поручение.',replies:{plainCoffee:'Закрытая упаковка обычного кофе. Именно этот запас просил экипаж. Спасибо за внимательность.'}});
  // Core submission uses its private reason; the wrapper supplies task-specific feedback.
  const submit=C.submit;C.submit=s=>{const kitchen=s.orderIndex===1;const r=submit(s);if(kitchen&&r.type==='wrong')r.text='Эта вещь не соответствует пожеланиям экипажа. Сверь её свойства с запиской и уточнениями ЛУЧа.';return r;};
 }
 const api={pages,note,questions,initialize,read,ask,sprite,install};root.ShiftKnowledge=api;if(root.ShiftCore)install(root.ShiftCore,root.ShiftRooms);if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
