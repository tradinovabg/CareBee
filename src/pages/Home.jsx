// src/pages/Home.jsx
import { useEffect, useRef, useState } from "react";

function HeroVideo() {
  const videoRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  const src = import.meta.env.BASE_URL + "video/hero.mp4";
  const poster = import.meta.env.BASE_URL + "carebee-logo.png";

  // автопауза, если вкладка не активна
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

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md">
      {!fallback ? (
        <>
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
          />
          {/* Лёгкое затемнение, чтобы титры были читабельны */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </>
      ) : (
        <div className="flex items-center justify-center bg-amber-100 py-10">
          <img src={poster} alt="CareBee" className="w-28 h-28 mr-4" />
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold">
              CareBee — заботливая пчёлка рядом с вами.
            </h1>
            <p className="text-sm opacity-80 mt-1">
              Помогает следить за здоровьем близких
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl w-full p-3 space-y-4">
      <HeroVideo />
      {/* ниже остаётся ваш текст и карточки */}
      {/* ... */}
    </main>
  );
}

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

      <SosModal
        open={open}
        onClose={() => setOpen(false)}
        contacts={contacts}
        onSend={onSend}
      />
    </main>
  );
}

function Hero() {
  const [error, setError] = useState(false);
  const src = import.meta.env.BASE_URL + "video/hero.mp4";
  const poster = import.meta.env.BASE_URL + "carebee-logo.png";

  if (error) {
    return (
      <div className="bg-amber-400 rounded-2xl p-6 text-center shadow-md">
        <img src={poster} alt="CareBee" className="mx-auto w-24 h-24 mb-4" />
        <h1 className="text-3xl font-bold">
          CareBee — заботливая пчёлка рядом с вами.
        </h1>
        <p className="mt-2 text-lg">Помогает следить за здоровьем близких</p>
      </div>
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      onError={() => setError(true)}
      className="w-full h-auto rounded-2xl shadow-md object-cover"
      src={src}
    />
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

