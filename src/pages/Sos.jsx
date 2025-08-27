// src/pages/Sos.jsx
export default function Sos() {
  const click = () => alert("SOS test — кнопка работает ✅");
  return (
    <main style={{minHeight:"70vh", display:"grid", placeItems:"center", padding:16}}>
      <button
        onClick={click}
        type="button"
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
