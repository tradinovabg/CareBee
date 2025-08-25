import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          today: "Today",
          calendar: {
            title: "Calendar",
            day: "Day",
            week: "Week",
            month: "Month",
            showVisits: "Visits & Events",
            showMeds: "Meds schedule",
            visit: "Visit",
            med: "Med",
            empty: "Nothing scheduled"
          }
        }
      }
    }
  });

export default i18n;
