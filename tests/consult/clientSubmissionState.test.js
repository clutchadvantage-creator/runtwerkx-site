import test from 'node:test'
import assert from 'node:assert/strict'
import { getSubmissionFailureSnapshot } from '../../src/shared/consult/clientSubmissionState.js'
import { sampleAssessmentPackage, sampleBuildRequest } from './fixtures.js'

test('frontend state snapshot preserves the original request data on failure', () => {
  const snapshot = getSubmissionFailureSnapshot({
    buildRequest: sampleBuildRequest,
    assessmentSessionPackage: sampleAssessmentPackage,
    errorMessage: 'Retry later',
  })

  assert.equal(snapshot.buildRequest.fullName, sampleBuildRequest.fullName)
  assert.equal(snapshot.assessmentSessionPackage.route, sampleAssessmentPackage.route)
  assert.equal(snapshot.errorMessage, 'Retry later')
  assert.equal(snapshot.successModalOpen, false)
})
