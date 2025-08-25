import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Visits() {
  const { t } = useTranslation();
  const [items, setItems] = useState(() => load("carebee.visits", []));
  const [form, setForm] = useState({ date: todayStr(), time: "", doctor: "", place: "", notes: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const add = (e) => {
    e.preventDefault();
    const next = [...items, { ...form }];
    next.sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time));
    setItems(next); save("carebee.visits", next);
    setForm({ date: todayStr(), time: "", doctor: "", place: "", notes: "" });
  };

  const delAt = (i) => {
    const next = items.filter((_, idx) => idx!==i);
    setItems(next); save("carebee.visits", next);
  };

  return (
    <div className="container">
      <h1>{t("visits.title","Visits & Events")}</h1>

      <div className="card mb-4">
        <form onSubmit={add} className="form-grid">
          <input className="input" type="date"  name="date"  value={form.date} onChange={onChange} />
          <input className="input" type="time"  name="time"  value={form.time} onChange={onChange} />
          <input className="input" type="text"  name="doctor" placeholder={t("fields.doctor")} value={form.doctor} onChange={onChange} />
          <input className="input" type="text"  name="place"  placeholder={t("fields.place")}  value={form.place}  onChange={onChange} />
          <input className="input md:col-span-3" type="text" name="notes"  placeholder={t("fields.notes")} value={form.notes} onChange={onChange} />
          <div className="md:col-span-3">
            <button className="btn btn-primary" type="submit">{t("visits.add","Add visit")}</button>
          </div>
        </form>
      </div>

      {!items.length ? (
        <div className="card muted">{t("visits.empty","No visits yet")}</div>
      ) : (
        <ul className="grid gap-2">
          {items.map((v, i) => (
            <li key={i} className="card flex items-start justify-between">
              <div>
                <div className="font-medium">{v.date} {v.time ? v.time : ""} — {v.doctor || t("fields.doctor")}</div>
                <div className="muted text-sm">
                  {[v.place, v.notes].filter(Boolean).join(" · ")}
                </div>
              </div>
              <button className="btn btn-danger" onClick={()=>delAt(i)}>{t("actions.delete","Delete")}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
