import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SosModal from "../components/SosModal";
import { loadContacts } from "../lib/contacts";

export default function Home() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadContacts().then(setContacts);
  }, []);

  const send = () => {
    alert("SOS send placeholder");
    setOpen(false);
  };

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-6">
      {/* HERO */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 md:p-10 mb-6">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* LOGO */}
          <img
            src="/CareBee/carebee-logo.png"  // prod (Pages) — prefixed
            onError={(e) => { e.currentTarget.src = "/carebee-logo.png"; }} // dev preview
            alt={t("home.logoAlt", "CareBee logo")}
            className="w-40 h-40 md:w-56 md:h-56 rounded-full border-8 border-white shadow-xl object-contain bg-white"
            loading="lazy"
          />
          {/* TAGLINE */}
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
            {t("home.tagline", "CareBee — the caring bee, always by your side.")}
          </h1>
        </div>
      </section>

      {/* EXPLANATION */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">{t("home.aboutTitle", "CareBee")}</h2>
        <p className="text-slate-600">
          {t(
            "home.aboutText",
            "CareBee helps a family monitor a loved one's condition, quickly look for urgent help nearby, keep a calendar of events and visits, and manage the medication schedule. A helper for families who take care of elderly or ill relatives."
          )}
        </p>
      </section>

      {/* SOS BUTTON */}
      <button
        onClick={() => setOpen(true)}
        aria-label={t("home.openSos", "Open SOS")}
        className="fixed inset-x-0 bottom-6 z-50 mx-auto grid h-16 w-72 place-items-center rounded-2xl bg-red-600 text-2xl font-extrabold text-white shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)] ring-4 ring-red-300/50 hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-8 focus:ring-red-400/60"
      >
        {t("nav.sos", "SOS")}
      </button>

      {/* CARD LINKS */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        <CardLink
          to="/calendar"
          title={t("calendar.title", "Calendar")}
          text={t("home.cards.calendar.text", "Nothing scheduled — quick add your events and reminders.")}
        />
        <CardLink
          to="/visits"
          title={t("visits.title", "Visits")}
          text={t("home.cards.visits.text", "Plan and keep track of appointments.")}
        />
        <CardLink
          to="/meds"
          title={t("meds.title", "Meds")}
          text={t("home.cards.meds.text", "Comma-separated (e.g. 08:00, 20:00). Manage medication schedule.")}
        />
        <CardLink
          to="/vitals"
          title={t("vitals.title", "Vitals")}
          text={t("home.cards.vitals.text", "Record key health indicators.")}
        />
        <CardLink
          to="/nearby"
          title={t("nearby.title", "Nearby")}
          text={t("home.cards.nearby.text", "Data: OpenStreetMap/Overpass. Please search responsibly.")}
        />
        <CardLink
          to="/profile"
          title={t("profile.title", "Profile")}
          text={t("home.cards.profile.text", "Basic patient data and emergency info.")}
        />
      </section>
      <SosModal open={open} onClose={() => setOpen(false)} contacts={contacts} onSend={send} />
    </main>
  );
}

// Small card-link component
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
