import { HashRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Sos from "./pages/Sos";

const linkStyle = ({ isActive }) => ({
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  background: isActive ? "#fde68a" : "transparent",
});

export default function App() {
  return (
    <HashRouter>
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff8e1", borderBottom: "1px solid #f0d48a", padding: "8px 12px" }}>
        <nav aria-label="Main">
          <ul style={{ display: "flex", gap: 12, listStyle: "none", margin: 0, padding: 0 }}>
            <li>
              <NavLink to="/" end style={linkStyle}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/sos" style={linkStyle}>
                SOS
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sos" element={<Sos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
