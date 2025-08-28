import { useTranslation } from "react-i18next";

const COPY = {
  en: {
    title: "Privacy Policy",
    sections: [
      { h: "Data you provide", p: "Information is entered manually and stays only in your browser." },
      { h: "Use of data", p: "Data is used solely to display information within the app." },
      { h: "Removal", p: "Clear your browser storage to remove all saved data." },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    sections: [
      { h: "Вводимые данные", p: "Информация вводится вручную и остаётся только в вашем браузере." },
      { h: "Использование", p: "Данные используются только для отображения внутри приложения." },
      { h: "Удаление", p: "Очистите хранилище браузера, чтобы удалить все сохранённые данные." },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    sections: [
      { h: "Données fournies", p: "Les informations sont saisies manuellement et restent dans votre navigateur." },
      { h: "Utilisation", p: "Les données sont utilisées uniquement pour l’affichage dans l’application." },
      { h: "Suppression", p: "Effacez le stockage de votre navigateur pour supprimer toutes les données." },
    ],
  },
};

export default function Privacy() {
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

