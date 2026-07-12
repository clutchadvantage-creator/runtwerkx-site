import { assessmentConversation } from '../../components/assessment/assessmentConversation.js'

export function buildAssessmentAnswerRecord({ questionId, questionText, answerId, answerText, answerTags = [] }) {
  return {
    questionId,
    questionText,
    answerId,
    answerText,
    answerTags,
  }
}

export function buildAssessmentAnswerMap(answers = []) {
  return answers.reduce((accumulator, answer) => {
    if (answer?.questionId) {
      accumulator[answer.questionId] = answer
    }

    return accumulator
  }, {})
}

export function buildAssessmentContinuationPackage({ result, recommendation, answers = {} }) {
  const packagedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => {
    const question = assessmentConversation[questionId]

    return buildAssessmentAnswerRecord({
      questionId,
      questionText: question?.prompt || '',
      answerId: selectedAnswer?.value || '',
      answerText: selectedAnswer?.label || '',
      answerTags: Array.isArray(selectedAnswer?.tags) ? selectedAnswer.tags : [],
    })
  })

  return {
    route: recommendation?.route || '/contact',
    headline: recommendation?.headline || null,
    body: recommendation?.body || null,
    category: result?.category || null,
    stagedPath: result?.stagedPath || [],
    answers: packagedAnswers,
    capturedAt: new Date().toISOString(),
  }
}
