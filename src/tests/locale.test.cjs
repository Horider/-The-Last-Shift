const test=require('node:test'),assert=require('node:assert/strict'),{detect,formatScore}=require('../dist/i18n.js');
test('score decimal separator follows the selected language',()=>{assert.equal(formatScore(97.5,'ru'),'97,5%');assert.equal(formatScore(97.5,'en'),'97.5%');assert.equal(formatScore(null,'en'),'—');});
test('Russian device and Russian site use Russian',()=>{assert.equal(detect({languages:['ru-RU','en-US']}),'ru');assert.equal(detect({site:'ru',languages:['en-US']}),'ru');});
test('other primary languages use English even with Russian secondary preference',()=>{for(const language of ['en-US','de-DE','fr','th-TH'])assert.equal(detect({languages:[language,'ru']}),'en');});
test('explicit site language or preview override wins over device language',()=>{assert.equal(detect({site:'en',languages:['ru-RU']}),'en');assert.equal(detect({query:'ru',site:'en',languages:['en']}),'ru');assert.equal(detect({query:'en',site:'ru',languages:['ru']}),'en');});
