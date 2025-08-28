import React, { useEffect, useState } from "react";
import { LabeledInput } from "../components/forms/Labeled";
// ...
<div key={c.id} className="rounded-xl border p-3 grid md:grid-cols-5 gap-2">
  <LabeledInput label="Name" value={c.name} onChange={e=>update(c.id,{name:e.target.value})} />
  <LabeledInput label="Phone (+E.164)" value={c.phone_e164||""} onChange={e=>update(c.id,{phone_e164:e.target.value})} />
  <LabeledInput label="Email" value={c.email||""} onChange={e=>update(c.id,{email:e.target.value})} />
  <LabeledInput label="Priority" type="number" value={c.priority??0} onChange={e=>update(c.id,{priority:+e.target.value})} />
  <button onClick={()=>{removeContact(c.id); setItems(loadContacts());}}
          className="self-end h-10 rounded bg-red-600 text-white px-3">Delete</button>
</div>

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
    // ignore write errors
  }
}

function removeContact(id) {
  const list = loadContacts().filter(c => c.id !== id);
  saveContacts(list);
  return list;
}

const newId = () => (
  crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)
);

export default function Contacts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", priority: 0 });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setItems(loadContacts());
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...form, priority: Number(form.priority) || 0 };
    if (editing) {
      const next = items.map(c => (c.id === editing ? { ...c, ...payload } : c));
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
      priority: c.priority ?? 0
    });
  };

  const onDelete = (id) => {
    const next = items.filter(c => c.id !== id);
    setItems(next);
    removeContact(id);
  };

  return (
    <div className="container">
      <h1>Emergency contacts</h1>

      <div className="card mb-4">
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <input
            className="input"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={onChange}
            required
          />
          <input
            className="input"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={onChange}
          />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
          />
          <input
            className="input"
            type="number"
            name="priority"
            value={form.priority}
            onChange={onChange}
          />
          <div className="md:col-span-2">
            <button className="btn btn-primary" type="submit">
              {editing ? "Save" : "Add contact"}
            </button>
          </div>
        </form>
      </div>

      {!items.length ? (
        <div className="card muted">No contacts yet</div>
      ) : (
        <ul className="grid gap-2">
          {items
            .slice()
            .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
            .map(c => (
              <li key={c.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="muted text-sm">
                    {[c.phone, c.email].filter(Boolean).join(" · ")}
                  </div>
                  <div className="muted text-xs">Priority: {c.priority ?? 0}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn" onClick={() => onEdit(c)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => onDelete(c.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

