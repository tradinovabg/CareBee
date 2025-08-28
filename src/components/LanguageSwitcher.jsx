import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2)

  const changeLanguage = (e) => {
    const lang = e.target.value
    i18n.changeLanguage(lang)
    localStorage.setItem('lng', lang)
  }

  return (
    <select
      className="select select-bordered"
      value={current}
      onChange={changeLanguage}
    >
      <option value="en">EN</option>
      <option value="ru">RU</option>
      <option value="fr">FR</option>
    </select>
  )
}
