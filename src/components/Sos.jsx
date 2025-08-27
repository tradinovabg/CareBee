codex/remove-alert-and-implement-accessible-notification
import { useEffect, useRef, useState } from "react";

export default function Sos() {
  const [active, setActive] = useState(false);
  const buttonRef = useRef(null);
  const closeButtonRef = useRef(null);

  const open = () => setActive(true);
  const close = () => setActive(false);

  useEffect(() => {
    if (active) {
      closeButtonRef.current?.focus();
    } else {
      buttonRef.current?.focus();
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        e.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <main style={{minHeight:"70vh", display:"grid", placeItems:"center", padding:16}}>
      <button
        ref={buttonRef}
        onClick={open}
        type="button"
        aria-label="SOS"
        style={{
          width:"18rem", height:"18rem", borderRadius:"9999px",
          background:"#dc2626", color:"#fff", fontWeight:800, fontSize:"56px",
          boxShadow:"0 20px 50px -12px rgba(220,38,38,.6)",
          border:"8px solid rgba(248,113,113,.5)", cursor:"pointer"
        }}
      >
        SOS
      </button>

      {active && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="sos-title"
          style={{
            position:"fixed", inset:0, display:"grid", placeItems:"center",
            background:"rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              background:"#fff", padding:24, borderRadius:8, textAlign:"center",
              maxWidth:320, boxShadow:"0 10px 25px rgba(0,0,0,0.2)"
            }}
          >
            <h2 id="sos-title" style={{fontSize:24, marginBottom:16}}>SOS activated</h2>
            <p style={{marginBottom:24}}>Emergency services have been notified.</p>
            <button
              ref={closeButtonRef}
              onClick={close}
              type="button"
              style={{
                padding:"8px 16px", background:"#dc2626", color:"#fff",
                border:"none", borderRadius:4, cursor:"pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}========
// src/components/Sos.jsx
import "./Sos.css";

export default function Sos() {
  const click = () => alert("SOS test — кнопка работает ✅");
  return (
    <main className="sos-container">
      <button
        onClick={click}
        type="button"
        aria-label="SOS"
        className="sos-button"
      >
        SOS
      </button>
main
    </main>
  );
}
