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

// Minimal placeholder pages
const FaqPage = () => <main className="p-4 max-w-2xl mx-auto">FAQ</main>;
const PrivacyPage = () => <main className="p-4 max-w-2xl mx-auto">Privacy</main>;
const GuidePage = () => <main className="p-4 max-w-2xl mx-auto">Guide</main>;

// Helper for active navigation link
function LinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "px-3 py-1 rounded " +
        (isActive ? "bg-yellow-200 font-semibold" : "hover:bg-yellow-100")
      }
      end
    >
      {children}
    </NavLink>
  );
}

export default function App() {
  const { t } = useTranslation();

  return (
    <Router>
      {/* HEADER WITH NAVIGATION */}
      <header className="sticky top-0 z-40 bg-amber-50 border-b border-amber-200">
  <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 p-2 text-sm">
    <nav className="flex flex-wrap gap-2">
      {/* LinkItem ... как сейчас */}
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
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* FOOTER */}
      <footer className="bg-amber-50 border-t border-amber-200 mt-8 p-4 text-sm">
        <nav className="flex justify-center gap-4">
          <Link to="/guide" className="text-blue-600 hover:underline">
            {t("footer.guide")}
          </Link>
          <Link to="/faq" className="text-blue-600 hover:underline">
            {t("footer.faq")}
          </Link>
          <Link to="/privacy" className="text-blue-600 hover:underline">
            {t("footer.privacy")}
          </Link>
        </nav>
      </footer>
    </Router>
  );
}

