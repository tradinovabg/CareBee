import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // локально открываем по /, на GitHub Pages — по /CareBee/
  base: command === "serve" ? "/" : "/CareBee/",
  root: ".",                 // корень проекта = папка pages
  build: { outDir: "dist" }  // билд в pages/dist
}));
