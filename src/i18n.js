import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import fr from "./locales/fr.json";

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  fr: { translation: fr },
};

const savedLang = localStorage.getItem("lang") || "en";

const updateHtmlLang = (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
  localStorage.setItem("lang", lng);
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: "en",
  supportedLngs: ["en", "ru", "fr"],
  interpolation: { escapeValue: false },
});

updateHtmlLang(i18n.language);

i18n.on("languageChanged", updateHtmlLang);

export default i18n;
