import { Routes, Route, Link, NavLink } from 'react-router-dom'
import './App.css'
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
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {t('nav.profile', 'Profile')}
            </NavLink>
            <NavLink to="/meds" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {t('nav.meds', 'Meds')}
            </NavLink>
            <NavLink to="/visits" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {t('nav.visits', 'Visits')}
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {t('nav.calendar', 'Calendar')}
            </NavLink>
            <NavLink to="/qr" className={({ isActive }) => (isActive ? 'active' : undefined)}>QR</NavLink>
            <NavLink to="/vitals" className={({ isActive }) => (isActive ? 'active' : undefined)}>Vitals</NavLink>
            <NavLink to="/nearby" className={({ isActive }) => (isActive ? 'active' : undefined)}>Nearby</NavLink>
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
