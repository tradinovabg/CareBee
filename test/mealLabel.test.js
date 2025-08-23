import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MEAL_LABEL } from '../src/locale/mealLabel.js'

test('MEAL_LABEL exports expected keys', () => {
  assert.deepEqual(MEAL_LABEL, {
    before: 'meds.before',
    with: 'meds.with',
    after: 'meds.after'
  })
})
