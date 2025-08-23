import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { buildGoogleCalLink, buildICSEvent, fromDateAndTimeLocal, toICSDateTimeUTC } from '../lib/ics'
codex/add-normalization-to-times-array
import { normalizeTimes } from '../lib/normalizeTimes'
=======
import { MEAL_LABEL } from '../locale/mealLabel'
main

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

const parseISODate = iso => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const addDays = (d, n) => {
  const x = parseISODate(d)
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
  const [meal, setMeal] = useState('after')
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
    setMeal('after')
  }

  const saveItem = () => {
    if (!name.trim()) return
    const base = { id: editId || Date.now().toString(), name: name.trim(), mode, startDate, meal }
    let item
    if (mode === 'once') {
      item = { ...base, times: [onceTime], onceTime }
    } else {
      const times = normalizeTimes(Object.values(slots).filter(Boolean))
      if (!times.length) return
      item = { ...base, endDate: endDate || undefined, slots, times }
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
    setMeal(m.meal || 'after')
    if (m.mode === 'once') {
      setOnceTime(m.times?.[0] || '08:00')
      setSlots(emptySlots)
    } else {
      setSlots({ ...emptySlots, ...m.slots })
    }
  }

  const remove = id => setItems(p => p.filter(i => i.id !== id))
  const extend = id => setItems(p => p.map(i => i.id === id ? { ...i, endDate: addDays(i.endDate || today(), 7) } : i))

  const renewals = useMemo(() => {
    const now = today()
    return items.filter(i => i.mode === 'daily' && i.endDate && (parseISODate(i.endDate) - parseISODate(now)) / 86400000 <= 3)
  }, [items])

  const schedule = useMemo(() => {
    const list = []
    const base = today()
    for (let i = 0; i < days; i++) {
      const date = addDays(base, i)
      const entries = []
      items.forEach(m => {
        if (m.mode === 'once') {
          if (m.startDate === date) entries.push({ name: m.name, time: m.times[0], meal: m.meal })
        } else {
          const within = (!m.startDate || date >= m.startDate) && (!m.endDate || date <= m.endDate)
          if (within) m.times.forEach(t => entries.push({ name: m.name, time: t, meal: m.meal }))
        }
      })
      list.push({ date, entries })
    }
    return list
  }, [items, days])

  const downloadICS = m => {
    const uid = `${m.id}@carebee`
    const start = fromDateAndTimeLocal(m.startDate, m.times[0])
    const dt = toICSDateTimeUTC(start)
    const stamp = toICSDateTimeUTC(new Date())
    const ics = buildICSEvent({ uid, dtstamp: stamp, dtstart: dt, dtend: dt, title: m.name })
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
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
            <select value={meal} onChange={e => setMeal(e.target.value)}>
              <option value='before'>{t(MEAL_LABEL.before, 'Before food')}</option>
              <option value='with'>{t(MEAL_LABEL.with, 'With food')}</option>
              <option value='after'>{t(MEAL_LABEL.after, 'After food')}</option>
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
                  {d.entries.map((e, i) => <li key={i}>{e.time} {e.name}{e.meal ? ' • ' + t(MEAL_LABEL[e.meal]) : ''}</li>)}
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
                <strong>{m.name}</strong> — {m.times.join(', ')}{m.meal ? ` • ${t(MEAL_LABEL[m.meal])}` : ''}
              </div>
              <div className='row' style={{ display: 'flex', gap: 8 }}>
                {m.mode === 'once' && <>
                  <button className='btn btn-outline' onClick={() => downloadICS(m)}>{t('meds.addToCalendar', 'Add to calendar')}</button>
                  <button className='btn btn-outline' onClick={() => window.open(buildGoogleCalLink({ title: m.name, date: m.startDate, time: m.times[0] }))}>{t('calendar.addToGoogle', 'Add to Google')}</button>
                </>}
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
