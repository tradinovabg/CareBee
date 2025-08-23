import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import QrCard from '../components/QrCard'

const KEY = 'carebee.profile'
const load = () => { try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : {} } catch { return {} } }
const save = (obj) => { try { localStorage.setItem(KEY, JSON.stringify(obj)) } catch { /* ignore */ } }

export default function Profile() {
  const { t } = useTranslation()
  const [p, setP] = useState(() => ({ firstName:'', lastName:'', age:'', phone:'', ...load() }))
  const [msg, setMsg] = useState('')

  useEffect(()=>{ save(p) }, [p])

  const onChange = (e) => {
    const { name, value } = e.target
    setP(prev => ({ ...prev, [name]: value }))
  }

  const onSave = (e) => {
    e.preventDefault()
    save(p); setMsg(t('profile.saved','Saved')); setTimeout(()=>setMsg(''), 2000)
  }

  return (
    <>
      <form onSubmit={onSave} className="sos-form" style={{maxWidth:520}}>
        <h1>{t('profile.title','Patient profile')}</h1>

        <label>{t('profile.firstName','First name')}
          <input name="firstName" value={p.firstName} onChange={onChange} required />
        </label>

        <label>{t('profile.lastName','Last name')}
          <input name="lastName" value={p.lastName} onChange={onChange} required />
        </label>

        <label>{t('profile.age','Age')}
          <input name="age" type="number" min="0" max="130" value={p.age} onChange={onChange} />
        </label>

        <label>{t('profile.phone','Phone')}
          <input name="phone" value={p.phone} onChange={onChange} placeholder="+33..." />
        </label>

        <button type="submit">{t('save','Save')}</button>
        {msg && <small aria-live="polite" style={{marginTop:6, display:'block'}}>{msg}</small>}
      </form>
      <QrCard />
    </>
  )
}
