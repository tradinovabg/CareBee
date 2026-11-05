'use client';
import { useEffect, useRef, useState } from 'react';
import { deleteRecipient, readRecipients, saveRecipient } from '../../lib/recipients.mjs';

type Profile = { id: string; name: string; aliases: string[]; phone: string; channel: string; isDefault: boolean; updatedAt: string };
export default function Recipients() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLElement>(null);
  function refresh() { try { setProfiles(readRecipients(localStorage)); setReady(true); setError(''); } catch { setReady(false); setError('Не удалось прочитать профили. Данные не перезаписаны. Проверьте доступ к хранилищу браузера.'); } }
  useEffect(() => { refresh(); window.addEventListener('storage',refresh); return () => window.removeEventListener('storage',refresh); },[]);
  useEffect(() => { if (deleting) dialog.current?.showModal(); else dialog.current?.close(); },[deleting]);
  function open(profile: Profile | null) { setEditing(profile); setFormOpen(true); setError(''); setNotice(''); setTimeout(() => { form.current?.scrollIntoView({ behavior:'smooth' }); form.current?.querySelector('input')?.focus(); },0); }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const values = new FormData(event.currentTarget);
    try { setProfiles(saveRecipient(localStorage,{ id:editing?.id, expectedUpdatedAt:editing?.updatedAt, name:values.get('name'), aliases:String(values.get('aliases') || '').split(/[,;\n]/).map(v=>v.trim()).filter(Boolean), phone:values.get('phone'), channel:'whatsapp', isDefault:values.get('isDefault')==='on' })); setFormOpen(false); setEditing(null); setError(''); setNotice('Профиль сохранён в этом браузере.'); }
    catch(e) { setError(e instanceof Error ? e.message : 'Не удалось сохранить профиль.'); }
  }
  return <main className="diary-shell recipients-page"><header className="brand-row"><a className="brand" href="/">✿ CareBee</a><a className="secondary" href="/">← К дневнику</a></header><h1>Получатели</h1><p className="privacy-note">Имена и номера хранятся только в браузере этого устройства. Между телефонами они не синхронизируются и могут исчезнуть при очистке данных браузера.</p><button className="primary" disabled={!ready} onClick={()=>open(null)}>＋ Добавить получателя</button>
    {notice && <p role="status">{notice}</p>}{error && <p className="error" role="alert">{error}</p>}{!ready && <button className="secondary" onClick={refresh}>Повторить загрузку</button>}
    {formOpen && <section className="card recipient-form" ref={form}><h2>{editing?'Изменить получателя':'Новый получатель'}</h2><form key={editing?.id || 'new'} onSubmit={submit}><label>Имя<input name="name" required maxLength={80} defaultValue={editing?.name || ''} placeholder="Например, Мама"/></label><label>Другие имена и формы обращения<textarea name="aliases" rows={3} maxLength={2400} defaultValue={editing?.aliases.join(', ') || ''} placeholder="Маме, маму, мамочка, мамочке"/></label><p className="form-hint">Через запятую или с новой строки. Для необычных форм имени добавьте алиас. При неоднозначном обращении приложение попросит выбрать человека.</p><label>Телефон с кодом страны<input name="phone" type="tel" autoComplete="tel" required maxLength={40} defaultValue={editing?.phone || ''} placeholder="+33 6 12 34 56 78"/></label><label>Канал<select name="channel" defaultValue="whatsapp"><option value="whatsapp">WhatsApp</option></select></label><label className="checkbox-label"><input name="isDefault" type="checkbox" defaultChecked={editing?.isDefault || false}/> Основной получатель</label><div className="composer-actions"><button className="primary" type="submit">Сохранить профиль</button><button className="secondary" type="button" onClick={()=>{setFormOpen(false);setError('');}}>Отмена</button></div></form></section>}
    <section className="profile-list" aria-label="Список получателей">{ready && !profiles.length && <p className="empty card">Добавьте человека, которому хотите отправлять записи.</p>}{profiles.map(profile=><article className="card recipient-profile" key={profile.id}><h2>{profile.name}</h2>{profile.isDefault && <span className="default-badge">Основной</span>}<p>{profile.phone}<br/>WhatsApp</p>{profile.aliases.length>0 && <p className="form-hint">Обращения: {profile.aliases.join(', ')}</p>}<div className="entry-actions"><button onClick={()=>open(profile)}>Изменить</button><button onClick={()=>{setError('');setDeleting(profile);}} className="delete-link">Удалить</button></div></article>)}</section>
    <dialog ref={dialog} aria-labelledby="delete-profile-title" onCancel={()=>setDeleting(null)}><h2 id="delete-profile-title">Удалить получателя?</h2><p>Профиль «{deleting?.name}» и номер будут удалены. Записи и прежние отметки в дневнике сохранятся.</p>{error && <p role="alert" className="error">{error}</p>}<div className="dialog-actions"><button className="secondary" autoFocus onClick={()=>setDeleting(null)}>Отмена</button><button className="danger" onClick={()=>{if(!deleting)return;try{setProfiles(deleteRecipient(localStorage,deleting.id,deleting.updatedAt));if(editing?.id===deleting.id){setEditing(null);setFormOpen(false);}setDeleting(null);setNotice('Получатель удалён.');}catch(e){setError(e instanceof Error?e.message:'Не удалось удалить профиль.');}}}>Удалить профиль</button></div></dialog>
  </main>;
}
