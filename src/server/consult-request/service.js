import { buildConsultEmailContent, buildRequesterConfirmationContent } from '../../shared/consult/emailFormatting.js'
import { generateReferenceNumber } from '../../shared/consult/referenceNumber.js'
import { generateConsultDossierPdfBuffer } from '../../shared/consult/pdfDocument.js'
import { resolveAssessmentOutcome } from '../../shared/consult/assessmentOutcome.js'
import { validateConsultRequestPayload } from '../../shared/consult/requestValidation.js'

const DEFAULT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 5
const DEFAULT_REQUEST_SIZE_LIMIT = 64 * 1024
const DEFAULT_CONSULT_FROM_EMAIL = 'RuntWerkx <no-reply@runtwerkx.dev>'
const DEFAULT_CONSULT_TO_EMAIL = 'runtwerkx.dev@gmail.com'

const requestBuckets = new Map()

function getClientIp(headers = {}) {
  const forwardedFor = headers['x-forwarded-for'] || headers['X-Forwarded-For'] || ''
  if (forwardedFor) {
    return String(forwardedFor).split(',')[0].trim()
  }

  return String(headers['x-real-ip'] || headers['X-Real-IP'] || headers['cf-connecting-ip'] || headers['CF-Connecting-IP'] || 'unknown')
}

function createMemoryRateLimiter({ windowMs = DEFAULT_RATE_LIMIT_WINDOW_MS, maxRequests = DEFAULT_RATE_LIMIT_MAX_REQUESTS } = {}) {
  return ({ ip, now = Date.now() }) => {
    const bucket = requestBuckets.get(ip) || []
    const windowStart = now - windowMs
    const recentHits = bucket.filter((timestamp) => timestamp >= windowStart)

    if (recentHits.length >= maxRequests) {
      requestBuckets.set(ip, recentHits)
      return { allowed: false, retryAfterMs: windowMs - (now - recentHits[0]) }
    }

    recentHits.push(now)
    requestBuckets.set(ip, recentHits)

    return { allowed: true, retryAfterMs: 0 }
  }
}

function safeLog(logger, level, message, meta = {}) {
  if (!logger || typeof logger[level] !== 'function') {
    return
  }

  logger[level](message, meta)
}

function buildGenericError(code, message = 'We could not process your request right now.') {
  return {
    success: false,
    error: {
      code,
      message,
    },
  }
}

function normalizeResponsePayload(payload) {
  return payload || buildGenericError('REQUEST_FAILED')
}

async function sendToResend(resendClient, options) {
  return resendClient.emails.send(options)
}

export function createConsultRequestService({
  resendClient,
  consultFromEmail = DEFAULT_CONSULT_FROM_EMAIL,
  consultToEmail = DEFAULT_CONSULT_TO_EMAIL,
  rateLimiter = createMemoryRateLimiter(),
  logger = console,
  now = () => new Date(),
  requestSizeLimit = DEFAULT_REQUEST_SIZE_LIMIT,
} = {}) {
  if (!resendClient?.emails?.send) {
    throw new Error('A Resend client with an emails.send method is required.')
  }

  return async function handleConsultRequest({ method, headers = {}, bodyText = '', ip = getClientIp(headers) }) {
    if (method !== 'POST') {
      return normalizeResponsePayload(buildGenericError('METHOD_NOT_ALLOWED', 'Method not allowed.'))
    }

    const contentType = String(headers['content-type'] || headers['Content-Type'] || '').toLowerCase()
    if (!contentType.includes('application/json')) {
      return normalizeResponsePayload(buildGenericError('INVALID_CONTENT_TYPE', 'Unsupported request type.'))
    }

    if (typeof bodyText !== 'string' || bodyText.length === 0) {
      return normalizeResponsePayload(buildGenericError('EMPTY_BODY', 'Invalid request body.'))
    }

    if (bodyText.length > requestSizeLimit) {
      return normalizeResponsePayload(buildGenericError('PAYLOAD_TOO_LARGE', 'Request body is too large.'))
    }

    const rateLimitResult = rateLimiter({ ip, now: now().getTime() })
    if (!rateLimitResult.allowed) {
      return normalizeResponsePayload(buildGenericError('RATE_LIMITED', 'Too many requests. Please try again later.'))
    }

    let parsedPayload
    try {
      parsedPayload = JSON.parse(bodyText)
    } catch {
      return normalizeResponsePayload(buildGenericError('MALFORMED_JSON', 'Invalid request body.'))
    }

    const validation = validateConsultRequestPayload(parsedPayload)
    if (!validation.ok) {
      return normalizeResponsePayload(buildGenericError(validation.code, validation.message))
    }

    const request = validation.value
    const assessmentOutcome = resolveAssessmentOutcome(request.assessment.answers)

    if (assessmentOutcome.route !== request.recommendation.route) {
      return normalizeResponsePayload(buildGenericError('RECOMMENDATION_MISMATCH', 'Invalid request body.'))
    }

    const referenceNumber = generateReferenceNumber(now())
    const submittedAt = now().toISOString()
    const recipientEmail = consultToEmail

    if (!recipientEmail) {
      safeLog(logger, 'error', 'Consult request configuration error', { code: 'MISSING_RECIPIENT_EMAIL' })
      return normalizeResponsePayload(buildGenericError('SERVER_CONFIGURATION_ERROR', 'We could not process your request right now.'))
    }

    const emailContent = buildConsultEmailContent({
      referenceNumber,
      submittedAt,
      customer: request.customer,
      consultation: request.consultation,
      recommendation: assessmentOutcome,
      assessment: {
        answers: request.assessment.answers,
      },
      notes: request.customer.notes,
    })

    const pdf = generateConsultDossierPdfBuffer({
      referenceNumber,
      submittedAt,
      customer: request.customer,
      consultation: request.consultation,
      recommendation: assessmentOutcome,
      assessment: {
        answers: request.assessment.answers,
      },
    })

    try {
      await sendToResend(resendClient, {
        from: consultFromEmail,
        to: recipientEmail,
        replyTo: request.customer.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments: [
          {
            filename: pdf.filename,
            content: pdf.buffer.toString('base64'),
          },
        ],
      })

      try {
        const confirmationContent = buildRequesterConfirmationContent({
          referenceNumber,
          submittedAt,
          customer: request.customer,
          consultation: request.consultation,
          recommendation: assessmentOutcome,
        })

        await sendToResend(resendClient, {
          from: consultFromEmail,
          to: request.customer.email,
          replyTo: consultToEmail,
          subject: confirmationContent.subject,
          html: confirmationContent.html,
          text: confirmationContent.text,
        })
      } catch {
        safeLog(logger, 'warn', 'Consult confirmation email failed', {
          code: 'CONFIRMATION_SEND_FAILED',
        })
      }

      return {
        success: true,
        referenceNumber,
      }
    } catch {
      safeLog(logger, 'error', 'Consult request provider failed', {
        code: 'RESEND_SEND_FAILED',
      })

      return normalizeResponsePayload(buildGenericError('DELIVERY_FAILED', 'We could not process your request right now.'))
    }
  }
}

export function createDefaultRateLimiter(options) {
  return createMemoryRateLimiter(options)
}

export async function readRequestBody(request, limitBytes = DEFAULT_REQUEST_SIZE_LIMIT) {
  const chunks = []
  let totalBytes = 0

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    totalBytes += buffer.length

    if (totalBytes > limitBytes) {
      const error = new Error('Payload too large.')
      error.code = 'PAYLOAD_TOO_LARGE'
      throw error
    }

    chunks.push(buffer)
  }

  return Buffer.concat(chunks).toString('utf8')
}

export function buildJsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(payload),
  }
}
