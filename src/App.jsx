import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Sos from './pages/Sos.jsx'
import LanguageSwitcher from './components/LanguageSwitcher.jsx'
import Meds from './pages/Meds.jsx'
import Visits from './pages/Visits.jsx'


export default function App() {
  const year = new Date().getFullYear()

  return (
    <>
      <header>
        <div className="container header-bar">
          <Link to="/" className="brand">CareBee</Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sos" element={<Sos />} />
          </Routes>
        </div>
      </main>

      <footer>
        <div className="container">© {year} CareBee</div>
      </footer>
    </>
  )
}

