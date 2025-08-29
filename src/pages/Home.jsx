// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function HeroVideo() {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  const src = import.meta.env.BASE_URL + "video/hero.mp4";
  const poster = import.meta.env.BASE_URL + "carebee-logo.png";

  // Уважение prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Автопауза, если вкладка не активна
  useEffect(() => {
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.visibilityState !== "visible") v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Если reduce-motion — сразу показываем запасной вариант
  useEffect(() => {
    if (prefersReducedMotion) setFallback(true);
  }, [prefersReducedMotion]);

  if (fallback) {
    return (
      <div className="rounded-2xl bg-amber-100 p-8 text-center shadow-md">
        <div className="flex items-center justify-center gap-4">
          <img
            src={poster}
            alt="CareBee"
            className="w-28 h-28 md:w-32 md:h-32 drop-shadow"
          />
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold">
              {t("home.title", {
                defaultValue: "CareBee — заботливая пчёлка рядом с вами.",
              })}
            </h1>
            <p className="text-sm md:text-base opacity-80 mt-1">
              {t("home.subtitle", {
                defaultValue: "Помогает следить за здоровьем близких",
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md">
      <video
        ref={videoRef}
        className="w-full h-auto object-cover"
        autoPlay
        muted
        loop
        playsInline
        src={src}
        poster={poster}
        onError={() => setFallback(true)}
      >
        {/* Fallback для очень старых браузеров */}
        <img
          src={poster}
          alt="CareBee"
          className="w-full h-auto object-cover"
        />
      </video>
      {/* Лёгкое затемнение, чтобы текст на ролике читался (если будет нужен) */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
}

function HomeCard({ to, title, desc, className }) {
  return (
    <NavLink
      to={to}
      className={`block rounded-xl border shadow-sm hover:shadow transition bg-white ${className}`}
    >
      <div className="p-4">
        <div className="font-semibold mb-1">{title}</div>
        <div className="text-sm opacity-80">{desc}</div>
      </div>
    </NavLink>
  );
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-6xl w-full p-3 space-y-4">
      {/* HERO */}
      <HeroVideo />

      {/* Лид */}
      <section className="rounded-2xl bg-white shadow-sm border p-4">
        <p className="text-sm md:text-base opacity-90">
          {t("home.lead", {
            defaultValue:
              "CareBee помогает семье следить за состоянием близкого, искать помощь поблизости, вести календарь событий и приёмов, управлять лекарствами.",
          })}
        </p>
      </section>

      {/* Карточки */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <HomeCard
          to="/calendar"
          title={t("nav.calendar", { defaultValue: "Календарь" })}
          desc={t("home.calendar.desc", {
            defaultValue: "Быстро добавляйте и смотрите расписание.",
          })}
          className="border-blue-100 bg-blue-50"
        />
        <HomeCard
          to="/visits"
          title={t("nav.visits", { defaultValue: "Визиты" })}
          desc={t("home.visits.desc", {
            defaultValue: "Планируйте и отслеживайте приёмы.",
          })}
          className="border-violet-100 bg-violet-50"
        />
        <HomeCard
          to="/meds"
          title={t("nav.meds", { defaultValue: "Лекарства" })}
          desc={t("home.meds.desc", {
            defaultValue: "Управляйте приёмом лекарств.",
          })}
          className="border-emerald-100 bg-emerald-50"
        />
        <HomeCard
          to="/vitals"
          title={t("nav.vitals", { defaultValue: "Показатели" })}
          desc={t("home.vitals.desc", {
            defaultValue: "Записывайте основные показатели здоровья.",
          })}
          className="border-amber-100 bg-amber-50"
        />
        <HomeCard
          to="/nearby"
          title={t("nav.nearby", { defaultValue: "Рядом" })}
          desc={t("home.nearby.desc", {
            defaultValue:
              "Ищите помощь поблизости (OpenStreetMap/Overpass).",
          })}
          className="border-rose-100 bg-rose-50"
        />
        <HomeCard
          to="/profile"
          title={t("nav.profile", { defaultValue: "Профиль" })}
          desc={t("home.profile.desc", {
            defaultValue:
              "Основные данные и информация для экстренных случаев.",
          })}
          className="border-fuchsia-100 bg-fuchsia-50"
        />
      </section>

      {/* SOS */}
      <section className="pt-4 pb-12">
        <NavLink
          to="/sos"
          className="mx-auto block w-full max-w-md rounded-xl bg-red-600 text-white text-2xl font-bold py-5 text-center shadow hover:bg-red-700"
          aria-label="SOS"
        >
          SOS
        </NavLink>
      </section>
    </main>
  );
}
