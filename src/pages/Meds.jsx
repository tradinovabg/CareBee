import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const STORAGE = 'carebee.meds'
const TODAY_TAKEN_KEY = (d) => `carebee.taken.${d}`

const todayISO = () => {
  const d = new Date(); const y=d.getFullYear()
  const m=String(d.getMonth()+1).padStart(2,'0')
  const day=String(d.getDate()).padStart(2,'0')
  return `${y}-${m}-${day}`
}
const load = (k, def) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):def } catch { return def } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export default function Meds(){
  const { t } = useTranslation()
  const [items, setItems] = useState(() => load(STORAGE, []))
  const [name, setName] = useState('')
  const [times, setTimes] = useState('08:00, 20:00')
  const [meal, setMeal] = useState('with')
  const [active, setActive] = useState(true)
  const date = todayISO()
  const [taken, setTaken] = useState(() => load(TODAY_TAKEN_KEY(date), {}))

  useEffect(()=>save(STORAGE, items), [items])
  useEffect(()=>save(TODAY_TAKEN_KEY(date), taken), [taken, date])

  const add = () => {
    if(!name.trim()) return
    const tms = times.split(/[,\s]+/).map(s=>s.trim()).filter(Boolean)
    const id = Date.now().toString()
    setItems(prev => [...prev, { id, name: name.trim(), times: tms, meal, active }])
    setName(''); setTimes('08:00, 20:00')
  }

  const remove = (id) => setItems(prev => prev.filter(x=>x.id!==id))
  const toggleActive = (id) => setItems(prev => prev.map(x=> x.id===id? {...x, active: !x.active } : x))

  const todayDoses = useMemo(()=> {
    const list=[]
    items.filter(x=>x.active).forEach(m => m.times.forEach(t => list.push({ key:`${m.id}@${t}`, label:`${m.name} — ${t}` })))
    return list.sort((a,b)=>a.label.localeCompare(b.label))
  }, [items])

  const toggleTaken = (key) => setTaken(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="container" style={{maxWidth:760, margin:'0 auto', padding:'1rem'}}>
      <h1>{t('meds.title','Medicine schedule')}</h1>

      <div className="card" style={{background:'#fff', padding:'1rem', borderRadius:12, margin:'1rem 0', border:'1px solid #e5e7eb'}}>
        <h2 style={{marginTop:0}}>{t('meds.add','Add medicine')}</h2>
        <div style={{display:'grid', gap:8}}>
          <label>{t('meds.name','Name')}
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Amlodipine" />
          </label>
          <label>{t('meds.times','Times (comma separated)')}
            <input value={times} onChange={e=>setTimes(e.target.value)} placeholder="08:00, 20:00" />
          </label>
          <label>{t('meds.meal','With food')}
            <select value={meal} onChange={e=>setMeal(e.target.value)}>
              <option value="with">{t('meds.meal_with','with food')}</option>
              <option value="after">{t('meds.meal_after','after food')}</option>
              <option value="before">{t('meds.meal_before','before food')}</option>
            </select>
          </label>
          <label><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} /> {t('meds.active','Active')}</label>
          <button onClick={add}>{t('save','Save')}</button>
        </div>
      </div>

      <h2>{t('meds.today','Today')}</h2>
      <ul>
        {todayDoses.length===0 && <li>{t('meds.empty','No active medicines')}</li>}
        {todayDoses.map(d=>(
          <li key={d.key} style={{margin:'6px 0'}}>
            <label>
              <input type="checkbox" checked={!!taken[d.key]} onChange={()=>toggleTaken(d.key)} />
              {' '}{d.label}
            </label>
          </li>
        ))}
      </ul>

      <h2 style={{marginTop:'1.5rem'}}>{t('meds.all','All medicines')}</h2>
      <ul>
        {items.map(m=>(
          <li key={m.id} style={{margin:'8px 0', padding:'8px', border:'1px solid #eee', borderRadius:8}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <strong>{m.name}</strong> • {m.times.join(', ')} • {t('meds.meal_short','meal')}: {m.meal}
                {' '}• {m.active ? t('meds.status_active','active') : t('meds.status_inactive','inactive')}
              </div>
              <div style={{display:'flex', gap:8}}>
                <button onClick={()=>toggleActive(m.id)}>{m.active? t('meds.deactivate','Deactivate') : t('meds.activate','Activate')}</button>
                <button onClick={()=>remove(m.id)}>{t('delete','Delete')}</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
