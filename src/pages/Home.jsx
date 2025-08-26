import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="container">
      {/* Hero */}
      <section className="card border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="/carebee-logo.png"
            alt="CareBee"
            className="w-40 md:w-56 drop-shadow"
            loading="eager"
          />
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              {t("app.title","CareBee")}
            </h1>
            <p className="mt-2 text-slate-600">
              {t("app.tagline","Your friendly health companion")}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/calendar" className="btn btn-primary">{t("nav.calendar","Calendar")}</Link>
              <Link to="/visits" className="btn">{t("nav.visits","Visits")}</Link>
              <Link to="/meds" className="btn">{t("nav.meds","Meds")}</Link>
              <Link to="/vitals" className="btn">{t("nav.vitals","Vitals")}</Link>
              <Link to="/profile" className="btn">{t("nav.profile","Profile")}</Link>
              <Link to="/nearby" className="btn">{t("nav.nearby","Nearby")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Быстрые подсказки/дальше можно добавить карточки */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card">
          <div className="card-title">{t("nav.calendar","Calendar")}</div>
          <p className="text-sm text-slate-600">
            {t("calendar.empty","Nothing scheduled")} — {t("calendar.quick","Quick add")} прямо из календаря.
          </p>
        </div>
        <div className="card">
          <div className="card-title">{t("nav.meds","Meds")}</div>
          <p className="text-sm text-slate-600">
            {t("meds.hint_times","Comma-separated (e.g. 08:00, 20:00)")}
          </p>
        </div>
        <div className="card">
          <div className="card-title">{t("nav.profile","Profile")}</div>
          <p className="text-sm text-slate-600">
            {t("profile.saved","Profile saved")}
          </p>
        </div>
      </div>
    </div>
  );
}
