import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => () => {
    i18n.changeLanguage(lng)
  }

  return (
    <div>
      <button onClick={changeLanguage('ru')}>RU</button>
      <button onClick={changeLanguage('en')}>EN</button>
      <button onClick={changeLanguage('fr')}>FR</button>
    </div>
  )
}
