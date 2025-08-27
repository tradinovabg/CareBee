codex/add-tests-for-sos-component-onc6ne
import { test, expect } from 'vitest';
=======
import { test } from 'vitest';
import { strict as assert } from 'node:assert';
main

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

test('shouldAutoSend uses auto-send settings rather than profile', async () => {
  global.localStorage = createLocalStorage();
  // profile contains legacy autosend fields which should be ignored
  localStorage.setItem('carebee.profile', JSON.stringify({
    autosendEnabled: true,
    autosendTime: '05:00',
  }));

  const { shouldAutoSend, setAutoSendSettings } = await import('./dailySummary.js');
  // Prepare a consistent "now" based on today's date
  const now = new Date();
  now.setHours(9, 0, 0, 0);

  // With default settings (enabled=false) it should not send
  expect(shouldAutoSend(now)).toBe(false);

  // Enabling via settings should allow auto-send irrespective of profile
  setAutoSendSettings({ enabled: true, time: '08:00' });
  expect(shouldAutoSend(now)).toBe(true);
});
