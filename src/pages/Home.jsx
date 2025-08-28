import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  const cards = [
    { to: "/calendar", label: t("nav.calendar", "Calendar") },
    { to: "/visits", label: t("nav.visits", "Visits") },
    { to: "/meds", label: t("nav.meds", "Meds") },
    { to: "/vitals", label: t("nav.vitals", "Vitals") },
    { to: "/nearby", label: t("nav.nearby", "Nearby") },
    { to: "/profile", label: t("nav.profile", "Profile") },
  ];

  return (
    <div className="container grid gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">CareBee</h1>
        <p className="text-slate-600">Welcome!</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="card text-center">
            <div className="card-title">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
