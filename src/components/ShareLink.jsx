import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { shareLink } from '../shareLink.js'

export default function ShareLink() {
  const { t } = useTranslation()
  const [msg, setMsg] = useState('')
  const LINK = 'https://tinyurl.com/carebee24'

  const onShare = async () => {
    const { msg: message, manual } = await shareLink(navigator, LINK, t)
    if (message) {
      setMsg(message)
      if (!manual) setTimeout(() => setMsg(''), 2000)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button type="button" onClick={onShare}>{t('share', 'Share')}</button>
      <small aria-live="polite">{msg}</small>
    </div>
  )
}
