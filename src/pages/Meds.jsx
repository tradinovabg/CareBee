import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const STORAGE = 'carebee.meds'
const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def } catch { return def } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export default function Meds() {
  const { t } = useTranslation()
  const [items, setItems] = useState(() => load(STORAGE, []))

  const [name, setName] = useState('')
  const [morning, setMorning] = useState(true)
  const [noon, setNoon] = useState(false)
  const [evening, setEvening] = useState(true)
  const [tmMorning, setTmMorning] = useState('08:00')
  const [tmNoon, setTmNoon] = useState('13:00')
  const [tmEvening, setTmEvening] = useState('20:00')
  const [meal, setMeal] = useState('with')
  const [active, setActive] = useState(true)

  useEffect(() => save(STORAGE, items), [items])

  const add = () => {
    if (!name.trim()) return
    const times = []
    if (morning) times.push(tmMorning)
    if (noon) times.push(tmNoon)
    if (evening) times.push(tmEvening)
    if (!times.length) return
    const id = Date.now().toString()
    setItems(prev => [...prev, { id, name: name.trim(), times, meal, active }])
    setName('')
    setMorning(true)
    setNoon(false)
    setEvening(true)
    setTmMorning('08:00')
    setTmNoon('13:00')
    setTmEvening('20:00')
    setMeal('with')
    setActive(true)
  }

  const remove = id => setItems(prev => prev.filter(x => x.id !== id))
  const toggleActive = id => setItems(prev => prev.map(x => x.id === id ? { ...x, active: !x.active } : x))

  const todayDoses = useMemo(() => {
    const list = []
    items.filter(x => x.active).forEach(m => m.times.forEach(t => list.push({ key: `${m.id}@${t}`, label: `${m.name} — ${t}` })))
    return list.sort((a, b) => a.label.localeCompare(b.label))
  }, [items])

  return (
    <div className="container" style={{ maxWidth: 760, margin: '0 auto', padding: '1rem' }}>
      <h1>{t('meds.title', 'Medicine schedule')}</h1>

      <div className="card" style={{ background: '#fff', padding: '1rem', borderRadius: 12, margin: '1rem 0', border: '1px solid #e5e7eb' }}>
        <h2 style={{ marginTop: 0 }}>{t('meds.add', 'Add medicine')}</h2>

        <div style={{ display: 'grid', gap: 8 }}>
          <label>{t('meds.name', 'Name')}
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Amlodipine" />
          </label>

          <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px' }}>
            <legend style={{ padding: '0 6px' }}>{t('meds.chooseTimes', 'Choose times')}</legend>
            <div style={{ display: 'grid', gap: 8 }}>
              <label>
                <input type="checkbox" checked={morning} onChange={e => setMorning(e.target.checked)} />
                {t('meds.morning', 'Morning')}
                {morning && (
                  <input value={tmMorning} onChange={e => setTmMorning(e.target.value)} style={{ marginLeft: 8, width: 100 }} />
                )}
              </label>
              <label>
                <input type="checkbox" checked={noon} onChange={e => setNoon(e.target.checked)} />
                {t('meds.noon', 'Noon')}
                {noon && (
                  <input value={tmNoon} onChange={e => setTmNoon(e.target.value)} style={{ marginLeft: 8, width: 100 }} />
                )}
              </label>
              <label>
                <input type="checkbox" checked={evening} onChange={e => setEvening(e.target.checked)} />
                {t('meds.evening', 'Evening')}
                {evening && (
                  <input value={tmEvening} onChange={e => setTmEvening(e.target.value)} style={{ marginLeft: 8, width: 100 }} />
                )}
              </label>
            </div>
          </fieldset>

          <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px' }}>
            <legend style={{ padding: '0 6px' }}>{t('meds.mealMode', 'Meal timing')}</legend>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <label>
                <input type="radio" name="meal" value="before" checked={meal === 'before'} onChange={e => setMeal(e.target.value)} />
                {t('meds.meal_before', 'before food')}
              </label>
              <label>
                <input type="radio" name="meal" value="with" checked={meal === 'with'} onChange={e => setMeal(e.target.value)} />
                {t('meds.meal_with', 'with food')}
              </label>
              <label>
                <input type="radio" name="meal" value="after" checked={meal === 'after'} onChange={e => setMeal(e.target.value)} />
                {t('meds.meal_after', 'after food')}
              </label>
            </div>
          </fieldset>

          <label>
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
            {t('meds.active', 'Active')}
          </label>

          <button onClick={add}>{t('save', 'Save')}</button>
        </div>
      </div>

      <h2>{t('meds.today', 'Today')}</h2>
      <ul>
        {todayDoses.length === 0 && <li>{t('meds.empty', 'No active medicines')}</li>}
        {todayDoses.map(d => (
          <li key={d.key} style={{ margin: '6px 0' }}>
            <label>
              <input type="checkbox" /> {d.label}
            </label>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '1.5rem' }}>{t('meds.all', 'All medicines')}</h2>
      <ul>
        {items.map(m => (
          <li key={m.id} style={{ margin: '8px 0', padding: '8px', border: '1px solid #eee', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{m.name}</strong> • {m.times.join(', ')} • {t('meds.meal_short', 'meal')}: {m.meal} •
                {m.active ? t('meds.status_active', 'active') : t('meds.status_inactive', 'inactive')}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleActive(m.id)}>
                  {m.active ? t('meds.deactivate', 'Deactivate') : t('meds.activate', 'Activate')}
                </button>
                <button onClick={() => remove(m.id)}>{t('delete', 'Delete')}</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
