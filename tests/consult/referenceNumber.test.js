import test from 'node:test'
import assert from 'node:assert/strict'
import { generateReferenceNumber } from '../../src/shared/consult/referenceNumber.js'

test('generateReferenceNumber uses the official reference format', () => {
  const referenceNumber = generateReferenceNumber(new Date('2026-07-12T12:00:00Z'))

  assert.match(referenceNumber, /^RWX-20260712-[A-F0-9]{6}$/)
})
