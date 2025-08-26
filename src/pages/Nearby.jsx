import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// фикс путей к иконкам Leaflet в бандлере
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl: marker2x, iconUrl: marker, shadowUrl: shadow });

const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const CATEGORIES = [
  { id: "doctor",   tag: "(doctors|clinic|hospital)" },
  { id: "clinic",   tag: "(clinic|hospital)" },
  { id: "pharmacy", tag: "(pharmacy)" },
  { id: "other",    tag: "(doctors|clinic|pharmacy|hospital)" }
];

export default function Nearby() {
  const { t, i18n } = useTranslation();
  const mapRef = useRef(null);
  const groupRef = useRef(L.layerGroup());
  const [center, setCenter] = useState(() => load("carebee.map.center", { lat: 48.8566, lng: 2.3522 })); // Paris по умолчанию
  const [radius, setRadius] = useState(() => load("carebee.map.radius", 2000)); // метры
  const [cat, setCat] = useState(() => load("carebee.map.cat", "pharmacy"));
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);

  // инициализация карты
  useEffect(() => {
    if (mapRef.current) return;
    const m = L.map("map", { center: [center.lat, center.lng], zoom: 14, scrollWheelZoom: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(m);
    groupRef.current.addTo(m);
    mapRef.current = m;
  }, []);

  // сохранение пользовательских настроек
  useEffect(() => { save("carebee.map.center", center); }, [center]);
  useEffect(() => { save("carebee.map.radius", radius); }, [radius]);
  useEffect(() => { save("carebee.map.cat", cat); }, [cat]);

  // центровка карты при изменении центра
  useEffect(() => {
    if (mapRef.current) mapRef.current.setView([center.lat, center.lng], mapRef.current.getZoom());
  }, [center]);

  // получить текущие координаты
  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => alert(err.message),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // запрос к Overpass API
  const search = async () => {
    if (!mapRef.current) return;
    setBusy(true);
    setCount(0);
    groupRef.current.clearLayers();

    // круг поиска
    const circle = L.circle([center.lat, center.lng], { radius, color: "#0ea5e9", weight: 1, fillOpacity: 0.05 });
    circle.addTo(groupRef.current);

    const tag = CATEGORIES.find(c => c.id === cat)?.tag || "(pharmacy)";
    const q = `
[out:json][timeout:25];
(
  node["amenity"~"${tag}"](around:${radius},${center.lat},${center.lng});
  way["amenity"~"${tag}"](around:${radius},${center.lat},${center.lng});
  relation["amenity"~"${tag}"](around:${radius},${center.lat},${center.lng});
);
out center 40;
`;

    try {
      const r = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: q,
        headers: { "Content-Type": "text/plain; charset=UTF-8", "Accept-Language": i18n.language }
      });
      const data = await r.json();

      const markers = [];
      (data.elements || []).forEach(el => {
        const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
        if (lat == null || lon == null) return;
        const name = el.tags?.name || "(no name)";
        const addr = [el.tags?.["addr:street"], el.tags?.["addr:housenumber"], el.tags?.["addr:city"]].filter(Boolean).join(", ");
        const amen = el.tags?.amenity;
        const html = `
          <div style="min-width:200px">
            <strong>${name}</strong><br/>
            <small>${amen || ""}</small><br/>
            <small>${addr}</small><br/>
            <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + addr)}">${t("nearby.openInMaps","Open in Maps")}</a>
          </div>`;
        const mk = L.marker([lat, lon]).bindPopup(html);
        mk.addTo(groupRef.current);
        markers.push(mk.getLatLng());
      });

      setCount(markers.length);
      if (markers.length) {
        const b = L.latLngBounds(markers);
        mapRef.current.fitBounds(b.pad(0.2));
      } else {
        mapRef.current.setView([center.lat, center.lng], 14);
      }
    } catch (e) {
      console.error(e);
      alert("Overpass API error. Try a smaller radius or later.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <h1>{t("nearby.title","Nearby")}</h1>

      <div className="card mb-4">
        <div className="form-grid md:grid-cols-4">
          <div className="field">
            <label className="label">{t("nearby.category","Category")}</label>
            <select className="select" value={cat} onChange={e=>setCat(e.target.value)}>
              <option value="doctor">{t("nearby.categories.doctor","Doctor")}</option>
              <option value="clinic">{t("nearby.categories.clinic","Clinic")}</option>
              <option value="pharmacy">{t("nearby.categories.pharmacy","Pharmacy")}</option>
              <option value="other">{t("nearby.categories.other","Other")}</option>
            </select>
          </div>

          <div className="field">
            <label className="label">Radius: {(radius/1000).toFixed(1)} km</label>
            <input className="w-full" type="range" min="500" max="10000" step="100" value={radius} onChange={e=>setRadius(+e.target.value)} />
          </div>

          <div className="field">
            <label className="label">Lat, Lng</label>
            <div className="flex gap-2">
              <input className="input" value={center.lat} onChange={e=>setCenter({ ...center, lat:+e.target.value })} />
              <input className="input" value={center.lng} onChange={e=>setCenter({ ...center, lng:+e.target.value })} />
            </div>
          </div>

          <div className="field">
            <label className="label">&nbsp;</label>
            <div className="flex gap-2">
              <button className="btn" type="button" onClick={useMyLocation}>{t("actions.useMyLoc","Use my location")}</button>
              <button className="btn btn-primary" type="button" disabled={busy} onClick={search}>
                {busy ? "…" : t("actions.search","Search")}
              </button>
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-500 mt-2">
          {t("nearby.info","Data: OpenStreetMap/Overpass. Please search responsibly.")} {count ? `• ${count} results` : ""}
        </div>
      </div>

      <div id="map" className="rounded-2xl border border-slate-200 shadow-sm" style={{height:"520px"}} />
    </div>
  );
}
