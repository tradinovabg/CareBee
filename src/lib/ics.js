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
}
