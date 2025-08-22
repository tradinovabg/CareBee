import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="home">
      <div className="hero-card">
        <h1>{t('title', 'CareBee')}</h1>
        <p>{t('tagline', 'Quick help at your fingertips.')}</p>
        <Link to="/sos">
          <button className="sos-button">{t('goToSOS', 'Go to SOS')}</button>
        </Link>
      </div>
    </div>
  )
}
