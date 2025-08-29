import { createHashRouter, RouterProvider } from "react-router-dom";

// Layout components
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

// Built‑in SOS page with rectangular button
function SosPage() {
  const click = () => alert("SOS sent (test) ✅");
  return (
    <main className="min-h-[70vh] grid place-items-center p-4">
      <button
        onClick={click}
        type="button"
        aria-label="SOS"
        className="w-64 h-32 rounded-lg bg-red-600 text-white text-5xl font-extrabold
                   shadow-[0_20px_50px_-12px_rgba(220,38,38,0.6)] ring-4 ring-red-300/50
                   hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-8
                   focus:ring-red-400/60 select-none"
      >
        SOS
      </button>
    </main>
  );
}

// Router definition
const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/meds", element: <Meds /> },
  { path: "/visits", element: <Visits /> },
  { path: "/calendar", element: <Calendar /> },
  { path: "/vitals", element: <Vitals /> },
  { path: "/nearby", element: <Nearby /> },
  { path: "/contacts", element: <Contacts /> },
  { path: "/docs", element: <Docs /> },
  { path: "/guide", element: <Guide /> },
  { path: "/faq", element: <Faq /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/sos", element: <SosPage /> },
  { path: "*", element: <NotFound /> },
]);

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1">
        <RouterProvider router={router} />
      </div>
      <Footer />
    </div>
  );
}

