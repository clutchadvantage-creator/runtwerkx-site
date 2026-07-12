export const consultationRoutes = {
  workflowConsulting: '/recommendation/workflow-consulting',
  customTools: '/recommendation/custom-tools',
  platformEngineering: '/recommendation/platform-engineering',
  alternatePath: '/recommendation/alternate-path',
}

export const recommendationCategoryToRoute = {
  workflowConsulting: consultationRoutes.workflowConsulting,
  operationalTooling: consultationRoutes.customTools,
  platformEngineering: consultationRoutes.platformEngineering,
  betterFitElsewhere: consultationRoutes.alternatePath,
}

export const allowedRecommendationRoutes = new Set(Object.values(recommendationCategoryToRoute))
