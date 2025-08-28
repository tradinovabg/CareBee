import { useState, useEffect } from 'react'

export default function SosModal({ open, onClose, contacts = [], onSend }) {
  const [message, setMessage] = useState('')
  const [selectedContacts, setSelectedContacts] = useState([])
  const [channels, setChannels] = useState([])

  useEffect(() => {
    if (!open) {
      setMessage('')
      setSelectedContacts([])
      setChannels([])
    }
  }, [open])

  const toggleContact = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const toggleChannel = (ch) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    )
  }

  const handleSend = () => {
    onSend?.({ message, contacts: selectedContacts, channels })
    onClose?.()
  }

  if (!open) return null

  const CHANNELS = ['sms', 'email']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Send SOS</h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-neutral-100">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="sos-message" className="block text-sm font-medium mb-1">Message</label>
            <textarea
              id="sos-message"
              className="w-full rounded-xl border p-2"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div>
            <div className="block text-sm font-medium mb-1">Recipients</div>
            <div className="max-h-40 overflow-auto rounded-xl border p-2 space-y-1">
              {contacts.map((c) => (
                <label key={c.id ?? c.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(c.id)}
                    onChange={() => toggleContact(c.id)}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="block text-sm font-medium mb-1">Channels</div>
            <div className="space-y-1">
              {CHANNELS.map((ch) => (
                <label key={ch} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={channels.includes(ch)}
                    onChange={() => toggleChannel(ch)}
                  />
                  <span className="uppercase">{ch}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-2xl border px-4 py-2">Cancel</button>
            <button
              type="button"
              onClick={handleSend}
              className="rounded-2xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

