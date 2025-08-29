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

// src/App.jsx (фрагмент)
export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header / Navigation */}
      <Header />

      {/* Контент растягивается, футер прижат к низу */}
      <div className="flex-1">
        <RouterProvider router={router} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

