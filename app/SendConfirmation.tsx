'use client';
import { useEffect, useRef, useState } from 'react';
export default function SendConfirmation({ name, phone, text, onCancel, onConfirm }: { name:string; phone:string; text:string; onCancel:()=>void; onConfirm:()=>void }) {
  const [seconds,setSeconds]=useState(5);
  const dialog=useRef<HTMLDialogElement>(null);
  const callbacks=useRef({onCancel,onConfirm});
  callbacks.current={onCancel,onConfirm};
  useEffect(()=>{
    dialog.current?.showModal();
    const deadline=Date.now()+5000; let finished=false;
    const timer=setInterval(()=>{const remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));setSeconds(remaining);if(remaining===0&&!finished){finished=true;clearInterval(timer);callbacks.current.onConfirm();}},100);
    const cancel=()=>{if(document.hidden&&!finished){finished=true;clearInterval(timer);callbacks.current.onCancel();}};
    document.addEventListener('visibilitychange',cancel);
    return()=>{finished=true;clearInterval(timer);document.removeEventListener('visibilitychange',cancel);};
  },[]);
  return <dialog className="send-confirmation" ref={dialog} aria-labelledby="send-title" onCancel={event=>{event.preventDefault();onCancel();}}><p className="eyebrow">ПРОВЕРЬТЕ ПОЛУЧАТЕЛЯ</p><h2 id="send-title">Кому: <strong>{name}</strong></h2><p className="send-phone">{phone} · WhatsApp</p><div className="message-preview">{text}</div><p className="send-explanation">Через {seconds} сек. запись сохранится в дневнике и откроется WhatsApp. Окончательную отправку вы подтверждаете в самом мессенджере.</p><p className="countdown" aria-live="off">{seconds}</p><button className="secondary full cancel-send" autoFocus onClick={onCancel}>Отмена</button></dialog>;
}
