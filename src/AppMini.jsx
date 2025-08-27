// src/AppMini.jsx
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// ключевой трюк: берем корректный base из Vite
const BASENAME = import.meta.env.BASE_URL; // в Codespaces это как раз /CareBee/

function Home() {
  console.log("[MINI] render Home");
  return (
    <main style={{maxWidth:900, margin:"20px auto", padding:"0 16px"}}>
      <div style={{background:"#10b981",color:"#fff",padding:"6px 10px",borderRadius:8,marginBottom:12}}>
        MINI APP • basename: {BASENAME}
      </div>
      <h1 style={{fontSize:28, fontWeight:800, textAlign:"center", marginBottom:16}}>
        CareBee — Home (mini)
      </h1>

      {/* ОГРОМНАЯ ССЫЛКА-КНОПКА на /sos */}
      <div style={{display:"grid", placeItems:"center", margin:"24px 0 8px"}}>
        <Link
          to="/sos"
          aria-label="Open SOS"
          style={{
            width:"18rem", height:"18rem", borderRadius:"9999px",
            background:"#dc2626", color:"#fff", fontWeight:800, fontSize:"56px",
            display:"grid", placeItems:"center", textDecoration:"none",
            boxShadow:"0 20px 50px -12px rgba(220,38,38,.6)",
            border:"8px solid rgba(248,113,113,.5)"
          }}
        >
          SOS
        </Link>
      </div>
      <p style={{textAlign:"center", fontSize:12, color:"#6b7280"}}>
        Нажми — откроется страница /sos (mini).
      </p>
    </main>
  );
}

function Sos() {
  console.log("[MINI] render Sos");
  return (
    <main style={{minHeight:"70vh", display:"grid", placeItems:"center", padding:16}}>
      <button
        onClick={() => alert("SOS test (mini)")}
        type="button"
        aria-label="SOS"
        style={{
          width:"18rem", height:"18rem", borderRadius:"9999px",
          background:"#dc2626", color:"#fff", fontWeight:800, fontSize:"56px",
          boxShadow:"0 20px 50px -12px rgba(220,38,38,.6)",
          border:"8px solid rgba(248,113,113,.5)", cursor:"pointer"
        }}
      >
        SOS
      </button>
    </main>
  );
}

export default function AppMini() {
  console.log("[MINI] mount AppMini, base =", BASENAME);
  return (
    <BrowserRouter basename={BASENAME}>
      <header style={{position:"sticky",top:0,zIndex:10,background:"#fff8e1",borderBottom:"1px solid #f0d48a", padding:"8px 12px"}}>
        <nav aria-label="Main">
          <ul style={{display:"flex",gap:12,fontSize:14,listStyle:"none",margin:0,padding:0}}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sos">SOS</Link></li>
          </ul>
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
