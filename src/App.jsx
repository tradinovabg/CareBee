import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Meds from "./pages/Meds.jsx";
import Visits from "./pages/Visits.jsx";
import Calendar from "./pages/Calendar.jsx";
import Vitals from "./pages/Vitals.jsx";
import Nearby from "./pages/Nearby.jsx";

export default function App() {
  const { t, i18n } = useTranslation();
  const changeLang = (e) => i18n.changeLanguage(e.target.value);

  return (
    <>
      <header className="header-bar hb-honey">
        <div className="flex items-center gap-3 flex-1">
          <NavLink to="/" className="font-semibold text-slate-800">
            {t("app.title","CareBee")}
          </NavLink>

        </div>

        <nav className="flex-1">
          <NavLink to="/" end>{t("nav.profile","Home")}</NavLink>
          <NavLink to="/profile">{t("nav.profile","Profile")}</NavLink>
          <NavLink to="/meds">{t("nav.meds","Meds")}</NavLink>
          <NavLink to="/visits">{t("nav.visits","Visits")}</NavLink>
          <NavLink to="/calendar">{t("nav.calendar","Calendar")}</NavLink>
          <NavLink to="/vitals">{t("nav.vitals","Vitals")}</NavLink>
          <NavLink to="/nearby">{t("nav.nearby","Nearby")}</NavLink>
        </nav>

        <select
          value={i18n.language}
          onChange={changeLang}
          className="input w-24"
          aria-label="Language"
        >
          <option value="en">EN</option>
          <option value="ru">RU</option>
          <option value="fr">FR</option>
        </select>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/meds" element={<Meds />} />
          <Route path="/visits" element={<Visits />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/nearby" element={<Nearby />} />
        </Routes>
      </main>
    </>
  );
}
