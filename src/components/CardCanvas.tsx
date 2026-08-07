import { forwardRef, useEffect, useRef } from 'react'
import type { BuilderData } from '../types'

interface CardCanvasProps {
  builderData: BuilderData
}

const CardCanvas = forwardRef<HTMLCanvasElement, CardCanvasProps>(({ builderData }, ref) => {
  const internalRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || internalRef

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 800
    const H = builderData.cardType === 'pfp-frame' ? 800 : 1150
    canvas.width = W
    canvas.height = H

    if (builderData.cardType === 'id-card') {
      drawPosterIDCard(ctx, W, H, builderData)
    } else {
      drawPFPFrame(ctx, W, H, builderData)
    }
  }, [builderData])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', maxWidth: '480px', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
    />
  )
})

function drawPosterIDCard(ctx: CanvasRenderingContext2D, W: number, H: number, data: BuilderData) {
  // Brand Color Tokens (Same as Site!)
  const greenBg = '#046A38'        // Primary Deep Green
  const greenDark = '#024F2B'      // Secondary Dark Green
  const greenShadow = '#022C19'    // Deepest Green Shadow
  const yellowAcc = '#F6D64A'      // Warm Mustard Yellow
  const pinkAcc = '#FF2D8D'        // Hot Pink Accent
  const whiteText = '#FFFFFF'

  // 1. Base Canvas Background
  ctx.fillStyle = greenBg
  ctx.fillRect(0, 0, W, H)

  // 2. Geometric Lattice Background Grid
  drawLatticePattern(ctx, W, H, yellowAcc)

  // 3. Double Outer Border Frame
  ctx.strokeStyle = yellowAcc
  ctx.lineWidth = 3.5
  ctx.strokeRect(16, 16, W - 32, H - 32)
  ctx.lineWidth = 1.5
  ctx.strokeRect(22, 22, W - 44, H - 44)

  // 4. Top Header — Group / Team Badge (Top Left)
  const groupText = (data.groupNo || 'AETHERSLAB').toUpperCase()
  ctx.save()
  ctx.fillStyle = greenShadow
  ctx.fillRect(48, 40, 260, 48)
  ctx.strokeStyle = yellowAcc
  ctx.lineWidth = 2
  ctx.strokeRect(48, 40, 260, 48)

  ctx.font = '900 20px "Space Grotesk", "Arial Black", sans-serif'
  ctx.fillStyle = yellowAcc
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(fitText(ctx, groupText, 230, 20), 48 + 130, 40 + 24)
  ctx.restore()

  // 5. Top Header — Badges & Emblems (Top Right)
  drawTopLogos(ctx, W - 48, 40, yellowAcc, pinkAcc)

  // 6. Main Headline Box (HH GOA 2026) — Strictly Contained & Centered!
  const titleText = (data.headerTitle || 'HH GOA 2026').toUpperCase()
  const titleBoxX = 48
  const titleBoxY = 102
  const titleBoxW = 704
  const titleBoxH = 120

  ctx.save()
  ctx.fillStyle = greenDark
  ctx.fillRect(titleBoxX, titleBoxY, titleBoxW, titleBoxH)
  ctx.strokeStyle = yellowAcc
  ctx.lineWidth = 3
  ctx.strokeRect(titleBoxX, titleBoxY, titleBoxW, titleBoxH)
  ctx.lineWidth = 1.5
  ctx.strokeRect(titleBoxX + 5, titleBoxY + 5, titleBoxW - 10, titleBoxH - 10)

  // Auto-fit headline text size so it NEVER overflows the box
  const computedFontSize = getFittedFontSize(ctx, titleText, titleBoxW - 40, 72, 40)
  ctx.font = `900 ${computedFontSize}px "Cormorant Garamond", "Impact", serif`
  ctx.fillStyle = yellowAcc
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(titleText, W / 2, titleBoxY + titleBoxH / 2)
  ctx.restore()

  // 7. Dark Green Graphic Backdrop Block (Left Side)
  const blockX = 48
  const blockY = 240
  const blockW = 460
  const blockH = 670

  const blockGrad = ctx.createLinearGradient(blockX, blockY, blockX, blockY + blockH)
  blockGrad.addColorStop(0, '#024F2B')
  blockGrad.addColorStop(1, '#022C19')
  ctx.fillStyle = blockGrad
  ctx.fillRect(blockX, blockY, blockW, blockH)
  ctx.strokeStyle = yellowAcc
  ctx.lineWidth = 2
  ctx.strokeRect(blockX, blockY, blockW, blockH)

  // Architectural / Campus Building Silhouette inside block
  drawBuildingSilhouette(ctx, blockX, blockY, blockW, blockH, yellowAcc)

  // 8. Vertical Stacked Text (Right Side Margin) — Perfectly Scaled & Positioned!
  const verticalText = (data.sideText || 'PARUL UNIVERSITY').toUpperCase()
  ctx.save()
  ctx.translate(W - 68, 250)
  ctx.rotate(Math.PI / 2)

  const sideFontSize = getFittedFontSize(ctx, verticalText, 640, 48, 28)
  ctx.font = `900 ${sideFontSize}px "Cormorant Garamond", "Impact", serif`
  ctx.fillStyle = yellowAcc
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(verticalText, 0, 0)
  ctx.restore()

  // Render User Image & Overlays
  if (data.imageUrl) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.save()
      // Render user image in center-foreground box
      const imgX = blockX + 15
      const imgY = blockY + 15
      const imgW = blockW - 30
      const imgH = blockH - 30

      // Clip image to block area
      ctx.beginPath()
      ctx.rect(imgX, imgY, imgW, imgH)
      ctx.clip()

      // Smart Crop Aspect Fill
      const aspect = img.width / img.height
      let sx = 0, sy = 0, sw = img.width, sh = img.height
      if (aspect > imgW / imgH) {
        sw = img.height * (imgW / imgH)
        sx = (img.width - sw) / 2
      } else {
        sh = img.width / (imgW / imgH)
        sy = (img.height - sh) / 2
      }

      ctx.drawImage(img, sx, sy, sw, sh, imgX, imgY, imgW, imgH)
      ctx.restore()

      // Draw Name Box & Footer over the photo
      drawNameTagAndFooter(ctx, W, H, data, yellowAcc, greenShadow, pinkAcc, whiteText)
    }
    img.src = data.imageUrl
  } else {
    // Placeholder silhouette
    drawPlaceholderSubject(ctx, blockX + 40, blockY + 50, blockW - 80, blockH - 100)
    drawNameTagAndFooter(ctx, W, H, data, yellowAcc, greenShadow, pinkAcc, whiteText)
  }
}

function drawNameTagAndFooter(
  ctx: CanvasRenderingContext2D,
  W: number,
  _H: number,
  data: BuilderData,
  yellow: string,
  darkGreen: string,
  pink: string,
  white: string
) {
  // 9. Name Tag Box (Bottom-left over photo)
  const nameText = (data.name || 'MERIL PARMAR').toUpperCase()
  const nameTagX = 64
  const nameTagY = 840
  const nameTagW = 340
  const nameTagH = 52

  ctx.save()
  ctx.fillStyle = yellow
  ctx.fillRect(nameTagX, nameTagY, nameTagW, nameTagH)
  ctx.strokeStyle = darkGreen
  ctx.lineWidth = 2
  ctx.strokeRect(nameTagX, nameTagY, nameTagW, nameTagH)

  const nameFontSize = getFittedFontSize(ctx, nameText, nameTagW - 24, 24, 16)
  ctx.font = `900 ${nameFontSize}px "Space Grotesk", "Arial Black", sans-serif`
  ctx.fillStyle = darkGreen
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(nameText, nameTagX + nameTagW / 2, nameTagY + nameTagH / 2)
  ctx.restore()

  // 10. Bottom Footer Bar — Clean 3-Column Layout without Overlaps!
  const footerX = 24
  const footerY = 930
  const footerW = W - 48
  const footerH = 180

  ctx.save()
  // Solid Dark Shadow Green Footer Box
  ctx.fillStyle = darkGreen
  ctx.fillRect(footerX, footerY, footerW, footerH)
  ctx.strokeStyle = yellow
  ctx.lineWidth = 2
  ctx.strokeRect(footerX, footerY, footerW, footerH)

  // Halftone Dot Matrix Pattern (Bottom Left)
  drawHalftoneDots(ctx, footerX + 12, footerY + 25, 90, 130, yellow)

  // Sparkle Stars (Yellow & Pink)
  drawSparkleStar(ctx, footerX + 30, footerY + 30, 10, yellow)
  drawSparkleStar(ctx, footerX + footerW - 24, footerY + 145, 14, pink)
  drawSparkleStar(ctx, footerX + footerW - 35, footerY + 25, 8, yellow)

  // Column 1: Role Text (Left) — Dynamically scaled to fit!
  const roleText = (data.role || 'FULLSTACK DEVELOPER').toUpperCase()
  const maxRoleWidth = 320
  const roleFontSize = getFittedFontSize(ctx, roleText, maxRoleWidth, 34, 18)

  ctx.font = `900 ${roleFontSize}px "Cormorant Garamond", "Impact", serif`
  ctx.fillStyle = yellow
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(roleText, footerX + 115, footerY + 90)

  // Column 2: Center Diamond Crest Emblem
  drawDiamondCrest(ctx, footerX + footerW / 2 - 20, footerY + 40, yellow)

  // Column 3: Location / Dept Info (Right Top)
  const locText = (data.location || 'DESA KECAMATAN KABUPATEN').toUpperCase()
  const locFontSize = getFittedFontSize(ctx, locText, 250, 14, 10)
  ctx.font = `700 ${locFontSize}px "Space Mono", monospace`
  ctx.fillStyle = white
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText(locText, footerX + footerW - 25, footerY + 55)

  // Column 3: Decorative Tech Checkers & Orbital Icon (Right Bottom)
  drawTechIconsRight(ctx, footerX + footerW - 170, footerY + 95, yellow)
  ctx.restore()
}

// Background Lattice Grid (Yellow lines on Green canvas)
function drawLatticePattern(ctx: CanvasRenderingContext2D, W: number, H: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.08
  ctx.lineWidth = 1
  const step = 45

  for (let x = -H; x < W + H; x += step) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + H, H)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x - H, H)
    ctx.stroke()
  }
  ctx.restore()
}

// Top Right Badges & Logos
function drawTopLogos(ctx: CanvasRenderingContext2D, rightX: number, topY: number, yellow: string, pink: string) {
  ctx.save()
  // Badge 1: Education Circle Logo
  const b1X = rightX - 170
  ctx.fillStyle = yellow
  ctx.beginPath()
  ctx.arc(b1X + 18, topY + 24, 18, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#022C19'
  ctx.font = 'bold 9px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('GOA', b1X + 18, topY + 27)

  // Badge 2: Kampus Merdeka / Tech Text Badge
  const b2X = rightX - 105
  ctx.font = '700 12px "Space Grotesk", sans-serif'
  ctx.fillStyle = yellow
  ctx.textAlign = 'left'
  ctx.fillText('HACKER', b2X, topY + 18)
  ctx.fillStyle = pink
  ctx.fillText('HOUSE', b2X, topY + 32)

  // Badge 3: Star Shield Emblem
  const b3X = rightX - 32
  ctx.fillStyle = yellow
  ctx.beginPath()
  ctx.arc(b3X + 16, topY + 24, 16, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#022C19'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('★', b3X + 16, topY + 28)
  ctx.restore()
}

// Building Silhouette inside Left Backdrop Block
function drawBuildingSilhouette(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  ctx.globalAlpha = 0.12
  const bY = y + h - 130

  // Pillars base
  ctx.fillRect(x + 20, bY, w - 40, 130)

  // Columns
  for (let px = x + 35; px < x + w - 45; px += 40) {
    ctx.clearRect(px, bY + 20, 18, 110)
  }

  // Triangular pediment roof
  ctx.beginPath()
  ctx.moveTo(x + 10, bY)
  ctx.lineTo(x + w / 2, bY - 55)
  ctx.lineTo(x + w - 10, bY)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// Placeholder Subject Silhouette
function drawPlaceholderSubject(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, _h: number) {
  ctx.save()
  ctx.fillStyle = 'rgba(246, 214, 74, 0.2)'

  // Head
  ctx.beginPath()
  ctx.arc(x + w / 2, y + 140, 80, 0, Math.PI * 2)
  ctx.fill()

  // Shoulders
  ctx.beginPath()
  ctx.ellipse(x + w / 2, y + 420, 150, 190, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Halftone Dot Matrix
function drawHalftoneDots(ctx: CanvasRenderingContext2D, startX: number, startY: number, w: number, h: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  ctx.globalAlpha = 0.35
  const cols = 6
  const rows = 8
  const dx = w / cols
  const dy = h / rows

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const radius = (r + 1) * 0.7
      ctx.beginPath()
      ctx.arc(startX + c * dx, startY + r * dy, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}

// Sparkle Star
function drawSparkleStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx, cy - size)
  ctx.quadraticCurveTo(cx, cy, cx + size, cy)
  ctx.quadraticCurveTo(cx, cy, cx, cy + size)
  ctx.quadraticCurveTo(cx, cy, cx - size, cy)
  ctx.quadraticCurveTo(cx, cy, cx, cy - size)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// Diamond Crest Emblem
function drawDiamondCrest(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  const w = 40
  const h = 40

  // Outer diamond
  ctx.beginPath()
  ctx.moveTo(x + w / 2, y)
  ctx.lineTo(x + w, y + h / 2)
  ctx.lineTo(x + w / 2, y + h)
  ctx.lineTo(x, y + h / 2)
  ctx.closePath()
  ctx.stroke()

  // Inner concentric diamond
  ctx.beginPath()
  ctx.moveTo(x + w / 2, y + 7)
  ctx.lineTo(x + w - 7, y + h / 2)
  ctx.lineTo(x + w / 2, y + h - 7)
  ctx.lineTo(x + 7, y + h / 2)
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

// Tech Icons Right (Checkerboard + Orbit)
function drawTechIconsRight(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  const sz = 7
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      if ((r + c) % 2 === 0) {
        ctx.fillRect(x + c * sz, y + r * sz, sz, sz)
      }
    }
  }

  const ox = x + 55
  const oy = y + 7
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(ox, oy, 12, 5, Math.PI / 4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(ox, oy, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Utility: Auto-fit text within maximum pixel width
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startFontSize: number): string {
  let fontSize = startFontSize
  ctx.font = `900 ${fontSize}px sans-serif`
  while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
    fontSize -= 1
    ctx.font = `900 ${fontSize}px sans-serif`
  }
  return text
}

// Utility: Compute fitted font size in pixels
function getFittedFontSize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startFontSize: number, minFontSize: number): number {
  let fontSize = startFontSize
  ctx.font = `900 ${fontSize}px sans-serif`
  while (ctx.measureText(text).width > maxWidth && fontSize > minFontSize) {
    fontSize -= 1
    ctx.font = `900 ${fontSize}px sans-serif`
  }
  return fontSize
}

// Square PFP Frame Mode
function drawPFPFrame(ctx: CanvasRenderingContext2D, W: number, H: number, data: BuilderData) {
  const greenBg = '#046A38'
  const yellowAcc = '#F6D64A'
  const darkGreen = '#022C19'

  ctx.fillStyle = darkGreen
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const r = 320

  // Photo circle
  if (data.imageUrl) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.clip()
      const aspect = img.width / img.height
      let sx = 0, sy = 0, sw = img.width, sh = img.height
      if (aspect > 1) { sw = img.height; sx = (img.width - sw) / 2 }
      else { sh = img.width; sy = (img.height - sh) / 2 }
      ctx.drawImage(img, sx, sy, sw, sh, cx - r, cy - r, r * 2, r * 2)
      ctx.restore()
      drawPFPOverlay(ctx, W, H, cx, cy, r, data, greenBg, yellowAcc, darkGreen)
    }
    img.src = data.imageUrl
  } else {
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(246, 214, 74, 0.15)'
    ctx.fill()
    ctx.restore()
    drawPFPOverlay(ctx, W, H, cx, cy, r, data, greenBg, yellowAcc, darkGreen)
  }
}

function drawPFPOverlay(
  ctx: CanvasRenderingContext2D,
  _W: number,
  H: number,
  cx: number,
  cy: number,
  r: number,
  data: BuilderData,
  _greenBg: string,
  yellowAcc: string,
  darkGreen: string
) {
  // Ring border
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = yellowAcc
  ctx.lineWidth = 10
  ctx.stroke()
  ctx.restore()

  // Top title
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = '900 20px "Cormorant Garamond", serif'
  ctx.fillStyle = yellowAcc
  ctx.fillText((data.headerTitle || 'HH GOA 2026').toUpperCase(), cx, cy - r - 20)
  ctx.restore()

  // Bottom Name Tag
  if (data.name) {
    ctx.save()
    const tagW = 320
    const tagH = 50
    const tagX = cx - tagW / 2
    const tagY = cy + r - 55

    ctx.fillStyle = yellowAcc
    ctx.fillRect(tagX, tagY, tagW, tagH)
    ctx.strokeStyle = darkGreen
    ctx.lineWidth = 2
    ctx.strokeRect(tagX, tagY, tagW, tagH)
    ctx.restore()

    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = '900 24px "Space Grotesk", sans-serif'
    ctx.fillStyle = darkGreen
    ctx.fillText(data.name.toUpperCase(), cx, tagY + 33)
    ctx.restore()
  }

  // Footer hashtag
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = '700 16px "Space Mono", monospace'
  ctx.fillStyle = yellowAcc
  ctx.fillText((data.groupNo || 'AETHERSLAB').toUpperCase(), cx, H - 40)
  ctx.restore()
}

CardCanvas.displayName = 'CardCanvas'

export default CardCanvas
