import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="ml-auto shrink-0">
      <select
        aria-label="Language"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="w-20 h-8 rounded border border-slate-300 bg-white px-2 text-xs
                   leading-none focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="en">EN</option>
        <option value="ru">RU</option>
        <option value="fr">FR</option>
      </select>
    </div>
  );
}
