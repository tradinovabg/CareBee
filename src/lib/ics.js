export const icsEscape = (str = '') => String(str)
  .replace(/\\/g, '\\\\')
  .replace(/\n/g, '\\n')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;')

export const fromDateAndTimeLocal = (date, time = '09:00') => {
  return new Date(`${date}T${time || '09:00'}:00`)
}

export const toICSDateTimeUTC = (d) => {
  const date = d instanceof Date ? d : new Date(d)
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
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
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`
  })
  if (description) params.set('details', description)
  if (location) params.set('location', location)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export const genUID = (domain = 'carebee') => {
  const rnd = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return `${rnd}@${domain}`
}

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
