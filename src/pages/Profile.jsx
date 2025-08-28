import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LabeledInput, LabeledTextarea } from "../components/forms/Labeled";

const STORAGE_KEY = "carebee.profile";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : { fullName: "", birthDate: "", allergySeverity: "", allergyTo: "", notes: "" };
  } catch {
    return { fullName: "", birthDate: "", allergySeverity: "", allergyTo: "", notes: "" };
  }
};

const save = (v) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
};

export default function Profile() {
  const { t } = useTranslation();
  const [p, setP] = useState(load);
  const [msg, setMsg] = useState("");

  const onChange = (e) => setP({ ...p, [e.target.name]: e.target.value });

  const onSave = (e) => {
    e.preventDefault();
    save(p);
    setMsg(t("profile.saved", "Profile saved"));
    setTimeout(() => setMsg(""), 1500);
  };

  const onClear = () => {
    const empty = { fullName: "", birthDate: "", allergySeverity: "", allergyTo: "", notes: "" };
    setP(empty);
    save(empty);
  };

  return (
    <div className="container">
      <h1>{t("nav.profile")}</h1>

      <form onSubmit={onSave} className="grid gap-4 md:grid-cols-2 my-3">
        <LabeledInput
          label="Full name"
          name="fullName"
          value={p.fullName}
          onChange={onChange}
          className="md:col-span-2"
        />
        <LabeledInput
          label="Birth date"
          type="date"
          name="birthDate"
          value={p.birthDate}
          onChange={onChange}
        />
        <LabeledInput
          label="Allergy severity"
          name="allergySeverity"
          value={p.allergySeverity}
          onChange={onChange}
        />
        <LabeledInput
          label="Allergy to"
          name="allergyTo"
          value={p.allergyTo}
          onChange={onChange}
        />
        <LabeledTextarea
          label="Notes"
          name="notes"
          value={p.notes}
          onChange={onChange}
          className="md:col-span-2"
        />
        <div className="md:col-span-2 flex gap-2">
          <button className="btn btn-primary">{t("actions.save", "Save")}</button>
          <button type="button" className="btn" onClick={onClear}>
            {t("actions.clear", "Clear")}
          </button>
        </div>
      </form>

      {msg && <div className="text-green-700">{msg}</div>}
    </div>
  );
}

