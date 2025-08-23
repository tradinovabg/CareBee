import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toUTCStamp } from '../src/lib/ics.js'

test('toUTCStamp validates HH:MM format', () => {
  assert.equal(toUTCStamp('invalid', 10), null)
  assert.equal(toUTCStamp('24:00', 10), null)
})

test('toUTCStamp validates plusMinutes', () => {
  assert.equal(toUTCStamp('09:00', -5), null)
  assert.equal(toUTCStamp('09:00', Infinity), null)
})

test('toUTCStamp returns stamp for valid input', () => {
  const stamp = toUTCStamp('09:30', 15)
  assert.ok(typeof stamp === 'string')
  assert.match(stamp, /^\d{8}T\d{6}Z$/)
})

