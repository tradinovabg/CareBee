// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main style={{maxWidth:900, margin:"20px auto", padding:"0 16px"}}>
      <h1 style={{fontSize:28, fontWeight:800, textAlign:"center", marginBottom:16}}>
        CareBee — Home
      </h1>

      <div style={{display:"grid", placeItems:"center", margin:"24px 0 8px"}}>
        <Link
          to="/sos"
          style={{
            width:"18rem", height:"18rem", borderRadius:"9999px",
            background:"#dc2626", color:"#fff", fontWeight:800, fontSize:"56px",
            display:"grid", placeItems:"center", textDecoration:"none",
            boxShadow:"0 20px 50px -12px rgba(220,38,38,.6)",
            border:"8px solid rgba(248,113,113,.5)"
          }}
          aria-label="Open SOS"
        >
          SOS
        </Link>
      </div>

      <p style={{textAlign:"center", fontSize:12, color:"#6b7280"}}>
        Кнопка большая и кликабельная. Откроет страницу <code>/sos</code>.
      </p>
    </main>
  );
}
