// Server-only module: imported exclusively by route handlers and Node tests.
import { createHmac, createHash, timingSafeEqual, randomBytes } from 'node:crypto';
export const TELEGRAM_MAX_LENGTH = 4096;
export class TelegramError extends Error {
  constructor(message, status = 400, uncertain = false) { super(message); this.status = status; this.uncertain = uncertain; }
}
const hash = value => createHash('sha256').update(value).digest('hex');
const equal = (a,b) => typeof a === 'string' && typeof b === 'string' && a.length === b.length && timingSafeEqual(Buffer.from(a),Buffer.from(b));
export function createTelegramService({ env = process.env, fetcher = fetch } = {}) {
  const configured = () => Boolean(env.TELEGRAM_BOT_TOKEN && /^[A-Za-z0-9_]{5,32}$/.test(env.TELEGRAM_BOT_USERNAME || '') && env.TELEGRAM_WEBHOOK_SECRET?.length >= 24 && env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
  function requireConfig() { if (!configured()) throw new TelegramError('Telegram не настроен на сервере. Можно отправить через WhatsApp.',503); }
  async function redis(command) {
    try {
      const url = new URL(env.UPSTASH_REDIS_REST_URL);
      if(url.protocol !== 'https:') throw new Error();
      const r = await fetcher(url.toString(),{method:'POST',headers:{Authorization:`Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(command),signal:AbortSignal.timeout(6000),cache:'no-store'});
      const data = await r.json(); if(!r.ok || data.error) throw new Error(); return data.result;
    } catch { throw new TelegramError('Защита отправки временно недоступна. Попробуйте позже или используйте WhatsApp.',503); }
  }
  async function limit(key,max,seconds=60) {
    const count = await redis(['EVAL',"local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n",1,'carebee:rate:'+hash(key),seconds]);
    if(Number(count)>max) throw new TelegramError('Слишком много запросов. Подождите минуту.',429);
  }
  function capability(chatId) { return createHmac('sha256',env.TELEGRAM_BOT_TOKEN).update('carebee:recipient:'+chatId).digest('base64url'); }
  async function bot(method,body) {
    let r;
    try { r=await fetcher(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(10000),cache:'no-store'}); }
    catch { throw new TelegramError('Нет ответа Telegram. Возможно, сообщение уже принято. Перед повтором проверьте чат, чтобы избежать дубля.',502,true); }
    let data;try{data=await r.json();}catch{throw new TelegramError('Ответ Telegram не получен. Проверьте чат перед повтором.',502,true);}
    if(!r.ok || !data.ok) throw new TelegramError(data.error_code===403 ? 'Получатель заблокировал бота. Откройте бота и нажмите Старт.' : 'Telegram отклонил сообщение. Проверьте подключение или используйте WhatsApp.',502);
    return data.result;
  }
  return {
    config: () => ({configured:configured(), username:configured()?env.TELEGRAM_BOT_USERNAME:null}),
    async pair(ip) {
      requireConfig(); await limit('pair:'+ip,5); await limit('pair:global',30);
      const code=randomBytes(24).toString('base64url');const pollKey=randomBytes(24).toString('base64url');
      await redis(['SET','carebee:pair:'+hash(code),JSON.stringify({pollHash:hash(pollKey)}),'EX',600,'NX']);
      return {code,pollKey,url:`https://t.me/${env.TELEGRAM_BOT_USERNAME}?start=${code}`,expiresIn:600};
    },
    async status({code,pollKey},ip) {
      requireConfig();if(!/^[A-Za-z0-9_-]{32}$/.test(code || '') || !/^[A-Za-z0-9_-]{32}$/.test(pollKey || '')) throw new TelegramError('Некорректный код подключения.');
      await limit('poll:'+ip,40);const raw=await redis(['GET','carebee:pair:'+hash(code)]);
      if(!raw) throw new TelegramError('Срок ссылки истёк. Создайте новую ссылку.',410);
      const pair=JSON.parse(raw);if(!equal(pair.pollHash,hash(pollKey))) throw new TelegramError('Неверный код проверки.',403);
      return pair.chatId ? {connected:true,chatId:pair.chatId,telegramKey:capability(pair.chatId)} : {connected:false};
    },
    async webhook(update,secret) {
      requireConfig();if(!equal(secret,env.TELEGRAM_WEBHOOK_SECRET)) throw new TelegramError('Доступ запрещён.',403);
      const message=update?.message;
      if(message?.chat?.type!=='private' || message.from?.id!==message.chat.id || typeof message.text!=='string') return;
      const match=message.text.match(/^\/start(?:@[A-Za-z0-9_]+)? ([A-Za-z0-9_-]{32})$/);
      if(!match)return;
      // Atomic first claimant wins; the code cannot bind another chat later.
      await redis(['EVAL',"local v=redis.call('GET',KEYS[1]); if not v then return 0 end; local p=cjson.decode(v); if p.chatId then return 0 end; p.chatId=ARGV[1]; redis.call('SET',KEYS[1],cjson.encode(p),'KEEPTTL'); return 1",1,'carebee:pair:'+hash(match[1]),String(message.chat.id)]);
      // No message text or Bot API response is persisted or logged.
    },
    async send({chatId,telegramKey,text,requestId,test=false},ip) {
      requireConfig();
      if(typeof chatId!=='string' || !/^[1-9]\d{0,15}$/.test(chatId)) throw new TelegramError('Chat id не привязан. Подключите Telegram в профиле или используйте WhatsApp.');
      if(!equal(telegramKey,capability(chatId))) throw new TelegramError('Подключите получателя через ссылку на бота. Ручного chat id недостаточно.',403);
      if(!test && (typeof text!=='string' || !text.trim() || text.length>TELEGRAM_MAX_LENGTH)) throw new TelegramError('Telegram: от 1 до 4096 символов. Сократите текст или используйте WhatsApp.');
      if(typeof requestId!=='string' || !/^[a-f0-9-]{36}$/i.test(requestId)) throw new TelegramError('Некорректный идентификатор запроса.');
      await limit('send:ip:'+ip,15);await limit('send:chat:'+chatId,5);await limit('send:global',30);
      const key='carebee:send:'+hash(chatId+':'+requestId);
      // No text is retained: only a deduplication state and timestamp, for 24 hours.
      const acquired=await redis(['SET',key,JSON.stringify({state:'pending'}),'EX',86400,'NX']);
      if(!acquired){const previous=JSON.parse(await redis(['GET',key]) || '{}');if(previous.state==='sent')return {delivered:true,at:previous.at};throw new TelegramError('Этот запрос уже выполнялся. Проверьте чат перед повтором.',409,true);}
      try {
        await bot('sendMessage',{chat_id:chatId,text:test?'Проверка связи CareBee. Telegram подключён.':text.trim()});
      } catch(e) {if(!e.uncertain)await redis(['DEL',key]);throw e;}
      const at=new Date().toISOString();
      try {await redis(['SET',key,JSON.stringify({state:'sent',at}),'EX',86400]);}catch{ /* Telegram already confirmed; do not report a false failure. */ }
      return {delivered:true,at};
    }
  };
}
