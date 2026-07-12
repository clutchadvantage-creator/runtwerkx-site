import { Resend } from 'resend'
import { createConsultRequestService, createDefaultRateLimiter, readRequestBody } from '../src/server/consult-request/service.js'

const resendClient = new Resend(process.env.RESEND_API_KEY)
const consultRequestHandler = createConsultRequestService({
  resendClient,
  consultFromEmail: process.env.CONSULT_FROM_EMAIL || 'RuntWerkx <no-reply@runtwerkx.dev>',
  consultToEmail: process.env.CONSULT_TO_EMAIL || 'runtwerkx.dev@gmail.com',
  rateLimiter: createDefaultRateLimiter(),
  logger: console,
})

export default async function handler(request, response) {
  try {
    const bodyText = await readRequestBody(request)
    const result = await consultRequestHandler({
      method: request.method,
      headers: request.headers,
      bodyText,
    })

    if (result.success) {
      response.status(200).json(result)
      return
    }

    const statusCode = result.error?.code === 'METHOD_NOT_ALLOWED'
      ? 405
      : result.error?.code === 'INVALID_CONTENT_TYPE'
        ? 415
        : result.error?.code === 'PAYLOAD_TOO_LARGE'
          ? 413
          : result.error?.code === 'RATE_LIMITED'
            ? 429
            : 400

    response.status(statusCode).json(result)
  } catch (error) {
    const statusCode = error?.code === 'PAYLOAD_TOO_LARGE' ? 413 : 500
    response.status(statusCode).json({
      success: false,
      error: {
        code: error?.code || 'SERVER_ERROR',
        message: 'We could not process your request right now.',
      },
    })
  }
}
