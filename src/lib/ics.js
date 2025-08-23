export const icsEscape = (v = '') => String(v)
  .replace(/\\/g, '\\\\')
  .replace(/\r?\n/g, '\\n')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;')

export const buildICSEvent = ({ uid, start, title, details = '', location = '' }) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CareBee//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `SUMMARY:${title}`
  ]
  if (location) lines.push(`LOCATION:${location}`)
  if (details) lines.push(`DESCRIPTION:${details}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\n')
}

export const genUID = (domain = 'carebee') => {
  const rnd = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return `${rnd}@${domain}`
}

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
}

export const detectTZ = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return tz || 'UTC'
  } catch {
    return 'UTC'
  }
}

export const fromDateAndTimeLocal = (date, time = '09:00') => {
  return new Date(`${date}T${time || '09:00'}:00`)
}

codex/validate-date-in-toicsdatetimeutc
export const toICSDateTimeUTC = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
main
main
main
=======
export const toICSDateTimeUTC = (d) => {
  const date = d instanceof Date ? d : new Date(d)
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
main
}

