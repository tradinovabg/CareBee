import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ShareLink() {
  const { t } = useTranslation()
  const [msg, setMsg] = useState('')
  const LINK = 'https://tinyurl.com/carebee24'

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'CareBee',
          text: t('shareText', 'Quick help at your fingertips'),
          url: LINK,
        })
        return
      }
      await navigator.clipboard.writeText(LINK)
      setMsg(t('linkCopied', 'Link copied'))
      setTimeout(() => setMsg(''), 2000)
    } catch {
      setMsg(t('linkCopyFailed', 'Could not share'))
      setTimeout(() => setMsg(''), 2000)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button type="button" onClick={onShare}>{t('share', 'Share')}</button>
      <small aria-live="polite">{msg}</small>
    </div>
  )
}
