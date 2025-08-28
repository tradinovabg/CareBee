// src/App.jsx
import { HashRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";

// ПОДКЛЮЧАЕМ СТРАНИЦЫ ИЗ src/pages/
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Meds from "./pages/Meds";
import Visits from "./pages/Visits";
import Calendar from "./pages/Calendar";
import Vitals from "./pages/Vitals";
import Nearby from "./pages/Nearby";

/**
 * Встроенная страница SOS (большая кнопка).
 * Никаких внешних файлов не нужно: даже если src/pages/Sos.jsx удалён, маршрут /sos работает.
 */
function SosPage() {
  const click = () => alert("SOS sent (test) ✅");
  return (
    <main className="min-h-[70vh] grid place-items-center p-4">
      <button
        onClick={click}
        type="button"
        aria-label="SOS"
        style={{ width: "18rem", height: "18rem" }}
        className="rounded-full bg-red-600 text-white text-5xl font-extrabold
                   shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)] ring-4 ring-red-300/50
                   hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-8
                   focus:ring-red-400/60 select-none"
      >
        SOS
      </button>
    </main>
  );
}

// Небольшой помощник для активного пункта меню
function LinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "px-3 py-1 rounded " + (isActive ? "bg-yellow-200 font-semibold" : "hover:bg-yellow-100")
      }
      end
    >
      {children}
    </NavLink>
  );
}

export default function App() {
  return (
    <Router>
      {/* ШАПКА-НАВИГАЦИЯ */}
      <header
        style={{ position: "sticky", top: 0, zIndex: 10 }}
        className="bg-amber-50 border-b border-amber-200"
      >
        <nav className="max-w-6xl mx-auto flex flex-wrap gap-2 p-2 text-sm">
          <LinkItem to="/">Home</LinkItem>
          <LinkItem to="/profile">Profile</LinkItem>
          <LinkItem to="/meds">Meds</LinkItem>
          <LinkItem to="/visits">Visits</LinkItem>
          <LinkItem to="/calendar">Calendar</LinkItem>
          <LinkItem to="/vitals">Vitals</LinkItem>
          <LinkItem to="/nearby">Nearby</LinkItem>
          <LinkItem to="/sos">SOS</LinkItem>
        </nav>
      </header>

      {/* МАРШРУТЫ */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/meds" element={<Meds />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/vitals" element={<Vitals />} />
        <Route path="/nearby" element={<Nearby />} />

        <Route path="/sos" element={<SosPage />} />

        {/* Любой другой путь → на Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
