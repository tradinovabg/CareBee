import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SosModal from "../components/SosModal";
import { loadContacts } from "../lib/contactsStore";

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
      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 md:p-10 mb-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src="/CareBee/carebee-logo.png"
            onError={(e) => { e.currentTarget.src = "/carebee-logo.png"; }}
            alt="CareBee logo"
            className="w-40 h-40 md:w-56 md:h-56 rounded-full border-8 border-white shadow-xl bg-white object-contain"
            loading="lazy"
          />
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
            CareBee — the caring bee, always by your side.
          </h1>
        </div>
      </section>

      {/* Пояснение */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">CareBee</h2>
        <p className="text-slate-700">
          CareBee helps a family monitor a loved one's condition, quickly look for urgent help nearby,
          keep a calendar of events and visits, and manage the medication schedule.
          A helper for families who take care of elderly or ill relatives.
        </p>
      </section>

      {/* Карточки-линки */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        <Card to="/calendar" title="Calendar" text="Quickly add or see your schedule." />
        <Card to="/visits" title="Visits" text="Plan and track appointments." />
        <Card to="/meds" title="Meds" text="Manage medication schedule." />
        <Card to="/vitals" title="Vitals" text="Record key health indicators." />
        <Card to="/nearby" title="Nearby" text="Search responsibly (OpenStreetMap/Overpass)." />
        <Card to="/profile" title="Profile" text="Basic patient data and emergency info." />
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

function Card({ to, title, text }) {
  return (
    <Link to={to} className="block rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition">
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm text-slate-600">{text}</div>
    </Link>
  );
}

