import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import fr from "./locales/fr.json";

const saved = localStorage.getItem("lng") || "en";

i18n.use(initReactI18next).init({
  lng: saved,
  fallbackLng: "en",
  supportedLngs: ["en", "ru", "fr"],
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    fr: { translation: fr },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
