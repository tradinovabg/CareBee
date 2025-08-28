<div className="relative rounded-xl overflow-hidden">
  <video
    className="w-full h-auto"
    autoPlay
    muted
    loop
    playsInline
    aria-hidden="true"
    role="presentation"
  >
    <source src="/hero.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white text-center p-4">
    <img src="/carebee-logo.png" alt="CareBee" className="w-24 h-24 mb-4" />
    <h1 className="text-3xl font-bold">CareBee — заботливая пчёлка рядом с вами.</h1>
    <p className="mt-2 text-lg">Помогает следить за здоровьем близких</p>
    <p className="sr-only">Background video playing</p>
  </div>
</div>

import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SosModal from "../components/SosModal";
import { loadContacts } from "../lib/contactsStore";

const COLORS = {
  calendar: "bg-sky-50 border-sky-200 hover:bg-sky-100",
  visits: "bg-violet-50 border-violet-200 hover:bg-violet-100",
  meds: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
  vitals: "bg-amber-50 border-amber-200 hover:bg-amber-100",
  nearby: "bg-rose-50 border-rose-200 hover:bg-rose-100",
  profile: "bg-fuchsia-50 border-fuchsia-200 hover:bg-fuchsia-100",
};

export default function Home() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const contacts = loadContacts();

  const onSend = ({ message, channels, recipients }) => {
    // TODO: заменить на Edge Function. Пока: демонстрация.
    alert(
      `Sending SOS:\n${message}\n\nVia: ${
        Object.entries(channels).filter(([,v])=>v).map(([k])=>k).join(", ")
      }\nTo: ${recipients.map(r=>r.name).join(", ")}`
    );
    setOpen(false);
  };

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-6 pb-28">
      {/* HERO */}
      <section className="rounded-2xl border border-amber-300 bg-amber-100/80 p-6 md:p-10 mb-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src="/CareBee/carebee-logo.png"
            onError={(e) => {
              e.currentTarget.src = "/carebee-logo.png";
            }}
            alt="CareBee logo"
            className="w-40 h-40 md:w-56 md:h-56 rounded-full border-8 border-white shadow-xl bg-white object-contain"
            loading="lazy"
          />
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
            {t("app.title")}
          </h1>
        </div>
      </section>

      {/* Пояснение */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 mb-6">
        <p className="text-slate-700">{t("app.blurb")}</p>
      </section>

      {/* Карточки-линки */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        <Card
          to="/calendar"
          title={t("home.cards.calendar.title")}
          text={t("home.cards.calendar.text")}
          color={COLORS.calendar}
        />
        <Card
          to="/visits"
          title={t("home.cards.visits.title")}
          text={t("home.cards.visits.text")}
          color={COLORS.visits}
        />
        <Card
          to="/meds"
          title={t("home.cards.meds.title")}
          text={t("home.cards.meds.text")}
          color={COLORS.meds}
        />
        <Card
          to="/vitals"
          title={t("home.cards.vitals.title")}
          text={t("home.cards.vitals.text")}
          color={COLORS.vitals}
        />
        <Card
          to="/nearby"
          title={t("home.cards.nearby.title")}
          text={t("home.cards.nearby.text")}
          color={COLORS.nearby}
        />
        <Card
          to="/profile"
          title={t("home.cards.profile.title")}
          text={t("home.cards.profile.text")}
          color={COLORS.profile}
        />
      </section>

      {/* Липкий низ с большой кнопкой SOS */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-30">
        <button
          onClick={() => setOpen(true)}
          style={{ width: "22rem", height: "5rem" }}
          className="pointer-events-auto rounded-2xl bg-red-600 text-white text-3xl font-extrabold
                     shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)] ring-4 ring-red-300/50
                     hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-8 focus:ring-red-400/60"
        >
          {t("home.sos")}
        </button>
      </div>

      <SosModal open={open} onClose={() => setOpen(false)} contacts={contacts} onSend={onSend} />
    </main>
  );
}

function Card({ to, title, text, color }) {
  return (
    <Link to={to} className={`block rounded-xl border p-4 transition ${color}`}>
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm text-slate-700">{text}</div>
    </Link>
  );
}

