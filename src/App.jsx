import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Home from "./pages/Home";
import Meds from "./pages/Meds";
import Visits from "./pages/Visits";
import Calendar from "./pages/Calendar";
import Vitals from "./pages/Vitals";
import Nearby from "./pages/Nearby";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const BASENAME = import.meta.env.BASE_URL;

export default function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter basename={BASENAME}>
      <header className="header-bar hb-honey">
        <nav aria-label="Main">
          <ul>
            <li>
              <NavLink to="/" end>{t("nav.home", "Home")}</NavLink>
            </li>
            <li>
              <NavLink to="/meds">{t("nav.meds", "Meds")}</NavLink>
            </li>
            <li>
              <NavLink to="/visits">{t("nav.visits", "Visits")}</NavLink>
            </li>
            <li>
              <NavLink to="/calendar">{t("nav.calendar", "Calendar")}</NavLink>
            </li>
            <li>
              <NavLink to="/vitals">{t("nav.vitals", "Vitals")}</NavLink>
            </li>
            <li>
              <NavLink to="/nearby">{t("nav.nearby", "Nearby")}</NavLink>
            </li>
            <li>
              <NavLink to="/profile">{t("nav.profile", "Profile")}</NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meds" element={<Meds />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/vitals" element={<Vitals />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
