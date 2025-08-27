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
        <div role="alert" className="sos-notification" data-testid="notification">
          <p>Emergency services have been notified.</p>
          <button
            ref={closeButtonRef}
            onClick={close}
            type="button"
          >
            Close
          </button>
        </div>
      )}
    </main>
  );
}
