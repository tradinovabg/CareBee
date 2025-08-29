import React from 'react';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif' }}>
      <h2>Главная</h2>
      <p>Шаблон работает. Навигация ниже:</p>
      <nav style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <Link to="/sos">SOS</Link>
        <Link to="/schedule">Расписание</Link>
        <Link to="/nearby">Поблизости</Link>
      </nav>
    </main>
  );
}
