import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "serve" ? "/" : "/CareBee/", // dev: '/', Pages: '/CareBee/'
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
  },
}));
