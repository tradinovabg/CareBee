import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toUTCStamp } from '../src/lib/ics.js'

test('toUTCStamp returns start and end UTC stamps', () => {
  const [start, end] = toUTCStamp('2025-06-15', 9, 30, 45)
  assert.match(start, /^\d{8}T\d{6}Z$/)
  assert.match(end, /^\d{8}T\d{6}Z$/)
  assert.notEqual(start, end)
})

