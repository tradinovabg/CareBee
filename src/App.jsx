// src/App.jsx
import { HashRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sos from "./pages/Sos";
import "./App.css";

export default function App() {
  return (
    <Router>
      <header style={{
        position:"sticky",top:0,zIndex:10,background:"#fff8e1",
        borderBottom:"1px solid #f0d48a", padding:"8px 12px"
      }}>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/sos">SOS</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sos" element={<Sos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
