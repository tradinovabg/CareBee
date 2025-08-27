import { test, expect } from "vitest";

function createLocalStorage() {
  const store = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      for (const k in store) delete store[k];
    },
  };
}

test("shouldAutoSend uses auto-send settings rather than profile", async () => {
  global.localStorage = createLocalStorage();
  localStorage.setItem(
    "carebee.profile",
    JSON.stringify({ autosendEnabled: true, autosendTime: "05:00" })
  );

  const { shouldAutoSend, setAutoSendSettings } = await import("./dailySummary.js");
  const now = new Date();
  now.setHours(9, 0, 0, 0);

  expect(shouldAutoSend(now)).toBe(false);
  setAutoSendSettings({ enabled: true, time: "08:00" });
  expect(shouldAutoSend(now)).toBe(true);
});
