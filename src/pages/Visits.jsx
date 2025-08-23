import { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
codex/implement-google-calendar-link-feature
import { buildGoogleCalLink } from '../lib/ics'
=======
import { fromDateAndTimeLocal, toICSDateTimeUTC } from '../lib/ics'
main

const STORAGE = 'carebee.visits'
const load = (k, def) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):def } catch { return def } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }

const todayISO = () => { const d=new Date(); const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}` }

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

  const upcoming = useMemo(() =>
    [...list].sort((a, b) =>
      fromDateAndTimeLocal(a.date, a.time) - fromDateAndTimeLocal(b.date, b.time)
    ),
    [list]
  )

  const downloadICS = (v) => {
    const uid = `${v.id}@carebee`
    const start = fromDateAndTimeLocal(v.date, v.time)
    const dtStart = toICSDateTimeUTC(start)
    const dtStamp = toICSDateTimeUTC(new Date())
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CareBee//EN\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${dtStamp}\nDTSTART:${dtStart}\nSUMMARY:${esc(`Visit — ${v.doctor}`) || ''}\nLOCATION:${esc(v.place) || ''}\nDESCRIPTION:${esc(v.notes)}\nEND:VEVENT\nEND:VCALENDAR`
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `visit-${v.date}-${v.time}.ics`
    a.click()
    URL.revokeObjectURL(a.href)
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
                <button onClick={()=>window.open(buildGoogleCalLink({ title: `Visit — ${v.doctor}`, date: v.date, time: v.time, description: v.notes, location: v.place }))}>{t('calendar.addToGoogle','Add to Google')}</button>
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
