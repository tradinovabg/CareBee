import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LabeledInput, LabeledSelect } from "../components/forms/Labeled";
import { load, save } from "../lib/storage.js";

export default function Meds() {
  const { t } = useTranslation();
  const [items, setItems] = useState(() => load("carebee.meds", []));
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [mode, setMode] = useState("daily");
  const [times, setTimes] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const add = (e) => {
    e.preventDefault();
    const rec = { id: crypto.randomUUID(), name, dose, mode, times, from, to };
    const next = [...items, rec];
    setItems(next);
    save("carebee.meds", next);
    setName("");
    setDose("");
    setMode("daily");
    setTimes("");
    setFrom("");
    setTo("");
  };

  const del = (id) => {
    const next = items.filter((m) => m.id !== id);
    setItems(next);
    save("carebee.meds", next);
  };

  return (
    <main className="mx-auto max-w-5xl p-4 space-y-3">
      <h1 className="text-xl font-bold">{t("meds.title")}</h1>

      <div className="rounded-xl border p-3 space-y-3 bg-white">
        <form onSubmit={add} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-2">
            <LabeledInput label={t("meds.form.name")} value={name} onChange={(e) => setName(e.target.value)} required />
            <LabeledInput label={t("meds.form.dose")} value={dose} onChange={(e) => setDose(e.target.value)} />
          </div>

          <LabeledSelect label={t("meds.form.mode")} value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="daily">{t("meds.modes.daily")}</option>
            <option value="odd_even">{t("meds.modes.odd_even")}</option>
            <option value="custom">{t("meds.modes.custom")}</option>
          </LabeledSelect>

          <LabeledInput
            label={t("meds.form.times")}
            placeholder={t("meds.hint_times")}
            value={times}
            onChange={(e) => setTimes(e.target.value)}
          />

          <div className="grid md:grid-cols-2 gap-2">
            <LabeledInput type="date" label={t("meds.form.from")} value={from} onChange={(e) => setFrom(e.target.value)} />
            <LabeledInput type="date" label={t("meds.form.to")} value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <button className="px-4 py-2 rounded bg-amber-600 text-white font-semibold">
            {t("meds.form.add")}
          </button>
        </form>
      </div>

      {!!items.length && (
        <ul className="space-y-2">
          {items.map((m) => (
            <li key={m.id} className="rounded-xl border p-3 bg-white flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {m.name}
                  {m.dose ? ` — ${m.dose}` : ""}
                </div>
                <div className="text-sm text-slate-600">
                  {t(`meds.modes.${m.mode}`)}{m.times ? `: ${m.times}` : ""}
                  {(m.from || m.to) ? ` (${m.from || "…"} — ${m.to || "…"})` : ""}
                </div>
              </div>
              <button className="btn btn-danger" onClick={() => del(m.id)}>
                {t("meds.delete")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
