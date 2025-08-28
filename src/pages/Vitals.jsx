import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { maybeSendDailySummary } from "../lib/dailySummary.js";
import { load, save } from "../lib/storage.js";

const nowStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const newId = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);

export default function Vitals() {
  const { t } = useTranslation();
  const [items, setItems] = useState(() => {
    const data = load("carebee:vitals", []);
    let changed = false;
    const withIds = data.map((it) => {
      if (!it.id) {
        changed = true;
        return { ...it, id: newId() };
      }
      return it;
    });
    if (changed) save("carebee:vitals", withIds);
    return withIds;
  });

  const emptyForm = () => ({
    datetime: nowStr(),
    temp: "",
    sys: "",
    dia: "",
    pulse: "",
    spo2: "",
    weight: "",
    notes: "",
  });

  const [form, setForm] = useState(emptyForm);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const add = (e) => {
    e.preventDefault();
    const rec = { id: newId(), ...form };
    const next = [...items, rec];
    next.sort((a, b) => a.datetime.localeCompare(b.datetime));
    setItems(next);
    save("carebee:vitals", next);
    maybeSendDailySummary();
    setForm(emptyForm());
  };

  const del = (id) => {
    const next = items.filter((r) => r.id !== id);
    setItems(next);
    save("carebee:vitals", next);
  };

  return (
    <div className="container">
      <h1>{t("vitals.title", "Vitals")}</h1>

      <div className="card mb-4">
        <form onSubmit={add} className="grid gap-3 md:grid-cols-2">
          <input
            className="input md:col-span-2"
            type="datetime-local"
            name="datetime"
            value={form.datetime}
            onChange={onChange}
          />
          <input
            className="input"
            type="number"
            step="any"
            name="temp"
            placeholder={t("vitals.temp", "Temperature")}
            value={form.temp}
            onChange={onChange}
          />
          <div className="flex gap-2">
            <input
              className="input"
              type="number"
              step="any"
              name="sys"
              placeholder={t("vitals.sys", "Systolic")}
              value={form.sys}
              onChange={onChange}
            />
            <input
              className="input"
              type="number"
              step="any"
              name="dia"
              placeholder={t("vitals.dia", "Diastolic")}
              value={form.dia}
              onChange={onChange}
            />
          </div>
          <input
            className="input"
            type="number"
            step="any"
            name="pulse"
            placeholder={t("vitals.pulse", "Pulse")}
            value={form.pulse}
            onChange={onChange}
          />
          <input
            className="input"
            type="number"
            step="any"
            name="spo2"
            placeholder={t("vitals.spo2", "SpO₂")}
            value={form.spo2}
            onChange={onChange}
          />
          <input
            className="input"
            type="number"
            step="any"
            name="weight"
            placeholder={t("vitals.weight", "Weight")}
            value={form.weight}
            onChange={onChange}
          />
          <input
            className="input md:col-span-2"
            name="notes"
            placeholder={t("fields.notes", "Notes")}
            value={form.notes}
            onChange={onChange}
          />
          <div className="md:col-span-2">
            <button className="btn btn-primary" type="submit">
              {t("vitals.add", "Add measurement")}
            </button>
          </div>
        </form>
      </div>

      {!items.length ? (
        <div className="card muted">
          {t("vitals.empty", "No vitals recorded yet")}
        </div>
      ) : (
        <ul className="grid gap-2">
          {items.map((r) => (
            <li key={r.id} className="card flex items-start justify-between">
              <div className="font-medium">
                {r.datetime} — {t("vitals.temp", "T")}: {r.temp}, BP: {r.sys}/
                {r.dia}, {t("vitals.pulse", "Pulse")}: {r.pulse}, SpO₂: {r.spo2},
                {" "}
                {t("vitals.weight", "Weight")}: {r.weight}
                {r.notes ? ` — ${r.notes}` : ""}
              </div>
              <button
                className="btn btn-danger"
                onClick={() => del(r.id)}
              >
                {t("actions.delete", "Delete")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

