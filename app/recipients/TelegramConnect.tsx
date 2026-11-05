'use client';
import { useEffect,useState } from 'react';
import { telegramRequest } from '../../lib/telegram-client';
import { readRecipients,saveRecipient } from '../../lib/recipients.mjs';
type Profile={id:string;name:string;updatedAt:string;telegramChatId?:string;telegramKey?:string};
export default function TelegramConnect({profile,onChange}:{profile:Profile;onChange:()=>void}) {
  const [pair,setPair]=useState<{code:string;pollKey:string;url:string;expiresIn:number}|null>(null);
  const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
  const [connected,setConnected]=useState(Boolean(profile.telegramChatId&&profile.telegramKey));
  useEffect(()=>{setConnected(Boolean(profile.telegramChatId&&profile.telegramKey));},[profile.telegramChatId,profile.telegramKey]);
  useEffect(()=>{
    if(!pair)return;let active=true;let timer:ReturnType<typeof setTimeout>;const deadline=Date.now()+pair.expiresIn*1000;
    const poll=async()=>{
      if(!active)return;
      if(Date.now()>deadline){setPair(null);setMessage('Срок ссылки истёк. Нажмите «Подключить Telegram» заново.');return;}
      try {
        const data=await telegramRequest('status',{code:pair.code,pollKey:pair.pollKey});if(!active)return;
        if(data.connected){
          const latest=readRecipients(localStorage).find((p:Profile)=>p.id===profile.id);
          if(!latest)throw new Error('Профиль удалён. Создайте его заново.');
          if(latest.updatedAt!==profile.updatedAt)throw new Error('Профиль изменён. Обновите страницу и подключите заново.');
          saveRecipient(localStorage,{...latest,expectedUpdatedAt:latest.updatedAt,telegramChatId:data.chatId,telegramKey:data.telegramKey});
          setConnected(true);setPair(null);setMessage('Telegram подключён. Теперь проверьте связь и выберите Telegram основным каналом.');onChange();return;
        }
        setMessage('Ожидаем нажатия «Старт» в боте. Не закрывайте эту страницу.');
      }catch(e){if(active){setPair(null);setMessage(e instanceof Error?e.message:'Не удалось проверить подключение.');}return;}
      if(active)timer=setTimeout(poll,3000);
    };
    timer=setTimeout(poll,3000);return()=>{active=false;clearTimeout(timer);};
  },[pair,profile.id,profile.updatedAt,onChange]);
  async function start(){setBusy(true);try{const result=await telegramRequest('pair',{});setPair(result);setMessage('Передайте ссылку нужному человеку: он должен открыть бота и нажать Старт. Ссылка одноразовая, действует 10 минут; получит её только выбранный человек.');}catch(e){setMessage(e instanceof Error?e.message:'Не удалось подключить Telegram.');}finally{setBusy(false);}}
  async function test(){setBusy(true);try{const p=readRecipients(localStorage).find((p:Profile)=>p.id===profile.id);await telegramRequest('send',{chatId:p?.telegramChatId,telegramKey:p?.telegramKey,test:true,requestId:crypto.randomUUID()});setMessage('Пробное сообщение доставлено в Telegram. Это не подтверждает прочтение.');}catch(e){setMessage(e instanceof Error?e.message:'Не удалось проверить связь.');}finally{setBusy(false);}}
  return <section className="telegram-connect"><h3>Telegram</h3><p>Chat id: {profile.telegramChatId || 'не подключён'}</p><p className="form-hint">Через Telegram сообщения уходят через наш сервер и серверы Telegram. Временный код и chat id при подключении хранятся на сервере до 10 минут; затем chat id и ключ подключения остаются в этом браузере.</p><div className="composer-actions"><button className="secondary" disabled={busy||!!pair} onClick={start}>{connected?'Переподключить Telegram':'Подключить Telegram'}</button><button className="secondary" disabled={busy||!connected} onClick={test}>Проверить связь</button></div>{pair&&<div><a className="primary" href={pair.url} target="_blank" rel="noreferrer">Открыть бота и нажать Старт</a><p className="pair-url">{pair.url}</p><button className="secondary" onClick={()=>{setPair(null);setMessage('Подключение отменено. Ссылка истечёт через 10 минут.');}}>Отмена подключения</button></div>}<p role="status">{message}</p></section>;
}
