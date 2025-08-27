import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sos from "./pages/Sos";
import Profile from "./pages/Profile";
import Meds from "./pages/Meds";
import Visits from "./pages/Visits";
import Calendar from "./pages/Calendar";
import Vitals from "./pages/Vitals";
import Nearby from "./pages/Nearby";

const BASENAME = import.meta.env.MODE === "development" ? "/" : "/CareBee/";

function Nav() {
  const link = ({ isActive }) =>
    `px-3 py-2 text-sm ${isActive ? "font-semibold underline" : "hover:underline"}`;
  return (
    <header className="sticky top-0 z-40 bg-amber-50/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-2">
        <NavLink to="/" className="font-bold">CareBee</NavLink>
        <nav className="flex flex-wrap gap-3">
          <NavLink to="/" className={link}>Home</NavLink>
          <NavLink to="/profile" className={link}>Profile</NavLink>
          <NavLink to="/meds" className={link}>Meds</NavLink>
          <NavLink to="/visits" className={link}>Visits</NavLink>
          <NavLink to="/calendar" className={link}>Calendar</NavLink>
          <NavLink to="/vitals" className={link}>Vitals</NavLink>
          <NavLink to="/nearby" className={link}>Nearby</NavLink>
          <NavLink to="/sos" className={link}>SOS</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  console.log("[CareBee] App.jsx mounted");
  return (
    <>
      {/* Диагностическая плашка — если её видишь, значит грузится ЭТОТ App.jsx */}
      <div style={{background:"#16a34a",color:"#fff",fontSize:12,padding:"4px 8px"}}>
        App v2 loaded — router from src/App.jsx
      </div>

      <BrowserRouter basename={BASENAME}>
        <Nav />
        <Routes>
          {/* ГЛАВНАЯ */}
          <Route path="/" element={<Home />} />

          {/* Остальные страницы */}
          <Route path="/sos" element={<Sos />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/meds" element={<Meds />} />
          <Route path="/visits" element={<Visits />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/nearby" element={<Nearby />} />

          {/* 404 → на главную */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
