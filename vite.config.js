import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // локально: '/', на GitHub Pages: '/CareBee/'
  base: command === "serve" ? "/" : "/CareBee/",
}));
