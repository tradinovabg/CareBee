import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shareLink } from '../src/shareLink.js'

const t = (key, defaultText) => defaultText

const LINK = 'https://tinyurl.com/carebee24'

test('falls back to manual copy instructions when clipboard unsupported', async () => {
  const nav = {}
  const { msg, manual } = await shareLink(nav, LINK, t)
  assert.equal(manual, true)
  assert.equal(msg, `Copy the link manually: ${LINK}`)
})

test('copies link when clipboard supported', async () => {
  let written = ''
  const nav = {
    clipboard: {
      writeText: async (text) => { written = text }
    }
  }
  const { msg, manual } = await shareLink(nav, LINK, t)
  assert.equal(written, LINK)
  assert.equal(manual, false)
  assert.equal(msg, 'Link copied')
})
