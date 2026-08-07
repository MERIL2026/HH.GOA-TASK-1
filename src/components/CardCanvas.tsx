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
    const H = builderData.cardType === 'pfp-frame' ? 800 : 960
    canvas.width = W
    canvas.height = H

    if (builderData.cardType === 'id-card') {
      drawIDCard(ctx, W, H, builderData)
    } else {
      drawPFPFrame(ctx, W, H, builderData)
    }
  }, [builderData])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', maxWidth: '480px' }}
    />
  )
})

function drawIDCard(ctx: CanvasRenderingContext2D, W: number, H: number, data: BuilderData) {
  // Background
  ctx.fillStyle = '#080808'
  ctx.fillRect(0, 0, W, H)

  // Background gradient top
  const bgGrad = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 600)
  bgGrad.addColorStop(0, 'rgba(4,106,56,0.15)')
  bgGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  // Bottom gradient
  const bgGrad2 = ctx.createRadialGradient(W, H, 0, W, H, 500)
  bgGrad2.addColorStop(0, 'rgba(232,25,44,0.06)')
  bgGrad2.addColorStop(1, 'transparent')
  ctx.fillStyle = bgGrad2
  ctx.fillRect(0, 0, W, H)

  // Card border
  ctx.save()
  roundRect(ctx, 32, 32, W - 64, H - 64, 32)
  ctx.strokeStyle = 'rgba(4,106,56,0.3)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.restore()

  // Top bar — HH GOA branding stripe
  ctx.fillStyle = '#046A38'
  roundRect(ctx, 32, 32, W - 64, 10, { tl: 32, tr: 32, bl: 0, br: 0 })
  ctx.fill()

  // Header area
  ctx.save()
  ctx.font = 'bold 13px "Space Mono", monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.letterSpacing = '3px'
  ctx.fillText('HACKER HOUSE GOA 2026', 64, 90)
  ctx.restore()

  ctx.save()
  ctx.font = 'bold 13px "Space Mono", monospace'
  ctx.fillStyle = '#046A38'
  ctx.textAlign = 'right'
  ctx.fillText('BUILDER ID', W - 64, 90)
  ctx.restore()

  // Horizontal rule
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  ctx.fillRect(64, 100, W - 128, 1)

  // Photo area
  const photoSize = 300
  const photoX = (W - photoSize) / 2
  const photoY = 130

  if (data.imageUrl) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.save()
      // Draw photo with circle clip
      ctx.beginPath()
      roundRect(ctx, photoX, photoY, photoSize, photoSize, 20)
      ctx.clip()
      // Smart crop: fill the square
      const aspect = img.width / img.height
      let sx = 0, sy = 0, sw = img.width, sh = img.height
      if (aspect > 1) {
        sw = img.height
        sx = (img.width - sw) / 2
      } else {
        sh = img.width
        sy = (img.height - sh) / 2
      }
      ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoSize, photoSize)
      ctx.restore()

      // Photo border
      ctx.save()
      roundRect(ctx, photoX, photoY, photoSize, photoSize, 20)
      ctx.strokeStyle = 'rgba(4,106,56,0.5)'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      // Draw info below photo
      drawIDCardInfo(ctx, W, H, data, photoY + photoSize)
    }
    img.src = data.imageUrl
  } else {
    // Placeholder
    ctx.fillStyle = 'rgba(4,106,56,0.08)'
    ctx.beginPath()
    roundRect(ctx, photoX, photoY, photoSize, photoSize, 20)
    ctx.fill()
    ctx.strokeStyle = 'rgba(4,106,56,0.2)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    drawIDCardInfo(ctx, W, H, data, photoY + photoSize)
  }
}

function drawIDCardInfo(ctx: CanvasRenderingContext2D, W: number, H: number, data: BuilderData, afterPhotoY: number) {
  const centerX = W / 2
  let y = afterPhotoY + 36

  // Name
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = 'bold 42px "Space Grotesk", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  const name = data.name || 'Your Name'
  ctx.fillText(name.toUpperCase(), centerX, y)
  y += 10

  // Underline accent
  const nameWidth = ctx.measureText(name.toUpperCase()).width
  const lineW = Math.min(nameWidth * 0.4, 100)
  ctx.fillStyle = '#046A38'
  ctx.fillRect(centerX - lineW / 2, y + 4, lineW, 3)
  ctx.restore()
  y += 30

  // Stack/Role
  if (data.stack || data.role) {
    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = '18px "Inter", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    const roleText = [data.stack, data.role].filter(Boolean).join(' · ')
    ctx.fillText(roleText, centerX, y + 20)
    ctx.restore()
    y += 50
  } else {
    y += 20
  }

  // Builder ID badge
  const badgeW = 240
  const badgeH = 36
  const badgeX = centerX - badgeW / 2
  const badgeY = y + 20

  ctx.save()
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 18)
  ctx.fillStyle = 'rgba(4,106,56,0.12)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(4,106,56,0.3)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = 'bold 12px "Space Mono", monospace'
  ctx.fillStyle = '#046A38'
  ctx.letterSpacing = '2px'
  ctx.fillText('HH · GOA · 2026 · BUILDER', centerX, badgeY + 23)
  ctx.restore()

  y = badgeY + badgeH + 40

  // Hashtag footer
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = 'bold 20px "Space Grotesk", sans-serif'
  ctx.fillStyle = '#FFD73A'
  ctx.fillText('#FrameInGoa', centerX, H - 60)
  ctx.restore()

  // Bottom line
  ctx.fillStyle = '#046A38'
  ctx.fillRect(32, H - 42, W - 64, 6)
  roundRect(ctx, 32, H - 42, W - 64, 6, { tl: 0, tr: 0, bl: 32, br: 32 })
  ctx.fillStyle = '#046A38'
  ctx.fill()
}

function drawPFPFrame(ctx: CanvasRenderingContext2D, W: number, H: number, data: BuilderData) {
  // Background
  ctx.fillStyle = '#0A0A0A'
  ctx.fillRect(0, 0, W, H)

  // Background glow
  const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 1.5)
  bgGrad.addColorStop(0, 'rgba(4,106,56,0.1)')
  bgGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const r = 330

  // Outer glow ring
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r + 20, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(4,106,56,0.15)'
  ctx.lineWidth = 40
  ctx.stroke()
  ctx.restore()

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
    ctx.fillStyle = 'rgba(4,106,56,0.08)'
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
  const ringGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
  ringGrad.addColorStop(0, '#046A38')
  ringGrad.addColorStop(0.5, '#0ED47B')
  ringGrad.addColorStop(1, '#046A38')
  ctx.strokeStyle = ringGrad
  ctx.lineWidth = 8
  ctx.stroke()
  ctx.restore()

  // Top badge
  const badgeArc = -Math.PI / 2
  const badgeY = cy + Math.sin(badgeArc) * (r + 4)

  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = 'bold 11px "Space Mono", monospace'
  ctx.fillStyle = '#046A38'
  ctx.fillText('HACKER HOUSE GOA 2026', cx, badgeY - 12)
  ctx.restore()

  // Bottom name tag
  if (data.name) {
    ctx.save()
    const tagW = Math.min(ctx.measureText(data.name).width + 80, 300)
    const tagH = 44
    const tagX = cx - tagW / 2
    const tagY = cy + r - 60

    roundRect(ctx, tagX, tagY, tagW, tagH, 22)
    ctx.fillStyle = '#046A38'
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = 'bold 20px "Space Grotesk", sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(data.name, cx, tagY + 29)
    ctx.restore()
  }

  // Hashtag
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = 'bold 16px "Space Grotesk", sans-serif'
  ctx.fillStyle = '#FFD73A'
  ctx.fillText('#FrameInGoa', cx, H - 40)
  ctx.restore()
}

// Utility: rounded rect path
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  radius: number | { tl: number; tr: number; bl: number; br: number }
) {
  const r = typeof radius === 'number'
    ? { tl: radius, tr: radius, bl: radius, br: radius }
    : radius

  ctx.beginPath()
  ctx.moveTo(x + r.tl, y)
  ctx.lineTo(x + w - r.tr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr)
  ctx.lineTo(x + w, y + h - r.br)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h)
  ctx.lineTo(x + r.bl, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl)
  ctx.lineTo(x, y + r.tl)
  ctx.quadraticCurveTo(x, y, x + r.tl, y)
  ctx.closePath()
}

CardCanvas.displayName = 'CardCanvas'

export default CardCanvas
