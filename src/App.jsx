import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Profile from "./pages/Profile.jsx";
import Meds from "./pages/Meds.jsx";
import Visits from "./pages/Visits.jsx";
import Calendar from "./pages/Calendar.jsx";
import Vitals from "./pages/Vitals.jsx";
import Nearby from "./pages/Nearby.jsx";

export default function App() {
  const { t, i18n } = useTranslation();
  const changeLang = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };
  const lng = i18n.resolvedLanguage || i18n.language || "en";

  return (
    <>
      <header className="header-bar">
        <div className="inner">
          <Link to="/calendar" className="font-semibold text-xl text-slate-900">
            {t("app.title", "CareBee")}
          </Link>

          <nav className="flex gap-4 flex-wrap">
            <Link to="/profile">{t("nav.profile","Profile")}</Link>
            <Link to="/meds">{t("nav.meds","Meds")}</Link>
            <Link to="/visits">{t("nav.visits","Visits")}</Link>
            <Link to="/calendar">{t("nav.calendar","Calendar")}</Link>
            <Link to="/vitals">{t("nav.vitals","Vitals")}</Link>
            <Link to="/nearby">{t("nav.nearby","Nearby")}</Link>
          </nav>

          <select value={lng} onChange={changeLang}
                  className="ml-auto select w-auto">
            <option value="en">EN</option>
            <option value="ru">RU</option>
            <option value="fr">FR</option>
          </select>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/meds" element={<Meds />} />
          <Route path="/visits" element={<Visits />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="*" element={<Navigate to="/calendar" replace />} />
        </Routes>
      </main>
    </>
  );
}
