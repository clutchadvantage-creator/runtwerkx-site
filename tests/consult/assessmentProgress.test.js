import test from 'node:test'
import assert from 'node:assert/strict'
import { createAssessmentProgressSnapshot, parseAssessmentProgress, serializeAssessmentProgress } from '../../src/shared/consult/assessmentProgress.js'
import { sampleAssessmentPackage } from './fixtures.js'

test('assessment progress serializes and restores without losing state', () => {
  const snapshot = createAssessmentProgressSnapshot({
    currentNodeId: 'outcome',
    phase: 'question',
    answers: { outcome: sampleAssessmentPackage.answers[4] },
    result: { kind: 'recommendation' },
    processingLine: 'Analyzing operational profile...',
  })

  const restored = parseAssessmentProgress(serializeAssessmentProgress(snapshot))

  assert.equal(restored.currentNodeId, 'outcome')
  assert.equal(restored.phase, 'question')
  assert.equal(restored.answers.outcome.answerText, 'Reduce bottlenecks')
  assert.equal(restored.processingLine, 'Analyzing operational profile...')
})
