import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./i18n.js";   // 👈 просто подключаем i18n, без лишнего кода

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
