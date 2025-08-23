import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'qrcode'

const KEY = 'carebee.qr'
const load = () => { try { const v=localStorage.getItem(KEY); return v?JSON.parse(v):{} } catch (e) { void e; return {} } }
const save = (o) => { try { localStorage.setItem(KEY, JSON.stringify(o)) } catch (e) { /* ignore */ void e; } }
const loadProfile = () => { try { const v=localStorage.getItem('carebee.profile'); return v?JSON.parse(v):{} } catch (e) { void e; return {} } }

export default function QR(){
  const { t, i18n } = useTranslation()
  const prof = loadProfile()
  const [form, setForm] = useState(() => ({
    allergies:'', conditions:'', meds:'', iceName:'', icePhone:'',
    includeAge:true, includeAllergies:true, includeMeds:true, includeICE:true,
    ...load()
  }))
  const [png, setPng] = useState('')

  useEffect(()=>save(form),[form])

  const payload = useMemo(()=>{
    void i18n.language
    const lines = []
    const name = [prof.firstName, prof.lastName].filter(Boolean).join(' ')
    if (name) lines.push(`${t('qr.payload.name')}: ${name}`)
    if (form.includeAge && prof.age) lines.push(`${t('qr.payload.age')}: ${prof.age}`)
    if (form.includeAllergies && form.allergies) lines.push(`${t('qr.payload.allergies')}: ${form.allergies}`)
    if (form.includeMeds && form.meds) lines.push(`${t('qr.payload.meds')}: ${form.meds}`)
    if (form.includeICE && (form.iceName || form.icePhone)) lines.push(`${t('qr.payload.ice')}: ${form.iceName || ''} ${form.icePhone || ''}`.trim())
    if (form.conditions) lines.push(`${t('qr.payload.notes')}: ${form.conditions}`)
    return lines.join('\n').slice(0, 600)
  }, [form, prof, t, i18n.language])

  const generate = async () => {
    const url = await QRCode.toDataURL(payload, { width: 512, margin: 1 })
    setPng(url)
  }

  const downloadPNG = () => {
    if(!png) return
    const a = document.createElement('a')
    a.href = png; a.download = 'carebee-qr.png'; a.click()
  }

  const onChange = (e)=> {
    const { name, type, checked, value } = e.target
    setForm(p=>({ ...p, [name]: type==='checkbox' ? checked : value }))
  }

  return (
    <div className="container" style={{maxWidth:760, margin:'0 auto'}}>
      <h1 className="h1">QR — {t('profile.title','Patient profile')}</h1>

      <div className="card">
        <div className="field"><label>Allergies</label>
          <textarea name="allergies" value={form.allergies} onChange={onChange} rows={2} placeholder="penicillin, peanuts…" />
        </div>
        <div className="field"><label>Important conditions</label>
          <textarea name="conditions" value={form.conditions} onChange={onChange} rows={2} placeholder="diabetes I, pacemaker…" />
        </div>
        <div className="field"><label>Critical meds</label>
          <textarea name="meds" value={form.meds} onChange={onChange} rows={2} placeholder="Warfarin 5mg…" />
        </div>
        <div className="row">
          <div className="field" style={{flex:1}}>
            <label>ICE name</label>
            <input name="iceName" value={form.iceName} onChange={onChange} placeholder="Emergency contact" />
          </div>
          <div className="field" style={{flex:1}}>
            <label>ICE phone</label>
            <input name="icePhone" value={form.icePhone} onChange={onChange} placeholder="+33…" />
          </div>
        </div>

        <div className="row" style={{marginTop:8}}>
          <label><input type="checkbox" name="includeAge" checked={form.includeAge} onChange={onChange}/> Include age</label>
          <label><input type="checkbox" name="includeAllergies" checked={form.includeAllergies} onChange={onChange}/> Include allergies</label>
          <label><input type="checkbox" name="includeMeds" checked={form.includeMeds} onChange={onChange}/> Include meds</label>
          <label><input type="checkbox" name="includeICE" checked={form.includeICE} onChange={onChange}/> Include ICE</label>
        </div>

        <div className="row" style={{marginTop:8}}>
          <button className="btn btn-primary" onClick={generate}>Generate QR</button>
          <button className="btn btn-outline" onClick={downloadPNG} disabled={!png}>Download PNG</button>
          <button className="btn btn-outline" onClick={()=>window.print()} disabled={!png}>Print</button>
        </div>
      </div>

      {png && (
        <div style={{textAlign:'center', marginTop:16}}>
          <img src={png} alt="QR Code" style={{maxWidth:'320px'}} />
          <pre style={{textAlign:'left', whiteSpace:'pre-wrap', background:'#fff', padding:12, borderRadius:8, border:'1px solid #eee', marginTop:12}}>{payload}</pre>
        </div>
      )}
    </div>
  )
}

