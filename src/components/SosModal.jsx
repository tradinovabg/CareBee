import { useEffect, useState } from "react";

export default function SosModal({ open, onClose, contacts = [], onSend }) {
  const [message, setMessage] = useState("Emergency! Please help.");
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [channels, setChannels] = useState({ sms: true, whatsapp: true, email: false });

  useEffect(() => {
    if (!open) return;
    const ids = new Set(contacts.map(c => c.id)); // по умолчанию все
    setSelectedIds(ids);
  }, [open, contacts]);

  if (!open) return null;

  const toggle = (id) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const handleSend = () => {
    const recipients = contacts.filter(c => selectedIds.has(c.id));
    onSend?.({ message, channels, recipients });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl p-4 md:p-6">
        <h2 className="text-xl font-bold mb-3">Send SOS</h2>

        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full rounded border border-slate-300 p-2 mb-4"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="font-medium mb-2">Recipients</div>
            <div className="max-h-48 overflow-auto pr-1 space-y-2">
              {contacts.length === 0 && (
                <div className="text-slate-500 text-sm">No contacts yet. Add them on “nav.contacts”.</div>
              )}
              {contacts.map((c) => (
                <label key={c.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggle(c.id)} />
                  <span>{c.name}</span>
                  {c.phone_e164 && <span className="text-slate-500 text-xs">({c.phone_e164})</span>}
                  {c.email && <span className="text-slate-500 text-xs">({c.email})</span>}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="font-medium mb-2">Channels</div>
            <label className="block"><input type="checkbox" checked={channels.sms}
              onChange={e=>setChannels(v=>({...v, sms:e.target.checked}))}/> SMS</label>
            <label className="block"><input type="checkbox" checked={channels.whatsapp}
              onChange={e=>setChannels(v=>({...v, whatsapp:e.target.checked}))}/> WhatsApp</label>
            <label className="block"><input type="checkbox" checked={channels.email}
              onChange={e=>setChannels(v=>({...v, email:e.target.checked}))}/> Email</label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={handleSend} className="px-4 py-2 rounded bg-red-600 text-white font-semibold">
            Send SOS
          </button>
        </div>
      </div>
    </div>
  );
}

