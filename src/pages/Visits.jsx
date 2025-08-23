import { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const STORAGE = 'carebee.visits'
const load = (k, def) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):def } catch { return def } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }

const todayISO = () => { const d=new Date(); const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}` }
const formatUTC = dt => dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
const toUTC = (isoDate, hhmm, addMinutes = 0) => {
  const [h, m] = (hhmm || '09:00').split(':').map(Number)
  const dt = new Date(`${isoDate}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`)
  dt.setMinutes(dt.getMinutes() + addMinutes)
  return formatUTC(dt)
}

const esc = v => (v || '').replace(/[\n,;]/g, ' ')

export default function Visits(){
  const { t } = useTranslation()
  const [list, setList] = useState(()=> load(STORAGE, []))
  const [doctor, setDoctor] = useState('')
  const [place, setPlace] = useState('')
  const [date, setDate] = useState(todayISO())
  const [time, setTime] = useState('09:00')
  const [notes, setNotes] = useState('')
  const fileRef = useRef(null)

  useEffect(()=>save(STORAGE, list), [list])

  const add = () => {
    if(!doctor.trim()) return
    const id = Date.now().toString()
    setList(prev=> [...prev, { id, doctor: doctor.trim(), place: place.trim(), date, time, notes: notes.trim() }])
    setDoctor(''); setPlace(''); setNotes('')
  }
  const remove = (id) => setList(prev=> prev.filter(x=>x.id!==id))

  const upcoming = useMemo(()=> [...list].sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time)), [list])

  const downloadICS = (v) => {
codex/normalize-text-in-ics-download-templates
    const uid = `${v.id}@carebee`
    const dtstart = toICSDateTime(v.date, v.time)
    const now = toICSDateTime(todayISO(), new Date().toTimeString().slice(0,5))
    const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CareBee//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${dtstart}
SUMMARY:${esc(`Visit — ${v.doctor}`)}
LOCATION:${esc(v.place)}
DESCRIPTION:${esc(v.notes)}
END:VEVENT
END:VCALENDAR`
    const blob = new Blob([ics], {type:'text/calendar;charset=utf-8'})
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `visit-${v.date}-${v.time}.ics`
    a.click()
    URL.revokeObjectURL(a.href)
=======
    const startUTC = toUTC(v.date, v.time)
    const endUTC = toUTC(v.date, v.time, 60)
    const summary = v.doctor ? `Visit — ${v.doctor}` : 'Visit'
    const location = v.place?.trim()
    const url = new URL('https://calendar.google.com/calendar/render')
    url.searchParams.set('action', 'TEMPLATE')
    url.searchParams.set('dates', `${startUTC}/${endUTC}`)
    url.searchParams.set('text', summary)
    if (location) url.searchParams.set('location', location)
    window.open(url.toString(), '_blank')
main
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'visits-backup.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importJson = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        const valid = Array.isArray(data) && data.every(obj => obj && typeof obj === 'object' &&
          'id' in obj && 'doctor' in obj && 'place' in obj && 'date' in obj && 'time' in obj && 'notes' in obj)
        if (valid) {
          setList(data)
        } else {
          alert(t('visits.invalidFile'))
        }
      } catch {
        alert(t('visits.invalidFile'))
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="container" style={{maxWidth:760, margin:'0 auto', padding:'1rem'}}>
      <h1>{t('visits.title','Doctor visits')}</h1>

      <div className="card" style={{background:'#fff', padding:'1rem', borderRadius:12, margin:'1rem 0', border:'1px solid #e5e7eb'}}>
        <h2 style={{marginTop:0}}>{t('visits.add','Add visit')}</h2>
        <div style={{display:'grid', gap:8}}>
          <label>{t('visits.doctor','Doctor')}
            <input value={doctor} onChange={e=>setDoctor(e.target.value)} placeholder="Dr Martin" />
          </label>
          <label>{t('visits.place','Place')}
            <input value={place} onChange={e=>setPlace(e.target.value)} placeholder="Clinic address" />
          </label>
          <div style={{display:'flex', gap:8}}>
            <label style={{flex:1}}>{t('date','Date')}
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
            </label>
            <label style={{flex:1}}>{t('time','Time')}
              <input value={time} onChange={e=>setTime(e.target.value)} placeholder="09:00" />
            </label>
          </div>
          <label>{t('notes','Notes')}
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} />
          </label>
          <button onClick={add}>{t('save','Save')}</button>
        </div>
      </div>

      <h2>{t('visits.upcoming','Upcoming')}</h2>
      <ul>
        {upcoming.length===0 && <li>{t('visits.empty','No visits')}</li>}
        {upcoming.map(v=>(
          <li key={v.id} style={{margin:'8px 0', padding:'8px', border:'1px solid #eee', borderRadius:8}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
              <div>
                <strong>{v.doctor}</strong> — {v.date} {v.time} {v.place?`• ${v.place}`:''}
                {v.notes? <div style={{color:'#555'}}>{v.notes}</div> : null}
              </div>
              <div style={{display:'flex', gap:8}}>
                <button onClick={()=>downloadICS(v)}>{t('visits.addToCalendar','Add to calendar')}</button>
                <button onClick={()=>remove(v.id)}>{t('delete','Delete')}</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div style={{marginTop:'1rem', display:'flex', gap:8}}>
        <button onClick={exportJson}>{t('visits.exportJson','Export JSON')}</button>
        <div>
          <input type="file" accept="application/json" ref={fileRef} onChange={importJson} style={{display:'none'}} />
          <button type="button" onClick={()=>fileRef.current?.click()}>{t('visits.importJson','Import JSON')}</button>
        </div>
      </div>
    </div>
  )
}
