import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";     // <— добавили
import Nearby from "./pages/Nearby";
import NotFound from "./pages/NotFound";

// Временная страница SOS
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

// Роутер
const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/sos", element: <SosPage /> },
  { path: "/schedule", element: <Schedule /> },  // <— добавили
  { path: "/nearby", element: <Nearby /> },
  { path: "/profile", element: <Profile /> },
  { path: "*", element: <NotFound /> }
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
