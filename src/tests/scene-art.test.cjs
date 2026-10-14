const test=require('node:test'),assert=require('node:assert/strict'),{fit}=require('../dist/scene-art.js');
test('expanded backgrounds always keep their original aspect and fill the viewport',()=>{
 for(const [vw,vh] of [[2048,1125],[1920,1080],[844,390],[390,844],[360,640]]){const [iw,ih]=vw/vh>=1?[1774,887]:[852,1846],g=fit(vw,vh,iw,ih);assert.ok(Math.abs(g.width/g.height-iw/ih)<1e-10);assert.ok(g.x<=0&&g.y<=0);assert.ok(g.x+g.width>=vw-1e-8&&g.y+g.height>=vh-1e-8);assert.ok(Math.abs(g.width/iw-g.height/ih)<1e-10);}
});
test('scene anchors use the same scale and offset as the illustrated doors',()=>{const g=fit(2048,1125,1774,887);const door={x:.38*1774,y:.28*887};const rendered={x:g.x+door.x*g.scale,y:g.y+door.y*g.scale};assert.ok(rendered.x>0&&rendered.x<2048);assert.ok(rendered.y>0&&rendered.y<1125);assert.ok(g.width<2400,'the portrait cannot be horizontally stretched across the wide screen');});
