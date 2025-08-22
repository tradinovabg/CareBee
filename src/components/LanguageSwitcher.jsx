import { useTranslation } from 'react-i18next'
export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  return (
    <select onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
      <option value="en">EN</option>
      <option value="ru">RU</option>
      <option value="fr">FR</option>
    </select>
  )
}
