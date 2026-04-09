import { jsPDF } from 'jspdf'

export function createLetterPdf() {
  const pdf = new jsPDF({ unit: 'pt', format: 'letter' })
  const margin = 42
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  return {
    pdf,
    margin,
    pageWidth,
    pageHeight,
    maxWidth: pageWidth - margin * 2,
  }
}

export function toPdfFileName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function writeWrapped(pdf, text, x, y, options = {}) {
  const lines = pdf.splitTextToSize(text, options.maxWidth)
  pdf.text(lines, x, y)
  return y + lines.length * (options.lineHeight ?? 16)
}

export function ensurePdfSpace(pdf, { cursorY, heightNeeded, pageHeight, margin }) {
  if (cursorY + heightNeeded <= pageHeight - margin) {
    return cursorY
  }

  pdf.addPage()
  return 48
}

export function addPdfHeader(pdf, { margin, maxWidth, cursorY, eyebrow, title, subtitle }) {
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(15, 138, 75)
  pdf.text(eyebrow, margin, cursorY)

  cursorY += 24
  pdf.setFontSize(24)
  pdf.text(title, margin, cursorY)

  if (!subtitle) {
    return cursorY
  }

  cursorY += 20
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(12)
  pdf.setTextColor(71, 85, 105)
  return writeWrapped(pdf, subtitle, margin, cursorY, { maxWidth })
}

export function addPdfSection(
  pdf,
  { cursorY, margin, maxWidth, pageHeight, label, body, minHeight = 72, lineHeight = 15 }
) {
  const lines = pdf.splitTextToSize(body, maxWidth - 28)
  const boxHeight = Math.max(minHeight, lines.length * lineHeight + 34)
  const nextY = ensurePdfSpace(pdf, {
    cursorY,
    heightNeeded: boxHeight + 12,
    pageHeight,
    margin,
  })

  pdf.roundedRect(margin, nextY, maxWidth, boxHeight, 12, 12)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(15, 138, 75)
  pdf.text(label, margin + 14, nextY + 18)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(12)
  pdf.setTextColor(15, 23, 42)
  pdf.text(lines, margin + 14, nextY + 38)

  return nextY + boxHeight + 12
}

export function addPdfChecklistSection(
  pdf,
  { cursorY, margin, maxWidth, pageWidth, pageHeight, label, items, noteLabel = 'Notes: ________________________________' }
) {
  const itemWidth = maxWidth - 230
  const rows = items.map((item) => {
    const lines = pdf.splitTextToSize(item, itemWidth)
    const height = Math.max(lines.length * 14, 20) + 8
    return { item, lines, height }
  })
  const boxHeight = rows.reduce((total, row) => total + row.height, 46)
  const nextY = ensurePdfSpace(pdf, {
    cursorY,
    heightNeeded: boxHeight + 12,
    pageHeight,
    margin,
  })

  pdf.roundedRect(margin, nextY, maxWidth, boxHeight, 12, 12)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(15, 138, 75)
  pdf.text(label, margin + 14, nextY + 18)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(12)
  pdf.setTextColor(15, 23, 42)

  let listY = nextY + 40
  rows.forEach((row) => {
    pdf.rect(margin + 14, listY - 10, 12, 12)
    pdf.text(row.lines, margin + 36, listY)
    pdf.setTextColor(100, 116, 139)
    pdf.text(noteLabel, pageWidth - 220, listY)
    pdf.setTextColor(15, 23, 42)
    listY += row.height
  })

  return listY
}

export function addPdfFooter(pdf, { cursorY, margin, maxWidth, pageHeight, text }) {
  const nextY = ensurePdfSpace(pdf, {
    cursorY,
    heightNeeded: 40,
    pageHeight,
    margin,
  })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(71, 85, 105)
  return writeWrapped(pdf, text, margin, nextY + 6, { maxWidth, lineHeight: 14 })
}