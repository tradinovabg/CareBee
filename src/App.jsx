cat > src/App.jsx <<'EOF'
import React from "react";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
      <h2>Главная</h2>
      <p>Шаблон работает. Навигация:</p>
      <nav style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <Link to="/sos">SOS</Link>
        <Link to="/schedule">Расписание</Link>
        <Link to="/nearby">Поблизости</Link>
      </nav>
    </main>
  );
}
EOF
