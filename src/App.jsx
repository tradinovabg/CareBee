cat > src/App.jsx <<'EOF'
import React from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "./i18n.js";

// странички (имена и регистр — как в файловой системе!)
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Meds from "./pages/Meds.jsx";
import Visits from "./pages/Visits.jsx";
import Calendar from "./pages/Calendar.jsx";
import QR from "./pages/QR.jsx";
import Vitals from "./pages/Vitals.jsx";
import Nearby from "./pages/Nearby.jsx";

function LangSwitcher() {
  return (
    <select
      value={i18n.language}
      onChange={(e) => {
        i18n.changeLanguage(e.target.value);
        localStorage.setItem("lng", e.target.value);
      }}
      className="border rounded px-2 py-1"
    >
      <option value="en">EN</option>
      <option value="ru">RU</option>
      <option value="fr">FR</option>
    </select>
  );
}

function Header() {
  const { t } = useTranslation();
  return (
    <nav className="header-bar container">
      <Link to="/profile">{t("nav.profile", "Profile")}</Link>
      <Link to="/meds">{t("nav.meds", "Meds")}</Link>
      <Link to="/visits">{t("nav.visits", "Visits")}</Link>
      <Link to="/calendar">{t("nav.calendar", "Calendar")}</Link>
      <Link to="/qr">{t("nav.qr", "QR")}</Link>
      <Link to="/vitals">{t("nav.vitals", "Vitals")}</Link>
      <Link to="/nearby">{t("nav.nearby", "Nearby")}</Link>
      <LangSwitcher />
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          {/* главная — пусть ведёт на Home; если хочешь Profile по умолчанию, поменяй элемент */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/meds" element={<Meds />} />
          <Route path="/visits" element={<Visits />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/qr" element={<QR />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/nearby" element={<Nearby />} />

          {/* если путь не найден — на главную */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="container" style={{ marginTop: 24, color: "#666" }}>
        © 2025 CareBee
      </footer>
    </>
  );
}
EOF
