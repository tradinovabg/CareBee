cat > src/components/Footer.jsx <<'EOF'
import React from "react";
import { NavLink } from "react-router-dom";
<<<<<<< HEAD

export default function Footer() {
  const linkStyle = ({ isActive }) =>
    "px-3 py-2 rounded-lg " + (isActive ? "font-semibold underline" : "");

=======
export default function Footer() {
  const linkStyle = ({ isActive }) =>
    "px-3 py-2 rounded-lg " + (isActive ? "font-semibold underline" : "");
>>>>>>> 2cca76d (feat(router): add /schedule route and align footer links)
  return (
    <footer className="border-t bg-white/70 backdrop-blur p-3">
      <nav className="max-w-5xl mx-auto flex gap-3 flex-wrap">
        <NavLink to="/" className={linkStyle}>Главная</NavLink>
        <NavLink to="/sos" className={linkStyle}>SOS</NavLink>
        <NavLink to="/schedule" className={linkStyle}>Расписание</NavLink>
        <NavLink to="/nearby" className={linkStyle}>Поблизости</NavLink>
        <NavLink to="/profile" className={linkStyle}>Профиль</NavLink>
      </nav>
      <div className="max-w-5xl mx-auto mt-2 opacity-60 text-sm">
        © {new Date().getFullYear()} CareBee
      </div>
    </footer>
  );
}
EOF
