// Run manually with secrets in the process environment or an ignored .env.local.
const {TELEGRAM_BOT_TOKEN,TELEGRAM_WEBHOOK_SECRET}=process.env;
try {
 const url=new URL(process.argv[2]);if(url.protocol!=='https:'||url.username||url.password)throw new Error();
 if(!TELEGRAM_BOT_TOKEN||!TELEGRAM_WEBHOOK_SECRET||TELEGRAM_WEBHOOK_SECRET.length<24)throw new Error();
 const r=await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:new URL('/api/telegram/webhook',url).href,secret_token:TELEGRAM_WEBHOOK_SECRET,allowed_updates:['message']}),signal:AbortSignal.timeout(15000)});
 const data=await r.json();if(!r.ok||!data.ok)throw new Error();
 console.log('Webhook Telegram настроен. Можно подключать получателей в CareBee.');
} catch {console.error('Webhook не настроен. Проверьте HTTPS-адрес, TELEGRAM_BOT_TOKEN и TELEGRAM_WEBHOOK_SECRET (не менее 24 символов). Значения секретов не выводятся.');process.exitCode=1;}
