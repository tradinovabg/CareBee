import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export default function Nearby() {
  const { t } = useTranslation();
  const [items, setItems] = useState(() => load("carebee.places", []));
  const [form, setForm] = useState({ name:"", category:"pharmacy", address:"", phone:"" });
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onAdd = (e) => {
    e.preventDefault();
    const next = [...items, { ...form }];
    setItems(next); save("carebee.places", next);
    setForm({ name:"", category:"pharmacy", address:"", phone:"" });
  };

  const removeAt = (i) => {
    const next = items.filter((_, idx) => idx!==i);
    setItems(next); save("carebee.places", next);
  };

  const mapsUrl = (name, address) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`;

  return (
    <div className="container">
      <h1>{t("nearby.title","Nearby")}</h1>

      <form onSubmit={onAdd} className="grid gap-2 md:grid-cols-4 my-3">
        <input className="border p-2" name="name" placeholder={t("fields.name")} value={form.name} onChange={onChange} required />
        <select className="border p-2" name="category" value={form.category} onChange={onChange} aria-label={t("nearby.category")}>
          <option value="doctor">{t("nearby.categories.doctor")}</option>
          <option value="clinic">{t("nearby.categories.clinic")}</option>
          <option value="pharmacy">{t("nearby.categories.pharmacy")}</option>
          <option value="other">{t("nearby.categories.other")}</option>
        </select>
        <input className="border p-2" name="address" placeholder={t("fields.address")} value={form.address} onChange={onChange} />
        <input className="border p-2" name="phone" placeholder={t("fields.phone")} value={form.phone} onChange={onChange} />
        <button className="border p-2 bg-sky-600 text-white rounded md:col-span-4">{t("nearby.addPlace","Add place")}</button>
      </form>

      {!items.length ? (
        <p className="text-gray-500">{t("nearby.empty","No saved places")}</p>
      ) : (
        <ul className="list-disc pl-6">
          {items.map((p, i) => (
            <li key={i} className="mb-2">
              <strong>{p.name}</strong> — {t(`nearby.categories.${p.category}`, p.category)}
              {p.address ? ` · ${p.address}` : ""}{p.phone ? ` · ${p.phone}` : ""}
              {" "}<a className="text-sky-700 hover:underline" href={mapsUrl(p.name, p.address)} target="_blank" rel="noreferrer">
                {t("nearby.openInMaps","Open in Maps")}
              </a>
              <button className="ml-2 text-red-600" onClick={() => removeAt(i)}>{t("actions.delete","Delete")}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
