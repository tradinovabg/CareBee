export function icsEscape(str = '') {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
}

export function buildICSEvent({ uid, start, title, details = '', location = '' }) {
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
