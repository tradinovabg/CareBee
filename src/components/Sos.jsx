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
          className="sos-overlay"
        >
          <div className="sos-dialog">
            <h2 id="sos-title" className="sos-title">
              SOS activated
            </h2>
            <p className="sos-message">
              Emergency services have been notified.
            </p>
            <button
              ref={closeButtonRef}
              onClick={close}
              type="button"
              className="sos-close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

