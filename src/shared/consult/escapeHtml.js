const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => HTML_ESCAPE_MAP[character] || character)
}

export function sanitizeText(value, { maxLength = 2000, trim = true } = {}) {
  let normalized = String(value ?? '').split('\u0000').join('').replace(/\r\n?/g, '\n')

  if (trim) {
    normalized = normalized.trim()
  }

  if (normalized.length > maxLength) {
    normalized = normalized.slice(0, maxLength)
  }

  return normalized
}

export function sanitizeSingleLine(value, { maxLength = 256 } = {}) {
  return sanitizeText(value, { maxLength }).replace(/\n+/g, ' ')
}
