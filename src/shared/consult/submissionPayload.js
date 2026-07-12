import { buildConsultRequestPayload } from './requestPayload.js'

export function buildFrontendConsultSubmissionPayload({ buildRequest, assessmentSessionPackage, recommendationRoute, honeypot = '', turnstileToken = '' }) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

  return buildConsultRequestPayload({
    customer: {
      name: buildRequest.fullName,
      company: buildRequest.company,
      email: buildRequest.email,
      phone: buildRequest.phone,
      timeZone: timezone,
      notes: buildRequest.notes,
    },
    consultation: {
      date: buildRequest.preferredDate,
      time: buildRequest.preferredTime,
    },
    recommendation: {
      route: recommendationRoute,
    },
    assessment: {
      answers: assessmentSessionPackage?.answers || [],
      category: assessmentSessionPackage?.category || '',
      stagedPath: assessmentSessionPackage?.stagedPath || [],
      capturedAt: assessmentSessionPackage?.capturedAt || '',
    },
    security: {
      honeypot,
      turnstileToken,
    },
    metadata: {
      submittedAt: new Date().toISOString(),
    },
  })
}
