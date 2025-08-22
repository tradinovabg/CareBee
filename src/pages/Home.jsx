import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SHORT_LINK } from '../config/links.js'

export default function Home() {
  const { t } = useTranslation()
  return (
    <div className="home">
      <h1>{t('title', 'CareBee')}</h1>
      <p>{t('tagline', 'Quick help at your fingertips.')}</p>
      <Link to="/sos">
        <button className="sos-button">{t('goToSOS', 'SOS')}</button>
      </Link>
      <p className="short-link">
        <a href={SHORT_LINK} target="_blank" rel="noopener noreferrer">
          {SHORT_LINK}
        </a>
      </p>
    </div>
  )
}
