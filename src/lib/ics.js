/**
 * Escape special characters for use in ICS files.
 * @param {string} [v='']
 * @returns {string}
 */
export const icsEscape = (v = '') => String(v)
  .replace(/\\/g, '\\\\')
  .replace(/\r?\n/g, '\\n')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;')

codex/add-normalization-to-times-array
=======
codex/create-localization-for-meal-labels
=======
codex/update-googlecallink-dates-formatting
=======
codex/validate-hhmm-and-plusminutes-parameters
/**
 * Build a minimal ICS event string.
 * @param {Object} params
 * @param {string} params.uid
 * @param {string} params.dtstamp
 * @param {string} params.dtstart
 * @param {string} [params.dtend]
 * @param {string} [params.title]
 * @param {string} [params.desc]
 * @param {string} [params.loc]
 * @param {string} [params.method='PUBLISH']
 * @returns {string}
 */
=======
codex/refactor-toutcstamp-for-utc-date-creation
=======
main

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
codex/validate-hhmm-and-plusminutes-parameters

 codex/add-normalization-to-times-array
=======
codex/create-localization-for-meal-labels
=======
codex/update-googlecallink-dates-formatting
=======
/**
 * Create a Date from separate ISO date and `HH:MM` time.
 * @param {string} date
 * @param {string} [time='09:00']
 * @returns {Date}
 */
=======
main

export const fromDateAndTimeLocal = (date, time = '09:00') => {
  return new Date(`${date}T${time || '09:00'}:00`)
}

/**
 * Convert a Date (or value convertible to Date) to an ICS UTC date-time.
 * Returns `null` if the input cannot be parsed.
 * @param {Date|number|string} date
 * @returns {string|null}
 */
export const toICSDateTimeUTC = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

codex/validate-hhmm-and-plusminutes-parameters
/**
 * Convert an `HH:MM` time string and offset to a UTC timestamp.
 *
 * @param {string} hhmm - Time in 24-hour `HH:MM` format.
 * @param {number} plusMinutes - Additional minutes to add; must be a finite, positive number.
 * @returns {string|null} UTC timestamp in `YYYYMMDDTHHMMSSZ` format or `null` on invalid input.
 */
export const toUTCStamp = (hhmm, plusMinutes) => {
  if (typeof hhmm !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hhmm)) return null
  if (!Number.isFinite(plusMinutes) || plusMinutes <= 0) return null
  const [hh, mm] = hhmm.split(':').map(Number)
  const d = new Date()
  d.setUTCHours(hh, mm + plusMinutes, 0, 0)
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

/**
 * Build a Google Calendar event creation link.
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.date
 * @param {string} params.time
 * @param {string} [params.endDate]
 * @param {string} [params.endTime]
 * @param {string} [params.description]
 * @param {string} [params.location]
 * @returns {string}
 */
=======
export const toUTCStamp = (dateISO, H = 0, M = 0, durationMin = 60) => {
  const [y, m, d] = dateISO.split('-').map(Number)
  const start = new Date(Date.UTC(y, m - 1, d, Number(H), Number(M), 0))
  const end = new Date(start.getTime() + durationMin * 60000)
  return [toICSDateTimeUTC(start), toICSDateTimeUTC(end)]
}

main
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
  const dates = encodeURIComponent(`${start}/${end}`)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title
  })
  if (description) params.set('details', description)
  if (location) params.set('location', location)
  return `https://calendar.google.com/calendar/render?${params.toString()}&dates=${dates}`
}

/**
 * Detect the current IANA time zone, defaulting to `UTC` on failure.
 * @returns {string}
 */
export const detectTZ = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return tz || 'UTC'
  } catch {
    return 'UTC'
  }
}

/**
 * Generate a unique identifier suitable for ICS events.
 * @param {string} [domain='carebee']
 * @returns {string}
 */
export const genUID = (domain = 'carebee') => {
  const rnd = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return `${rnd}@${domain}`
}
codex/add-normalization-to-times-array
=======
codex/create-localization-for-meal-labels
=======
codex/update-googlecallink-dates-formatting

=======
codex/validate-hhmm-and-plusminutes-parameters

=======
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
