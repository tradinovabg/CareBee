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
}
