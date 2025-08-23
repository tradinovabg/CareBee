import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const STORAGE = 'carebee.meds'

const load = (k, def) => {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : def
  } catch {
    return def
  }
}

const save = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ }
}

const addDays = (d, n) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x.toISOString().slice(0, 10)
}

export default function Meds () {
  const { t } = useTranslation()
  const [items, setItems] = useState(() => load(STORAGE, []))

  const [name, setName] = useState('')
  const [mode, setMode] = useState('once')
  const today = () => new Date().toISOString().slice(0, 10)
  const [onceDate, setOnceDate] = useState(today())
  const [onceTime, setOnceTime] = useState('08:00')
  const [start, setStart] = useState(today())
  const [end, setEnd] = useState('')
  const [duration, setDuration] = useState('')
  const [times, setTimes] = useState('08:00')
  const [days, setDays] = useState(7)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => save(STORAGE, items), [items])

  const add = () => {
    if (!name.trim()) return
    if (mode === 'once') {
      const newItem = { id: editingId || Date.now().toString(), name: name.trim(), mode, once: { date: onceDate, time: onceTime } }
      setItems(p => editingId ? p.map(i => i.id === editingId ? newItem : i) : [...p, newItem])
    } else {
      if (!start) return
      if (!end && !duration) return
      const timesArr = times.split(',').map(s => s.trim()).filter(Boolean)
      if (!timesArr.length) return
      let endDate = end
      if (!endDate && duration) endDate = addDays(start, parseInt(duration) - 1)
      const newItem = { id: editingId || Date.now().toString(), name: name.trim(), mode, daily: { start, end: endDate, times: timesArr } }
      setItems(p => editingId ? p.map(i => i.id === editingId ? newItem : i) : [...p, newItem])
    }
    setName('')
    setMode('once')
    setOnceDate(today())
    setOnceTime('08:00')
    setStart(today())
    setEnd('')
    setDuration('')
    setTimes('08:00')
    setEditingId(null)
  }

  const remove = id => setItems(p => p.filter(i => i.id !== id))
  const extend = id => setItems(p => p.map(i => i.id === id ? { ...i, daily: { ...i.daily, end: addDays(i.daily.end || today(), 7) } } : i))

  const startEdit = m => {
    setEditingId(m.id)
    setName(m.name)
    setMode(m.mode)
    if (m.mode === 'once') {
      setOnceDate(m.once.date)
      setOnceTime(m.once.time)
    } else {
      setStart(m.daily.start)
      setEnd(m.daily.end || '')
      setDuration('')
      setTimes(m.daily.times.join(', '))
    }
  }

  const renewals = useMemo(() => {
    const now = today()
    return items.filter(i => i.mode === 'daily' && i.daily?.end && (new Date(i.daily.end) - new Date(now)) / 86400000 <= 3)
  }, [items])

  const schedule = useMemo(() => {
    const list = []
    const base = today()
    for (let i = 0; i < days; i++) {
      const date = addDays(base, i)
      const entries = []
      items.forEach(m => {
        if (m.mode === 'once') {
          if (m.once.date === date) entries.push(`${m.name} ${m.once.time}`)
        } else {
          const d = m.daily
          const within = (!d.start || date >= d.start) && (!d.end || date <= d.end)
          if (within) d.times.forEach(t => entries.push(`${m.name} ${t}`))
        }
      })
      list.push({ date, entries })
    }
    return list
  }, [items, days])

  const downloadICS = m => {
    const dt = `${m.once.date.replace(/-/g, '')}T${m.once.time.replace(':', '')}00`
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${m.id}\nDTSTAMP:${dt}\nDTSTART:${dt}\nSUMMARY:${m.name}\nEND:VEVENT\nEND:VCALENDAR`
    const blob = new Blob([ics], { type: 'text/calendar' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${m.name}.ics`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className='container'>
      <h1>{t('meds.title', 'Meds')}</h1>

      {renewals.map(r => (
        <div key={r.id} className='card'>
          <div className='row' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>{t('meds.renew', 'Course ends')} {r.name} {t('meds.on', 'on')} {r.daily.end}</div>
            <button className='btn btn-primary' onClick={() => extend(r.id)}>{t('meds.extend', 'Extend')}</button>
          </div>
        </div>
      ))}

      <div className='card'>
        <h2>{editingId ? t('meds.edit', 'Edit medicine') : t('meds.add', 'Add medicine')}</h2>
        <div className='field'>
          <label>{t('meds.name', 'Name')}
            <input value={name} onChange={e => setName(e.target.value)} />
          </label>
        </div>
        <div className='row' style={{ display: 'flex', gap: 8 }}>
          <label><input type='radio' value='once' checked={mode === 'once'} onChange={e => setMode(e.target.value)} /> {t('meds.once', 'Once')}</label>
          <label><input type='radio' value='daily' checked={mode === 'daily'} onChange={e => setMode(e.target.value)} /> {t('meds.daily', 'Daily')}</label>
        </div>

        {mode === 'once' ? (
          <div className='row' style={{ display: 'flex', gap: 8 }}>
            <label>{t('meds.date', 'Date')}
              <input type='date' value={onceDate} onChange={e => setOnceDate(e.target.value)} />
            </label>
            <label>{t('meds.time', 'Time')}
              <input type='time' value={onceTime} onChange={e => setOnceTime(e.target.value)} />
            </label>
          </div>
        ) : (
          <>
            <div className='row' style={{ display: 'flex', gap: 8 }}>
              <label>{t('meds.start', 'Start')}
                <input type='date' value={start} onChange={e => setStart(e.target.value)} />
              </label>
              <label>{t('meds.end', 'End')}
                <input type='date' value={end} onChange={e => setEnd(e.target.value)} />
              </label>
              <label>{t('meds.duration', 'Days')}
                <input type='number' min='1' value={duration} onChange={e => setDuration(e.target.value)} />
              </label>
            </div>
            <div className='field'>
              <label>{t('meds.times', 'Times (comma separated)')}
                <input value={times} onChange={e => setTimes(e.target.value)} />
              </label>
            </div>
          </>
        )}

        <div className='row' style={{ display: 'flex', gap: 8 }}>
          <button className='btn btn-primary' onClick={add}>{editingId ? t('update', 'Update') : t('save', 'Save')}</button>
        </div>
      </div>

      <h2>{t('meds.schedule', 'Schedule')}</h2>
      <div className='card'>
        <ul>
          {schedule.map(d => (
            <li key={d.date}>
              <strong>{d.date}</strong>
              {d.entries.length ? (
                <ul>
                  {d.entries.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              ) : <span> — </span>}
            </li>
          ))}
        </ul>
        <button className='btn btn-outline' onClick={() => setDays(d => d === 7 ? 14 : 7)}>
          {days === 7 ? t('meds.expand', 'Show 14 days') : t('meds.collapse', 'Show 7 days')}
        </button>
      </div>

      <h2>{t('meds.all', 'All medicines')}</h2>
      <ul>
        {items.map(m => (
          <li key={m.id} className='card'>
            <div className='row' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{m.name}</strong>
                {' '}
                {m.mode === 'once'
                  ? `${m.once.date} ${m.once.time}`
                  : `${m.daily.start}${m.daily.end ? '–' + m.daily.end : ''} ${m.daily.times.join(', ')}`}
              </div>
              <div className='row' style={{ display: 'flex', gap: 8 }}>
                {m.mode === 'once' && <button className='btn btn-outline' onClick={() => downloadICS(m)}>ICS</button>}
                <button className='btn btn-outline' onClick={() => startEdit(m)}>{t('edit', 'Edit')}</button>
                <button className='btn btn-danger' onClick={() => remove(m.id)}>{t('delete', 'Delete')}</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

