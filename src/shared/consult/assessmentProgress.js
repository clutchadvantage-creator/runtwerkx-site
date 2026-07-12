const ASSESSMENT_PROGRESS_STORAGE_KEY = 'rwxAssessmentProgress'

export function createAssessmentProgressSnapshot({
  currentNodeId = 'intro',
  phase = 'idle',
  answers = {},
  result = null,
  processingLine = '',
} = {}) {
  return {
    currentNodeId,
    phase,
    answers,
    result,
    processingLine,
    updatedAt: new Date().toISOString(),
  }
}

export function serializeAssessmentProgress(snapshot) {
  return JSON.stringify(createAssessmentProgressSnapshot(snapshot))
}

export function parseAssessmentProgress(serializedValue) {
  if (!serializedValue) {
    return null
  }

  try {
    const parsed = JSON.parse(serializedValue)

    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    return createAssessmentProgressSnapshot({
      currentNodeId: typeof parsed.currentNodeId === 'string' ? parsed.currentNodeId : 'intro',
      phase: typeof parsed.phase === 'string' ? parsed.phase : 'idle',
      answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      result: parsed.result ?? null,
      processingLine: typeof parsed.processingLine === 'string' ? parsed.processingLine : '',
    })
  } catch {
    return null
  }
}

export function buildAssessmentProgressStorageKey() {
  return ASSESSMENT_PROGRESS_STORAGE_KEY
}
