import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Sos from './pages/Sos.jsx'
import LanguageSwitcher from './components/LanguageSwitcher.jsx'

export default function App() {
  return (
    <>
      <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sos" element={<Sos />} />
      </Routes>
    </>
  )
}
