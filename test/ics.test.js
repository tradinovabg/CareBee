import { test } from 'node:test'
import assert from 'node:assert/strict'
import { icsEscape, buildICSEvent } from '../src/lib/ics.js'

test('icsEscape escapes special characters', () => {
  const input = 'comma,semi;slash\\line\nnext'
  const expected = 'comma\\,semi\\;slash\\\\line\\nnext'
  assert.equal(icsEscape(input), expected)
})

test('buildICSEvent builds CRLF ICS with escaped fields', () => {
  const dt = '20240101T000000Z'
  const ics = buildICSEvent({
    uid: '1',
    dtstamp: dt,
    dtstart: dt,
    dtend: dt,
    title: 'tit,le;\\one\n',
    desc: 'det,ail;\\two\n',
    loc: 'loc,ation;\\three\n'
  })
  assert.ok(ics.includes('PRODID:-//CareBee//EN'))
  assert.ok(ics.includes('SUMMARY:tit\\,le\\;\\\\one\\n'))
  assert.ok(ics.includes('DESCRIPTION:det\\,ail\\;\\\\two\\n'))
  assert.ok(ics.includes('LOCATION:loc\\,ation\\;\\\\three\\n'))
  assert.ok(ics.includes('\r\n'))
  assert.ok(ics.endsWith('\r\n'))
})
