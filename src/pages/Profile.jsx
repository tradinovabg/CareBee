import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import QrCard from '../components/QrCard'
import { makeSummary } from '../lib/summary'

const KEY = 'carebee.profile'
const load = () => { try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : {} } catch { return {} } }
const save = (obj) => { try { localStorage.setItem(KEY, JSON.stringify(obj)) } catch { /* ignore */ } }
const loadVisits = () => { try { const v = localStorage.getItem('carebee.visits'); return v ? JSON.parse(v) : [] } catch { return [] } }
const loadMeds = () => { try { const v = localStorage.getItem('carebee.meds'); return v ? JSON.parse(v) : [] } catch { return [] } }

export default function Profile() {
  const { t, i18n } = useTranslation()
  const [p, setP] = useState(() => ({ firstName:'', lastName:'', age:'', phone:'', autoSend:false, ...load() }))
  const [msg, setMsg] = useState('')
  const [sumMsg, setSumMsg] = useState('')

  const getSummary = () => makeSummary(p, loadVisits(), loadMeds(), i18n)

  const sendSummary = () => {
    const text = getSummary()
    const mailto = `mailto:?subject=${encodeURIComponent(t('profile.title','Patient summary'))}&body=${encodeURIComponent(text)}`
    window.location.href = mailto
  }
  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(getSummary())
      setSumMsg(t('profile.summaryCopied','Summary copied'))
      setTimeout(()=>setSumMsg(''),2000)
    } catch { /* ignore */ }
  }
  const shareSummary = async () => {
    const text = getSummary()
    try {
      if (navigator.share) {
        await navigator.share({ title:'CareBee', text })
      } else {
        await navigator.clipboard.writeText(text)
        setSumMsg(t('profile.summaryCopied','Summary copied'))
        setTimeout(()=>setSumMsg(''),2000)
      }
    } catch { /* ignore */ }
  }

  useEffect(()=>{ save(p) }, [p])

  useEffect(()=>{
    if(p.autoSend){
      const today=new Date().toISOString().slice(0,10)
      const last=localStorage.getItem('carebee.summary.last')
      if(last!==today){ sendSummary(); localStorage.setItem('carebee.summary.last', today) }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[p.autoSend])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setP(prev => ({ ...prev, [name]: type==='checkbox'? checked : value }))
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

        <label><input type="checkbox" name="autoSend" checked={p.autoSend} onChange={onChange} /> {t('profile.autoSend','Auto-send daily summary')}</label>

        <div className="row" style={{display:'flex', gap:8, marginTop:8}}>
          <button type="button" onClick={sendSummary}>{t('profile.sendSummary','Send summary now')}</button>
          <button type="button" onClick={copySummary}>{t('profile.copySummary','Copy')}</button>
          <button type="button" onClick={shareSummary}>{t('profile.shareSummary','Share')}</button>
        </div>

        <button type="submit" style={{marginTop:8}}>{t('save','Save')}</button>
        {msg && <small aria-live="polite" style={{marginTop:6, display:'block'}}>{msg}</small>}
        {sumMsg && <small aria-live="polite" style={{marginTop:6, display:'block'}}>{sumMsg}</small>}
      </form>
      <QrCard />
    </>
  )
}
