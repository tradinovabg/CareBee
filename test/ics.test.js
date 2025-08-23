import { test } from 'node:test'
import assert from 'node:assert/strict'
import { icsEscape, buildICSEvent, toICSDateTimeUTC } from '../src/lib/ics.js'

test('icsEscape escapes special characters', () => {
  const input = 'comma,semi;slash\\line\nnext'
  const expected = 'comma\\,semi\\;slash\\\\line\\nnext'
  assert.equal(icsEscape(input), expected)
})

test('buildICSEvent uses escaped fields', () => {
  const dt = '20240101T000000Z'
  const ics = buildICSEvent({
    uid: '1',
    start: dt,
    title: icsEscape('tit,le;\\one\n'),
    details: icsEscape('det,ail;\\two\n'),
    location: icsEscape('loc,ation;\\three\n')
  })
  assert.ok(ics.includes('SUMMARY:tit\\,le\\;\\\\one\\n'))
  assert.ok(ics.includes('DESCRIPTION:det\\,ail\\;\\\\two\\n'))
  assert.ok(ics.includes('LOCATION:loc\\,ation\\;\\\\three\\n'))
})

test('toICSDateTimeUTC returns null for invalid date', () => {
  assert.equal(toICSDateTimeUTC('not-a-date'), null)
})
