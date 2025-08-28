import { useTranslation } from "react-i18next";

const COPY = {
  en: {
    title: "Frequently Asked Questions",
    items: [
      { q: "What is CareBee?", a: "CareBee is a simple helper for coordinating care." },
      { q: "Where is my data stored?", a: "All information stays on your device." },
      { q: "How to send an SOS?", a: "Press the red SOS button on the home screen and follow the steps." },
    ],
  },
  ru: {
    title: "Частые вопросы",
    items: [
      { q: "Что такое CareBee?", a: "CareBee — простой помощник для координации ухода." },
      { q: "Где хранятся мои данные?", a: "Вся информация остаётся на вашем устройстве." },
      { q: "Как отправить SOS?", a: "Нажмите красную кнопку SOS на главной странице и следуйте шагам." },
    ],
  },
  fr: {
    title: "Questions fréquentes",
    items: [
      { q: "Qu’est-ce que CareBee ?", a: "CareBee est un outil simple pour coordonner les soins." },
      { q: "Où sont stockées mes données ?", a: "Toutes les informations restent sur votre appareil." },
      { q: "Comment envoyer un SOS ?", a: "Appuyez sur le bouton SOS rouge sur l’accueil et suivez les étapes." },
    ],
  },
};

export default function Faq() {
  const { i18n } = useTranslation();
  const L = COPY[i18n.language] || COPY.en;
  return (
    <main className="mx-auto max-w-5xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">{L.title}</h1>
      {L.items.map((s, i) => (
        <section key={i}>
          <h2 className="text-lg font-semibold">{s.q}</h2>
          <p className="text-slate-700">{s.a}</p>
        </section>
      ))}
    </main>
  );
}

