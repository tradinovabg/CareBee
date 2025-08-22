import { useState } from 'react'
import { SHORT_LINK } from '../config/links.js'

export default function ShareLink() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CareBee',
          text: 'Quick help at your fingertips',
          url: SHORT_LINK,
        })
      } catch (err) {
        console.error(err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(SHORT_LINK)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div className="share-wrapper">
      <button onClick={handleShare}>Share</button>
      {copied && <span className="copied-notice">Link copied</span>}
    </div>
  )
}
