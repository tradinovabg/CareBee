import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main style={{minHeight:"70vh",display:"grid",placeItems:"center",textAlign:"center"}}>
      <div>
        <h1 style={{fontSize:"2rem",fontWeight:800,marginBottom:16}}>404 - Page Not Found</h1>
        <p><Link to="/">Go to Home</Link></p>
      </div>
    </main>
  );
}
