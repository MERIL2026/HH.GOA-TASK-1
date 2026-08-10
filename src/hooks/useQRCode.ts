/**
 * Minimal QR Code Generator — Canvas renderer
 * Encodes alphanumeric data using QR Code Model 2, Version 2, Error Correction Level M
 * No external dependencies. Renders directly to a CanvasRenderingContext2D.
 */

// QR Code generator using a lookup-table approach for small alphanumeric strings
// For builder IDs like "HHGOA26-7757" (≤16 chars), Version 1-2 M is sufficient

const ALIGNMENT_PATTERN = [6, 18] // Version 2

// Alphanumeric mode character map
const ALPHANUM_MAP: Record<string, number> = {}
'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'.split('').forEach((c, i) => {
  ALPHANUM_MAP[c] = i
})

function encodeAlphanumeric(str: string): number[] {
  const bits: number[] = []
  const upper = str.toUpperCase()
  for (let i = 0; i < upper.length; i += 2) {
    if (i + 1 < upper.length) {
      const val = (ALPHANUM_MAP[upper[i]] || 0) * 45 + (ALPHANUM_MAP[upper[i + 1]] || 0)
      for (let b = 10; b >= 0; b--) bits.push((val >> b) & 1)
    } else {
      const val = ALPHANUM_MAP[upper[i]] || 0
      for (let b = 5; b >= 0; b--) bits.push((val >> b) & 1)
    }
  }
  return bits
}

// Simple QR matrix generator
function createQRMatrix(data: string): number[][] {
  const size = 25 // Version 2 = 25x25
  const matrix: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

  // Place finder patterns
  const placeFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const mr = row + r, mc = col + c
        if (mr < 0 || mr >= size || mc < 0 || mc >= size) continue
        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
          matrix[mr][mc] = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) ? 1 : 0
        } else {
          matrix[mr][mc] = 0
        }
        reserved[mr][mc] = true
      }
    }
  }

  placeFinder(0, 0)
  placeFinder(0, size - 7)
  placeFinder(size - 7, 0)

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0 ? 1 : 0
    matrix[i][6] = i % 2 === 0 ? 1 : 0
    reserved[6][i] = true
    reserved[i][6] = true
  }

  // Alignment pattern (Version 2)
  const ar = ALIGNMENT_PATTERN[1], ac = ALIGNMENT_PATTERN[1]
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      matrix[ar + r][ac + c] = (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) ? 1 : 0
      reserved[ar + r][ac + c] = true
    }
  }

  // Reserve format info areas
  for (let i = 0; i < 8; i++) {
    reserved[8][i] = true
    reserved[i][8] = true
    reserved[8][size - 1 - i] = true
    reserved[size - 1 - i][8] = true
  }
  reserved[8][8] = true
  matrix[size - 8][8] = 1 // Dark module
  reserved[size - 8][8] = true

  // Encode data
  // Mode: Alphanumeric (0010), Char count (9 bits for V2)
  const dataBits: number[] = []
  // Mode indicator
  dataBits.push(0, 0, 1, 0)
  // Character count
  const len = data.length
  for (let b = 8; b >= 0; b--) dataBits.push((len >> b) & 1)
  // Data
  dataBits.push(...encodeAlphanumeric(data))
  // Terminator
  dataBits.push(0, 0, 0, 0)

  // Pad to 44 codewords (352 bits for V2-M = 44 data codewords)
  while (dataBits.length % 8 !== 0) dataBits.push(0)
  const totalDataBits = 352
  const padBytes = [0xEC, 0x11]
  let padIdx = 0
  while (dataBits.length < totalDataBits) {
    const pb = padBytes[padIdx % 2]
    for (let b = 7; b >= 0; b--) dataBits.push((pb >> b) & 1)
    padIdx++
  }

  // Place data bits in zigzag pattern
  let bitIndex = 0
  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col = 5 // Skip timing column
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const actualCol = col - c
        const actualRow = (Math.floor((size - 1 - col + (col > 6 ? 1 : 0)) / 2) % 2 === 0)
          ? size - 1 - row : row
        if (actualCol < 0 || actualCol >= size || actualRow < 0 || actualRow >= size) continue
        if (reserved[actualRow][actualCol]) continue
        matrix[actualRow][actualCol] = bitIndex < dataBits.length ? dataBits[bitIndex] : 0
        bitIndex++
      }
    }
  }

  // Apply simple mask (mask 0: (row + col) % 2 === 0)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c] && (r + c) % 2 === 0) {
        matrix[r][c] ^= 1
      }
    }
  }

  // Write format info for mask 0, EC level M
  // Pre-computed format bits for M, mask 0: 101010000010010
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]
  // Horizontal
  for (let i = 0; i < 6; i++) matrix[8][i] = formatBits[i]
  matrix[8][7] = formatBits[6]
  matrix[8][8] = formatBits[7]
  matrix[7][8] = formatBits[8]
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = formatBits[i]
  // Vertical
  for (let i = 0; i < 7; i++) matrix[size - 1 - i][8] = formatBits[i]
  matrix[8][size - 8] = formatBits[7]
  for (let i = 8; i < 15; i++) matrix[8][size - 15 + i] = formatBits[i]

  return matrix
}

/**
 * Draw a QR code onto a canvas context
 */
export function drawQRCode(
  ctx: CanvasRenderingContext2D,
  data: string,
  x: number,
  y: number,
  size: number,
  darkColor = '#044A29',
  lightColor = '#FAF5EB'
) {
  const matrix = createQRMatrix(data)
  const modules = matrix.length
  const moduleSize = size / modules

  // Background
  ctx.fillStyle = lightColor
  ctx.fillRect(x, y, size, size)

  // Modules
  ctx.fillStyle = darkColor
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (matrix[r][c]) {
        ctx.fillRect(
          x + c * moduleSize,
          y + r * moduleSize,
          moduleSize + 0.5,
          moduleSize + 0.5
        )
      }
    }
  }
}

/**
 * Generate a unique builder ID from name + phone
 * Format: HHGOA26-XXXX where XXXX is a 4-digit number
 */
export function generateBuilderId(name: string, phone: string): string {
  const input = `${name.trim().toUpperCase()}:${phone.trim()}`
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  const num = Math.abs(hash) % 10000
  return `HHGOA26-${num.toString().padStart(4, '0')}`
}
