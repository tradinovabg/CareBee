import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function Sos() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [locStatus, setLocStatus] = useState('getting')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      () => setLocStatus('done'),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setLocStatus('denied')
        else setLocStatus('done')
      },
    )
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
  }

  return (
<form onSubmit={handleSubmit} className="sos-form">
  {/* Сообщения о статусе геолокации */}
  <div role="status" aria-live="polite">
    {locStatus === 'getting' && <p>{t('sos.gettingLocation')}</p>}
    {locStatus === 'denied' && <p>{t('errors.locationDenied')}</p>}
  </div>

  <label htmlFor="name">{t('sos.name')}</label>
  <input
    id="name"
    name="name"
    value={form.name}
    onChange={handleChange}
    required
  />

  <label htmlFor="email">E-mail</label>
  <input
    id="email"
    type="email"
    name="email"
    value={form.email}
    onChange={handleChange}
    required
  />

  <label htmlFor="message">{t('sos.message')}</label>
  <textarea
    id="message"
    name="message"
    value={form.message}
    onChange={handleChange}
    required
  />

  <button type="submit">{t('sos.send')}</button>
</form>
 main
    </form>
  )
}
