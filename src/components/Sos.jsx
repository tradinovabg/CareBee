import { useEffect, useRef, useState } from "react";

export default function Sos() {
  const [active, setActive] = useState(false);
  const buttonRef = useRef(null);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const firstRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    if (active) {
      const focusable = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstRef.current = focusable?.[0] || null;
      lastRef.current = focusable?.[focusable.length - 1] || null;
    }
    (active ? closeRef.current : buttonRef.current)?.focus();
  }, [active]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setActive(false);
      return;
    }

    if (e.key === "Tab" && active) {
      if (e.shiftKey) {
        if (document.activeElement === firstRef.current) {
          e.preventDefault();
          lastRef.current?.focus();
        }
      } else {
        if (document.activeElement === lastRef.current) {
          e.preventDefault();
          firstRef.current?.focus();
        }
      }
    }
  };

  return (
    <main className="min-h-[70vh] grid place-items-center p-4">
      <button
        ref={buttonRef}
        onClick={() => setActive(true)}
        type="button"
        className="w-72 h-72 rounded-full bg-red-600 text-white text-6xl font-extrabold shadow-xl border-8 border-red-300 focus:outline-none"
      >
        SOS
      </button>

      {active && (
        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 grid place-items-center bg-black/50"
          onKeyDown={handleKeyDown}
          ref={dialogRef}
        >
          <div className="bg-white p-6 rounded-xl text-center max-w-sm shadow-xl">
            <h2 className="text-2xl font-bold mb-4">SOS activated</h2>
            <p className="mb-6">Emergency services have been notified.</p>
            <button
              ref={closeRef}
              onClick={() => setActive(false)}
              type="button"
              className="btn btn-danger"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
