// src/pages/Home.jsx
<div style={{display:'none'}}>HOME_DBG</div>
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      {/* HERO */}
      <section className="rounded-3xl border bg-amber-50 p-6 sm:p-10 text-center shadow-sm">
        <img
          src="logo.png"
          alt="CareBee"
          className="mx-auto mb-6 h-40 w-40 object-contain"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          CareBee — the caring bee, always by your side.
        </h1>
      </section>

      {/* Описание */}
      <section className="mt-6 rounded-3xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold mb-1">CareBee</h2>
        <p className="text-neutral-700">
          CareBee помогает семье быстро искать помощь рядом, вести календарь визитов и
          управлять расписанием лекарств.
        </p>
      </section>

      {/* БОЛЬШАЯ SOS-КНОПКА ПРЯМО НА HOME */}
      <div className="my-8 grid place-items-center">
        <Link
          to="/sos"
          aria-label="Open SOS"
          style={{ width: "18rem", height: "18rem" }}   // размеры фиксированы, всегда БОЛЬШАЯ
          className="
            grid place-items-center
            rounded-full bg-red-600 text-white text-5xl font-extrabold
            shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)]
            ring-4 ring-red-300/50 hover:bg-red-700 active:scale-95
            focus:outline-none focus:ring-8 focus:ring-red-400/60
            select-none
          "
        >
          SOS
        </Link>
        <p className="mt-3 text-xs text-neutral-500">
          Нажмите, чтобы открыть страницу рассылки оповещений.
        </p>
      </div>

      {/* Карточки переходов */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Calendar" to="/calendar" text="Быстро добавляйте события." />
        <Card title="Visits" to="/visits" text="Планируйте приёмы." />
        <Card title="Meds" to="/meds" text="Список лекарств и время." />
        <Card title="Vitals" to="/vitals" text="Показатели здоровья." />
        <Card title="Nearby" to="/nearby" text="Поиск помощи рядом (OSM)." />
        <Card title="Profile" to="/profile" text="Данные пациента и экстр. инфо." />
      </section>
    </main>
  );
}

function Card({ title, text, to }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
    >
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm text-neutral-600">{text}</div>
    </Link>
  );
}
