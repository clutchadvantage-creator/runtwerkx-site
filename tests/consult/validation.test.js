import test from 'node:test'
import assert from 'node:assert/strict'
import { validateConsultRequestPayload } from '../../src/shared/consult/requestValidation.js'
import { buildFrontendConsultSubmissionPayload } from '../../src/shared/consult/submissionPayload.js'
import { sampleAssessmentPackage, sampleBuildRequest } from './fixtures.js'

function createPayload() {
  return buildFrontendConsultSubmissionPayload({
    buildRequest: sampleBuildRequest,
    assessmentSessionPackage: sampleAssessmentPackage,
    recommendationRoute: sampleAssessmentPackage.route,
  })
}

test('validateConsultRequestPayload accepts a complete consult payload', () => {
  const validation = validateConsultRequestPayload(createPayload())

  assert.equal(validation.ok, true)
  assert.equal(validation.value.customer.email, sampleBuildRequest.email)
  assert.equal(validation.value.assessment.answers.length, sampleAssessmentPackage.answers.length)
})

test('validateConsultRequestPayload rejects honeypot submissions', () => {
  const payload = createPayload()
  payload.security.honeypot = 'spam'

  const validation = validateConsultRequestPayload(payload)

  assert.equal(validation.ok, false)
  assert.equal(validation.code, 'BOT_DETECTED')
})
