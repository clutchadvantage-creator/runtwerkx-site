import { randomBytes } from 'node:crypto'

export function generateReferenceNumber(now = new Date()) {
  const year = String(now.getFullYear())
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const randomSegment = randomBytes(3).toString('hex').toUpperCase()

  return `RWX-${year}${month}${day}-${randomSegment}`
}
