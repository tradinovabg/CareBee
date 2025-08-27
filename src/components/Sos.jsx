import { useEffect, useRef, useState } from "react";
import "./Sos.css";

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

  return (
codex/add-tests-for-sos-component
    <main className="sos-container">
    
codex/remove-aria-label-from-button-in-sos.jsx
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 16 }}>

    <main className="sos-container">
main

      <button
        ref={buttonRef}
        onClick={open}
        type="button"
codex/add-tests-for-sos-component
        aria-label="SOS"
        className="sos-button"

codex/remove-aria-label-from-button-in-sos.jsx
        style={{
          width: "18rem",
          height: "18rem",
          borderRadius: "9999px",
          background: "#dc2626",
          color: "#fff",
          fontWeight: 800,
          fontSize: "56px",
          boxShadow: "0 20px 50px -12px rgba(220,38,38,.6)",
          border: "8px solid rgba(248,113,113,.5)",
          cursor: "pointer",
        }}

        aria-label="SOS"
        className="sos-button"
main

      >
        SOS
      </button>

      {active && (
codex/add-tests-for-sos-component
        <div role="alert" className="sos-notification" data-testid="notification">
          <p>Emergency services have been notified.</p>
          <button
            ref={closeButtonRef}
            onClick={close}
            type="button"
          >
            Close
          </button>

        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="sos-title"
 codex/remove-aria-label-from-button-in-sos.jsx
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              textAlign: "center",
              maxWidth: 320,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h2 id="sos-title" style={{ fontSize: 24, marginBottom: 16 }}>
              SOS activated
            </h2>
            <p style={{ marginBottom: 24 }}>

          className="sos-overlay"
        >
          <div className="sos-dialog">
            <h2 id="sos-title" className="sos-title">
              SOS activated
            </h2>
            <p className="sos-message">
main
              Emergency services have been notified.
            </p>
            <button
              ref={closeButtonRef}
              onClick={close}
              type="button"
 codex/remove-aria-label-from-button-in-sos.jsx
              style={{
                padding: "8px 16px",
                background: "#dc2626",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
              className="sos-close-button"
 main
            >
              Close
            </button>
          </div>
main
        </div>
      )}
    </main>
  );
}

