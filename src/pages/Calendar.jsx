import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const todayStr = () => new Date().toISOString().slice(0,10);
const addDays = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate()+n); return dt.toISOString().slice(0,10); };
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));

export default function Calendar () {
  const { t } = useTranslation();
  const [mode, setMode]   = useState("week");
  const [showVisits, setShowVisits] = useState(true);
  const [showMeds, setShowMeds]     = useState(true);

  const withIds = (key) => {
    const data = load(key, []);
    let changed = false;
    const res = data.map(it => {
      if (!it.id) { changed = true; return { ...it, id: newId() }; }
      return it;
    });
    if (changed) save(key, res);
    return res;
  };
  const [visits, setVisits] = useState(() => withIds("carebee.visits"));
  const [meds, setMeds]     = useState(() => withIds("carebee.meds"));
  useEffect(() => {
    const h = () => { setVisits(withIds("carebee.visits")); setMeds(withIds("carebee.meds")); };
    window.addEventListener("storage", h); return () => window.removeEventListener("storage", h);
  }, []);

  const rangeDays = mode === "day" ? 1 : mode === "week" ? 7 : 30;
  const today = todayStr();
  const days = useMemo(() => Array.from({length: rangeDays}, (_,i) => addDays(today, i)), [rangeDays, today]);

  const eventsByDate = useMemo(() => {
    const res = Object.fromEntries(days.map(d => [d, []]));
    const end = addDays(today, rangeDays-1);
    if (showVisits) {
      visits.forEach(v => {
        if (v.date >= today && v.date <= end) {
          res[v.date].push({ id: v.id, time: v.time, title: v.doctor, type: "visit", location: v.place, notes: v.notes });
        }
      });
    }
    if (showMeds) {
      meds.forEach(m => {
        if (m.mode === "once") {
          if (m.once?.date >= today && m.once?.date <= end) {
            res[m.once.date].push({ id: m.id, time: m.once.time, title: m.name, type: "med" });
          }
        } else {
          const d = m.daily || {};
          days.forEach(day => {
            const within = (!d.start || day >= d.start) && (!d.end || day <= d.end);
            if (within) (d.times||[]).forEach(tm => res[day].push({ id: `${m.id}-${tm}`, time: tm, title: m.name, type: "med" }));
          });
        }
      });
    }
    Object.values(res).forEach(list => list.sort((a,b) => (a.time||"").localeCompare(b.time||"")));
    return res;
  }, [days, visits, meds, showVisits, showMeds, today, rangeDays]);

  // Quick Add: Visit
  const [vForm, setVForm] = useState({ date: today, time: "", doctor: "", place: "", notes: "" });
  const onVChange = e => setVForm({ ...vForm, [e.target.name]: e.target.value });
  const addVisit = (e) => {
    e.preventDefault();
    const next = [...visits, { id: newId(), ...vForm }];
    setVisits(next); save("carebee.visits", next);
    setVForm({ date: todayStr(), time: "", doctor: "", place: "", notes: "" });
  };

  // Quick Add: Med
  const [modeMed, setModeMed] = useState("daily");
  const [mForm, setMForm] = useState({
    name:"", dose:"", once:{ date: today, time:"" }, daily:{ times:["08:00","20:00"], start:"", end:"" }
  });
  const onMChange = e => setMForm({ ...mForm, [e.target.name]: e.target.value });
  const onMOnce = e => setMForm({ ...mForm, once: { ...mForm.once, [e.target.name]: e.target.value }});
  const onMDaily = e => setMForm({
    ...mForm, daily:{ ...mForm.daily,
      [e.target.name]: e.target.name === "times"
        ? e.target.value.split(",").map(s=>s.trim()).filter(Boolean)
        : e.target.value
    }
  });
  const addMed = (e) => {
    e.preventDefault();
    const rec = { id: newId(), name: mForm.name, dose: mForm.dose, mode: modeMed };
    if (modeMed === "once") rec.once = { ...mForm.once };
    else rec.daily = { ...mForm.daily };
    const next = [...meds, rec];
    setMeds(next); save("carebee.meds", next);
    setMForm({ name:"", dose:"", once:{ date: todayStr(), time:"" }, daily:{ times:["08:00","20:00"], start:"", end:"" } });
  };

  return (
    <div className="container">
      <h1>{t("calendar.title","Calendar")}</h1>

      {/* Switches */}
      <div className="flex gap-2 my-2">
        <button className={mode==="day"?"btn btn-primary":"btn"} onClick={()=>setMode("day")}>{t("calendar.day","Day")}</button>
        <button className={mode==="week"?"btn btn-primary":"btn"} onClick={()=>setMode("week")}>{t("calendar.week","Week")}</button>
        <button className={mode==="month"?"btn btn-primary":"btn"} onClick={()=>setMode("month")}>{t("calendar.month","Month")}</button>
        <label className="ml-4"><input type="checkbox" checked={showVisits} onChange={e=>setShowVisits(e.target.checked)} /> {t("calendar.showVisits")}</label>
        <label><input type="checkbox" checked={showMeds} onChange={e=>setShowMeds(e.target.checked)} /> {t("calendar.showMeds")}</label>
      </div>

      {/* Quick Add */}
      <details className="mb-4">
        <summary className="cursor-pointer font-semibold">{t("calendar.quick","Quick add")}</summary>
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          {/* Visit */}
          <form onSubmit={addVisit} className="border rounded p-3 grid gap-2">
            <div className="font-semibold">{t("calendar.addVisit","Add visit")}</div>
            <input className="border p-2" name="date" type="date" value={vForm.date} onChange={onVChange} />
            <input className="border p-2" name="time" type="time" value={vForm.time} onChange={onVChange} />
            <input className="border p-2" name="doctor" placeholder={t("fields.doctor")} value={vForm.doctor} onChange={onVChange} />
            <input className="border p-2" name="place" placeholder={t("fields.place")} value={vForm.place} onChange={onVChange} />
            <input className="border p-2" name="notes" placeholder={t("fields.notes")} value={vForm.notes} onChange={onVChange} />
            <button className="border p-2 bg-sky-600 text-white rounded">{t("actions.add","Add")}</button>
          </form>

          {/* Med */}
          <form onSubmit={addMed} className="border rounded p-3 grid gap-2">
            <div className="font-semibold">{t("calendar.addMed","Add medication")}</div>
            <input className="border p-2" name="name" placeholder={t("fields.name")} value={mForm.name} onChange={onMChange} required />
            <input className="border p-2" name="dose" placeholder={t("fields.dose")} value={mForm.dose} onChange={onMChange} />
            <select className="border p-2" value={modeMed} onChange={e=>setModeMed(e.target.value)}>
              <option value="daily">{t("meds.mode_daily","Daily")}</option>
              <option value="once">{t("meds.mode_once","Once")}</option>
            </select>

            {modeMed==="once" ? (
              <>
                <input className="border p-2" name="date" type="date" value={mForm.once.date} onChange={onMOnce} />
                <input className="border p-2" name="time" type="time" value={mForm.once.time} onChange={onMOnce} />
              </>
            ) : (
              <>
                <input className="border p-2" name="times" placeholder={t("fields.times")} value={(mForm.daily.times||[]).join(", ")} onChange={onMDaily} />
                <small className="text-gray-500">{t("meds.hint_times")}</small>
                <div className="grid grid-cols-2 gap-2">
                  <input className="border p-2" name="start" type="date" value={mForm.daily.start||""} onChange={onMDaily} />
                  <input className="border p-2" name="end" type="date" value={mForm.daily.end||""} onChange={onMDaily} />
                </div>
              </>
            )}
            <button className="border p-2 bg-sky-600 text-white rounded">{t("actions.add","Add")}</button>
          </form>
        </div>
      </details>

      {/* Days */}
      {days.map(d => {
        const list = eventsByDate[d];
        return (
          <div key={d} className="card mb-3 border rounded p-3">
            <strong className={d===today ? "today-highlight" : ""}>
              {d===today ? t("today","Today") : d}
            </strong>
            {list.length ? (
              <ul className="mt-2">
                {list.map(e => (
                  <li key={e.id}>
                    {e.time ? `${e.time} ` : ""}{e.title} ({e.type==="visit" ? t("calendar.visit","Visit") : t("calendar.med","Med")})
                    {e.location ? ` — ${e.location}` : ""}{e.notes ? ` — ${e.notes}` : ""}
                  </li>
                ))}
              </ul>
            ) : (<div className="text-gray-500">{t("calendar.empty","Nothing scheduled")}</div>)}
          </div>
        );
      })}
    </div>
  );
}
