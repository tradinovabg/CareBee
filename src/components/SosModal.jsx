export default function SosModal({ open, onClose, contacts = [], onSend }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">SOS</h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-neutral-100">✕</button>
        </div>
        {contacts.length === 0 ? (
          <div className="mb-4 text-sm text-neutral-500">No contacts</div>
        ) : (
          <ul className="mb-4 space-y-1 text-sm">
            {contacts.map((c) => (
              <li key={c.id || c.name}>{c.name}</li>
            ))}
          </ul>
        )}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-2xl border px-4 py-2">Close</button>
          <button onClick={onSend} className="rounded-2xl bg-red-600 px-4 py-2 text-white hover:bg-red-700">Send</button>
        </div>
      </div>
    </div>
  );
}
