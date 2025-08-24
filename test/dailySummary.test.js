import { test } from 'node:test'
import assert from 'node:assert/strict'
import i18next from 'i18next'
import * as DS from '../src/lib/dailySummary.js'

test('maybeSendDailySummary uses translated confirmation', async () => {
  await i18next.init({
    resources: { en: { translation: { daily: { confirmSend: 'translated' } } } },
    lng: 'en',
    interpolation: { escapeValue: false }
  })

  const store = new Map()
  globalThis.localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: k => store.delete(k)
  }
  store.set('carebee.autosend', JSON.stringify({ enabled: true, time: '00:00' }))

  globalThis.window = { open: () => {} }
  let message
  globalThis.confirm = m => { message = m; return true }

  DS.maybeSendDailySummary()

  assert.equal(message, 'translated')

  delete globalThis.confirm
  delete globalThis.window
  delete globalThis.localStorage
})

