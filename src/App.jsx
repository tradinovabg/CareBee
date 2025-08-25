import { Routes, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/LanguageSwitcher.jsx'
import Home from './pages/Home.jsx'
import Sos from './pages/Sos.jsx'
import Profile from './pages/Profile.jsx'
import Meds from './pages/Meds.jsx'
import Visits from './pages/Visits.jsx'
import Calendar from './pages/Calendar.jsx'
import QR from './pages/QR.jsx'
import Vitals from './pages/Vitals.jsx'
import Docs from './pages/Docs.jsx'
import Nearby from './pages/Nearby.jsx'

export default function App () {
  const { t } = useTranslation()
  const year = new Date().getFullYear()


  return (
    <>
      <header>
        <div className="container header-bar">
          <Link to="/" className="brand">CareBee</Link>
          <nav className="main-nav" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/profile">{t('nav.profile', 'Profile')}</Link>
            <Link to="/meds">{t('nav.meds', 'Meds')}</Link>
            <Link to="/visits">{t('nav.visits', 'Visits')}</Link>
            <Link to="/calendar">{t('nav.calendar', 'Calendar')}</Link>
            <Link to="/qr">QR</Link>
            <Link to="/vitals">Vitals</Link>
            <Link to="/nearby">Nearby</Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sos" element={<Sos />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/meds" element={<Meds />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/qr" element={<QR />} />
            <Route path="/vitals" element={<Vitals />} />
            <Route path="/nearby" element={<Nearby />} />
          </Routes>
        </div>
      </main>
      <footer>
        <div className="container">© {year} CareBee</div>
      </footer>
    </>
  )
}
