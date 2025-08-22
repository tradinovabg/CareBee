import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('tagline')}</p>
      <Link to="/sos">
        <button>{t('goToSOS')}</button>
      </Link>
    </div>
  )
}
