export function generateReferenceNumber(now = new Date()) {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const randomSegment = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `RWX-${year}${month}${day}-${randomSegment}`
}
