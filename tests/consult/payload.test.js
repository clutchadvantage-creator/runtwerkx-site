import test from 'node:test'
import assert from 'node:assert/strict'
import { buildConsultRequestPayload } from '../../src/shared/consult/requestPayload.js'
import { sampleAssessmentPackage, sampleBuildRequest } from './fixtures.js'

test('buildConsultRequestPayload sanitizes and normalizes submission data', () => {
  const payload = buildConsultRequestPayload({
    customer: {
      name: 'Jordan <Smith>',
      company: 'Smith & Sons',
      email: 'jordan@example.com',
      phone: '(417) 555-0199',
      timeZone: 'America/Chicago',
      notes: 'Line one\r\nLine two',
    },
    consultation: {
      date: sampleBuildRequest.preferredDate,
      time: sampleBuildRequest.preferredTime,
    },
    recommendation: {
      route: sampleAssessmentPackage.route,
    },
    assessment: sampleAssessmentPackage,
    security: {
      honeypot: '',
      turnstileToken: '',
    },
    metadata: {
      submittedAt: '2026-07-12T12:00:00.000Z',
    },
  })

  assert.equal(payload.customer.name, 'Jordan <Smith>')
  assert.equal(payload.customer.notes, 'Line one\nLine two')
  assert.equal(payload.recommendation.route, sampleAssessmentPackage.route)
  assert.ok(!Object.prototype.hasOwnProperty.call(payload.customer, 'recipientEmail'))
})
