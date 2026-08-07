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
      style={{ width: '100%', maxWidth: '480px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
    />
  )
})

function drawPosterIDCard(ctx: CanvasRenderingContext2D, W: number, H: number, data: BuilderData) {
  const maroon = '#7A0C16'
  const darkMaroon = '#5B050D'

  // 1. Background
  ctx.fillStyle = '#F6F4EF'
  ctx.fillRect(0, 0, W, H)

  // 2. Geometric Lattice Pattern
  drawLatticePattern(ctx, W, H)

  // 3. Double Outer Frame
  ctx.strokeStyle = maroon
  ctx.lineWidth = 3
  ctx.strokeRect(16, 16, W - 32, H - 32)
  ctx.lineWidth = 1.5
  ctx.strokeRect(22, 22, W - 44, H - 44)

  // 4. Top Header - Group Badge (Top Left)
  const groupText = (data.groupNo || 'KELOMPOK 76').toUpperCase()
  ctx.save()
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(48, 42, 260, 46)
  ctx.strokeStyle = maroon
  ctx.lineWidth = 2.5
  ctx.strokeRect(48, 42, 260, 46)

  ctx.font = '900 24px "Arial Black", "Impact", sans-serif'
  ctx.fillStyle = maroon
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(groupText, 48 + 130, 42 + 23)
  ctx.restore()

  // 5. Top Header - Logos (Top Right)
  drawTopLogos(ctx, W - 48, 42)

  // 6. Main Headline Box (KKN 2026)
  const titleText = (data.headerTitle || 'KKN 2026').toUpperCase()
  ctx.save()
  ctx.strokeStyle = maroon
  ctx.lineWidth = 3
  ctx.strokeRect(48, 104, 704, 150)
  ctx.lineWidth = 1.5
  ctx.strokeRect(53, 109, 694, 140)

  ctx.font = '900 115px "Arial Black", "Impact", sans-serif'
  ctx.fillStyle = maroon
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(titleText, W / 2, 104 + 75)
  ctx.restore()

  // 7. Red Background Block (Left Side)
  const redBoxX = 48
  const redBoxY = 275
  const redBoxW = 430
  const redBoxH = 670

  const redGrad = ctx.createLinearGradient(redBoxX, redBoxY, redBoxX, redBoxY + redBoxH)
  redGrad.addColorStop(0, '#981421')
  redGrad.addColorStop(1, '#5C050D')
  ctx.fillStyle = redGrad
  ctx.fillRect(redBoxX, redBoxY, redBoxW, redBoxH)

  // Architectural silhouette inside red block
  drawBuildingSilhouette(ctx, redBoxX, redBoxY, redBoxW, redBoxH)

  // 8. Vertical Stacked Text (Right Side)
  const verticalText = (data.sideText || 'UNIVERSITAS NEGERI').toUpperCase()
  ctx.save()
  ctx.translate(W - 65, 275)
  ctx.rotate(Math.PI / 2)
  ctx.font = '900 78px "Arial Black", "Impact", sans-serif'
  ctx.fillStyle = maroon
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(verticalText, 0, 0)
  ctx.restore()

  // Render Image + Overlays (Name tag & Footer)
  if (data.imageUrl) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.save()
      // Render user image in foreground
      const imgW = 460
      const imgH = 650
      const imgX = (W - imgW) / 2 - 20
      const imgY = 285

      // Smart Crop / Draw
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
      drawNameTagAndFooter(ctx, W, H, data, maroon, darkMaroon)
    }
    img.src = data.imageUrl
  } else {
    // Placeholder silhouette
    drawPlaceholderSubject(ctx, redBoxX + 40, redBoxY + 50, 350, 600)
    drawNameTagAndFooter(ctx, W, H, data, maroon, darkMaroon)
  }
}

function drawNameTagAndFooter(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  data: BuilderData,
  maroon: string,
  darkMaroon: string
) {
  // 9. Name Tag (White box on bottom-left of photo)
  const nameText = (data.name || 'NAMA ANGGOTA').toUpperCase()
  const nameTagX = 76
  const nameTagY = 860
  const nameTagW = 310
  const nameTagH = 54

  ctx.save()
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(nameTagX, nameTagY, nameTagW, nameTagH)
  ctx.strokeStyle = maroon
  ctx.lineWidth = 2.5
  ctx.strokeRect(nameTagX, nameTagY, nameTagW, nameTagH)

  ctx.font = '900 25px "Arial Black", "Impact", sans-serif'
  ctx.fillStyle = maroon
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(nameText, nameTagX + nameTagW / 2, nameTagY + nameTagH / 2)
  ctx.restore()

  // 10. Bottom Footer Bar
  const footerX = 24
  const footerY = 960
  const footerW = W - 48
  const footerH = 150

  // Solid dark maroon footer
  ctx.fillStyle = darkMaroon
  ctx.fillRect(footerX, footerY, footerW, footerH)

  // Halftone Dot Matrix Pattern (Bottom Left)
  drawHalftoneDots(ctx, footerX + 10, footerY + 20, 100, 110)

  // Sparkle Stars
  drawSparkleStar(ctx, footerX + 35, footerY + 35, 12)
  drawSparkleStar(ctx, footerX + footerW - 20, footerY + 115, 16)
  drawSparkleStar(ctx, footerX + footerW - 35, footerY + 30, 8)

  // Left Title / Role (e.g. KETUA)
  const roleText = (data.role || 'KETUA').toUpperCase()
  ctx.save()
  ctx.font = '900 58px "Arial Black", "Impact", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(roleText, footerX + 110, footerY + 75)
  ctx.restore()

  // Center Emblem (Diamond Ornament)
  drawDiamondCrest(ctx, footerX + footerW / 2 - 20, footerY + 42)

  // Right Side Info (Location / Dept)
  const locText = (data.location || 'DESA KECAMATAN KABUPATEN').toUpperCase()
  ctx.save()
  ctx.font = '800 15px "Arial", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText(locText, footerX + footerW - 30, footerY + 52)

  // Decorative Tech Grid / Checkers (Bottom Right)
  drawTechIconsRight(ctx, footerX + footerW - 190, footerY + 80)
  ctx.restore()
}

// Background Geometric Lattice Pattern
function drawLatticePattern(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.save()
  ctx.strokeStyle = 'rgba(122, 12, 22, 0.08)'
  ctx.lineWidth = 1
  const step = 40

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

// Top Right Emblem Badges
function drawTopLogos(ctx: CanvasRenderingContext2D, rightX: number, topY: number) {
  ctx.save()
  // Logo 1: Tut Wuri Handayani Education Shield
  const r1X = rightX - 180
  ctx.fillStyle = '#0284C7'
  ctx.beginPath()
  ctx.arc(r1X + 20, topY + 23, 20, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 10px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('EDUCATION', r1X + 20, topY + 26)

  // Logo 2: Kampus Merdeka Emblem
  const r2X = rightX - 110
  ctx.font = '900 13px sans-serif'
  ctx.fillStyle = '#0369A1'
  ctx.textAlign = 'left'
  ctx.fillText('Kampus', r2X, topY + 18)
  ctx.fillStyle = '#EAB308'
  ctx.fillText('Merdeka', r2X, topY + 32)

  // Logo 3: University Crest Badge
  const r3X = rightX - 35
  ctx.fillStyle = '#1E293B'
  ctx.beginPath()
  ctx.arc(r3X + 18, topY + 23, 18, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '10px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('★', r3X + 18, topY + 26)
  ctx.restore()
}

// Architectural Building Backdrop Watermark inside Red Block
function drawBuildingSilhouette(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
  const bY = y + h - 140

  // Draw Pillars & Roof outline
  ctx.fillRect(x + 20, bY, w - 40, 140)

  // Pillars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
  for (let px = x + 40; px < x + w - 50; px += 45) {
    ctx.fillRect(px, bY + 30, 22, 110)
  }

  // Triangular Roof Pediment
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
  ctx.beginPath()
  ctx.moveTo(x + 10, bY)
  ctx.lineTo(x + w / 2, bY - 60)
  ctx.lineTo(x + w - 10, bY)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// Placeholder Subject Silhouette when no image is uploaded
function drawPlaceholderSubject(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'

  // Head
  ctx.beginPath()
  ctx.arc(x + w / 2, y + 140, 85, 0, Math.PI * 2)
  ctx.fill()

  // Torso / Shoulders
  ctx.beginPath()
  ctx.ellipse(x + w / 2, y + 420, 160, 200, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Halftone Dot Grid
function drawHalftoneDots(ctx: CanvasRenderingContext2D, startX: number, startY: number, w: number, h: number) {
  ctx.save()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
  const cols = 6
  const rows = 7
  const dx = w / cols
  const dy = h / rows

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const radius = (r + 1) * 0.8
      ctx.beginPath()
      ctx.arc(startX + c * dx, startY + r * dy, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}

// Sparkle Star Shape
function drawSparkleStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save()
  ctx.fillStyle = '#FFFFFF'
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
function drawDiamondCrest(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1.5
  const w = 45
  const h = 45

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
  ctx.moveTo(x + w / 2, y + 8)
  ctx.lineTo(x + w - 8, y + h / 2)
  ctx.lineTo(x + w / 2, y + h - 8)
  ctx.lineTo(x + 8, y + h / 2)
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

// Decorative Grid / Checkers on Footer Right
function drawTechIconsRight(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  // Checkerboard grid 4x2
  ctx.fillStyle = '#FFFFFF'
  const sz = 8
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      if ((r + c) % 2 === 0) {
        ctx.fillRect(x + c * sz, y + r * sz, sz, sz)
      }
    }
  }

  // Futuristic orbital symbol
  const ox = x + 60
  const oy = y + 8
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(ox, oy, 14, 6, Math.PI / 4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(ox, oy, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// PFP Frame renderer (Square mode)
function drawPFPFrame(ctx: CanvasRenderingContext2D, W: number, H: number, data: BuilderData) {
  ctx.fillStyle = '#0A0A0A'
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const r = 330

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
      drawPFPOverlay(ctx, W, H, cx, cy, r, data)
    }
    img.src = data.imageUrl
  } else {
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(122, 12, 22, 0.2)'
    ctx.fill()
    ctx.restore()
    drawPFPOverlay(ctx, W, H, cx, cy, r, data)
  }
}

function drawPFPOverlay(ctx: CanvasRenderingContext2D, _W: number, H: number, cx: number, cy: number, r: number, data: BuilderData) {
  // Main ring
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = '#7A0C16'
  ctx.lineWidth = 10
  ctx.stroke()
  ctx.restore()

  // Top title
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = '900 16px "Arial Black", sans-serif'
  ctx.fillStyle = '#7A0C16'
  ctx.fillText(data.headerTitle || 'KKN 2026', cx, cy - r - 20)
  ctx.restore()

  // Bottom Name Tag
  if (data.name) {
    ctx.save()
    const tagW = 320
    const tagH = 50
    const tagX = cx - tagW / 2
    const tagY = cy + r - 60

    ctx.fillStyle = '#7A0C16'
    ctx.fillRect(tagX, tagY, tagW, tagH)
    ctx.restore()

    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = '900 24px "Arial Black", sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(data.name.toUpperCase(), cx, tagY + 34)
    ctx.restore()
  }

  // Footer text
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillStyle = '#7A0C16'
  ctx.fillText(data.groupNo || 'KELOMPOK 76', cx, H - 40)
  ctx.restore()
}

CardCanvas.displayName = 'CardCanvas'

export default CardCanvas
