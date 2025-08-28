import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LabeledInput } from "../components/forms/Labeled";

const STORAGE_KEY = "carebee.contacts";

function loadContacts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveContacts(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

const newId = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);

export default function Contacts() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    priority: 0,
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setItems(loadContacts());
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...form, priority: Number(form.priority) || 0 };
    if (editing) {
      const next = items.map((c) => (c.id === editing ? { ...c, ...payload } : c));
      setItems(next);
      saveContacts(next);
    } else {
      const next = [...items, { id: newId(), ...payload }];
      setItems(next);
      saveContacts(next);
    }
    setEditing(null);
    setForm({ name: "", phone: "", email: "", priority: 0 });
  };

  const onEdit = (c) => {
    setEditing(c.id);
    setForm({
      name: c.name || "",
      phone: c.phone || "",
      email: c.email || "",
      priority: c.priority ?? 0,
    });
  };

  const onDelete = (id) => {
    const next = items.filter((c) => c.id !== id);
    setItems(next);
    saveContacts(next);
  };

  return (
    <div className="container">
      <h1>{t("nav.contacts")}</h1>

      <div className="card mb-4">
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <LabeledInput
            label="Name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
          <LabeledInput
            label="Phone (+E.164)"
            name="phone"
            value={form.phone}
            onChange={onChange}
          />
          <LabeledInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
          />
          <LabeledInput
            label="Priority"
            type="number"
            name="priority"
            value={form.priority}
            onChange={onChange}
          />
          <div className="md:col-span-2">
            <button className="btn btn-primary" type="submit">
              {editing ? t("actions.save", "Save") : t("contacts.add", "Add contact")}
            </button>
          </div>
        </form>
      </div>

      {!items.length ? (
        <div className="card muted">{t("contacts.empty", "No contacts yet")}</div>
      ) : (
        <ul className="grid gap-2">
          {items
            .slice()
            .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
            .map((c) => (
              <li key={c.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="muted text-sm">
                    {[c.phone, c.email].filter(Boolean).join(" · ")}
                  </div>
                  <div className="muted text-xs">Priority: {c.priority ?? 0}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn" onClick={() => onEdit(c)}>
                    {t("actions.edit", "Edit")}
                  </button>
                  <button className="btn btn-danger" onClick={() => onDelete(c.id)}>
                    {t("actions.delete", "Delete")}
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

