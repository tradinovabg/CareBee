// src/AppMini.jsx
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sos from "./pages/Sos";

// В твоём Codespaces dev-сервер реально висит под /CareBee/
const BASENAME = "/CareBee/"; // и dev, и prod — одинаково

export default function AppMini() {
  return (
    <BrowserRouter basename={BASENAME}>
      {/* МИНИ-Шапка без переводов/старого кода */}
      <header style={{
        position:"sticky",top:0,zIndex:10,background:"#fff8e1",
        borderBottom:"1px solid #f0d48a", padding:"8px 12px"
      }}>
        <nav style={{display:"flex",gap:12,fontSize:14}}>
          <Link to="/">Home</Link>
          <Link to="/sos">SOS</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sos" element={<Sos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
