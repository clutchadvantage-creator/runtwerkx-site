import test from 'node:test'
import assert from 'node:assert/strict'
import { buildConsultEmailContent } from '../../src/shared/consult/emailFormatting.js'
import { sampleAssessmentPackage, sampleBuildRequest } from './fixtures.js'

test('email formatting escapes HTML and includes assessment answers', () => {
  const content = buildConsultEmailContent({
    referenceNumber: 'RWX-20260712-ABC123',
    submittedAt: '2026-07-12T12:00:00.000Z',
    customer: {
      name: 'Jordan <Smith>',
      company: sampleBuildRequest.company,
      email: sampleBuildRequest.email,
      phone: sampleBuildRequest.phone,
      timeZone: 'America/Chicago',
      notes: 'Need <care> & support',
    },
    consultation: {
      date: sampleBuildRequest.preferredDate,
      time: sampleBuildRequest.preferredTime,
    },
    recommendation: {
      route: sampleAssessmentPackage.route,
    },
    assessment: {
      answers: sampleAssessmentPackage.answers,
    },
    notes: 'Need <care> & support',
  })

  assert.equal(content.subject, 'New Consultation Request — RWX-20260712-ABC123 — Jordan <Smith>')
  assert.ok(content.html.includes('&lt;Smith&gt;'))
  assert.ok(content.html.includes('Assessment Answers'))
  assert.ok(content.text.includes('Need <care> & support'))
})
