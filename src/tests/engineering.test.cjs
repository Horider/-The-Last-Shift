const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engineering.js');
test('closed containers protect finds, assembly requires both parts, collection is idempotent',()=>{
const s=E.create();assert.equal(E.collect(s,'empty'),false);assert.equal(E.collect(s,'body'),false);assert.equal(E.assemble(s),false);
s.drawer=true;assert.equal(E.collect(s,'body'),true);assert.equal(E.collect(s,'body'),false);assert.equal(E.assemble(s),false);
assert.equal(E.collect(s,'module'),false);for(let i=1;i<=3;i++){assert.equal(E.turn(s),true);assert.equal(s.turns,i);if(i<3)assert.equal(E.collect(s,'module'),false);}assert.equal(E.turn(s),false);assert.equal(E.collect(s,'module'),true);assert.equal(E.assemble(s),false);assert.equal(E.collect(s,'leads'),true);assert.equal(E.assemble(s),true);assert.equal(E.assemble(s),false);
s.box=true;assert.equal(E.collect(s,'empty'),true);assert.equal(E.collect(s,'empty'),false);assert.equal(E.collect(s,'powerbank'),true);assert.deepEqual(s.found,['empty','powerbank']);
assert.deepEqual(E.create(),{box:false,drawer:false,module:false,body:false,leads:false,turns:0,assembled:false,found:[]});
});

 test('three red batteries share exactly one sprite',()=>{assert.equal(E.sprites.battery,E.sprites.empty);assert.equal(E.sprites.battery,E.sprites.powerbank);assert.notEqual(E.sprites.battery,E.sprites.blueBattery)});
