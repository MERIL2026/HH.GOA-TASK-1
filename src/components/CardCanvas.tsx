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
    const H = builderData.cardType === 'pfp-frame' ? 800 : 1060
    canvas.width = W
    canvas.height = H

    if (builderData.cardType === 'id-card') {
      drawOfficialTicketCard(ctx, W, H, builderData)
    } else {
      drawPFPFrame(ctx, W, H, builderData)
    }
  }, [builderData])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', maxWidth: '480px', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
    />
  )
})

function drawOfficialTicketCard(ctx: CanvasRenderingContext2D, W: number, H: number, data: BuilderData) {
  // Official Color Palette
  const forestGreen = '#044A29'
  const forestDark = '#03331C'
  const vintageCream = '#FAF5EB'
  const sunYellow = '#F4B728'
  const terracottaRed = '#D9432F'
  const white = '#FFFFFF'

  // 1. Overall Card Background (Paper Cream)
  ctx.fillStyle = vintageCream
  ctx.fillRect(0, 0, W, H)

  // 2. Outer Border Frame (Double Green & Terracotta)
  ctx.strokeStyle = forestGreen
  ctx.lineWidth = 4
  ctx.strokeRect(12, 12, W - 24, H - 24)
  ctx.strokeStyle = terracottaRed
  ctx.lineWidth = 1.5
  ctx.strokeRect(18, 18, W - 36, H - 36)

  // 3. Top Header Bar (Dark Forest Green)
  const headerH = 120
  ctx.fillStyle = forestGreen
  ctx.fillRect(20, 20, W - 40, headerH)

  // Top Header Text: HACKER HOUSE + गोवा
  ctx.save()
  ctx.font = '900 42px "Cormorant Garamond", "Georgia", serif'
  ctx.fillStyle = white
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('HACKER HOUSE', 48, 60)

  // Hindi text "गोवा"
  ctx.font = '900 40px "Cormorant Garamond", serif'
  ctx.fillStyle = sunYellow
  ctx.fillText('गोवा', 400, 60)

  // Subheader: OPEN TRIALS · OCT 28-31
  const datesText = (data.dates || 'OPEN TRIALS · OCT 28–31').toUpperCase()
  ctx.font = '700 13px "Space Mono", monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.letterSpacing = '2px'
  ctx.fillText(datesText, 48, 98)
  ctx.restore()

  // Top Right Sun Icon
  drawSunIcon(ctx, W - 75, 65, 22, sunYellow)

  // Wavy Terracotta Divider Line below Header
  drawWavyLine(ctx, 20, 20 + headerH, W - 40, terracottaRed)

  // 4. Subtle Palm Tree Watermark Silhouettes on Cream Background
  drawPalmWatermark(ctx, 45, 650, 110, forestGreen)
  drawPalmWatermark(ctx, W - 145, 650, 110, forestGreen)

  // 5. Sunburst Ray Graphic (Behind Photo)
  const sunburstCX = W / 2
  const sunburstCY = 310
  const sunburstR = 190
  drawSunburstGraphic(ctx, sunburstCX, sunburstCY, sunburstR, sunYellow, '#FFF6DB', terracottaRed)

  // Render Photo + Details
  if (data.imageUrl) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.save()
      // Render user image inside double rounded frame
      const photoW = 340
      const photoH = 310
      const photoX = (W - photoW) / 2
      const photoY = 160

      // Shadow behind photo frame
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
      ctx.shadowBlur = 16
      ctx.shadowOffsetY = 8

      // Outer Rounded Green Frame
      ctx.fillStyle = forestGreen
      roundRectPath(ctx, photoX - 10, photoY - 10, photoW + 20, photoH + 20, 28)
      ctx.fill()
      ctx.shadowColor = 'transparent'

      // Inner Terracotta Border
      ctx.strokeStyle = terracottaRed
      ctx.lineWidth = 3
      roundRectPath(ctx, photoX - 4, photoY - 4, photoW + 8, photoH + 8, 22)
      ctx.stroke()

      // Clip and Draw Photo
      ctx.beginPath()
      roundRectPath(ctx, photoX, photoY, photoW, photoH, 18)
      ctx.clip()

      const aspect = img.width / img.height
      let sx = 0, sy = 0, sw = img.width, sh = img.height
      if (aspect > photoW / photoH) {
        sw = img.height * (photoW / photoH)
        sx = (img.width - sw) / 2
      } else {
        sh = img.width / (photoW / photoH)
        sy = (img.height - sh) / 2
      }

      ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH)
      ctx.restore()

      // Draw User Details & Footer over card
      drawCardDetailsAndFooter(ctx, W, H, data, forestGreen, forestDark, terracottaRed, sunYellow, white)
    }
    img.src = data.imageUrl
  } else {
    // Placeholder photo box
    drawPlaceholderSubject(ctx, (W - 340) / 2, 160, 340, 310, forestGreen, terracottaRed)
    drawCardDetailsAndFooter(ctx, W, H, data, forestGreen, forestDark, terracottaRed, sunYellow, white)
  }
}

function drawCardDetailsAndFooter(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  data: BuilderData,
  forestGreen: string,
  _forestDark: string,
  terracottaRed: string,
  sunYellow: string,
  white: string
) {
  // 6. User Full Name (Centered Serif)
  const nameText = (data.name || 'EKLAVYA DILIP JHA').toUpperCase()
  ctx.save()
  const nameFontSize = fitFontSize(ctx, nameText, W - 120, 52, 28)
  ctx.font = `900 ${nameFontSize}px "Cormorant Garamond", "Georgia", serif`
  ctx.fillStyle = forestGreen
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(nameText, W / 2, 520)
  ctx.restore()

  // 7. Fun Title Badge (e.g. "Full-Moon Merge Monk")
  const badgeText = data.titleBadge || 'Full-Moon Merge Monk'
  ctx.save()
  ctx.font = '700 20px "Space Grotesk", sans-serif'
  const textW = ctx.measureText(badgeText).width
  const badgeW = Math.max(textW + 36, 220)
  const badgeH = 42
  const badgeX = (W - badgeW) / 2
  const badgeY = 552

  // Rounded Pill Box
  ctx.fillStyle = '#FFFDF7'
  roundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, 12)
  ctx.fill()
  ctx.strokeStyle = terracottaRed
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = terracottaRed
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(badgeText, W / 2, badgeY + badgeH / 2)
  ctx.restore()

  // 8. Dot-Leader Data Fields (ROLE, COLLEGE, PHONE)
  const fields = [
    { label: 'ROLE', value: data.role || 'Frontend + AI Developer' },
    { label: 'COLLEGE', value: data.college || 'Gandhinagar University' },
    { label: 'PHONE', value: data.phone || '....91' },
  ]

  let fieldY = 635
  const startX = 72
  const endX = W - 72

  fields.forEach(field => {
    ctx.save()
    // Field Label
    ctx.font = '700 13px "Space Mono", monospace'
    ctx.fillStyle = forestGreen
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(field.label, startX, fieldY)

    const labelWidth = ctx.measureText(field.label).width + 12

    // Field Value
    ctx.font = '600 15px "Space Grotesk", sans-serif'
    ctx.fillStyle = forestGreen
    ctx.textAlign = 'right'
    const valueWidth = ctx.measureText(field.value).width + 12
    ctx.fillText(field.value, endX, fieldY)

    // Dotted Connection Line
    const dotStartX = startX + labelWidth
    const dotEndX = endX - valueWidth
    if (dotEndX > dotStartX) {
      ctx.strokeStyle = 'rgba(4,74,41,0.35)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([2, 5])
      ctx.beginPath()
      ctx.moveTo(dotStartX, fieldY + 2)
      ctx.lineTo(dotEndX, fieldY + 2)
      ctx.stroke()
    }
    ctx.restore()
    fieldY += 38
  })

  // 9. Builder Serial Badge (e.g. BUILDER #108 / 247)
  const builderNum = data.builderNo || '108'
  const totalNum = data.totalBuilders || '247'
  const serialText = `BUILDER #${builderNum} / ${totalNum}`

  ctx.save()
  // Left Label
  ctx.font = '700 11px "Space Mono", monospace'
  ctx.fillStyle = 'rgba(4,74,41,0.45)'
  ctx.textAlign = 'left'
  ctx.fillText('2:47 PM STUDIO', startX, 790)

  // Right Top Sub-label
  ctx.textAlign = 'right'
  ctx.fillText(`${totalNum} BUILDERS`, endX, 772)

  // Main Serial Text
  ctx.font = '900 36px "Space Grotesk", "Arial Black", sans-serif'
  ctx.fillStyle = forestGreen
  ctx.fillText(serialText, endX, 804)
  ctx.restore()

  // 10. Perforation Line of Dots before Footer
  ctx.save()
  ctx.fillStyle = forestGreen
  for (let px = 24; px < W - 24; px += 16) {
    ctx.beginPath()
    ctx.arc(px, 835, 3.5, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  // 11. Footer Bar (Dark Forest Green)
  const footerY = 848
  const footerH = H - footerY - 20
  ctx.fillStyle = forestGreen
  ctx.fillRect(20, footerY, W - 40, footerH)

  // Barcode Graphic (Bottom Left)
  drawBarcode(ctx, 48, footerY + 18, 120, 32, white)
  ctx.font = '700 9px "Space Mono", monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.textAlign = 'left'
  ctx.fillText('@247pmstudio', 48, footerY + 62)

  // Center Slogan
  ctx.font = '700 12px "Space Mono", monospace'
  ctx.fillStyle = white
  ctx.textAlign = 'center'
  ctx.letterSpacing = '2px'
  ctx.fillText('LESS NOISE. MORE SIGNAL', W / 2, footerY + 36)

  // Right Hashtag
  ctx.font = '900 16px "Space Grotesk", sans-serif'
  ctx.fillStyle = sunYellow
  ctx.textAlign = 'right'
  ctx.fillText('#FrameInGoa', endX, footerY + 58)

  // Wavy Bottom Line
  drawWavyLine(ctx, 20, footerY + footerH, W - 40, sunYellow)
}

// Draw Sunburst Rays Graphic (Behind Photo)
function drawSunburstGraphic(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color1: string,
  color2: string,
  borderColor: string
) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.clip()

  const numRays = 18
  const angleStep = (Math.PI * 2) / numRays

  for (let i = 0; i < numRays; i++) {
    const startAngle = i * angleStep
    const endAngle = (i + 1) * angleStep
    ctx.fillStyle = i % 2 === 0 ? color1 : color2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, radius + 20, startAngle, endAngle)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  // Border ring around sunburst
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.restore()
}

// Draw Sun Icon (Top Right)
function drawSunIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.lineWidth = 3

  // Center circle
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()

  // Rays
  const rayLen = 10
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4
    const x1 = cx + Math.cos(angle) * (r + 4)
    const y1 = cy + Math.sin(angle) * (r + 4)
    const x2 = cx + Math.cos(angle) * (r + 4 + rayLen)
    const y2 = cy + Math.sin(angle) * (r + 4 + rayLen)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  ctx.restore()
}

// Draw Wavy Zigzag Line
function drawWavyLine(ctx: CanvasRenderingContext2D, x1: number, y: number, x2: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath()

  const wavelength = 16
  const amplitude = 3.5
  let toggle = 1

  ctx.moveTo(x1, y)
  for (let x = x1; x <= x2; x += wavelength / 2) {
    ctx.lineTo(x, y + toggle * amplitude)
    toggle = -toggle
  }
  ctx.stroke()
  ctx.restore()
}

// Draw Palm Watermark Silhouettes
function drawPalmWatermark(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.globalAlpha = 0.07

  // Curved Trunk
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.quadraticCurveTo(x + 20, y - h / 2, x + 10, y - h)
  ctx.stroke()

  // Fronds / Leaves
  const topX = x + 10
  const topY = y - h
  ctx.lineWidth = 3
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 4 - (i * Math.PI) / 6
    const lx = topX + Math.cos(angle) * 45
    const ly = topY + Math.sin(angle) * 45
    ctx.beginPath()
    ctx.moveTo(topX, topY)
    ctx.quadraticCurveTo(topX + Math.cos(angle) * 20, topY + Math.sin(angle) * 20 - 10, lx, ly)
    ctx.stroke()
  }
  ctx.restore()
}

// Draw Barcode Graphic
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, _w: number, h: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  const bars = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2]
  let currentX = x
  bars.forEach(bw => {
    ctx.fillRect(currentX, y, bw, h)
    currentX += bw + 3
  })
  ctx.restore()
}

// Placeholder Subject Frame
function drawPlaceholderSubject(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  green: string,
  red: string
) {
  ctx.save()
  // Outer Green Frame
  ctx.fillStyle = green
  roundRectPath(ctx, x - 10, y - 10, w + 20, h + 20, 28)
  ctx.fill()

  // Inner Red Border
  ctx.strokeStyle = red
  ctx.lineWidth = 3
  roundRectPath(ctx, x - 4, y - 4, w + 8, h + 8, 22)
  ctx.stroke()

  // Inner Cream Fill
  ctx.fillStyle = 'rgba(254, 252, 245, 0.9)'
  roundRectPath(ctx, x, y, w, h, 18)
  ctx.fill()

  // Head & Shoulder Silhouette
  ctx.fillStyle = 'rgba(4, 74, 41, 0.2)'
  ctx.beginPath()
  ctx.arc(x + w / 2, y + 120, 65, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(x + w / 2, y + 320, 130, 150, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Helper: Fit font size dynamically to width
function fitFontSize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number, minSize: number): number {
  let size = startSize
  ctx.font = `900 ${size}px "Cormorant Garamond", serif`
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 1
    ctx.font = `900 ${size}px "Cormorant Garamond", serif`
  }
  return size
}

// Helper: Rounded Rectangle Path
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Square PFP Frame Mode
function drawPFPFrame(ctx: CanvasRenderingContext2D, W: number, H: number, data: BuilderData) {
  const forestGreen = '#044A29'
  const sunYellow = '#F4B728'
  const terracottaRed = '#D9432F'

  ctx.fillStyle = forestGreen
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const r = 310

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
      drawPFPOverlay(ctx, W, H, cx, cy, r, data, forestGreen, sunYellow, terracottaRed)
    }
    img.src = data.imageUrl
  } else {
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(244, 183, 40, 0.15)'
    ctx.fill()
    ctx.restore()
    drawPFPOverlay(ctx, W, H, cx, cy, r, data, forestGreen, sunYellow, terracottaRed)
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
  _forestGreen: string,
  sunYellow: string,
  terracottaRed: string
) {
  // Dual Ring Frame
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = sunYellow
  ctx.lineWidth = 10
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx, cy, r + 8, 0, Math.PI * 2)
  ctx.strokeStyle = terracottaRed
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.restore()

  // Top title
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = '900 24px "Cormorant Garamond", serif'
  ctx.fillStyle = sunYellow
  ctx.fillText('HACKER HOUSE GOA 2026', cx, cy - r - 22)
  ctx.restore()

  // Bottom Name Tag
  if (data.name) {
    ctx.save()
    const tagW = 320
    const tagH = 46
    const tagX = cx - tagW / 2
    const tagY = cy + r - 50

    ctx.fillStyle = sunYellow
    ctx.fillRect(tagX, tagY, tagW, tagH)
    ctx.strokeStyle = terracottaRed
    ctx.lineWidth = 2
    ctx.strokeRect(tagX, tagY, tagW, tagH)

    ctx.textAlign = 'center'
    ctx.font = '900 22px "Cormorant Garamond", serif'
    ctx.fillStyle = '#044A29'
    ctx.fillText(data.name.toUpperCase(), cx, tagY + 28)
    ctx.restore()
  }

  // Footer hashtag
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = '700 16px "Space Mono", monospace'
  ctx.fillStyle = sunYellow
  ctx.fillText('#FrameInGoa', cx, H - 40)
  ctx.restore()
}

CardCanvas.displayName = 'CardCanvas'

export default CardCanvas
