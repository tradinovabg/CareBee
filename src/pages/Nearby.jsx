import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { haversineKm, overpassAround, geocodeAddress, fetchNearbyPharmacies } from '../lib/geo'

const KM = m => (m/1000).toFixed(2)

export default function Nearby(){
  const { t, i18n } = useTranslation()
  const [loc, setLoc] = useState({ status:'getting', lat:null, lon:null })
  const [addr, setAddr] = useState('')
  const [radiusKm, setRadiusKm] = useState(1.5)
  const [tab, setTab] = useState('pharm') // pharm | spec
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(()=>{
    if (!('geolocation' in navigator)) { setLoc({ status:'denied' }); return }
    navigator.geolocation.getCurrentPosition(
      (p)=> setLoc({ status:'done', lat:p.coords.latitude, lon:p.coords.longitude }),
      ()=> setLoc({ status:'denied' })
    )
  }, [])

  const center = useMemo(()=> loc.lat && loc.lon ? ({lat:loc.lat, lon:loc.lon}) : null, [loc])

  const runSearch = async () => {
    setErr(''); setLoading(true); try{
      let origin = center
      if (!origin && addr.trim()){
        origin = await geocodeAddress(addr.trim(), i18n.resolvedLanguage || i18n.language || 'en')
      }
      if (!origin) { setErr(t('nearby.geolocDenied')); setItems([]); return }
      const radius = parseFloat(radiusKm)
      const blocks = tab==='pharm'
        ? null
        : [
            '["amenity"="doctors"]',
            '["healthcare"~"clinic|physiotherapist|rehabilitation|speech_therapist|occupational_therapist"]'
          ]
      const raw = tab==='pharm'
        ? await fetchNearbyPharmacies(origin.lat, origin.lon, radius)
        : await overpassAround(origin.lat, origin.lon, radius, blocks)
      const enriched = raw.map(o=>{
        const km = origin ? haversineKm(origin, {lat:o.lat, lon:o.lon}) : null
        const name = o.tags.name || (tab==='pharm' ? 'Pharmacy' : 'Medical')
        const addr = [o.tags['addr:street'], o.tags['addr:housenumber'], o.tags['addr:city']].filter(Boolean).join(' ')
        const phone = o.tags.phone || o.tags['contact:phone']
        const oh = o.tags.opening_hours
        return { ...o, name, addr, phone, oh, distKm: km }
      }).sort((a,b)=>(a.distKm ?? 1e9) - (b.distKm ?? 1e9))
      setItems(enriched)
    }catch(e){
      setErr(e.message==='not_found' ? t('nearby.geocodingError') : e.message)
      setItems([])
    }finally{
      setLoading(false)
    }
  }

  const mapsLink = (it) => `https://www.google.com/maps/search/?api=1&query=${it.lat},${it.lon}`
  const osmLink = (it) => `https://www.openstreetmap.org/?mlat=${it.lat}&mlon=${it.lon}#map=18/${it.lat}/${it.lon}`

  return (
    <div className="container" style={{maxWidth:860, margin:'0 auto', padding:'1rem'}}>
      <h1 className="h1">{t('nearby.title','Nearby')}</h1>

      <div className="card">
        <div className="row" style={{justifyContent:'space-between'}}>
          <div className="row">
            <button className="btn btn-outline" onClick={()=>setTab('pharm')} aria-pressed={tab==='pharm'}>{t('nearby.tabPharmacies')}</button>
            <button className="btn btn-outline" onClick={()=>setTab('spec')} aria-pressed={tab==='spec'}>{t('nearby.tabSpecialists')}</button>
          </div>
          <div className="row">
            <label className="field" style={{minWidth:160}}>
              <span>{t('nearby.radius')} (km)</span>
              <input type="number" min="0.2" step="0.1" value={radiusKm} onChange={e=>setRadiusKm(parseFloat(e.target.value||'1.5'))}/>
            </label>
            <button className="btn btn-primary" onClick={runSearch}>{t('nearby.load','Load')}</button>
          </div>
        </div>

        <div className="row">
          <button className="btn btn-outline" onClick={()=>setLoc({ ...loc, status:'done' })} disabled={loc.status==='done'}>
            {t('nearby.useMyLocation')}
          </button>
          <div className="field" style={{flex:1}}>
            <label>{t('nearby.searchAddress')}</label>
            <input placeholder={t('nearby.addressPlaceholder')} value={addr} onChange={e=>setAddr(e.target.value)} />
          </div>
        </div>

        {loc.status==='denied' && <p role="status">{t('nearby.geolocDenied')}</p>}
        {loading && <p aria-live="polite">{t('nearby.loading')}</p>}
        {err && <p role="alert">{err}</p>}
      </div>

      {/* Баннер 3237 */}
      {tab==='pharm' && (
        <div className="card">
          <div className="row" style={{justifyContent:'space-between'}}>
            <div>{t('nearby.guardPharmacy')} <strong>3237</strong></div>
            <div className="row">
              <a className="btn btn-outline" href="tel:3237">{t('nearby.call3237')}</a>
              <a className="btn btn-outline" href="https://www.3237.fr" target="_blank" rel="noreferrer">{t('nearby.website')}</a>
            </div>
          </div>
        </div>
      )}

      {/* Результаты */}
      <ul>
        {(!loading && items.length===0 && !err) && <li>{t('nearby.nothing')}</li>}
        {items.map(it=>(
          <li key={it.id} className="card">
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>
                <div><strong>{it.name}</strong> {it.distKm!=null ? `• ${t('nearby.distance',{km:KM(it.distKm*1000)})}` : ''}</div>
                {it.addr && <div>{it.addr}</div>}
                {it.oh && <div><em>{t('nearby.hours')}:</em> {it.oh}</div>}
                {it.tags?.wheelchair && <div>♿ {it.tags.wheelchair}</div>}
              </div>
              <div className="row">
                {it.phone && <a className="btn btn-outline" href={`tel:${it.phone}`}>{t('nearby.call')}</a>}
                <a className="btn btn-outline" href={mapsLink(it)} target="_blank" rel="noreferrer">{t('nearby.openMaps')}</a>
                <a className="btn btn-outline" href={osmLink(it)} target="_blank" rel="noreferrer">{t('nearby.openOSM')}</a>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p style={{opacity:.7}}>{t('nearby.source')}</p>

      {/* FINESS CSV (опционально) */}
      {tab==='spec' && (
        <div className="card">
          <div className="row" style={{justifyContent:'space-between'}}>
            <div>
              <strong>{t('nearby.importFiness')}</strong>
              <div style={{opacity:.8}}>{t('nearby.finessHint')}</div>
            </div>
            <div className="row">
              <input type="file" accept=".csv" onChange={async e=>{
                const file = e.target.files?.[0]; if(!file) return
                const Papa = (await import('papaparse')).default
                Papa.parse(file, {
                  header:true, skipEmptyLines:true,
                  complete: res => {
                    // Ожидаемые поля: latitude, longitude, rs_comp_lib (название), categetab (категория) — адаптировать к CSV
                    const origin = center || null
                    const out = res.data.map(r=>{
                      const lat = parseFloat(r.latitude || r.Latitude || r.lat); const lon = parseFloat(r.longitude || r.Longitude || r.lon)
                      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
                      const distKm = origin ? haversineKm(origin,{lat,lon}) : null
                      const name = r.rs_comp_lib || r.name || 'Facility'
                      const addr = [r.adresse || r.address, r.commune || r.city].filter(Boolean).join(' ')
                      return { id:`finess:${r.finess || name}-${lat},${lon}`, lat, lon, name, addr, distKm, tags:{} }
                    }).filter(Boolean).sort((a,b)=>(a.distKm ?? 1e9)-(b.distKm ?? 1e9))
                    setItems(out)
                  }
                })
              }} />
              <button className="btn btn-outline" onClick={()=>setItems([])}>{t('nearby.clear','Clear')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
