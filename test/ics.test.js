/* eslint-env node */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { icsEscape, buildICSEvent, toICSDateTimeUTC, toUTCStamp } from '../src/lib/ics.js'
import { spawnSync } from 'node:child_process'

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

test('toICSDateTimeUTC returns null for invalid date', () => {
  assert.equal(toICSDateTimeUTC('not-a-date'), null)
})

test('toUTCStamp yields same stamp across timezones', () => {
  const script = "import { toUTCStamp } from './src/lib/ics.js'; const [s,e] = toUTCStamp('2025-06-15', 9, 30); console.log(s + '|' + e);"
  const run = tz => spawnSync('node', ['--input-type=module', '-e', script], { env: { ...process.env, TZ: tz } }).stdout.toString().trim()
  const utc = run('UTC')
  const la = run('America/Los_Angeles')
  assert.equal(utc, la)
  assert.equal(utc, toUTCStamp('2025-06-15', 9, 30).join('|'))
})
