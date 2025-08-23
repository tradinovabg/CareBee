import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'

export default function QrCard() {
  const { t } = useTranslation()
  const text = t('tagline', 'Quick help at your fingertips.')
  return (
    <div className="card" style={{textAlign:'center', padding:16, marginTop:16}}>
      <QRCodeSVG value={text} size={180} />
      <div style={{marginTop:8}}>{text}</div>
    </div>
  )
}
