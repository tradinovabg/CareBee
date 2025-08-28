import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { load, save } from "../lib/storage.js";

const todayStr = () => new Date().toISOString().slice(0, 10);
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));

export default function Meds() {
  const { t } = useTranslation();
  const [items, setItems] = useState(() => {
    const data = load("carebee.meds", []);
    let changed = false;
    const withIds = data.map(it => {
      if (!it.id) { changed = true; return { ...it, id: newId() }; }
      return it;
    });
    if (changed) save("carebee.meds", withIds);
    return withIds;
  });
  const [mode, setMode] = useState("daily");
  const [form, setForm] = useState({
    name: "", dose: "",
    once: { date: todayStr(), time: "" },
    daily: { times: ["08:00", "20:00"], start: "", end: "" }
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onOnce   = (e) => setForm({ ...form, once: { ...form.once, [e.target.name]: e.target.value }});
  const onDaily  = (e) => setForm({
    ...form,
    daily: {
      ...form.daily,
      [e.target.name]:
        e.target.name === "times"
          ? e.target.value.split(",").map(s=>s.trim()).filter(Boolean)
          : e.target.value
    }
  });

  const add = (e) => {
    e.preventDefault();
    const rec = { id: newId(), name: form.name, dose: form.dose, mode };
    if (mode === "once") rec.once = { ...form.once };
    else rec.daily = { ...form.daily };
    const next = [...items, rec];
    setItems(next); save("carebee.meds", next);
    setForm({ name:"", dose:"", once:{ date: todayStr(), time:"" }, daily:{ times:["08:00","20:00"], start:"", end:"" } });
  };

  const del = (id) => {
    const next = items.filter(m => m.id !== id);
    setItems(next); save("carebee.meds", next);
  };

  return (
    <div className="container">
      <h1>{t("meds.title","Medications")}</h1>

      <div className="card mb-4">
        <form onSubmit={add} className="grid gap-3 md:grid-cols-2">
          <input className="input" name="name" required placeholder={t("fields.name")} value={form.name} onChange={onChange} />
          <input className="input" name="dose" placeholder={t("fields.dose")} value={form.dose} onChange={onChange} />

          <div className="md:col-span-2 flex gap-2">
            <select className="select" value={mode} onChange={(e)=>setMode(e.target.value)}>
              <option value="daily">{t("meds.mode_daily","Daily")}</option>
              <option value="once">{t("meds.mode_once","Once")}</option>
            </select>
          </div>

          {mode === "once" ? (
            <>
              <input className="input" type="date" name="date" value={form.once.date} onChange={onOnce} />
              <input className="input" type="time" name="time" value={form.once.time} onChange={onOnce} />
            </>
          ) : (
            <>
              <div className="md:col-span-2">
                <input className="input" name="times"
                       placeholder={t("fields.times")}
                       value={(form.daily.times||[]).join(", ")}
                       onChange={onDaily} />
                <div className="muted text-sm mt-1">{t("meds.hint_times")}</div>
              </div>
              <input className="input" type="date" name="start" value={form.daily.start||""} onChange={onDaily} />
              <input className="input" type="date" name="end"   value={form.daily.end||""} onChange={onDaily} />
            </>
          )}

          <div className="md:col-span-2">
            <button className="btn btn-primary" type="submit">{t("meds.add","Add medication")}</button>
          </div>
        </form>
      </div>

      {!items.length ? (
        <div className="card muted">{t("meds.empty","No medications added yet")}</div>
      ) : (
        <ul className="grid gap-2">
          {items.map(m => (
            <li key={m.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {m.name}{m.dose ? ` — ${m.dose}` : ""}
                </div>
                <div className="muted text-sm">
                  {m.mode === "once"
                    ? `${t("meds.mode_once")}: ${m.once?.date || ""} ${m.once?.time || ""}`
                    : `${t("meds.mode_daily")}: ${(m.daily?.times||[]).join(", ")} ${
                        [m.daily?.start, m.daily?.end].some(Boolean)
                          ? `(${m.daily?.start||"…"} — ${m.daily?.end||"…"})` : ""}`}
                </div>
              </div>
              <button className="btn btn-danger" onClick={()=>del(m.id)}>{t("actions.delete","Delete")}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
