import { useTranslation } from "react-i18next";

const COPY = {
  en: {
    title: "How to use CareBee",
    sections: [
      { h: "Purpose", p: "CareBee helps families coordinate care and keep essential health information." },
      { h: "SOS", p: "Use the red SOS button on the home screen to quickly alert selected contacts." },
      { h: "Data & privacy", p: "All data is stored locally in your browser and can be cleared at any time." },
    ],
  },
  ru: {
    title: "Как пользоваться CareBee",
    sections: [
      { h: "Назначение", p: "CareBee помогает семьям координировать уход и хранить важные данные." },
      { h: "SOS", p: "Используйте красную кнопку SOS на главной странице для быстрого оповещения контактов." },
      { h: "Данные и конфиденциальность", p: "Все данные хранятся локально в браузере и могут быть удалены." },
    ],
  },
  fr: {
    title: "Mode d’emploi de CareBee",
    sections: [
      { h: "Objet", p: "CareBee aide les familles à coordonner les soins et à conserver les informations essentielles." },
      { h: "SOS", p: "Utilisez le bouton SOS rouge sur l’accueil pour alerter rapidement les contacts sélectionnés." },
      { h: "Données & confidentialité", p: "Toutes les données sont stockées localement dans votre navigateur et peuvent être effacées." },
    ],
  },
};

export default function Guide() {
  const { i18n } = useTranslation();
  const L = COPY[i18n.language] || COPY.en;
  return (
    <main className="mx-auto max-w-5xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">{L.title}</h1>
      {L.sections.map((s, i) => (
        <section key={i}>
          <h2 className="text-lg font-semibold">{s.h}</h2>
          <p className="text-slate-700">{s.p}</p>
        </section>
      ))}
    </main>
  );
}

