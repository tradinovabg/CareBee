import { HashRouter as Router, Routes, Route, NavLink, Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/LanguageSwitcher";

// PAGES
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Meds from "./pages/Meds";
import Visits from "./pages/Visits";
import Calendar from "./pages/Calendar";
import Vitals from "./pages/Vitals";
import Nearby from "./pages/Nearby";
import Contacts from "./pages/Contacts";
import Guide from "./pages/Guide";
import Faq from "./pages/Faq";
import Privacy from "./pages/Privacy";

// Built‑in SOS page with rectangular button
function SosPage() {
  const click = () => alert("SOS sent (test) ✅");
  return (
    <main className="min-h-[70vh] grid place-items-center p-4">
      <button
        onClick={click}
        type="button"
        aria-label="SOS"
        className="w-64 h-32 rounded-lg bg-red-600 text-white text-5xl font-extrabold
                   shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)] ring-4 ring-red-300/50
                   hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-8
                   focus:ring-red-400/60 select-none"
      >
        SOS
      </button>
    </main>
  );
}

export default function App() {
  const { t } = useTranslation();

  const nav = [
    { to: "/", key: "nav.home" },
    { to: "/profile", key: "nav.profile" },
    { to: "/meds", key: "nav.meds" },
    { to: "/visits", key: "nav.visits" },
    { to: "/calendar", key: "nav.calendar" },
    { to: "/vitals", key: "nav.vitals" },
    { to: "/nearby", key: "nav.nearby" },
    { to: "/contacts", key: "nav.contacts" },
    { to: "/sos", key: "nav.sos" },
  ];

  return (
    <Router>
      {/* HEADER WITH NAVIGATION */}
      <header className="sticky top-0 z-40 bg-amber-200 border-b border-amber-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 p-2 text-sm">
          <nav className="flex flex-wrap items-center gap-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-1 rounded ${
                    isActive ? "bg-amber-300 font-semibold" : "hover:bg-amber-100"
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </header>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/meds" element={<Meds />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/vitals" element={<Vitals />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/sos" element={<SosPage />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* FOOTER */}
      <footer className="bg-amber-100 border-t border-amber-200 mt-8">
        <div className="max-w-6xl mx-auto px-3 py-3 text-sm text-slate-700 flex gap-4">
          <Link to="/guide">{t("nav.guide")}</Link>
          <Link to="/faq">{t("nav.faq")}</Link>
          <Link to="/privacy">{t("nav.privacy")}</Link>
        </div>
      </footer>
    </Router>
  );
}

