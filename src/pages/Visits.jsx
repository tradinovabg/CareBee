import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LabeledInput, LabeledTextarea } from "../components/forms/Labeled";
import { load, save } from "../lib/storage.js";

export default function Visits() {
  const { t } = useTranslation();
  const [items, setItems] = useState(() => load("carebee.visits", []));
  const [place, setPlace] = useState("");
  const [doctor, setDoctor] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const add = (e) => {
    e.preventDefault();
    const rec = { id: crypto.randomUUID(), place, doctor, purpose, date, time, notes };
    const next = [...items, rec];
    next.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    setItems(next);
    save("carebee.visits", next);
    setPlace("");
    setDoctor("");
    setPurpose("");
    setDate("");
    setTime("");
    setNotes("");
  };

  const del = (id) => {
    const next = items.filter((v) => v.id !== id);
    setItems(next);
    save("carebee.visits", next);
  };

  return (
    <main className="mx-auto max-w-5xl p-4 space-y-3">
      <h1 className="text-xl font-bold">{t("visits.title")}</h1>

      <div className="rounded-xl border p-3 space-y-3 bg-white">
        <form onSubmit={add} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-2">
            <LabeledInput label={t("visits.form.place")} value={place} onChange={(e) => setPlace(e.target.value)} />
            <LabeledInput label={t("visits.form.doctor")} value={doctor} onChange={(e) => setDoctor(e.target.value)} />
          </div>

          <LabeledInput label={t("visits.form.purpose")} value={purpose} onChange={(e) => setPurpose(e.target.value)} />

          <div className="grid md:grid-cols-2 gap-2">
            <LabeledInput type="date" label={t("visits.form.date")} value={date} onChange={(e) => setDate(e.target.value)} />
            <LabeledInput type="time" label={t("visits.form.time")} value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <LabeledTextarea label={t("visits.form.notes")} value={notes} onChange={(e) => setNotes(e.target.value)} />

          <button className="px-4 py-2 rounded bg-amber-600 text-white font-semibold">
            {t("visits.form.add")}
          </button>
        </form>
      </div>

      {!!items.length && (
        <ul className="space-y-2">
          {items.map((v) => (
            <li key={v.id} className="rounded-xl border p-3 bg-white flex items-start justify-between">
              <div>
                <div className="font-medium">
                  {v.date} {v.time ? v.time : ""} — {v.doctor}
                </div>
                <div className="text-sm text-slate-600">
                  {[v.place, v.purpose, v.notes].filter(Boolean).join(" · ")}
                </div>
              </div>
              <button className="btn btn-danger" onClick={() => del(v.id)}>
                {t("visits.delete")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
