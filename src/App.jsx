// src/App.jsx
 codex/replace-link-with-navlink-in-header-nav-b5rbde
import { HashRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
=======
codex/create-notfound-page-and-route
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Sos from "./pages/Sos";
import NotFound from "./pages/NotFound";
=======
import { HashRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
 main
import Home from "./pages/Home";
import Sos from "./pages/Sos";
import "./App.css";
main

export default function App() {
  const { t } = useTranslation();
  return (
    <Router>
      <header style={{
        position:"sticky",top:0,zIndex:10,background:"#fff8e1",
        borderBottom:"1px solid #f0d48a", padding:"8px 12px"
      }}>
codex/wrap-navigation-links-in-ul-and-style
        <nav aria-label="Main">
          <ul style={{display:"flex",gap:12,fontSize:14,listStyle:"none",margin:0,padding:0}}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sos">SOS</Link></li>
          </ul>
=======
codex/add-internationalization-to-app-component
        <nav style={{display:"flex",gap:12,fontSize:14}}>
codex/replace-link-with-navlink-in-header-nav-b5rbde
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : undefined}>Home</NavLink>
          <NavLink to="/sos" className={({ isActive }) => isActive ? "active" : undefined}>SOS</NavLink>
=======
          <Link to="/">{t('nav.home', 'Home')}</Link>
          <Link to="/sos">{t('nav.sos', 'SOS')}</Link>
=======
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/sos">SOS</Link>
main

        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sos" element={<Sos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
