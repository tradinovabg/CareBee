import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export default function Profile() {
  const { t } = useTranslation();
  const [p, setP] = useState(() => load("carebee.profile", {
    fullName: "", birthDate: "", bloodType: "",
    allergies: [], conditions: "", emgName: "", emgPhone: ""
  }));
  const [msg, setMsg] = useState("");

  const onChange = e => setP({ ...p, [e.target.name]: e.target.value });

  const onSave = (e) => {
    e.preventDefault();
    const normalized = {
      ...p,
      allergies: typeof p.allergies === "string" ? p.allergies.split(",").map(s=>s.trim()).filter(Boolean) : (p.allergies||[])
    };
    save("carebee.profile", normalized);
    setMsg(t("profile.saved","Profile saved"));
    setTimeout(()=>setMsg(""), 1500);
  };

  const onClear = () => {
    const empty = { fullName:"", birthDate:"", bloodType:"", allergies:[], conditions:"", emgName:"", emgPhone:"" };
    setP(empty); save("carebee.profile", empty);
  };

  return (
    <div className="container">
      <h1>{t("profile.title","Profile")}</h1>

      <form onSubmit={onSave} className="grid gap-2 md:grid-cols-2 my-3">
        <input className="border p-2" name="fullName" placeholder={t("profile.fullName")} value={p.fullName} onChange={onChange} />
        <input className="border p-2" name="birthDate" type="date" placeholder={t("profile.birthDate")} value={p.birthDate} onChange={onChange} />
        <input className="border p-2" name="bloodType" placeholder={t("profile.bloodType")} value={p.bloodType} onChange={onChange} />
        <input className="border p-2" name="allergies" placeholder={t("profile.allergies")} value={Array.isArray(p.allergies)? p.allergies.join(", "): (p.allergies||"")} onChange={onChange} />
        <textarea className="border p-2 md:col-span-2" rows={3} name="conditions" placeholder={t("profile.conditions")} value={p.conditions} onChange={onChange} />
        <input className="border p-2" name="emgName" placeholder={t("profile.emgName")} value={p.emgName} onChange={onChange} />
        <input className="border p-2" name="emgPhone" placeholder={t("profile.emgPhone")} value={p.emgPhone} onChange={onChange} />
        <div className="md:col-span-2 flex gap-2">
          <button className="border p-2 bg-sky-600 text-white rounded">{t("actions.save","Save")}</button>
          <button type="button" className="border p-2 rounded" onClick={onClear}>{t("actions.clear","Clear")}</button>
        </div>
      </form>

      {msg ? <div className="text-green-700">{msg}</div> : null}
    </div>
  );
}
