import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function Sos() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locStatus, setLocStatus] = useState('getting')

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocStatus('denied')
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => setLocStatus('done'),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setLocStatus('denied')
        else setLocStatus('done')
      }
    )
  }, [])

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
    } catch {
      /* ignore */
    }

    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendSOS()
  }

  return (
    <form onSubmit={handleSubmit} className="sos-form">
      <div role="status" aria-live="polite">
        {locStatus === 'getting' && <p>{t('sos.gettingLocation')}</p>}
        {locStatus === 'denied' && <p>{t('errors.locationDenied')}</p>}
      </div>

      <div className="field">
        <label htmlFor="name">{t('sos.name')}</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="message">{t('sos.message')}</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>

      {loading && <p aria-live="polite">{t('sos.loading', 'Loading…')}</p>}
      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {t('sos.send')}
      </button>
    </form>
  )
}
