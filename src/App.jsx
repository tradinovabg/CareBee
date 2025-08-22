import { Routes, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/LanguageSwitcher.jsx'
import Home from './pages/Home.jsx'
import Sos from './pages/Sos.jsx'
import Profile from './pages/Profile.jsx'
import Meds from './pages/Meds.jsx'
import Visits from './pages/Visits.jsx'
export default function App() {
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
          </Routes>
        </div>
      </main>
      <footer>
        <div className="container">© {year} CareBee</div>
      </footer>
    </>
  )
}
