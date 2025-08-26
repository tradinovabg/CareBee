import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// Нормализуем телефон до цифр (для wa/tel)
const digits = (s='') => (s || '').replace(/[^\d+]/g, '');

export default function Sos() {
  const { t } = useTranslation();

  const [contacts, setContacts] = useState(() => load("carebee.sos.contacts", []));
  const [template, setTemplate] = useState(() =>
    load("carebee.sos.template",
      t("sos.defaultMessage","SOS! I need help. Please contact me urgently."))
  );
  const [withLocation, setWithLocation] = useState(true);
  const [loc, setLoc] = useState(null);   // {lat,lng}

  useEffect(() => save("carebee.sos.contacts", contacts), [contacts]);
  useEffect(() => save("carebee.sos.template", template), [template]);

  const msg = useMemo(() => {
    const base = template.trim();
    if (withLocation && loc) {
      const link = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
      return `${base}\n\n${t("sos.location","My location")}: ${link}`;
    }
    return base;
  }, [template, withLocation, loc, t]);

  const getLocation = () => {
    if (!navigator.geolocation) return alert(t("sos.noGeo","Geolocation is not supported"));
    navigator.geolocation.getCurrentPosition(
      p => setLoc({ lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6) }),
      e => alert(e.message),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => { if (withLocation) getLocation(); }, []); // попытка взять локацию при входе

  const addEmpty = () => {
    setContacts(prev => [...prev, { id: crypto.randomUUID(), name: "", phone: "", email: "", wa: "" }]);
  };
  const update = (id, patch) => setContacts(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  const remove = (id) => setContacts(prev => prev.filter(c => c.id !== id));

  const copyMsg = async () => {
    try { await navigator.clipboard.writeText(msg); alert(t("sos.copied","Message copied")); }
    catch { alert(t("sos.copyFail","Cannot copy")); }
  };

  // Ссылки
  const smsHref = (phone) => `sms:${digits(phone)}?&body=${encodeURIComponent(msg)}`;
  const waHref  = (wa)    => `https://wa.me/${digits(wa || '')}?text=${encodeURIComponent(msg)}`;
  const mailHref= (mail)  => `mailto:${mail}?subject=${encodeURIComponent(t("sos.subject","SOS from CareBee"))}&body=${encodeURIComponent(msg)}`;
  const telHref = (phone) => `tel:${digits(phone)}`;

  return (
    <div className="container">
      <div className="card border-rose-200">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-rose-700">🆘 {t("sos.title","Emergency SOS")}</h1>
            <p className="mt-1 text-slate-600">{t("sos.hint","When pressed, quickly send prepared message to trusted contacts.")}</p>
          </div>

          <a
            href="#send"
            onClick={(e)=>{e.preventDefault();}}
            className="btn btn-danger text-base md:text-lg px-5 py-3 rounded-2xl"
            title={t("sos.sos","SOS")}
          >
            🆘 {t("sos.sos","SOS")}
          </a>
        </div>
function SosButton({ onPress }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2   /* всегда видна и поверх */
        z-50
        w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72   /* крупнее на больших экранах */
        rounded-full
        bg-red-600 text-white text-4xl sm:text-5xl font-extrabold
        shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)]
        ring-4 ring-red-300/50
        hover:bg-red-700 active:scale-95
        focus:outline-none focus:ring-8 focus:ring-red-400/60
        select-none
      "
      aria-label="SOS — срочно нужна помощь"
    >
      SOS
    </button>
  );
}

        {/* Шаблон сообщения */}
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="label">{t("sos.message","Message to send")}</label>
            <textarea className="textarea min-h-[120px]" value={template} onChange={e=>setTemplate(e.target.value)} />
            <div className="mt-2 flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={withLocation} onChange={e=>setWithLocation(e.target.checked)} />
                {t("sos.includeLoc","Attach my location")}
              </label>
              <button className="btn btn-ghost btn-sm" onClick={getLocation}>{t("sos.refreshLoc","Refresh location")}</button>
              <button className="btn btn-ghost btn-sm" onClick={copyMsg}>{t("sos.copy","Copy message")}</button>
            </div>
            {withLocation && loc &&
              <div className="text-xs text-slate-500 mt-1">
                {t("sos.location","My location")}: {loc.lat}, {loc.lng}
              </div>
            }
          </div>

          {/* Быстрые действия "отправить всем" (ручные клики по контактам — без попап-блокеров) */}
          <div className="card">
            <div className="card-title">{t("sos.quickSend","Quick send")}</div>
            <p className="text-sm text-slate-600 mb-2">{t("sos.quickHint","Tap channel for each contact below.")}</p>
            <p className="text-sm text-slate-600">{t("sos.note","Browsers block auto-sending to many contacts, so send per contact.")}</p>
          </div>
        </div>
      </div>

      {/* Контакты */}
      <div className="card mt-6">
        <div className="flex items-center justify-between">
          <div className="card-title">{t("sos.trusted","Trusted contacts")}</div>
          <button className="btn" onClick={addEmpty}>{t("actions.add","Add")}</button>
        </div>

        {contacts.length === 0 && (
          <div className="text-sm text-slate-600">
            {t("sos.trustedEmpty","No trusted contacts yet. Add at least one, with phone or WhatsApp or email.")}
          </div>
        )}

        <div className="mt-3 grid gap-3">
          {contacts.map(c => (
            <div key={c.id} className="rounded-xl border border-slate-200 p-3">
              <div className="grid md:grid-cols-5 gap-2">
                <input className="input" placeholder={t("sos.name","Name")} value={c.name} onChange={e=>update(c.id,{name:e.target.value})}/>
                <input className="input" placeholder={t("sos.phone","Phone")} value={c.phone||""} onChange={e=>update(c.id,{phone:e.target.value})}/>
                <input className="input" placeholder="WhatsApp" value={c.wa||""} onChange={e=>update(c.id,{wa:e.target.value})}/>
                <input className="input" placeholder="Email" value={c.email||""} onChange={e=>update(c.id,{email:e.target.value})}/>
                <div className="flex gap-2">
                  <a className="btn btn-danger"   href={smsHref(c.phone)}   target="_blank" rel="noreferrer">SMS</a>
                  <a className="btn btn-primary" href={waHref(c.wa || c.phone)} target="_blank" rel="noreferrer">WA</a>
                  <a className="btn"             href={mailHref(c.email)}    target="_blank" rel="noreferrer">Email</a>
                  <a className="btn"             href={telHref(c.phone)}     target="_blank" rel="noreferrer">Call</a>
                  <button className="btn btn-ghost" onClick={()=>remove(c.id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
