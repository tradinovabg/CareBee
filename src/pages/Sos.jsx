import { useState } from 'react'

export default function Sos() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const sendSOS = async () => {
    setLoading(true)
    setError('')
    const { name, email, message } = form

    let coords
    try {
      coords = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          reject
        )
      })
    } catch (err) {
      setError(err.message)
    }

    const mapLink = coords ? `https://maps.google.com/?q=${coords.lat},${coords.lon}` : ''
    const text = `SOS from CareBee: ${name} ${email}. ${message}.` +
      (coords ? ` Location: ${coords.lat},${coords.lon} ${mapLink}` : '')

    try {
      if (navigator.share) {
        await navigator.share({ title: 'SOS', text, url: mapLink || undefined })
        setLoading(false)
        return
      }
    } catch {
      // fall back to mailto
    }

    const mailto = `mailto:?subject=SOS%20CareBee&body=${encodeURIComponent(text)}`
    window.location.href = mailto

    try {
      await navigator.clipboard.writeText(text)
    } catch { /* ignore */ }

    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendSOS()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          E-mail
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Message
          <textarea name="message" value={form.message} onChange={handleChange} />
        </label>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <button type="submit" disabled={loading}>Send</button>
    </form>
  )
}
