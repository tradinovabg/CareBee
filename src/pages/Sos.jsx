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
    <form onSubmit={handleSubmit}>
      <h1>{t('sos.title')}</h1>
      {locStatus === 'getting' && <p>{t('sos.gettingLocation')}</p>}
      {locStatus === 'denied' && <p>{t('errors.locationDenied')}</p>}
      <div>
        <label>
          {t('sos.name')}
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          {t('sos.email')}
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          {t('sos.message')}
          <textarea name="message" value={form.message} onChange={handleChange} />
        </label>
      </div>
      <button type="submit">{t('sos.send')}</button>
    </form>
  )
}
