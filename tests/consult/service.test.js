import test from 'node:test'
import assert from 'node:assert/strict'
import { createConsultRequestService } from '../../src/server/consult-request/service.js'
import { buildFrontendConsultSubmissionPayload } from '../../src/shared/consult/submissionPayload.js'
import { sampleAssessmentPackage, sampleBuildRequest } from './fixtures.js'

function createValidPayload() {
  return buildFrontendConsultSubmissionPayload({
    buildRequest: sampleBuildRequest,
    assessmentSessionPackage: sampleAssessmentPackage,
    recommendationRoute: sampleAssessmentPackage.route,
  })
}

test('consult request service sends the consultation email and requester confirmation', async () => {
  const emailCalls = []
  const resendClient = {
    emails: {
      send: async (options) => {
        emailCalls.push(options)
        return { id: `message-${emailCalls.length}` }
      },
    },
  }

  const handler = createConsultRequestService({
    resendClient,
    consultFromEmail: 'RuntWerkx <no-reply@runtwerkx.dev>',
    consultToEmail: 'runtwerkx.dev@gmail.com',
    now: () => new Date('2026-07-12T12:00:00Z'),
    rateLimiter: () => ({ allowed: true, retryAfterMs: 0 }),
    logger: { error() {}, warn() {} },
  })

  const result = await handler({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    bodyText: JSON.stringify(createValidPayload()),
  })

  assert.equal(result.success, true)
  assert.match(result.referenceNumber, /^RWX-20260712-[A-F0-9]{6}$/)
  assert.equal(emailCalls.length, 2)
  assert.equal(emailCalls[0].to, 'runtwerkx.dev@gmail.com')
  assert.equal(emailCalls[1].to, sampleBuildRequest.email)
  assert.equal(emailCalls[0].attachments[0].filename.endsWith('.pdf'), true)
})

test('consult request service returns a generic failure when the provider fails', async () => {
  const resendClient = {
    emails: {
      send: async () => {
        throw new Error('provider down')
      },
    },
  }

  const handler = createConsultRequestService({
    resendClient,
    consultFromEmail: 'RuntWerkx <no-reply@runtwerkx.dev>',
    consultToEmail: 'runtwerkx.dev@gmail.com',
    now: () => new Date('2026-07-12T12:00:00Z'),
    rateLimiter: () => ({ allowed: true, retryAfterMs: 0 }),
    logger: { error() {}, warn() {} },
  })

  const result = await handler({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    bodyText: JSON.stringify(createValidPayload()),
  })

  assert.equal(result.success, false)
  assert.equal(result.error.code, 'DELIVERY_FAILED')
})

test('consult request service rejects malformed requests', async () => {
  const resendClient = {
    emails: {
      send: async () => ({ id: 'unused' }),
    },
  }

  const handler = createConsultRequestService({
    resendClient,
    consultFromEmail: 'RuntWerkx <no-reply@runtwerkx.dev>',
    consultToEmail: 'runtwerkx.dev@gmail.com',
    now: () => new Date('2026-07-12T12:00:00Z'),
    rateLimiter: () => ({ allowed: true, retryAfterMs: 0 }),
    logger: { error() {}, warn() {} },
  })

  const result = await handler({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    bodyText: '{not-json',
  })

  assert.equal(result.success, false)
  assert.equal(result.error.code, 'MALFORMED_JSON')
})
