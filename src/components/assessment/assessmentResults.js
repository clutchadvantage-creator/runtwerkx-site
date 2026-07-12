import { assessmentCategories } from './assessmentScoring'
import { getRecommendationMetadata } from '../../data/recommendationPages'

export const assessmentResultCopy = {
  workflowConsulting: {
    headline: 'Recommended path: Workflow Consulting',
    body:
      'Your responses suggest workflow alignment, handoffs, or process clarity should be addressed first. RuntWerkx can map current-state execution, identify bottlenecks, and define the right next step before software is recommended. This may lead into Operational Tooling, Platform Engineering, or integration improvements around existing systems.',
  },
  operationalTooling: {
    headline: 'Recommended path: Operational Tooling',
    body:
      'Your responses point to repeated manual execution, duplicate entry, or spreadsheet and paper dependency. RuntWerkx can design focused internal tooling such as forms, dashboards, reports, and workflow utilities that reduce operational drag while fitting how your team actually works.',
  },
  platformEngineering: {
    headline: 'Recommended path: Platform Engineering',
    body:
      'Your operation appears to need connected systems, shared visibility, and stronger cross-team coordination. RuntWerkx can help architect and implement a platform approach that links fragmented tools, improves reporting, and supports reliable execution across departments.',
  },
  betterFitElsewhere: {
    headline: 'Your responses suggest this request may require a licensed specialist outside software workflow services.',
    body:
      'Based on the answers provided, this appears to be primarily outside RuntWerkx operational scope, such as licensed accounting, tax, legal, medical, or hardware-only service needs. If there is still an operations or workflow layer to improve, RuntWerkx may still be able to help evaluate the best path forward.',
  },
}

export function getAssessmentResultCopy(result) {
  if (!result) {
    return null
  }

  if (result?.stagedPath?.length === 2) {
    const [firstCategory, secondCategory] = result.stagedPath
    const firstLabel = assessmentCategories[firstCategory]
    const secondLabel = assessmentCategories[secondCategory]

    if (firstLabel && secondLabel) {
      return getRecommendationMetadata({
        category: firstCategory,
        stagedPath: result.stagedPath,
        headline: `Recommended path: ${firstLabel} -> ${secondLabel}`,
        body: 'Your responses suggest a staged approach is the best fit. This may begin with workflow consulting to clarify bottlenecks, handoffs, and priorities, then progress into focused implementation. The right solution may be process improvement, custom tooling, platform engineering, or stronger integration with existing systems.',
      })
    }
  }

  const baseResult = assessmentResultCopy[result.category] || assessmentResultCopy.workflowConsulting

  return getRecommendationMetadata({
    category: result.category,
    stagedPath: result.stagedPath,
    headline: baseResult.headline,
    body: baseResult.body,
  })
}

export const noFrictionCopy = {
  headline: "That's good to hear.",
  body: 'If your operation changes in the future, RuntWerkx will be here.',
}
