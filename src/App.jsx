import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LanguageSwitcher from "./components/LanguageSwitcher";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Meds from "./pages/Meds";
import Visits from "./pages/Visits";
import Calendar from "./pages/Calendar";
import Vitals from "./pages/Vitals";
import Nearby from "./pages/Nearby";
import Contacts from "./pages/Contacts";
import Docs from "./pages/Docs";
import Guide from "./pages/Guide";
import Faq from "./pages/Faq";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

/** Простая страница SOS (смоук-кнопка) */
function SosPage() {
  const { t } = useTranslation();
  const click = () => alert("SOS sent (test) ✅");
  return (
    <main className="min-h-[70vh] grid place-items-center p-4">
      <button
        onClick={click}
        className="px-6 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 font-semibold"
      >
        {t("sos", "SOS")}
      </button>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        {/* Панель со сменой языка (если нужна) */}
        <div className="border-b border-slate-200">
          <div className="max-w-5xl mx-auto p-2">
            <LanguageSwitcher />
          </div>
        </div>

        <main className="flex-1 max-w-5xl mx-auto w-full p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/meds" element={<Meds />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/vitals" element={<Vitals />} />
            <Route path="/nearby" element={<Nearby />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/privacy" element={<Privacy />} />

            <Route path="/sos" element={<SosPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
