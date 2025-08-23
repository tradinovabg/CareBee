const PROFILE_KEY = 'carebee.profile'
const LAST_KEY = 'carebee.lastDailySent'

const load = (k, def) => {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : def
  } catch {
    return def
  }
}

const loadProfile = () => load(PROFILE_KEY, {})

export function shouldAutoSend () {
  try {
    const p = loadProfile()
    if (!p.autosendEnabled) return false
    const now = new Date()
    const hhmm = now.toTimeString().slice(0, 5)
    const today = now.toISOString().slice(0, 10)
    const last = localStorage.getItem(LAST_KEY)
    return hhmm >= (p.autosendTime || '00:00') && last !== today
  } catch {
    return false
  }
}

export function buildDailySummary () {
  const today = new Date().toISOString().slice(0, 10)
  const visits = load('carebee.visits', []).filter(v => v.date === today)
  const medsRaw = load('carebee.meds', [])
  const meds = []
  medsRaw.forEach(m => {
    if (m.mode === 'once') {
      if (m.once.date === today) meds.push(`${m.once.time} ${m.name}`)
    } else {
      const d = m.daily
      const within = (!d.start || today >= d.start) && (!d.end || today <= d.end)
      if (within) d.times.forEach(t => meds.push(`${t} ${m.name}`))
    }
  })
  const lines = [`Date: ${today}`]
  lines.push('')
  lines.push('Meds:')
  if (meds.length) meds.forEach(m => lines.push(`- ${m}`))
  else lines.push('- none')
  lines.push('')
  lines.push('Visits:')
  if (visits.length) {
    visits.forEach(v => {
      const place = v.place ? ` @ ${v.place}` : ''
      const notes = v.notes ? ` (${v.notes})` : ''
      lines.push(`- ${v.time} ${v.doctor}${place}${notes}`)
    })
  } else lines.push('- none')
  return lines.join('\n')
}

export function sendSummary () {
  const profile = loadProfile()
  const body = encodeURIComponent(buildDailySummary())
  const to = encodeURIComponent(profile.recipients || '')
  const subj = encodeURIComponent('CareBee Daily Summary')
  const url = `mailto:${to}?subject=${subj}&body=${body}`
  window.open(url)
  try { localStorage.setItem(LAST_KEY, new Date().toISOString()) } catch { /* ignore */ }
}

const AUTO_KEY = 'carebee.autoDailySummary'

export const getAutoSendSettings = () => load(AUTO_KEY, { enabled: false, time: '09:00' })

export const setAutoSendSettings = (s) => {
  try { localStorage.setItem(AUTO_KEY, JSON.stringify(s)) } catch { /* ignore */ }
}

export const getLastSummaryAt = () => load(LAST_KEY, null)

export const sendDailySummaryNow = () => {
  sendSummary()
  return getLastSummaryAt()
}

export function maybeSendDailySummary () {
  if (shouldAutoSend() && confirm('Send daily summary now?')) sendSummary()
}

