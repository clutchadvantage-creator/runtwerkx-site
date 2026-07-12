import { escapeHtml, sanitizeText } from './escapeHtml.js'

function formatAssessmentAnswersText(answers) {
  return answers
    .map((answer) => [
      `Question: ${answer.questionText}`,
      `Answer: ${answer.answerText}`,
    ].join('\n'))
    .join('\n\n')
}

function formatAssessmentAnswersHtml(answers) {
  return answers
    .map((answer) => `
      <tr>
        <td style="padding:10px 0 6px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(answer.questionText)}</td>
      </tr>
      <tr>
        <td style="padding:0 0 10px 0;color:#ecfff2;font-size:14px;line-height:1.55;">${escapeHtml(answer.answerText)}</td>
      </tr>
    `)
    .join('')
}

export function buildConsultEmailContent({ referenceNumber, submittedAt, customer, consultation, recommendation, assessment, notes }) {
  const safeNotes = sanitizeText(notes, { maxLength: 4000 }) || 'N/A'
  const questionRows = formatAssessmentAnswersHtml(assessment.answers)
  const questionText = formatAssessmentAnswersText(assessment.answers)

  const subject = `New Consultation Request — ${referenceNumber} — ${customer.name}`

  const recommendationLabel = `${recommendation.categoryLabel || recommendation.route} (${recommendation.route})`

  const text = [
    `Reference Number: ${referenceNumber}`,
    `Submitted At: ${submittedAt}`,
    `Customer Name: ${customer.name}`,
    `Company: ${customer.company || 'N/A'}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone || 'N/A'}`,
    `Requested Date: ${consultation.date}`,
    `Requested Time: ${consultation.time}`,
    `Time Zone: ${customer.timeZone}`,
    `Recommendation: ${recommendationLabel}`,
    '',
    'Assessment Answers',
    questionText || 'No assessment answers provided.',
    '',
    'Customer Notes',
    safeNotes,
  ].join('\n')

  const html = `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#0c1110;color:#ecfff2;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0c1110;padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:680px;max-width:94%;background:#111a16;border:1px solid #1f3a2b;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;background:linear-gradient(135deg,#143925,#0f2419);border-bottom:1px solid #1f3a2b;">
                    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#8cf7a9;">RuntWerkx Consultation</div>
                    <h1 style="margin:8px 0 0 0;font-size:24px;line-height:1.2;color:#ecfff2;">New Consultation Request</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:190px;">Reference Number</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;font-weight:700;">${escapeHtml(referenceNumber)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Submitted At</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(submittedAt)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Customer</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(customer.name)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Company</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(customer.company || 'N/A')}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(customer.email)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Phone</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(customer.phone || 'N/A')}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Requested Date</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(consultation.date)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Requested Time</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(consultation.time)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Time Zone</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(customer.timeZone)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Recommendation</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(recommendationLabel)}</td></tr>
                    </table>

                    <div style="margin:18px 0 0 0;padding:14px 16px;background:#0b1310;border:1px solid #1f3a2b;border-radius:10px;">
                      <div style="margin:0 0 8px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Assessment Answers</div>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${questionRows}</table>
                    </div>

                    <div style="margin:14px 0 0 0;padding:14px 16px;background:#0b1310;border:1px solid #1f3a2b;border-radius:10px;">
                      <div style="margin:0 0 8px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Customer Notes</div>
                      <div style="color:#d9f9e3;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(safeNotes)}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  return { subject, text, html }
}

export function buildRequesterConfirmationContent({ referenceNumber, submittedAt, customer, consultation, recommendation }) {
  const subject = `RuntWerkx Consultation Received — ${referenceNumber}`
  const recommendationLabel = `${recommendation.categoryLabel || recommendation.route} (${recommendation.route})`

  const text = [
    `Hi ${customer.name},`,
    '',
    'Your consult request has been received by RuntWerkx.',
    `Reference Number: ${referenceNumber}`,
    `Submitted At: ${submittedAt}`,
    `Requested Date: ${consultation.date}`,
    `Requested Time: ${consultation.time}`,
    `Time Zone: ${customer.timeZone}`,
    `Recommendation: ${recommendationLabel}`,
    '',
    'If you need to update anything, reply to this email and include your reference number.',
  ].join('\n')

  const html = `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#0c1110;color:#ecfff2;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0c1110;padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:680px;max-width:94%;background:#111a16;border:1px solid #1f3a2b;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;background:linear-gradient(135deg,#143925,#0f2419);border-bottom:1px solid #1f3a2b;">
                    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#8cf7a9;">RuntWerkx</div>
                    <h1 style="margin:8px 0 0 0;font-size:24px;line-height:1.2;color:#ecfff2;">Your Consultation Was Received</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0;color:#d9f9e3;font-size:14px;line-height:1.7;">Hi ${escapeHtml(customer.name)},</p>
                    <p style="margin:0 0 14px 0;color:#ccefd7;font-size:14px;line-height:1.7;">Your consult request has been received and is now in our operations queue.</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:190px;">Reference Number</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;font-weight:700;">${escapeHtml(referenceNumber)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Submitted At</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(submittedAt)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Requested Date</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(consultation.date)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Requested Time</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(consultation.time)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Time Zone</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(customer.timeZone)}</td></tr>
                      <tr><td style="padding:7px 0;color:#8cf7a9;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Recommendation</td><td style="padding:7px 0;color:#ecfff2;font-size:14px;">${escapeHtml(recommendationLabel)}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  return { subject, text, html }
}
