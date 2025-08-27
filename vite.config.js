import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "serve" ? "/" : "/CareBee/", // dev: '/', Pages: '/CareBee/'
  test: {
    environment: "jsdom",
codex/add-tests-for-sos-component-onc6ne
    setupFiles: "./tests/setup.js",
  },
=======
    globals: true
  }
main
}));
