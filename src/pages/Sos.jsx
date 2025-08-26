import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
// If you already have a Supabase client at src/lib/supabase.js it will be used.
// The page works even without it (falls back to Web Share / SMS composer).
let supabase = null;
try { supabase = require("../lib/supabase").supabase; } catch (e) {}

const EDGE = import.meta?.env?.VITE_SUPABASE_EDGE_URL; // e.g. https://<project>.functions.supabase.co

export default function Sos() {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState("");
  const [err, setErr] = useState("");
  const [coords, setCoords] = useState(null); // { lat, lon }
  const [includeLoc, setIncludeLoc] = useState(true);
  const [msg, setMsg] = useState(t("sos.need_help", "SOS! I need help."));

  // Try to get location early
  useEffect(() => {
    let cancelled = false;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        if (cancelled) return;
        setCoords({ lat: p.coords.latitude, lon: p.coords.longitude });
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 8000 }
    );
    return () => { cancelled = true; };
  }, []);

  const locationUrl = useMemo(() =>
    coords ? `https://maps.google.com/?q=${coords.lat},${coords.lon}` : null,
  [coords]);

  const onSend = async () => {
    setErr(""); setSent(""); setSending(true);
    const text = includeLoc && locationUrl ? `${msg} ${locationUrl}` : msg;

    // 1) Preferred: Edge Function broadcast with Supabase auth
    if (EDGE && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("not_authenticated");
        const r = await fetch(`${EDGE}/sos-broadcast`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ message: msg, locationUrl: includeLoc ? locationUrl : null }),
        });
        if (!r.ok) throw new Error(`broadcast_failed_${r.status}`);
        setSent(t("sos.sent", "Sent"));
      } catch (e) {
        console.error(e);
        setErr(t("sos.failed", "Failed to send"));
      } finally {
        setSending(false);
      }
      return;
    }

    // 2) Fallbacks if no backend yet
    try {
      if (navigator.share) {
        await navigator.share({ text });
        setSent(t("sos.sent", "Sent"));
      } else {
        // Open SMS composer (number left empty; user picks contact)
        const href = `sms:?&body=${encodeURIComponent(text)}`;
        window.location.href = href;
        setSent(t("sos.sent", "Sent"));
      }
    } catch (e) {
      console.error(e);
      setErr(t("sos.failed", "Failed to send"));
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-[80vh]">
      {/* HERO */}
      <section className="mx-auto max-w-3xl px-4 pt-10 pb-36 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">CareBee SOS</h1>
        <p className="mt-2 text-neutral-600">
          {t("sos.subtitle", "Tap the big red button to alert your trusted contacts.")}
        </p>

        {/* Controls */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 items-center justify-center">
          <label className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3">
            <input type="checkbox" className="h-4 w-4" checked={includeLoc} onChange={e=>setIncludeLoc(e.target.checked)} />
            <span className="text-sm">
              {t("sos.include_location", "Include my location")}
              {" "}
              {coords ? <span className="text-emerald-600">• ready</span> : <span className="text-neutral-400">• waiting</span>}
            </span>
          </label>
          <input
            value={msg}
            onChange={(e)=>setMsg(e.target.value)}
            className="w-full rounded-xl border px-3 py-3"
            aria-label={t("sos.custom_message", "Custom message")}
          />
        </div>
      </section>

      {/* BIG SOS BUTTON */}
      <button
        type="button"
        onClick={onSend}
        disabled={sending}
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72
          rounded-full text-white font-extrabold
          text-4xl sm:text-5xl select-none
          ${sending ? "bg-red-400" : "bg-red-600 hover:bg-red-700"}
          shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)]
          ring-4 ring-red-300/50 focus:outline-none focus:ring-8 focus:ring-red-400/60
          active:scale-95
        `}
        aria-label={t("sos.button", "SOS")}
      >
        SOS
      </button>

      {/* Status / errors */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mb-[18rem] flex justify-center">
        {sent && (
          <div className="pointer-events-auto rounded-full bg-emerald-600 text-white px-4 py-2 shadow">
            {sent}
          </div>
        )}
        {err && (
          <div className="pointer-events-auto rounded-full bg-red-600 text-white px-4 py-2 shadow">
            {err}
          </div>
        )}
      </div>
    </main>
  );
}
