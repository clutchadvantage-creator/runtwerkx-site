import { jsPDF } from 'jspdf'
import { sanitizeSingleLine, sanitizeText } from './escapeHtml.js'

function addWrappedLines(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text || ' ', maxWidth)
  let cursorY = y

  lines.forEach((line) => {
    doc.text(line, x, cursorY)
    cursorY += lineHeight
  })

  return cursorY
}

function addSectionTitle(doc, title, x, y) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(title, x, y)
  return y + 16
}

function addKeyValue(doc, key, value, x, y, maxWidth, lineHeight) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(`${key}:`, x, y)

  doc.setFont('helvetica', 'normal')
  return addWrappedLines(doc, value || 'N/A', x + 110, y, maxWidth - 110, lineHeight)
}

export function generateConsultDossierPdfBuffer({ referenceNumber, submittedAt, customer, consultation, recommendation, assessment }) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginX = 48
  const contentWidth = pageWidth - marginX * 2
  const lineHeight = 14
  let cursorY = 54

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('RuntWerkx Consultation Dossier', marginX, cursorY)
  cursorY += 20

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  cursorY = addWrappedLines(doc, `Reference Number: ${referenceNumber}`, marginX, cursorY, contentWidth, lineHeight)
  cursorY = addWrappedLines(doc, `Submitted At: ${submittedAt}`, marginX, cursorY + 4, contentWidth, lineHeight)
  cursorY += 8

  cursorY = addSectionTitle(doc, 'Customer Information', marginX, cursorY)
  cursorY = addKeyValue(doc, 'Name', customer.name, marginX, cursorY, contentWidth, lineHeight)
  cursorY = addKeyValue(doc, 'Company', customer.company || 'N/A', marginX, cursorY + 4, contentWidth, lineHeight)
  cursorY = addKeyValue(doc, 'Email', customer.email, marginX, cursorY + 4, contentWidth, lineHeight)
  cursorY = addKeyValue(doc, 'Phone', customer.phone || 'N/A', marginX, cursorY + 4, contentWidth, lineHeight)
  cursorY = addKeyValue(doc, 'Time Zone', customer.timeZone, marginX, cursorY + 4, contentWidth, lineHeight)

  cursorY += 8
  cursorY = addSectionTitle(doc, 'Consultation Request', marginX, cursorY)
  cursorY = addKeyValue(doc, 'Requested Date', consultation.date, marginX, cursorY, contentWidth, lineHeight)
  cursorY = addKeyValue(doc, 'Requested Time', consultation.time, marginX, cursorY + 4, contentWidth, lineHeight)
  cursorY = addKeyValue(doc, 'Recommendation', `${recommendation.categoryLabel || recommendation.category || recommendation.route} (${recommendation.route})`, marginX, cursorY + 4, contentWidth, lineHeight)

  cursorY += 8
  cursorY = addSectionTitle(doc, 'Assessment Answers', marginX, cursorY)

  assessment.answers.forEach((answer, index) => {
    if (cursorY > pageHeight - 72) {
      doc.addPage()
      cursorY = 54
    }

    cursorY = addKeyValue(doc, `Q${index + 1}`, answer.questionText, marginX, cursorY, contentWidth, lineHeight)
    cursorY = addKeyValue(doc, 'Answer', answer.answerText, marginX, cursorY + 4, contentWidth, lineHeight)
    cursorY += 4
  })

  if (cursorY > pageHeight - 72) {
    doc.addPage()
    cursorY = 54
  }

  cursorY = addSectionTitle(doc, 'Customer Notes', marginX, cursorY)
  const notes = sanitizeText(customer.notes, { maxLength: 4000 }) || 'N/A'
  addWrappedLines(doc, notes, marginX, cursorY, contentWidth, lineHeight)

  const buffer = Buffer.from(doc.output('arraybuffer'))
  const safeCustomerName = sanitizeSingleLine(customer.name, { maxLength: 80 }).replace(/[^A-Za-z0-9_-]+/g, '_') || 'customer'

  return {
    buffer,
    filename: `${referenceNumber}-${safeCustomerName}.pdf`,
  }
}
