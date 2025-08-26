import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const EDGE = import.meta.env.VITE_SUPABASE_EDGE_URL; // e.g. https://<ref>.functions.supabase.co

export default function Sos() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState("");
  const [err, setErr] = useState("");
  const [coords, setCoords] = useState(null); // { lat, lon }
  const [includeLoc, setIncludeLoc] = useState(true);
  const [msg, setMsg] = useState("SOS! I need help.");

  useEffect(() => {
    let cancelled = false;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => { if (!cancelled) setCoords({ lat: p.coords.latitude, lon: p.coords.longitude }); },
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 8000 }
    );
    return () => { cancelled = true; };
  }, []);

  const locationUrl = useMemo(
    () => (coords ? `https://maps.google.com/?q=${coords.lat},${coords.lon}` : null),
    [coords]
  );

  const onSend = async () => {
    setErr(""); setSent(""); setSending(true);
    const text = includeLoc && locationUrl ? `${msg} ${locationUrl}` : msg;

    try {
      if (EDGE) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("not_authenticated");
        const r = await fetch(`${EDGE}/sos-broadcast`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ message: msg, locationUrl: includeLoc ? locationUrl : null }),
        });
        if (!r.ok) throw new Error(`broadcast_failed_${r.status}`);
        setSent("Sent");
        setSending(false);
        return;
      }
    } catch (e) {
      console.error(e);
      setErr("Failed to send via backend");
    }

    try {
      if (navigator.share) {
        await navigator.share({ text });
        setSent("Sent");
      } else {
        window.location.href = `sms:?&body=${encodeURIComponent(text)}`;
        setSent("Sent");
      }
    } catch (e) {
      console.error(e);
      setErr("Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-[80vh] grid place-items-center p-8">
      {/* Controls above the button */}
      <section className="w-full max-w-3xl text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">CareBee SOS</h1>
        <p className="mt-2 text-neutral-600">Tap the big red button to alert your contacts.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 items-center justify-center">
          <label className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3">
            <input type="checkbox" className="h-4 w-4" checked={includeLoc}
                   onChange={(e)=>setIncludeLoc(e.target.checked)} />
            <span className="text-sm">
              Include my location {coords ? <span className="text-emerald-600">• ready</span> : <span className="text-neutral-400">• waiting</span>}
            </span>
          </label>
          <input
            value={msg}
            onChange={(e)=>setMsg(e.target.value)}
            className="w-full rounded-xl border px-3 py-3"
            aria-label="Custom message"
          />
      </div>
      </section>

      {/* GIANT SOS BUTTON centered; inline size fallback in case Tailwind fails */}
      <button
        type="button"
        onClick={onSend}
        disabled={sending}
        style={{ width: "18rem", height: "18rem" }}
        className={`
          rounded-full text-white font-extrabold
          text-5xl select-none
          ${sending ? "bg-red-400" : "bg-red-600 hover:bg-red-700"}
          shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)]
          ring-4 ring-red-300/50 focus:outline-none focus:ring-8 focus:ring-red-400/60
          active:scale-95
        `}
        aria-label="SOS"
      >
        SOS
      </button>

      {/* Status */}
      <div className="mt-6 h-6">
        {sent && <span className="rounded-full bg-emerald-600 text-white px-4 py-2 shadow">{sent}</span>}
        {err && <span className="rounded-full bg-red-600 text-white px-4 py-2 shadow">{err}</span>}
      </div>
    </main>
  );
}
