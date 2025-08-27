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
    <main className="sos-container">
      <button
        ref={buttonRef}
        onClick={open}
        type="button"
        aria-label="SOS"
        className="sos-button"
      >
        SOS
      </button>

      {active && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="sos-title"
          className="sos-modal-overlay"
        >
          <div className="sos-modal" role="document" aria-live="assertive">
            <h2 id="sos-title" className="sos-modal-title">SOS activated</h2>
            <p className="sos-modal-message">Emergency services have been notified.</p>
            <button
              ref={closeButtonRef}
              onClick={close}
              type="button"
              className="sos-modal-close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

