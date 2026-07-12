export const assessmentCategories = {
  workflowConsulting: 'Workflow Consulting',
  operationalTooling: 'Operational Tooling',
  platformEngineering: 'Platform Engineering',
  betterFitElsewhere: 'Better Fit Elsewhere',
}

const createScores = () => ({
  workflowConsulting: 0,
  operationalTooling: 0,
  platformEngineering: 0,
  betterFitElsewhere: 0,
})

const SERVICE_KEYS = ['workflowConsulting', 'operationalTooling', 'platformEngineering']

const TAG_WEIGHTS = {
  workflowConsulting: 1.2,
  operationalTooling: 1.2,
  platformEngineering: 1.2,
  betterFitElsewhere: 2.2,
}

function chooseStagedPath(primaryCategory, secondaryCategory, scores) {
  if (!primaryCategory || !secondaryCategory) {
    return null
  }

  const closeScoreGap = Math.abs((scores[primaryCategory] || 0) - (scores[secondaryCategory] || 0))

  if (closeScoreGap > 1) {
    return null
  }

  if (primaryCategory === 'workflowConsulting' && secondaryCategory !== 'workflowConsulting') {
    return ['workflowConsulting', secondaryCategory]
  }

  if (secondaryCategory === 'workflowConsulting' && primaryCategory !== 'workflowConsulting') {
    return ['workflowConsulting', primaryCategory]
  }

  const workflowScore = scores.workflowConsulting || 0
  const topScore = Math.max(scores[primaryCategory] || 0, scores[secondaryCategory] || 0)

  if (workflowScore >= topScore - 1) {
    return ['workflowConsulting', primaryCategory]
  }

  return null
}

export function scoreAssessment(answers = {}) {
  const scores = createScores()

  Object.values(answers).forEach((answer) => {
    if (!answer?.tags?.length) {
      return
    }

    answer.tags.forEach((category) => {
      if (scores[category] !== undefined) {
        scores[category] += TAG_WEIGHTS[category] || 1
      }
    })
  })

  const serviceScores = SERVICE_KEYS.map((key) => [key, scores[key] || 0]).sort((a, b) => b[1] - a[1])
  const [topService = 'workflowConsulting', topServiceScore = 0] = serviceScores[0] || []
  const [secondService = 'operationalTooling', _secondServiceScore = 0] = serviceScores[1] || []
  const outsideScopeScore = scores.betterFitElsewhere || 0

  let category = topService

  if (outsideScopeScore >= 3 && outsideScopeScore >= topServiceScore + 2) {
    category = 'betterFitElsewhere'
  } else if (topServiceScore <= 0) {
    category = 'workflowConsulting'
  }

  const stagedPath =
    category === 'betterFitElsewhere'
      ? null
      : chooseStagedPath(topService, secondService, scores)

  return {
    category,
    scores,
    stagedPath,
  }
}

export function scoreNoFrictionResponse() {
  return {
    category: 'betterFitElsewhere',
    scores: createScores(),
  }
}
