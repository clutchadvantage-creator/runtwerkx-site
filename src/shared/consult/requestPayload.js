import { sanitizeSingleLine, sanitizeText } from './escapeHtml.js'

export function buildConsultRequestPayload({
  customer,
  consultation,
  recommendation,
  assessment,
  security = {},
  metadata = {},
}) {
  return {
    customer: {
      name: sanitizeSingleLine(customer?.name, { maxLength: 120 }),
      company: sanitizeSingleLine(customer?.company, { maxLength: 140 }),
      email: sanitizeSingleLine(customer?.email, { maxLength: 180 }),
      phone: sanitizeSingleLine(customer?.phone, { maxLength: 40 }),
      timeZone: sanitizeSingleLine(customer?.timeZone, { maxLength: 80 }),
      notes: sanitizeText(customer?.notes, { maxLength: 2000 }),
    },
    consultation: {
      date: sanitizeSingleLine(consultation?.date, { maxLength: 20 }),
      time: sanitizeSingleLine(consultation?.time, { maxLength: 80 }),
    },
    recommendation: {
      route: sanitizeSingleLine(recommendation?.route, { maxLength: 120 }),
    },
    assessment: {
      answers: Array.isArray(assessment?.answers) ? assessment.answers : [],
      category: sanitizeSingleLine(assessment?.category, { maxLength: 80 }),
      stagedPath: Array.isArray(assessment?.stagedPath) ? assessment.stagedPath : [],
      capturedAt: sanitizeSingleLine(assessment?.capturedAt, { maxLength: 40 }),
    },
    security: {
      honeypot: sanitizeSingleLine(security?.honeypot, { maxLength: 120 }),
      turnstileToken: sanitizeSingleLine(security?.turnstileToken, { maxLength: 5000 }),
    },
    metadata: {
      submittedAt: sanitizeSingleLine(metadata?.submittedAt, { maxLength: 40 }),
    },
  }
}
