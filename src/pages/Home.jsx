// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-4 md:p-6">
      {/* HERO */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 md:p-10 mb-6">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* ЛОГО */}
          <img
            src="/CareBee/carebee-logo.png"  // прод (Pages) — под префиксом
            onError={(e) => { e.currentTarget.src = "/carebee-logo.png"; }} // dev превью
            alt="CareBee logo"
            className="w-40 h-40 md:w-56 md:h-56 rounded-full border-8 border-white shadow-xl object-contain bg-white"
            loading="lazy"
          />
          {/* СЛОГАН */}
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
            CareBee — the caring bee, always by your side.
          </h1>
        </div>
      </section>

      {/* ПОЯСНЕНИЕ */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">CareBee</h2>
        <p className="text-slate-600">
          CareBee helps a family monitor a loved one's condition, quickly look for urgent help nearby,
          keep a calendar of events and visits, and manage the medication schedule.
          A helper for families who take care of elderly or ill relatives.
        </p>
      </section>

      {/* SOS БОЛЬШАЯ */}
      <div className="grid place-items-center my-4">
        <Link
          to="/sos"
          aria-label="Open SOS"
          style={{ width: "18rem", height: "18rem" }}
          className="grid place-items-center rounded-full bg-red-600 text-white text-5xl font-extrabold
                     shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)] ring-4 ring-red-300/50
                     hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-8
                     focus:ring-red-400/60 select-none"
        >
          SOS
        </Link>
      </div>

      {/* КАРТОЧКИ-ЛИНКИ */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        <CardLink to="/calendar" title="Calendar"
          text="Nothing scheduled — quick add your events and reminders." />
        <CardLink to="/visits" title="Visits"
          text="Plan and keep track of appointments." />
        <CardLink to="/meds" title="Meds"
          text="Comma-separated (e.g. 08:00, 20:00). Manage medication schedule." />
        <CardLink to="/vitals" title="Vitals"
          text="Record key health indicators." />
        <CardLink to="/nearby" title="Nearby"
          text="Data: OpenStreetMap/Overpass. Please search responsibly." />
        <CardLink to="/profile" title="Profile"
          text="Basic patient data and emergency info." />
      </section>
    </main>
  );
}

// Небольшой компонент карточки-ссылки
function CardLink({ to, title, text }) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition"
    >
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm text-slate-600">{text}</div>
    </Link>
  );
}
