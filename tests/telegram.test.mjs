import {test} from 'node:test';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
import {createTelegramService} from '../lib/telegram-server.mjs';
import {whatsappLink,saveRecipient,readRecipients} from '../lib/recipients.mjs';
import {saveEntry,markDelivery,readEntries,exportDiary} from '../lib/diary.mjs';
const fakeEnv={TELEGRAM_BOT_TOKEN:'fake-test-only-not-a-credential',TELEGRAM_BOT_USERNAME:'carebee_test_bot',TELEGRAM_WEBHOOK_SECRET:'test-only-webhook-secret-123456',UPSTASH_REDIS_REST_URL:'https://redis.example.test',UPSTASH_REDIS_REST_TOKEN:'test-only'};
function setup(mode='ok',env=fakeEnv){
 const values=new Map();const calls=[];let botCalls=0;
 const fetcher=async(url,options)=>{
  const body=JSON.parse(options.body);
  if(String(url).startsWith('https://redis.example.test')){
   const [cmd,...args]=body;let result;
   if(cmd==='SET'){const [k,v,...flags]=args;if(flags.includes('NX')&&values.has(k))result=null;else{values.set(k,v);result='OK';}}
   else if(cmd==='GET')result=values.get(args[0])??null;
   else if(cmd==='DEL'){result=values.delete(args[0])?1:0;}
   else if(cmd==='EVAL'){
    const [script,_n,key,arg]=args;
    if(script.includes('INCR')){result=Number(values.get(key)||0)+1;values.set(key,String(result));}
    else{const raw=values.get(key);const p=raw?JSON.parse(raw):null;if(p&&!p.chatId){p.chatId=arg;values.set(key,JSON.stringify(p));result=1;}else result=0;}
   }else throw new Error('Unexpected redis command');
   return Response.json({result});
  }
  botCalls++;calls.push(body);if(mode==='network')throw new Error('network with sensitive details must be suppressed');
  if(mode==='rejected')return Response.json({ok:false,error_code:403,description:'private details'},{status:403});
  return Response.json({ok:true,result:{message_id:1,date:1,chat:{id:123},text:body.text}});
 };
 return {service:createTelegramService({env,fetcher}),values,calls,count:()=>botCalls};
}
async function connect(ctx){const pair=await ctx.service.pair('test-ip');assert.equal(pair.code.length,32);assert.ok(pair.url.includes('?start='+pair.code));await ctx.service.webhook({message:{chat:{type:'private',id:123},from:{id:123},text:'/start '+pair.code}},fakeEnv.TELEGRAM_WEBHOOK_SECRET);const linked=await ctx.service.status(pair,'test-ip');return {pair,linked};}
const payload=linked=>({chatId:linked.chatId,telegramKey:linked.telegramKey,text:'Вымышленная запись 130 на 80',requestId:randomUUID()});
test('real service contract: paired recipient, successful send, idempotent retry, no stored text',async()=>{
 const ctx=setup();const {linked}=await connect(ctx);assert.equal(linked.chatId,'123');const body=payload(linked);
 const first=await ctx.service.send(body,'test-ip');assert.equal(first.delivered,true);assert.deepEqual(await ctx.service.send(body,'test-ip'),first);assert.equal(ctx.count(),1);assert.equal(ctx.calls[0].text,body.text);assert.ok(!JSON.stringify([...ctx.values]).includes(body.text));
});
test('network errors are sanitized and uncertain retry does not automatically duplicate',async()=>{
 const ctx=setup('network');const {linked}=await connect(ctx);const body=payload(linked);
 await assert.rejects(()=>ctx.service.send(body,'test-ip'),e=>e.status===502&&e.uncertain&&!e.message.includes('sensitive'));
 await assert.rejects(()=>ctx.service.send(body,'test-ip'),e=>e.status===409);assert.equal(ctx.count(),1);
});
test('missing token, missing chat id, forged capability and oversized messages never call Bot API',async()=>{
 const missing=setup('ok',{...fakeEnv,TELEGRAM_BOT_TOKEN:''});assert.equal(missing.service.config().configured,false);await assert.rejects(()=>missing.service.send({chatId:'123'},'test'),e=>e.status===503);assert.equal(missing.count(),0);
 const ctx=setup();const {linked}=await connect(ctx);
 await assert.rejects(()=>ctx.service.send({...payload(linked),chatId:''},'ip'),e=>e.status===400);
 await assert.rejects(()=>ctx.service.send({...payload(linked),telegramKey:'forged'},'ip'),e=>e.status===403);
 await assert.rejects(()=>ctx.service.send({...payload(linked),text:'a'.repeat(4097)},'ip'),e=>e.status===400);assert.equal(ctx.count(),0);
});
test('one-time start, secret status proof, webhook verification and shared rate limits',async()=>{
 const ctx=setup();const {pair,linked}=await connect(ctx);
 await ctx.service.webhook({message:{chat:{type:'private',id:456},from:{id:456},text:'/start '+pair.code}},fakeEnv.TELEGRAM_WEBHOOK_SECRET);assert.equal((await ctx.service.status(pair,'ip')).chatId,linked.chatId);
 await assert.rejects(()=>ctx.service.status({...pair,pollKey:'x'.repeat(32)},'ip'),e=>e.status===403);
 await assert.rejects(()=>ctx.service.webhook({},'wrong'),e=>e.status===403);
 for(let i=0;i<5;i++)await ctx.service.send(payload(linked),'ip');
 await assert.rejects(()=>ctx.service.send(payload(linked),'ip'),e=>e.status===429);assert.equal(ctx.count(),5);
});
test('Bot API rejection permits safe retry and test message ignores diary text',async()=>{
 const ctx=setup('rejected');const {linked}=await connect(ctx);const body=payload(linked);await assert.rejects(()=>ctx.service.send(body,'ip'),e=>e.status===502&&!e.uncertain);await assert.rejects(()=>ctx.service.send(body,'ip'));assert.equal(ctx.count(),2);
 const ok=setup();const {linked:l}=await connect(ok);await ok.service.send({...payload(l),test:true},'ip');assert.equal(ok.calls[0].text,'Проверка связи CareBee. Telegram подключён.');
});
test('Telegram profiles reload, WhatsApp fallback remains valid, delivery marks and export differ',()=>{
 const map=new Map();const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 saveRecipient(storage,{name:'Мама',aliases:[],phone:'+12025550123',channel:'telegram',telegramChatId:'123',telegramKey:'fake-capability'});const profile=readRecipients(storage)[0];assert.equal(profile.telegramChatId,'123');assert.equal(whatsappLink(profile,'Привет'),`https://wa.me/12025550123?text=${encodeURIComponent('Привет')}`);
 const entry=saveEntry(storage,{text:'Вымышленная запись'})[0];markDelivery(storage,entry.id,{recipientName:'Мама',channel:'telegram',at:new Date().toISOString()});assert.equal(readEntries(storage)[0].handoffs[0].channel,'telegram');assert.ok(exportDiary(readEntries(storage)).includes('Доставлено в Telegram'));
});
