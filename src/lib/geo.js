export const haversineKm = (a, b) => {
  const R=6371, toRad = d=>d*Math.PI/180
  const dLat=toRad(b.lat-a.lat), dLon=toRad(b.lon-a.lon)
  const s1=Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2
  return 2*R*Math.asin(Math.sqrt(s1))
}

// Overpass with fallbacks
const OVERPASS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
]

async function overpassFetch(body){
  for (const url of OVERPASS){
    const controller = new AbortController()
    const timer = setTimeout(()=>controller.abort(), 25000)
    try{
      const r = await fetch(url, { method:"POST", headers:{ "Content-Type":"text/plain" }, body, signal: controller.signal })
      if (!r.ok) throw new Error('overpass_failed')
      return await r.json()
    }catch{
      // try next endpoint on failure/timeout
    }finally{
      clearTimeout(timer)
    }
  }
  throw new Error('overpass_failed')
}

export async function overpassAround(lat, lon, radiusKm, qlBlocks){
  const radiusM = Math.round(radiusKm * 1000)
  const any = qlBlocks.map(q => `nwr(around:${radiusM},${lat},${lon})${q};`).join("\n")
  const body = `[out:json][timeout:25];(${any});out center tags;`
  const data = await overpassFetch(body)
  return (data.elements||[]).map(el=>{
    const latc = el.center?.lat ?? el.lat, lonc = el.center?.lon ?? el.lon
    return { id: `${el.type}/${el.id}`, lat: latc, lon: lonc, tags: el.tags||{} }
  })
}

export async function fetchNearbyPharmacies(lat, lon, radiusKm = 1){
  return overpassAround(lat, lon, radiusKm, ['["amenity"="pharmacy"]'])
}

// Nominatim — geocode address → {lat, lon}
export async function geocodeAddress(q, lang="en"){
  const u = new URL("https://nominatim.openstreetmap.org/search")
  u.searchParams.set("format","json")
  u.searchParams.set("q", q)
  u.searchParams.set("limit","1")
  u.searchParams.set("addressdetails","1")
  u.searchParams.set("accept-language", lang)
  const r = await fetch(u.toString(), { headers:{ "Accept":"application/json" } })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const arr = await r.json()
  if (!arr.length) throw new Error("not_found")
  return { lat: parseFloat(arr[0].lat), lon: parseFloat(arr[0].lon) }
}
