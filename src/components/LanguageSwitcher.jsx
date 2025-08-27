import { useTranslation } from 'react-i18next'
export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = (i18n.resolvedLanguage || i18n.language || 'en').slice(0,2)
  return (
    <select
      value={current}
      onChange={(e) => {
        const newLang = e.target.value
        i18n.changeLanguage(newLang)
        localStorage.setItem("lng", newLang)
      }}
    >
      <option value="en">EN</option>
      <option value="ru">RU</option>
      <option value="fr">FR</option>
    </select>
  )
}
