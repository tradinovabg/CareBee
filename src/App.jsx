import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Meds from "./pages/Meds";
import Visits from "./pages/Visits";
import Calendar from "./pages/Calendar";
import Vitals from "./pages/Vitals";
import Nearby from "./pages/Nearby";
import Contacts from "./pages/Contacts";
import Docs from "./pages/Docs";
import Guide from "./pages/Guide";
import Faq from "./pages/Faq";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Built-in SOS page (заглушка)
function SosPage() {
  const click = () => alert("SOS sent (test) ✅");
  return (
    <main className="min-h-[70vh] grid place-items-center p-4">
      <button
        onClick={click}
        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow"
      >
        SOS
      </button>
    </main>
  );
}

export default function App() {
  return (
    <Router basename="/CareBee">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sos" element={<SosPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/meds" element={<Meds />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/vitals" element={<Vitals />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}
