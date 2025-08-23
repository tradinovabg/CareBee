import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeTimes } from '../src/lib/normalizeTimes.js'

test('normalizeTimes sorts and de-duplicates times', () => {
  const input = ['09:00', '08:00', '09:00', '07:30']
  const expected = ['07:30', '08:00', '09:00']
  assert.deepEqual(normalizeTimes(input), expected)
})
