codex/extend-ics.js-for-ics-events
export const icsEscape = v => (v || '')
  .replace(/\\/g, '\\\\')
  .replace(/\r?\n/g, '\\n')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;')

export const genUID = (domain = 'carebee') => {
  const rnd = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return `${rnd}@${domain}`
}

export const buildICSEvent = ({ uid, dtstamp, dtstart, title, desc, loc, method = 'PUBLISH' }) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'PRODID:-//CareBee//EN',
    'VERSION:2.0',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    title ? `SUMMARY:${title}` : null,
    desc ? `DESCRIPTION:${desc}` : null,
    loc ? `LOCATION:${loc}` : null,
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean)
  return lines.join('\r\n') + '\r\n'
=======
codex/implement-google-calendar-link-feature
export function toICSDateTime (isoDate, hhmm) {
  return new Date(`${isoDate}T${hhmm || '09:00'}:00`).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function buildGoogleCalLink ({
  title = '',
  date,
  time,
  endDate,
  endTime,
  description = '',
  location = ''
}) {
  if (!date) return ''
  const dt = s => new Date(`${s.date}T${s.time || '00:00'}:00`).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const start = dt({ date, time })
  const end = dt({ date: endDate || date, time: endTime || time })
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`
  })
  if (description) params.set('details', description)
  if (location) params.set('location', location)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
=======
export const detectTZ = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export const fromDateAndTimeLocal = (date, time = '09:00') => {
  return new Date(`${date}T${time || '09:00'}:00`)
}

export const toICSDateTimeUTC = (d) => {
  const date = d instanceof Date ? d : new Date(d)
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
main
main
}
