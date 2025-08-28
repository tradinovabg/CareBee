import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { maybeSendDailySummary } from "../lib/dailySummary.js";
import { load, save } from "../lib/storage.js";

const todayStr = () => new Date().toISOString().slice(0, 10);
const timeStr  = () => new Date().toTimeString().slice(0,5);
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));

export default function Vitals() {
  const { t } = useTranslation();
  const [items, setItems] = useState(() => {
    const data = load("carebee.vitals", []);
    let changed = false;
    const withIds = data.map(it => {
      if (!it.id) { changed = true; return { ...it, id: newId() }; }
      return it;
    });
    if (changed) save("carebee.vitals", withIds);
    return withIds;
  });
  const [form, setForm]   = useState({ type: "hr", value: "", date: todayStr(), time: timeStr(), notes: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const add = (e) => {
    e.preventDefault();
    const next = [...items, { id: newId(), ...form }];
    next.sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time));
    setItems(next); save("carebee.vitals", next);
    maybeSendDailySummary();
    setForm({ type: form.type, value:"", date: todayStr(), time: timeStr(), notes:"" });
  };

  const del = (id) => {
    const next = items.filter(r => r.id !== id);
    setItems(next); save("carebee.vitals", next);
  };

  return (
    <div className="container">
      <h1>{t("vitals.title","Vitals")}</h1>

      <div className="card mb-4">
        <form onSubmit={add} className="grid gap-3 md:grid-cols-4">
          <select className="select" name="type" value={form.type} onChange={onChange}>
            <option value="hr">{t("vitals.hr","Heart rate (bpm)")}</option>
            <option value="temp">{t("vitals.temp","Temperature (°C)")}</option>
            <option value="sys">{t("vitals.sys","Systolic (mmHg)")}</option>
            <option value="dia">{t("vitals.dia","Diastolic (mmHg)")}</option>
          </select>
          <input className="input" name="value" type="number" step="any" required
                 placeholder={t("fields.value")} value={form.value} onChange={onChange} />
          <input className="input" name="date" type="date" value={form.date} onChange={onChange} />
          <input className="input" name="time" type="time" value={form.time} onChange={onChange} />
          <input className="input md:col-span-4" name="notes" placeholder={t("fields.notes")} value={form.notes} onChange={onChange} />
          <div className="md:col-span-4">
            <button className="btn btn-primary" type="submit">{t("vitals.add","Add measurement")}</button>
          </div>
        </form>
      </div>

      {!items.length ? (
        <div className="card muted">{t("vitals.empty","No vitals recorded yet")}</div>
      ) : (
        <ul className="grid gap-2">
          {items.map(r => (
            <li key={r.id} className="card flex items-start justify-between">
              <div>
                <div className="font-medium">{r.date} {r.time} — {r.type.toUpperCase()}: {r.value}</div>
                {r.notes ? <div className="muted text-sm">{r.notes}</div> : null}
              </div>
              <button className="btn btn-danger" onClick={()=>del(r.id)}>{t("actions.delete","Delete")}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
