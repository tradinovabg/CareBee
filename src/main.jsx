// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import AppMini from "./AppMini"; // ← ПОДКЛЮЧАЕМ MINI

console.log("[BOOT] main.jsx • BASE_URL =", import.meta.env.BASE_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppMini />
  </React.StrictMode>
);
