const LAST_KEY = 'carebee.lastDailySent'

export const markDailySent = (date = new Date()) => {
  const d = typeof date === 'string' ? date : date.toISOString().slice(0, 10)
  try { localStorage.setItem(LAST_KEY, d) } catch {
    /* ignore */
  }
}

export const getLastDailySent = () => {
  try { return localStorage.getItem(LAST_KEY) } catch {
    return null
  }
}

export const shouldPromptDaily = () => {
  const today = new Date().toISOString().slice(0, 10)
  return getLastDailySent() !== today
}

export const sendSummary = async (profile) => {
  const parts = []
  if (profile.firstName || profile.lastName) {
    parts.push(`${profile.firstName || ''} ${profile.lastName || ''}`.trim())
  }
  if (profile.age) parts.push(`Age ${profile.age}`)
  if (profile.phone) parts.push(`Phone ${profile.phone}`)
  const text = parts.join(', ')
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Daily summary', text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  } catch {
    // ignore share errors
  }
  markDailySent()
}
