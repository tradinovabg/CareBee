import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import QrCard from '../components/QrCard'
import { buildDailySummary, sendSummary } from '../lib/dailySummary.js'

const KEY = 'carebee.profile'
const load = () => { try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : {} } catch { return {} } }
const save = (obj) => { try { localStorage.setItem(KEY, JSON.stringify(obj)) } catch { /* ignore */ } }

export default function Profile () {
  const { t } = useTranslation()
  const [p, setP] = useState(() => ({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    recipients: '',
    autosendEnabled: false,
    autosendTime: '08:00',
    ...load()
  }))
  const [msg, setMsg] = useState('')

  useEffect(() => { save(p) }, [p])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setP(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSave = (e) => {
    e.preventDefault()
    save(p); setMsg(t('profile.saved', 'Saved')); setTimeout(() => setMsg(''), 2000)
  }

  const copySummary = () => {
    navigator.clipboard?.writeText(buildDailySummary())
    setMsg(t('profile.copied', 'Copied'))
    setTimeout(() => setMsg(''), 2000)
  }

  const shareSummary = () => {
    navigator.share({ title: 'CareBee Daily Summary', text: buildDailySummary() })
  }

  return (
    <>
      <form onSubmit={onSave} className="sos-form" style={{ maxWidth: 520 }}>
        <h1>{t('profile.title', 'Patient profile')}</h1>

        <label>{t('profile.firstName', 'First name')}
          <input name="firstName" value={p.firstName} onChange={onChange} required />
        </label>

        <label>{t('profile.lastName', 'Last name')}
          <input name="lastName" value={p.lastName} onChange={onChange} required />
        </label>

        <label>{t('profile.age', 'Age')}
          <input name="age" type="number" min="0" max="130" value={p.age} onChange={onChange} />
        </label>

        <label>{t('profile.phone', 'Phone')}
          <input name="phone" value={p.phone} onChange={onChange} placeholder="+33..." />
        </label>

        <label>{t('profile.recipients', 'Recipients')}
          <input name="recipients" value={p.recipients} onChange={onChange} placeholder="alice@example.com,bob@example.com" />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" name="autosendEnabled" checked={p.autosendEnabled} onChange={onChange} />
          {t('profile.autosendEnabled', 'Enable auto send')}
        </label>

        <label>{t('profile.autosendTime', 'Autosend time')}
          <input type="time" name="autosendTime" value={p.autosendTime} onChange={onChange} />
        </label>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          <button type="button" onClick={() => sendSummary()}>{t('profile.sendNow', 'Send summary now')}</button>
          <button type="button" onClick={copySummary}>{t('profile.copy', 'Copy summary')}</button>
          {navigator.share && <button type="button" onClick={shareSummary}>{t('profile.share', 'Share')}</button>}
        </div>

        <button type="submit" style={{ marginTop: 12 }}>{t('save', 'Save')}</button>
        {msg && <small aria-live="polite" style={{ marginTop: 6, display: 'block' }}>{msg}</small>}
      </form>
      <QrCard />
    </>
  )
}

