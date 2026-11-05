export async function telegramRequest(path:string,body:object) {
  const r=await fetch('/api/telegram/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await r.json();if(!r.ok)throw new Error(data.error || 'Не удалось отправить в Telegram.');return data;
}
