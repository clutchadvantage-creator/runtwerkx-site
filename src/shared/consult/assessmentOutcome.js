import { assessmentConversation } from '../../components/assessment/assessmentConversation.js'
import { assessmentCategories, scoreAssessment } from '../../components/assessment/assessmentScoring.js'
import { recommendationCategoryToRoute } from './recommendationRoutes.js'
import { buildAssessmentAnswerRecord } from './assessmentSubmission.js'

function buildScoringAnswers(assessmentAnswers = []) {
  return assessmentAnswers.reduce((accumulator, answer) => {
    const question = assessmentConversation[answer.questionId]
    const matchedOption = question?.options?.find((option) => option.value === answer.answerId)

    if (question && matchedOption) {
      accumulator[answer.questionId] = {
        questionId: answer.questionId,
        prompt: question.prompt,
        value: matchedOption.value,
        label: matchedOption.label,
        tags: matchedOption.tags || [],
      }
    }

    return accumulator
  }, {})
}

export function resolveAssessmentOutcome(assessmentAnswers = []) {
  const score = scoreAssessment(buildScoringAnswers(assessmentAnswers))
  const route = recommendationCategoryToRoute[score.category] || recommendationCategoryToRoute.workflowConsulting

  return {
    category: score.category,
    categoryLabel: assessmentCategories[score.category] || score.category,
    route,
    stagedPath: score.stagedPath || [],
    verificationAnswers: assessmentAnswers.map((answer) => buildAssessmentAnswerRecord(answer)),
  }
}
