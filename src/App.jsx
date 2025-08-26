// pages/src/App.jsx
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sos from "./pages/Sos";
import Contacts from "./pages/Contacts";

// если у тебя Vite настроен для GitHub Pages, можно так:
const BASENAME = import.meta.env.BASE_URL || "/";

function Nav() {
  const link = "px-3 py-2 text-sm hover:underline";
  return (
    <header className="sticky top-0 z-40 bg-amber-50/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-2">
        <NavLink to="/" className="font-bold">CareBee</NavLink>
        <nav className="flex gap-3">
          <NavLink to="/" className={link}>Home</NavLink>
          <NavLink to="/contacts" className={link}>Contacts</NavLink>
          <NavLink to="/sos" className={link}>SOS</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Nav />
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<Home />} />
        {/* Контакты и SOS */}
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/sos" element={<Sos />} />
        {/* 404 → на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
