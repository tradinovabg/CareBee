import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const load = (k, def) => {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : def
  } catch {
    return def
  }
}

const parseISODate = iso => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const addDays = (date, n) => {
  const d = parseISODate(date)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export default function Calendar () {
  const { t } = useTranslation()
  const [mode, setMode] = useState('day')
  const [showVisits, setShowVisits] = useState(true)
  const [showMeds, setShowMeds] = useState(true)

  const [visits, setVisits] = useState(() => load('carebee.visits', []))
  const [meds, setMeds] = useState(() => load('carebee.meds', []))

  useEffect(() => {
    const handler = () => {
      setVisits(load('carebee.visits', []))
      setMeds(load('carebee.meds', []))
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const todayISO = new Date().toISOString().slice(0, 10)
  const isToday = iso => iso === todayISO
  const rangeDays = mode === 'day' ? 1 : mode === 'week' ? 7 : 30

  const days = useMemo(() => {
    return Array.from({ length: rangeDays }, (_, i) => addDays(todayISO, i))
  }, [todayISO, rangeDays])

  const eventsByDate = useMemo(() => {
    const res = Object.fromEntries(days.map(d => [d, []]))
    const end = addDays(todayISO, rangeDays - 1)
    if (showVisits) {
      visits.forEach(v => {
        if (v.date >= todayISO && v.date <= end) {
          res[v.date].push({
            time: v.time,
            title: v.doctor,
            type: 'visit',
            location: v.place,
            notes: v.notes
          })
        }
      })
    }
    if (showMeds) {
      meds.forEach(m => {
        if (m.mode === 'once') {
          if (m.once.date >= todayISO && m.once.date <= end) {
            res[m.once.date].push({
              time: m.once.time,
              title: m.name,
              type: 'med'
            })
          }
        } else {
          const d = m.daily
          days.forEach(day => {
            const within = (!d.start || day >= d.start) && (!d.end || day <= d.end)
            if (within) {
              d.times.forEach(t => {
                res[day].push({ time: t, title: m.name, type: 'med' })
              })
            }
          })
        }
      })
    }
    Object.values(res).forEach(list => list.sort((a, b) => (a.time || '').localeCompare(b.time || '')))
    return res
  }, [days, visits, meds, showVisits, showMeds, todayISO, rangeDays])

  return (
    <div className='container'>
      <h1>{t('calendar.title', 'Calendar')}</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className={mode === 'day' ? 'btn btn-primary' : 'btn'} onClick={() => setMode('day')}>{t('calendar.day', 'Day')}</button>
        <button className={mode === 'week' ? 'btn btn-primary' : 'btn'} onClick={() => setMode('week')}>{t('calendar.week', 'Week')}</button>
        <button className={mode === 'month' ? 'btn btn-primary' : 'btn'} onClick={() => setMode('month')}>{t('calendar.month', 'Month')}</button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <label>
          <input type='checkbox' checked={showVisits} onChange={e => setShowVisits(e.target.checked)} /> {t('calendar.showVisits', 'Visits & Events')}
        </label>
        <label>
          <input type='checkbox' checked={showMeds} onChange={e => setShowMeds(e.target.checked)} /> {t('calendar.showMeds', 'Meds schedule')}
        </label>
      </div>
      {days.map(d => {
        const list = eventsByDate[d]
        return (
          <div
            key={d}
            className={`card day-cell${isToday(d) ? ' is-today' : ''}`}
            aria-current={isToday(d) ? 'date' : undefined}
          >
            <strong>
              {d}
              {isToday(d) && <span className='today-pill'>{t('calendar.today', 'Today')}</span>}
            </strong>
            {list.length ? (
              <ul>
                {list.map((e, i) => (
                  <li key={i}>
                    {e.time ? `${e.time} ` : ''}{e.title} ({e.type === 'visit' ? t('calendar.visit', 'Visit') : t('calendar.med', 'Med')})
                    {e.location ? ` — ${e.location}` : ''}
                    {e.notes ? <div style={{ color: '#555' }}>{e.notes}</div> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div>{t('calendar.empty', 'Nothing scheduled')}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

