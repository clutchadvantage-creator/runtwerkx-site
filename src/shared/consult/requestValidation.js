import { assessmentConversation } from '../../components/assessment/assessmentConversation.js'
import { allowedRecommendationRoutes } from './recommendationRoutes.js'
import { sanitizeSingleLine, sanitizeText } from './escapeHtml.js'

const ALLOWED_TIME_WINDOWS = new Set([
  'Morning (8:00 AM - 12:00 PM)',
  'Afternoon (12:00 PM - 4:00 PM)',
  'Late Afternoon (4:00 PM - 6:00 PM)',
])

const REQUIRED_ASSESSMENT_QUESTION_IDS = [
  'intro',
  'friction-area',
  'process-management',
  'affected',
  'outcome',
  'urgency',
  'fit-check',
]

const REQUEST_MAX_LENGTHS = {
  name: 120,
  company: 140,
  email: 180,
  phone: 40,
  timeZone: 80,
  date: 20,
  time: 80,
  notes: 2000,
  honeypot: 120,
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+[.][^\s@]+$/.test(value)
}

function isValidPhone(value) {
  return /^[+()0-9.\s-]{7,25}$/.test(value)
}

function isValidTimeZone(value) {
  if (!value) {
    return false
  }

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format(new Date())
    return true
  } catch {
    return false
  }
}

function isValidDateValue(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isTomorrowOrLater(dateValue) {
  const parsed = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) {
    return false
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return parsed.getTime() > today.getTime()
}

function normalizeAssessmentAnswer(answer) {
  return {
    questionId: sanitizeSingleLine(answer?.questionId, { maxLength: 80 }),
    questionText: sanitizeText(answer?.questionText, { maxLength: 300 }),
    answerId: sanitizeSingleLine(answer?.answerId, { maxLength: 120 }),
    answerText: sanitizeText(answer?.answerText, { maxLength: 300 }),
    answerTags: Array.isArray(answer?.answerTags) ? answer.answerTags.filter(Boolean) : [],
  }
}

export function validateConsultRequestPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, code: 'MALFORMED_REQUEST', message: 'Invalid request body.' }
  }

  const customer = payload.customer || {}
  const consultation = payload.consultation || {}
  const recommendation = payload.recommendation || {}
  const assessment = payload.assessment || {}
  const security = payload.security || {}

  const honeypot = sanitizeSingleLine(security.honeypot, { maxLength: REQUEST_MAX_LENGTHS.honeypot })
  if (honeypot) {
    return { ok: false, code: 'BOT_DETECTED', message: 'Invalid request body.' }
  }

  const normalizedCustomer = {
    name: sanitizeSingleLine(customer.name, { maxLength: REQUEST_MAX_LENGTHS.name }),
    company: sanitizeSingleLine(customer.company, { maxLength: REQUEST_MAX_LENGTHS.company }),
    email: sanitizeSingleLine(customer.email, { maxLength: REQUEST_MAX_LENGTHS.email }),
    phone: sanitizeSingleLine(customer.phone, { maxLength: REQUEST_MAX_LENGTHS.phone }),
    timeZone: sanitizeSingleLine(customer.timeZone, { maxLength: REQUEST_MAX_LENGTHS.timeZone }),
    notes: sanitizeText(customer.notes, { maxLength: REQUEST_MAX_LENGTHS.notes }),
  }

  const normalizedConsultation = {
    date: sanitizeSingleLine(consultation.date, { maxLength: REQUEST_MAX_LENGTHS.date }),
    time: sanitizeSingleLine(consultation.time, { maxLength: REQUEST_MAX_LENGTHS.time }),
  }

  const normalizedRoute = sanitizeSingleLine(recommendation.route, { maxLength: 120 })
  const normalizedAnswers = Array.isArray(assessment.answers) ? assessment.answers.map(normalizeAssessmentAnswer) : []
  const allowedQuestions = new Map(Object.values(assessmentConversation).map((node) => [node.id, node]))

  if (!normalizedCustomer.name || !normalizedCustomer.email || !normalizedConsultation.date || !normalizedConsultation.time || !normalizedCustomer.timeZone) {
    return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
  }

  if (!isValidEmail(normalizedCustomer.email)) {
    return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
  }

  if (normalizedCustomer.phone && !isValidPhone(normalizedCustomer.phone)) {
    return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
  }

  if (!isValidTimeZone(normalizedCustomer.timeZone)) {
    return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
  }

  if (!isValidDateValue(normalizedConsultation.date) || !isTomorrowOrLater(normalizedConsultation.date)) {
    return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
  }

  if (!ALLOWED_TIME_WINDOWS.has(normalizedConsultation.time)) {
    return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
  }

  if (!allowedRecommendationRoutes.has(normalizedRoute)) {
    return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
  }

  if (normalizedAnswers.length === 0) {
    return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
  }

  if (normalizedAnswers.length !== REQUIRED_ASSESSMENT_QUESTION_IDS.length) {
    return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
  }

  for (const [index, answer] of normalizedAnswers.entries()) {
    if (answer.questionId !== REQUIRED_ASSESSMENT_QUESTION_IDS[index]) {
      return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
    }

    const question = allowedQuestions.get(answer.questionId)
    if (!question) {
      return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
    }

    const matchedOption = question.options.find((option) => option.value === answer.answerId)
    if (!matchedOption) {
      return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
    }

    if (!answer.questionText || answer.questionText !== question.prompt) {
      return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
    }

    if (!answer.answerText || answer.answerText !== matchedOption.label) {
      return { ok: false, code: 'VALIDATION_ERROR', message: 'Required fields are missing.' }
    }

    answer.answerTags = Array.isArray(matchedOption.tags) ? matchedOption.tags : []
  }

  return {
    ok: true,
    value: {
      customer: normalizedCustomer,
      consultation: normalizedConsultation,
      recommendation: {
        route: normalizedRoute,
      },
      assessment: {
        answers: normalizedAnswers,
        category: sanitizeSingleLine(assessment.category, { maxLength: 80 }),
        stagedPath: Array.isArray(assessment.stagedPath) ? assessment.stagedPath : [],
        capturedAt: sanitizeSingleLine(assessment.capturedAt, { maxLength: 40 }),
      },
      security: {
        turnstileToken: sanitizeSingleLine(security.turnstileToken, { maxLength: 5000 }),
      },
    },
  }
}
