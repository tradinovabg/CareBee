import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();
  const logo = import.meta.env.BASE_URL + "carebee-logo.png";

  return (
    <div className="container space-y-6">
      {/* HERO: только лого и слоган */}
      <section className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-10 md:px-10 md:py-14 text-center">
        <img src={logo} alt="CareBee" className="mx-auto w-40 md:w-56 drop-shadow" />
        <h1 className="mt-4 text-2xl md:text-4xl font-bold text-slate-800">
          {t("home.slogan","CareBee — the caring bee, always by your side.")}
        </h1>
      </section>

      {/* Пояснение */}
      <section className="card">
        <div className="card-title">{t("app.title","CareBee")}</div>
        <p className="text-slate-700 leading-relaxed">
          {t("home.pitch",
            "CareBee helps a family monitor a loved one's condition, quickly look for urgent help nearby, keep a calendar of events and visits, and manage the medication schedule. A helper for families who take care of elderly or ill relatives.")}
        </p>
      </section>

      {/* Огромная кнопка SOS — отдельно от остальных */}
      <div className="text-center">
        <Link to="/sos" className="btn-sos">🆘 SOS</Link>
      </div>

      {/* Сетка «крупных» кнопок-навигации */}
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/calendar" className="card hover:shadow-md transition">
          <div className="card-title">{t("nav.calendar","Calendar")}</div>
          <p className="text-sm text-slate-600">
            {t("calendar.empty","Nothing scheduled")} — {t("calendar.quick","Quick add")} прямо из календаря.
          </p>
        </Link>
        <Link to="/visits" className="card hover:shadow-md transition">
          <div className="card-title">{t("nav.visits","Visits")}</div>
          <p className="text-sm text-slate-600">{t("visits.hint","Plan and keep track of appointments.")}</p>
        </Link>
        <Link to="/meds" className="card hover:shadow-md transition">
          <div className="card-title">{t("nav.meds","Meds")}</div>
          <p className="text-sm text-slate-600">{t("meds.hint_times","Comma-separated (e.g. 08:00, 20:00)")}</p>
        </Link>
        <Link to="/vitals" className="card hover:shadow-md transition">
          <div className="card-title">{t("nav.vitals","Vitals")}</div>
          <p className="text-sm text-slate-600">{t("vitals.hint","Record key health indicators.")}</p>
        </Link>
        <Link to="/nearby" className="card hover:shadow-md transition">
          <div className="card-title">{t("nav.nearby","Nearby")}</div>
          <p className="text-sm text-slate-600">{t("nearby.info","Data: OpenStreetMap/Overpass. Please search responsibly.")}</p>
        </Link>
        <Link to="/profile" className="card hover:shadow-md transition">
          <div className="card-title">{t("nav.profile","Profile")}</div>
          <p className="text-sm text-slate-600">{t("profile.hint","Basic patient data and emergency info.")}</p>
        </Link>
      </section>
    </div>
  );
}
