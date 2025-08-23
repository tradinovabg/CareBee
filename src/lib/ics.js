export const icsEscape = (v = '') => String(v)
  .replace(/\\/g, '\\\\')
  .replace(/\r?\n/g, '\\n')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;')

codex/refactor-toutcstamp-for-utc-date-creation
=======
export const buildICSEvent = ({
  uid,
  dtstamp,
  dtstart,
  dtend,
  title = '',
  desc = '',
  loc = '',
  method = 'PUBLISH'
}) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'PRODID:-//CareBee//EN',
    'VERSION:2.0',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`
  ]
  if (dtend) lines.push(`DTEND:${dtend}`)
  if (title) lines.push(`SUMMARY:${icsEscape(title)}`)
  if (desc) lines.push(`DESCRIPTION:${icsEscape(desc)}`)
  if (loc) lines.push(`LOCATION:${icsEscape(loc)}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n') + '\r\n'
}
main
export const fromDateAndTimeLocal = (date, time = '09:00') => {
  return new Date(`${date}T${time || '09:00'}:00`)
}

export const toICSDateTimeUTC = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export const toUTCStamp = (dateISO, H = 0, M = 0, durationMin = 60) => {
  const [y, m, d] = dateISO.split('-').map(Number)
  const start = new Date(Date.UTC(y, m - 1, d, Number(H), Number(M), 0))
  const end = new Date(start.getTime() + durationMin * 60000)
  return [toICSDateTimeUTC(start), toICSDateTimeUTC(end)]
}

export const buildGoogleCalLink = ({
  title = '',
  date,
  time,
  endDate,
  endTime,
  description = '',
  location = ''
}) => {
  if (!date) return ''
  const start = toICSDateTimeUTC(fromDateAndTimeLocal(date, time))
  const end = toICSDateTimeUTC(fromDateAndTimeLocal(endDate || date, endTime || time))
  if (!start || !end) return ''
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

export const genUID = (domain = 'carebee') => {
  const rnd = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return `${rnd}@${domain}`
}
codex/refactor-toutcstamp-for-utc-date-creation

export const buildICSEvent = ({
  uid,
  dtstamp,
  dtstart,
  dtend,
  title = '',
  desc = '',
  loc = '',
  method = 'PUBLISH'
}) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'PRODID:-//CareBee//EN',
    'VERSION:2.0',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`
  ]
  if (title) lines.push(`SUMMARY:${icsEscape(title)}`)
  if (desc) lines.push(`DESCRIPTION:${icsEscape(desc)}`)
  if (loc) lines.push(`LOCATION:${icsEscape(loc)}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n') + '\r\n'
}

=======
main
