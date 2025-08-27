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
    </main>
  );
}
