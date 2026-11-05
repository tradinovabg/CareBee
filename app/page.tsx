'use client';
import { useEffect, useRef, useState } from 'react';
import { deleteEntry, exportDiary, formatDate, MAX_TEXT_LENGTH, readEntries, saveEntry, markDelivery, STORAGE_KEY } from '../lib/diary.mjs';
import { telegramRequest } from '../lib/telegram-client';
import SendConfirmation from './SendConfirmation';
import { readRecipients, recognizeRecipient, whatsappLink, RECIPIENTS_KEY } from '../lib/recipients.mjs';
import { getRecognition, Recognition, speechError } from '../lib/speech';

type Profile = { id: string; name: string; aliases: string[]; phone: string; channel: string; isDefault: boolean; updatedAt: string; telegramChatId?:string; telegramKey?:string };
type Handoff = { recipientName: string; at: string; channel: string };
type Entry = { id: string; text: string; createdAt: string; updatedAt: string; handoffs?: Handoff[] };
type VoiceState = 'idle' | 'starting' | 'listening' | 'stopping';
export default function Diary() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profilesError, setProfilesError] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [recipientMessage, setRecipientMessage] = useState('');
  const [sendJob, setSendJob] = useState<{ profile: Profile; text: string; editing: Entry | null } | null>(null);
  const [telegramResult,setTelegramResult] = useState<{delivered:boolean;message:string;profile:Profile;text:string;entryId:string;requestId:string}|null>(null);
  const [telegramBusy,setTelegramBusy] = useState(false);
  const [telegramConfig,setTelegramConfig] = useState<boolean|null>(null);
  const [handoffLink, setHandoffLink] = useState('');
  const sendLocked = useRef(false);
  const allowNavigation = useRef(false);
  const chosen = profiles.find(p => p.id === selectedId);
  function refreshProfiles() {
    try { const current = readRecipients(localStorage); setProfiles(current); setProfilesError(''); setSelectedId(previous => current.some(p => p.id === previous) ? previous : current.find(p => p.isDefault)?.id || ''); }
    catch { setProfiles([]); setSelectedId(''); setProfilesError('Не удалось прочитать получателей. Сохранить запись в дневник можно без отправки.'); }
  }
  const [entries, setEntries] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);
  const [storageOK, setStorageOK] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [voiceReason, setVoiceReason] = useState('');
  const [text, setText] = useState('');
  const [editing, setEditing] = useState<Entry | null>(null);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const [voice, setVoice] = useState<VoiceState>('idle');
  const [voiceMessage, setVoiceMessage] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  const resolveVoice = useRef<(() => void) | null>(null);
  const voiceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const confirmation = useRef<HTMLDialogElement>(null);
  const recording = voice !== 'idle';
  const dirty = text !== (editing?.text || '');

  function refresh() {
    try { setEntries(readEntries(window.localStorage)); setStorageOK(true); setStorageError(''); }
    catch { setStorageOK(false); setStorageError('Не удалось прочитать дневник из браузера. Данные не перезаписаны. Разрешите хранение данных сайта и повторите загрузку. При повреждении данных сначала сохраните их копию; не очищайте браузер.'); }
    setReady(true);
  }
  useEffect(() => {
    refresh(); refreshProfiles();
    fetch('/api/telegram/config').then(r=>r.json()).then(data=>setTelegramConfig(Boolean(data.configured))).catch(()=>setTelegramConfig(false));
    setVoiceAvailable(Boolean(getRecognition()) && window.isSecureContext);
    setVoiceReason(!window.isSecureContext ? 'Для микрофона откройте приложение по HTTPS. Сейчас можно вводить текст вручную.' : !getRecognition() ? 'Этот браузер не поддерживает голосовой ввод. Попробуйте Chrome на Android или Safari на iPhone, либо введите текст вручную.' : '');
    const sync = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) refresh(); if(event.key === RECIPIENTS_KEY || event.key === null) refreshProfiles(); };
    window.addEventListener('focus',refreshProfiles);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('focus',refreshProfiles); if (voiceTimer.current) clearTimeout(voiceTimer.current); if (recognition.current) { recognition.current.onend = null; recognition.current.onerror = null; recognition.current.onresult = null; recognition.current.onstart = null; recognition.current.abort(); } };
  }, []);
  useEffect(() => {
    if (!dirty && !recording) return;
    const warn = (event: BeforeUnloadEvent) => { if (!allowNavigation.current) event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, recording]);
  useEffect(() => { if (deleting) confirmation.current?.showModal(); else confirmation.current?.close(); }, [deleting]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 5000); return () => clearTimeout(timer); }, [notice]);

  function beginVoice() {
    const Constructor = getRecognition();
    if (!Constructor || !window.isSecureContext || recognition.current) return;
    setError(''); setNotice(''); setVoiceMessage('Браузер запрашивает микрофон. Разрешите доступ и дождитесь надписи «Слушаю».');
    const instance = new Constructor();
    recognition.current = instance;
    instance.lang = 'ru-RU'; instance.continuous = true; instance.interimResults = true; instance.maxAlternatives = 1;
    const base = text.trimEnd(); let received = false; let failed = false; let latestTranscript = '';
    const resolveRecipient = () => {
      if (!latestTranscript) return;
      const result = recognizeRecipient(latestTranscript, profiles);
      if (result.status === 'matched') { setSelectedId(result.recipientId!); setText([base, result.text].filter(Boolean).join('\n').slice(0, MAX_TEXT_LENGTH)); setRecipientMessage('Получатель распознан. Проверьте строку «Кому».'); }
      else { setSelectedId(''); setRecipientMessage(result.status === 'ambiguous' ? 'Найдено несколько похожих имён. Выберите получателя вручную; текст не изменён.' : 'Имя не распознано. Выберите получателя вручную или просто сохраните запись.'); }
    };
    resolveVoice.current = resolveRecipient;
    const clearTimer = () => { if (voiceTimer.current) { clearTimeout(voiceTimer.current); voiceTimer.current = null; } };
    instance.onstart = () => { clearTimer(); setVoice('listening'); setVoiceMessage('Слушаю по-русски. Говорите, затем нажмите «Остановить».'); };
    instance.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0].transcript).join(' ').trim();
      if (transcript) { latestTranscript = transcript; received = true; const combined = [base, transcript].filter(Boolean).join('\n'); setText(combined.slice(0, MAX_TEXT_LENGTH)); if (combined.length > MAX_TEXT_LENGTH) { failed = true; setVoiceMessage('Достигнут лимит 20 000 символов. Проверьте текст и сохраните запись.'); instance.stop(); } }
    };
    instance.onerror = event => { resolveRecipient(); failed = true; clearTimer(); instance.onend = null; instance.onstart = null; instance.onresult = null; instance.onerror = null; instance.abort(); recognition.current = null; setVoice('idle'); setVoiceMessage(speechError(event.error)); };
    instance.onend = () => { resolveRecipient(); clearTimer(); recognition.current = null; setVoice('idle'); if (!failed) setVoiceMessage(received ? 'Распознавание закончено. Проверьте и исправьте текст, затем нажмите «Сохранить».' : 'Текст не получен. Можно повторить запись или ввести текст вручную.'); };
    setVoice('starting');
    try {
      instance.start();
      voiceTimer.current = setTimeout(() => { failed = true; instance.abort(); recognition.current = null; setVoice('idle'); setVoiceMessage('Браузер не запустил распознавание. Проверьте разрешение микрофона или введите текст вручную.'); }, 20000);
    } catch { recognition.current = null; setVoice('idle'); setVoiceMessage('Не удалось запустить микрофон. Попробуйте снова или введите текст вручную.'); }
  }
  function stopVoice() {
    const instance = recognition.current;
    if (!instance) return;
    if (voiceTimer.current) clearTimeout(voiceTimer.current);
    setVoice('stopping');
    try {
      if (voice === 'starting') instance.abort(); else instance.stop();
      voiceTimer.current = setTimeout(() => { resolveVoice.current?.(); instance.onend = null; instance.onresult = null; instance.onerror = null; instance.onstart = null; instance.abort(); recognition.current = null; setVoice('idle'); setVoiceMessage('Запись остановлена. Проверьте полученный текст.'); }, 5000);
    } catch { recognition.current = null; setVoice('idle'); setVoiceMessage('Запись остановлена. Проверьте текст.'); }
  }
  function requestSend() {
    if (recording || busy || !storageOK || !text.trim()) return;
    if (!chosen) { setRecipientMessage('Выберите получателя кнопкой ниже. Сохранение в дневник доступно без получателя.'); return; }
    sendLocked.current = false; setError(''); setHandoffLink(''); setTelegramResult(null);
    setSendJob({profile:{...chosen}, text:text.trim(), editing});
  }
  async function deliverTelegram(profile:Profile,message:string,entryId:string,requestId:string) {
    setTelegramBusy(true);setBusy(true);
    try {
      const result=await telegramRequest('send',{chatId:profile.telegramChatId,telegramKey:profile.telegramKey,text:message,requestId});
      let note='Доставлено в Telegram. Это означает принятие сообщения Bot API, а не прочтение получателем.';
      try {setEntries(markDelivery(localStorage,entryId,{recipientName:profile.name,channel:'telegram',at:result.at}));}
      catch {note+=' Не удалось сохранить отметку в дневнике; не отправляйте повторно.';}
      setTelegramResult({delivered:true,message:note,profile,text:message,entryId,requestId});
    }catch(e){setTelegramResult({delivered:false,message:e instanceof Error?e.message:'Нет ответа сервера. Проверьте чат перед повтором.',profile,text:message,entryId,requestId});}
    finally{setTelegramBusy(false);setBusy(false);}
  }
  async function completeSend() {
    if (!sendJob || sendLocked.current) return;
    sendLocked.current = true;
    try {
      const current = readRecipients(localStorage).find((p: Profile) => p.id === sendJob.profile.id);
      if (!current || current.updatedAt !== sendJob.profile.updatedAt) throw new Error('Получатель изменён или удалён. Выберите его и подтвердите отправку заново.');
      if(sendJob.profile.channel==='telegram') {
        const before=readEntries(localStorage);const ids=new Set(before.map((e:Entry)=>e.id));
        const next=saveEntry(localStorage,{id:sendJob.editing?.id,expectedUpdatedAt:sendJob.editing?.updatedAt,text:sendJob.text});
        const entry=sendJob.editing ? next.find((e:Entry)=>e.id===sendJob.editing!.id) : next.find((e:Entry)=>!ids.has(e.id));
        setEntries(next);setText('');setEditing(null);setVoiceMessage('');setSendJob(null);
        await deliverTelegram(current,sendJob.text,entry.id,crypto.randomUUID());return;
      }
      const link = whatsappLink({...current,channel:'whatsapp'}, sendJob.text);
      const next = saveEntry(localStorage,{id:sendJob.editing?.id,expectedUpdatedAt:sendJob.editing?.updatedAt,text:sendJob.text,handoff:{recipientName:current.name,channel:'whatsapp',at:new Date().toISOString()}});
      setEntries(next); setText(''); setEditing(null); setVoiceMessage(''); setSendJob(null); setHandoffLink(link); setNotice('Запись сохранена. Подтвердите отправку в WhatsApp.');
      allowNavigation.current = true;
      try { window.location.assign(link); } catch { setNotice('Запись сохранена. Нажмите «Перейти в WhatsApp» ниже.'); }
      setTimeout(()=>{allowNavigation.current=false;},10000);
    } catch(e) { setSendJob(null); setError(e instanceof Error ? e.message : 'Не удалось сохранить запись. Сообщение не отправлено.'); }
  }
  function fallbackWhatsApp() {
    if(!telegramResult)return;
    try {
      const result=telegramResult;const profile=readRecipients(localStorage).find((p:Profile)=>p.id===result.profile.id);
      if(!profile)throw new Error('Получатель удалён.');
      const entry=readEntries(localStorage).find((e:Entry)=>e.id===result.entryId);
      if(!entry)throw new Error('Запись удалена. Откройте её заново.');
      sendLocked.current=false;setSendJob({profile:{...profile,channel:'whatsapp'},text:result.text,editing:entry});setTelegramResult(null);
    }catch(e){setError(e instanceof Error?e.message:'Не удалось открыть WhatsApp.');}
  }
  function submit(event: React.FormEvent) {
    event.preventDefault(); if (!text.trim() || recording || !storageOK || busy) return;
    setBusy(true); setError('');
    try { const next = saveEntry(window.localStorage, { id: editing?.id, expectedUpdatedAt: editing?.updatedAt, text }); setEntries(next); setText(''); setEditing(null); setVoiceMessage(''); setNotice(editing ? 'Изменения сохранены на этом устройстве.' : 'Запись сохранена на этом устройстве.'); }
    catch (e) { setError(e instanceof Error && !['QuotaExceededError','SecurityError'].includes(e.name) ? e.message : 'Не удалось сохранить: браузер запретил хранение или закончилось место. Ваш текст остаётся в поле — скопируйте его, прежде чем закрывать страницу.'); }
    finally { setBusy(false); }
  }
  function edit(entry: Entry) {
    if (dirty && !window.confirm('В поле есть несохранённый текст. Отбросить его и открыть запись?')) return;
    setEditing(entry); setText(entry.text); setError(''); setVoiceMessage(''); editor.current?.focus(); editor.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function cancel() {
    if (dirty && !window.confirm('Отбросить несохранённые изменения?')) return;
    setText(''); setEditing(null); setError(''); setVoiceMessage('');
  }
  function confirmDelete() {
    if (!deleting) return;
    try { setEntries(deleteEntry(window.localStorage, deleting.id, deleting.updatedAt)); if (editing?.id === deleting.id) { setEditing(null); setText(''); } setDeleting(null); setNotice('Запись удалена.'); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'Не удалось удалить запись.'); }
  }
  function download() {
    try {
      const latest = readEntries(window.localStorage); setEntries(latest);
      const blob = new Blob(['\uFEFF', exportDiary(latest)], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `carebee-diary-${new Date().toLocaleDateString('en-CA')}.txt`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
      setNotice('Файл дневника подготовлен. Проверьте загрузки или меню сохранения браузера.');
    } catch { setError('Не удалось экспортировать дневник. Проверьте доступ к данным браузера.'); }
  }
  return <main className="diary-shell">
    <header className="brand-row"><a href="/" className="brand"><span aria-hidden="true">✿</span> CareBee</a><a className="secondary manage-recipients" href="/recipients">Получатели</a></header>
    <section className="intro"><p className="eyebrow">ЗАПИСАТЬ. ПРОВЕРИТЬ. СОХРАНИТЬ.</p><h1>Забота —<br/>своими словами.</h1><p>Дневник ухода и самочувствия.<br/>Расскажите, как прошёл день, пока всё помните.</p><div className="intro-flower" aria-hidden="true">✿</div></section>
    <aside className="privacy-note"><span aria-hidden="true">ⓘ</span><p>Записи хранятся <strong>в браузере этого устройства</strong>. При отправке в Telegram текст проходит через наш сервер и серверы Telegram. Между телефонами записи не синхронизируются и могут исчезнуть при очистке данных браузера. В приватном режиме хранение может быть временным. Сохраняйте копию через экспорт.</p></aside>
    <section className="card composer" aria-labelledby="composer-title"><div className="section-heading"><div><p className="eyebrow">{editing ? 'РЕДАКТИРОВАНИЕ' : 'МОМЕНТ ЗАБОТЫ'}</p><h2 id="composer-title">{editing ? 'Изменить запись' : 'Новая запись'}</h2></div><span className="step-badge">{editing ? '✎' : '01'}</span></div>
      {editing && <p className="edit-date">Запись от {formatDate(editing.createdAt)}. Дата создания сохранится.</p>}
      <button type="button" className={'voice-button ' + (recording ? 'is-recording' : '')} disabled={!ready || !voiceAvailable || voice === 'stopping'} onClick={recording ? stopVoice : beginVoice}><span className="mic-icon" aria-hidden="true">{recording ? '■' : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/></svg>}</span><span>{voice === 'starting' ? 'Отменить запуск' : voice === 'listening' ? 'Остановить' : voice === 'stopping' ? 'Останавливаю…' : 'Записать голосом'}</span>{voice === 'listening' && <span className="recording-dot"/>}</button>
      <p className="voice-status" role="status">{voiceMessage || voiceReason || (ready ? 'Нажмите кнопку и разрешите доступ к микрофону.' : 'Проверяем возможности браузера…')}</p>
      <p className="audio-notice">Голос может обрабатываться внешним сервисом браузера. Обычно нужен интернет. Можно обойтись ручным вводом.</p><details className="voice-privacy"><summary>Куда передаётся голос?</summary><p>Используется распознавание речи вашего браузера. Аудио может передаваться внешнему сервису поставщика браузера (например, Google в Chrome или Apple в Safari); обработка зависит от браузера и его настроек. Обычно нужен интернет. CareBee не записывает аудиофайлы и не отправляет текст на свой сервер. Для первой проверки используйте вымышленные сведения; если не хотите передавать аудио, вводите текст вручную.</p></details>
      <section className="recipient-picker" aria-label="Выбор получателя"><p className="recipient-to">Кому: <strong>{chosen?.name || 'Выберите получателя'}</strong></p>{chosen && <p className="recipient-number">{chosen.phone} · {chosen.channel==='telegram'?'Telegram':'WhatsApp'}{chosen.isDefault ? ' · Основной' : ''}</p>}{chosen?.channel==='telegram'&&(!chosen.telegramChatId||!chosen.telegramKey||telegramConfig===false)&&<p className="error">{telegramConfig===false?'Telegram не настроен на сервере.':'Telegram ещё не привязан к получателю.'} Можно сохранить запись или отправить через WhatsApp.</p>}<div className="recipient-buttons">{profiles.map(profile=><button type="button" key={profile.id} disabled={recording} className={selectedId===profile.id?'selected-recipient':'secondary'} aria-pressed={selectedId===profile.id} onClick={()=>{setSelectedId(profile.id);setRecipientMessage('Получатель выбран вручную.');}}>{profile.name}</button>)}</div>{!profiles.length && <a className="secondary add-recipient-link" href="/recipients">＋ Добавить получателя</a>}<p className="recipient-status" role="status">{profilesError || recipientMessage || (!chosen ? 'Выберите человека для WhatsApp. Просто сохранить запись можно и без получателя.' : 'Можно выбрать другого человека кнопкой выше.')}</p></section>
      <form onSubmit={submit}><label htmlFor="entry-text">{editing ? 'Текст записи' : 'Проверьте текст или напишите вручную'}</label><textarea ref={editor} id="entry-text" name="text" rows={6} maxLength={MAX_TEXT_LENGTH} value={text} onChange={e => setText(e.target.value)} disabled={recording} placeholder="Например: Сегодня утром измерили маме давление — 130 на 80. Чувствует себя хорошо." aria-describedby="save-hint"/><div className="text-meta"><span>{recording ? 'После остановки текст можно исправить' : 'Можно исправить каждое слово'}</span><span>{text.length.toLocaleString('ru-RU')} / 20 000</span></div>
      <p id="save-hint" className="save-hint">«Сохранить» добавляет запись только в дневник. «Отправить» сохраняет её после обратного отсчёта и отправляет через основной канал. Telegram передаёт текст через наш сервер и серверы Telegram; WhatsApp открывается для ручного подтверждения. Несохранённый текст может потеряться при закрытии страницы.</p>
      {error && !deleting && <p className="error" role="alert">{error}</p>}
      <div className="composer-actions diary-save-actions"><button className="primary" type="submit" disabled={!ready || !storageOK || !text.trim() || recording || busy}>{busy ? 'Сохраняем…' : editing ? 'Сохранить изменения' : 'Сохранить' }<span aria-hidden="true">→</span></button><button type="button" className="send-button" disabled={!ready || !storageOK || !text.trim() || recording || busy} onClick={requestSend}>Отправить</button>{chosen?.channel==='telegram'&&<button className="secondary" type="button" disabled={busy||recording||!text.trim()||!storageOK} onClick={()=>{sendLocked.current=false;setSendJob({profile:{...chosen,channel:'whatsapp'},text:text.trim(),editing});}}>Отправить через WhatsApp</button>}{(editing || text) && <button className="secondary" type="button" disabled={recording || busy} onClick={cancel}>{editing ? 'Отмена' : 'Очистить'}</button>}</div></form>
    </section>
    {telegramBusy&&<section className="card telegram-result" role="status"><h2>Отправляем в Telegram…</h2><p>Не закрывайте страницу. Запись уже сохранена в дневнике.</p></section>}
    {telegramResult&&<section className="card telegram-result" role="status"><h2>{telegramResult.delivered?'Доставлено':'Не удалось отправить'}</h2><p>{telegramResult.message}</p>{!telegramResult.delivered&&<div className="composer-actions"><button className="primary" disabled={telegramBusy} onClick={()=>{const r=telegramResult;void deliverTelegram(r.profile,r.text,r.entryId,r.requestId);}}>Повторить</button><button className="secondary" disabled={telegramBusy} onClick={()=>{if(window.confirm('Проверьте чат: Telegram мог принять сообщение. Повторная отправка может создать дубль. Отправить заново?')){const r=telegramResult;void deliverTelegram(r.profile,r.text,r.entryId,crypto.randomUUID());}}}>Отправить заново</button><button className="secondary" disabled={telegramBusy} onClick={fallbackWhatsApp}>Отправить через WhatsApp</button></div>}</section>}
    {handoffLink && <section className="card handoff-fallback"><h2>Открыть WhatsApp</h2><p>Если мессенджер не открылся, нажмите кнопку. Запись уже сохранена; повторно сохранять её не нужно.</p><a className="primary" href={handoffLink}>Перейти в WhatsApp</a><p>Окончательную отправку подтвердите в WhatsApp. CareBee не получает подтверждения отправки или доставки.</p></section>}
    {sendJob && <SendConfirmation name={sendJob.profile.name} phone={sendJob.profile.channel==='telegram' ? (sendJob.profile.telegramChatId || 'Не подключён') : sendJob.profile.phone} channel={sendJob.profile.channel} text={sendJob.text} onCancel={()=>{sendLocked.current=true;setSendJob(null);setNotice('Отправка отменена. Текст остался в поле, изменения не сохранены.');}} onConfirm={completeSend}/>}
    {storageError && <div className="error" role="alert"><p>{storageError}</p><button className="secondary" onClick={refresh}>Повторить загрузку</button></div>}
    <section className="journal" aria-labelledby="journal-title"><div className="section-heading"><div><p className="eyebrow">ВАЖНОЕ ОСТАЁТСЯ РЯДОМ</p><h2 id="journal-title">Ваш дневник <span className="count">{entries.length}</span></h2></div><button className="export-button" disabled={!ready || !storageOK || !entries.length} onClick={download}><span aria-hidden="true">↓</span> Скачать .txt</button></div>
      <p className="journal-hint">Новые записи сверху · дата и время по настройкам устройства</p>
      {!ready ? <p className="empty">Загружаем дневник…</p> : !storageOK ? <p className="empty">Дневник пока недоступен. Ваш текст можно набрать выше.</p> : !entries.length ? <div className="empty card"><span aria-hidden="true">♡</span><h3>Начнём с одного момента</h3><p>Продиктуйте или напишите, как прошёл день.<br/>После сохранения запись появится здесь.</p></div> : <div className="entry-list">{entries.map(entry => <article className="card entry" key={entry.id}><div className="entry-top"><time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time><span aria-hidden="true">✧</span></div><p className="entry-text">{entry.text}</p>{entry.updatedAt !== entry.createdAt && <p className="edited-at">Изменено: {formatDate(entry.updatedAt)}</p>}{entry.handoffs?.map((handoff,index)=><p className="handoff-mark" key={index}>Отправлено: <strong>{handoff.recipientName}</strong> · {formatDate(handoff.at)}<small>{handoff.channel==='telegram'?'Доставлено в Telegram. Bot API принял сообщение; прочтение не подтверждено.':'Открытие WhatsApp. Отправка и доставка не подтверждены.'}</small></p>)}<div className="entry-actions"><button disabled={recording || busy} onClick={() => edit(entry)}>Изменить</button><button className="delete-link" disabled={recording || busy} onClick={() => { setError(''); setDeleting(entry); }}>Удалить</button></div></article>)}</div>}
      <p className="export-hint">Экспорт включает только сохранённые записи. Файл может содержать личные сведения — храните его бережно.</p>
    </section>
    <footer><span>✿ CareBee · Рядом с близкими</span><p>Показатели остаются частью текста. Приложение не интерпретирует их и не даёт медицинских рекомендаций.</p></footer>
    <dialog ref={confirmation} aria-labelledby="delete-title" onCancel={() => { setDeleting(null); setError(''); }}><h2 id="delete-title">Удалить запись?</h2><p>Запись от {deleting ? formatDate(deleting.createdAt) : ''} будет удалена с этого устройства. Отменить удаление нельзя.</p>{error && <p className="error" role="alert">{error}</p>}<div className="dialog-actions"><button autoFocus className="secondary" onClick={() => { setDeleting(null); setError(''); }}>Отмена</button><button className="danger" onClick={confirmDelete}>Удалить запись</button></div></dialog>
    {notice && <div className="toast" role="status">✓ {notice}</div>}
  </main>;
}
