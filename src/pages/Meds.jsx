import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const STORAGE = 'carebee.meds'
const SLOT_DEFAULTS = { morning: '08:00', noon: '13:00', evening: '20:00' }

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

  const today = () => new Date().toISOString().slice(0, 10)
  const emptySlots = { morning: '', noon: '', evening: '' }

  const [editId, setEditId] = useState(null)
  const [name, setName] = useState('')
  const [mode, setMode] = useState('once')
  const [startDate, setStartDate] = useState(today())
  const [endDate, setEndDate] = useState('')
  const [onceTime, setOnceTime] = useState('08:00')
  const [slots, setSlots] = useState(emptySlots)
  const [mealTiming, setMealTiming] = useState('after')
  const [days, setDays] = useState(7)

  useEffect(() => save(STORAGE, items), [items])

  const reset = () => {
    setEditId(null)
    setName('')
    setMode('once')
    setStartDate(today())
    setEndDate('')
    setOnceTime('08:00')
    setSlots(emptySlots)
    setMealTiming('after')
  }

  const saveItem = () => {
    if (!name.trim()) return
    const base = {
      id: editId || Date.now().toString(),
      name: name.trim(),
      mode,
      startDate,
      mealTiming
    }
    let item
    if (mode === 'once') {
      item = { ...base, onceTime }
    } else {
      if (!Object.values(slots).some(Boolean)) return
      item = { ...base, endDate: endDate || undefined, slots }
    }
    setItems(p => editId ? p.map(i => i.id === editId ? item : i) : [...p, item])
    reset()
  }

  const edit = m => {
    setEditId(m.id)
    setName(m.name)
    setMode(m.mode)
    setStartDate(m.startDate)
    setEndDate(m.endDate || '')
    setMealTiming(m.mealTiming || 'after')
    if (m.mode === 'once') {
      setOnceTime(m.onceTime)
      setSlots(emptySlots)
    } else {
      setSlots({ ...emptySlots, ...m.slots })
    }
  }

  const remove = id => setItems(p => p.filter(i => i.id !== id))
  const extend = id => setItems(p => p.map(i => i.id === id ? { ...i, endDate: addDays(i.endDate || today(), 7) } : i))

  const renewals = useMemo(() => {
    const now = today()
    return items.filter(i => i.mode === 'daily' && i.endDate && (new Date(i.endDate) - new Date(now)) / 86400000 <= 3)
  }, [items])

  const schedule = useMemo(() => {
    const list = []
    const base = today()
    for (let i = 0; i < days; i++) {
      const date = addDays(base, i)
      const entries = []
      items.forEach(m => {
        if (m.mode === 'once') {
          if (m.startDate === date) entries.push(`${m.name} ${m.onceTime} ${m.mealTiming}`)
        } else {
          const within = (!m.startDate || date >= m.startDate) && (!m.endDate || date <= m.endDate)
          if (within) Object.values(m.slots || {}).forEach(t => { if (t) entries.push(`${m.name} ${t} ${m.mealTiming}`) })
        }
      })
      list.push({ date, entries })
    }
    return list
  }, [items, days])

  const downloadICS = m => {
    const dt = new Date(`${m.startDate}T${m.onceTime}`).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CareBee//EN\nBEGIN:VEVENT\nUID:${m.id}\nDTSTAMP:${dt}\nDTSTART:${dt}\nSUMMARY:${m.name}\nEND:VEVENT\nEND:VCALENDAR`
    const blob = new Blob([ics], { type: 'text/calendar' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${m.name}.ics`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const toggleSlot = s => e => {
    const checked = e.target.checked
    setSlots(p => ({ ...p, [s]: checked ? (p[s] || SLOT_DEFAULTS[s]) : '' }))
  }

  return (
    <div className='container'>
      <h1>{t('meds.title', 'Meds')}</h1>

      {renewals.map(r => (
        <div key={r.id} className='card'>
          <div className='row' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>{t('meds.renew', 'Course ends')} {r.name} {t('meds.on', 'on')} {r.endDate}</div>
            <button className='btn btn-primary' onClick={() => extend(r.id)}>{t('meds.extend', 'Extend')}</button>
          </div>
        </div>
      ))}

      <div className='card'>
        <h2>{t('meds.add', editId ? 'Edit medicine' : 'Add medicine')}</h2>
        <div className='field'>
          <label>{t('meds.name', 'Name')}
            <input value={name} onChange={e => setName(e.target.value)} />
          </label>
        </div>
        <div className='row' style={{ display: 'flex', gap: 8 }}>
          <label><input type='radio' value='once' checked={mode === 'once'} onChange={e => setMode(e.target.value)} /> {t('meds.once', 'Once')}</label>
          <label><input type='radio' value='daily' checked={mode === 'daily'} onChange={e => setMode(e.target.value)} /> {t('meds.daily', 'Daily')}</label>
        </div>
        <div className='row' style={{ display: 'flex', gap: 8 }}>
          <label>{t('meds.start', 'Start')}
            <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)} />
          </label>
          {mode === 'daily' && (
            <label>{t('meds.end', 'End')}
              <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} />
            </label>
          )}
        </div>

        {mode === 'once' ? (
          <div className='field'>
            <label>{t('meds.time', 'Time')}
              <input type='time' value={onceTime} onChange={e => setOnceTime(e.target.value)} />
            </label>
          </div>
        ) : (
          <div className='field' style={{ display: 'flex', gap: 8 }}>
            {['morning', 'noon', 'evening'].map(s => (
              <label key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>{t(`meds.${s}`, s)}</span>
                <input type='checkbox' checked={!!slots[s]} onChange={toggleSlot(s)} />
                {slots[s] && <input type='time' value={slots[s]} onChange={e => setSlots(p => ({ ...p, [s]: e.target.value }))} />}
              </label>
            ))}
          </div>
        )}

        <div className='field'>
          <label>{t('meds.meal', 'Meal')}
            <select value={mealTiming} onChange={e => setMealTiming(e.target.value)}>
              <option value='before'>{t('meds.before', 'Before food')}</option>
              <option value='with'>{t('meds.with', 'With food')}</option>
              <option value='after'>{t('meds.after', 'After food')}</option>
            </select>
          </label>
        </div>

        <div className='row' style={{ display: 'flex', gap: 8 }}>
          <button className='btn btn-primary' onClick={saveItem}>{t('save', 'Save')}</button>
          {editId && <button className='btn btn-outline' onClick={reset}>{t('cancel', 'Cancel')}</button>}
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
                  ? `${m.startDate} ${m.onceTime} ${m.mealTiming}`
                  : `${m.startDate}${m.endDate ? '–' + m.endDate : ''} ${Object.values(m.slots || {}).filter(Boolean).join(', ')} ${m.mealTiming}`}
              </div>
              <div className='row' style={{ display: 'flex', gap: 8 }}>
                {m.mode === 'once' && <button className='btn btn-outline' onClick={() => downloadICS(m)}>ICS</button>}
                <button className='btn btn-outline' onClick={() => edit(m)}>{t('edit', 'Edit')}</button>
                <button className='btn btn-danger' onClick={() => remove(m.id)}>{t('delete', 'Delete')}</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

