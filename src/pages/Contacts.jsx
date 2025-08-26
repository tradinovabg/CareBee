// pages/src/pages/Contacts.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

// простая проверка E.164 (можно пусто)
const isE164 = (v) => /^\+[1-9]\d{6,14}$/.test(v);

export default function Contacts() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      await fetchContacts(user.id);
      setLoading(false);
    })();
  }, []);

  const fetchContacts = async (uid = userId) => {
    const { data, error } = await supabase
      .from("sos_contacts")
      .select("id,user_id,name,phone_e164,email,priority,created_at")
      .eq("user_id", uid)
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) { setErr(error.message); return; }
    setItems(data || []);
  };

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return items;
    return items.filter((i) =>
      i.name.toLowerCase().includes(s) ||
      (i.phone_e164 || "").toLowerCase().includes(s) ||
      (i.email || "").toLowerCase().includes(s)
    );
  }, [q, items]);

  const onAdd = () => { setEditing(null); setOpen(true); setErr(""); setTimeout(() => formRef.current?.querySelector("[name=name]")?.focus(), 0); };
  const onEdit = (c) => { setEditing(c); setOpen(true); setErr(""); };

  const onDelete = async (id) => {
    if (!confirm("Delete this contact?")) return;
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id));
    const { error } = await supabase.from("sos_contacts").delete().eq("id", id);
    if (error) { setErr(error.message); setItems(prev); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") || "").trim();
    const phone = (fd.get("phone_e164") || "").trim();
    const email = (fd.get("email") || "").trim();
    const priority = Number(fd.get("priority") || 0);

    if (!name) return setErr("Name is required");
    if (phone && !isE164(phone)) return setErr("Phone must be in E.164, e.g. +33123456789");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Invalid email");

    setErr("");

    if (editing) {
      const patch = { name, phone_e164: phone || null, email: email || null, priority };
      const prev = items.slice();
      setItems(prev.map((x) => (x.id === editing.id ? { ...x, ...patch } : x)));
      const { error } = await supabase.from("sos_contacts").update(patch).eq("id", editing.id);
      if (error) { setErr(error.message); setItems(prev); return; }
      setOpen(false); setEditing(null); return;
    }

    const payload = { user_id: userId, name, phone_e164: phone || null, email: email || null, priority };
    const { data, error } = await supabase.from("sos_contacts").insert(payload).select().single();
    if (error) { setErr(error.message); return; }
    setItems((p) => [data, ...p]);
    setOpen(false); setEditing(null); e.currentTarget.reset();
  };

  if (loading) return <div className="p-6 text-sm text-neutral-500">Loading…</div>;
  if (!userId) return <div className="p-6 text-sm">Please sign in to manage contacts.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Emergency contacts</h1>
        <button onClick={onAdd} className="rounded-2xl bg-emerald-600 text-white px-4 py-2 shadow hover:bg-emerald-700">
          Add contact
        </button>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name, phone, email"
        className="w-full rounded-xl border p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left">
            <tr>
              <th className="p-3 w-16">Order</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3 w-40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td className="p-4 text-neutral-500" colSpan={5}>No contacts yet. Add your first one!</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 text-center">{c.priority ?? 0}</td>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">{c.phone_e164 ? <span className="font-mono">{c.phone_e164}</span> : <span className="text-neutral-400">—</span>}</td>
                <td className="p-3">{c.email || <span className="text-neutral-400">—</span>}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(c)} className="rounded-xl border px-3 py-1 hover:bg-neutral-50">Edit</button>
                    <button onClick={() => onDelete(c.id)} className="rounded-xl border px-3 py-1 text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалка */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">{editing ? "Edit contact" : "Add contact"}</h2>
              <button onClick={() => { setOpen(false); setEditing(null); }} className="rounded-xl p-2 hover:bg-neutral-100">✕</button>
            </div>

            {err && <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}

            <form ref={formRef} onSubmit={submit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                <input name="name" id="name" defaultValue={editing?.name || ""} className="w-full rounded-xl border p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone_e164">Phone (E.164)</label>
                <input name="phone_e164" id="phone_e164" placeholder="+33123456789" defaultValue={editing?.phone_e164 || ""} className="w-full rounded-xl border p-2 font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <input name="email" id="email" type="email" defaultValue={editing?.email || ""} className="w-full rounded-xl border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="priority">Order</label>
                <input name="priority" id="priority" type="number" min={0} step={1} defaultValue={editing?.priority ?? 0} className="w-32 rounded-xl border p-2" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setOpen(false); setEditing(null); }} className="rounded-2xl border px-4 py-2">Cancel</button>
                <button className="rounded-2xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
                  {editing ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
