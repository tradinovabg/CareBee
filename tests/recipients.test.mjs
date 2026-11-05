import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readRecipients,saveRecipient,deleteRecipient,recognizeRecipient,whatsappLink,normalizePhone,RECIPIENTS_KEY } from '../lib/recipients.mjs';
import { saveEntry,readEntries,exportDiary } from '../lib/diary.mjs';
const mother={id:'mother',name:'Мама',aliases:['мамочка','мамуля'],phone:'+1 (202) 555-0123',channel:'whatsapp'};
const anna={id:'anna',name:'Анна',aliases:['Аня'],phone:'+1 (202) 555-0124',channel:'whatsapp'};
function storage(){const map=new Map();return{getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)}}
test('recognizes recipient at either edge with case and punctuation, strips only address',()=>{
 for(const text of ['МАМА, сегодня всё хорошо.','Маме — сегодня всё хорошо.','Маму: сегодня всё хорошо.','Мамой, сегодня всё хорошо.','Мамочке! сегодня всё хорошо.','«Мама», сегодня всё хорошо.']){
  const r=recognizeRecipient(text,[mother]);assert.equal(r.status,'matched',text);assert.equal(r.recipientId,'mother');assert.equal(r.text,'сегодня всё хорошо.');
 }
 for(const text of ['Сегодня всё хорошо, мама!','Сегодня всё хорошо — маме.','Сегодня всё хорошо, мамулю.','Сегодня всё хорошо, «мама».']){const r=recognizeRecipient(text,[mother]);assert.equal(r.status,'matched');assert.equal(r.text,'Сегодня всё хорошо');}
 const r=recognizeRecipient('Анне, давление 130 на 80; без изменений',[mother,anna]);assert.equal(r.recipientId,'anna');assert.equal(r.text,'давление 130 на 80; без изменений');
});
test('similar names, multiword aliases and ambiguous addresses are not guessed',()=>{
 const profiles=[{...mother,id:'olya',name:'Оля',aliases:[]},{...mother,id:'olga',name:'Ольга',aliases:[]}];
 assert.equal(recognizeRecipient('Оле, привет',profiles).recipientId,'olya');assert.equal(recognizeRecipient('Ольге, привет',profiles).recipientId,'olga');
 const alex=[{...mother,id:'a',name:'Алексей',aliases:[]},{...mother,id:'b',name:'Александр',aliases:[]}];
 assert.equal(recognizeRecipient('Алексею, всё хорошо',alex).recipientId,'a');assert.equal(recognizeRecipient('Всё хорошо Александру',alex).recipientId,'b');
 const collision=[{...mother,id:'a',name:'Саша',aliases:[]},{...mother,id:'b',name:'Саша',aliases:[]}];
 assert.deepEqual(recognizeRecipient('Саше, привет',collision),{status:'ambiguous',text:'Саше, привет',candidates:['a','b']});
 assert.equal(recognizeRecipient('Мама, всё хорошо, Анна',[mother,anna]).status,'ambiguous');
 assert.equal(recognizeRecipient('Ивану Петровичу, всё хорошо',[{...mother,name:'Иван Петрович',aliases:['Иван Петрович']}]).status,'matched');
});
test('no match or name inside a sentence preserves original words and punctuation',()=>{
 for(const text of ['Сегодня маме измерили давление — 130 на 80.','Давление 130 на 80.','Маше, привет','Мамина запись','']) assert.deepEqual(recognizeRecipient(text,[mother]),{status:'none',text});
});
test('profile add/edit/default/delete survive re-reading and preserve previous diary metadata',()=>{
 const browser=storage();let profiles=saveRecipient(browser,{...mother,id:undefined,isDefault:true});const first=profiles[0];
 profiles=saveRecipient(browser,{...anna,id:undefined,isDefault:true});assert.equal(readRecipients(browser).length,2);assert.equal(profiles.filter(p=>p.isDefault).length,1);assert.equal(profiles[0].isDefault,false);
 profiles=saveRecipient(browser,{...first,name:'Мамочка',id:first.id,expectedUpdatedAt:first.updatedAt,isDefault:true});assert.equal(readRecipients(browser)[0].name,'Мамочка');
 const p=profiles[0];deleteRecipient(browser,p.id,p.updatedAt);assert.equal(readRecipients(browser).length,1);assert.equal(readRecipients(browser).filter(p=>p.isDefault).length,0);
 assert.throws(()=>saveRecipient(browser,{...first,expectedUpdatedAt:first.updatedAt}));
});
test('phone validation and WhatsApp URLs use digits only and correctly encode unicode and special characters',()=>{
 const text='Привет! Давление 130/80\nМама & папа? + # %';const link=whatsappLink(mother,text);assert.equal(link,`https://wa.me/12025550123?text=${encodeURIComponent(text)}`);
 assert.equal(new URL(link).searchParams.get('text'),text);assert.equal(normalizePhone('+33 (6) 12-34-56-78'),'+33612345678');
 for(const phone of ['2025550123','+012345678','+123','+12025550123?evil=1','+1+2025550123'])assert.throws(()=>whatsappLink({...mother,phone},text));
 assert.throws(()=>whatsappLink({...mother,channel:'sms'},text));
});
test('handoff snapshots are persisted and exported without claiming confirmed delivery',()=>{
 const browser=storage();const at='2026-11-05T13:00:00.000Z';const handoff={recipientName:'Мама',channel:'whatsapp',at};
 let entry=saveEntry(browser,{text:'Вымышленная запись',handoff},at)[0];assert.deepEqual(readEntries(browser)[0].handoffs,[handoff]);
 entry=saveEntry(browser,{id:entry.id,text:'Исправлено',expectedUpdatedAt:entry.updatedAt},'2026-11-05T14:00:00.000Z')[0];assert.deepEqual(entry.handoffs,[handoff]);
 const text=exportDiary(readEntries(browser));assert.ok(text.includes('Отправлено: Мама'));assert.ok(text.includes('WhatsApp открыт; отправка и доставка не подтверждены'));
});
test('corrupt profiles and failed writes are not silently overwritten',()=>{
 const browser=storage();browser.setItem(RECIPIENTS_KEY,'broken');assert.throws(()=>saveRecipient(browser,mother));assert.equal(browser.getItem(RECIPIENTS_KEY),'broken');
 assert.throws(()=>saveRecipient({getItem:()=>null,setItem(){throw new Error('quota')}},{...mother,id:undefined}));
});
