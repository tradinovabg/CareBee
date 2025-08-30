cat > src/components/Footer.jsx <<'JS'
import React from "react";
import { NavLink } from "react-router-dom";

const linkBase =
  "px-3 py-2 rounded-xl text-sm font-medium transition";
const linkActive =
  "bg-slate-900 text-white";
const linkIdle =
  "text-slate-600 hover:bg-slate-200";

export default function Footer() {
  const year = new Date().getFullYear();

  const Item = ({ to, children, end }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkIdle}`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto w-full p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap gap-2">
          <Item to="/" end>Главная</Item>
          <Item to="/sos">SOS</Item>
          <Item to="/schedule">Расписание</Item>
          <Item to="/nearby">Поблизости</Item>
          <Item to="/profile">Профиль</Item>
        </nav>

        <div className="text-xs text-slate-500">
          © {year} CareBee
        </div>
      </div>
    </footer>
  );
}
JS
