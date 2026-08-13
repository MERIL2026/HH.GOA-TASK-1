import { useEffect, useRef, forwardRef } from 'react'
import QRCode from 'qrcode'
import type { BuilderData } from '../types'
import JsBarcode from 'jsbarcode'

interface CardCanvasProps {
  builderData: BuilderData
  onRenderComplete?: (dataUrl: string) => void
}

// Canvas dimensions — 2:3 ratio (800×1200)
const W = 800
const H = 1200

// Senior UI/UX Production Color Palette
const C = {
  cream: '#FAF5EB',
  green: '#113A28',
  red: '#DA443F',
  yellow: '#F9B42A',
  white: '#FFFFFF',
  darkGreen: '#0B3D2E',
  forestGreen: '#1D7A44',
  orange: '#E35A24',
}

const FONTS = {
  sans: 'Space Grotesk, sans-serif',
  mono: 'JetBrains Mono, monospace',
}

export const CardCanvas = forwardRef<HTMLCanvasElement, CardCanvasProps>(
  ({ builderData, onRenderComplete }, forwardedRef) => {
    const internalRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = (forwardedRef as React.RefObject<HTMLCanvasElement>) || internalRef

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      let isCancelled = false

      const render = async () => {
        // 1. Load template image (1024x1536 clean background)
        const templateImg = await loadImage('/card-template-clean.png?v=' + Date.now())
        if (isCancelled) return

        // 2. Draw template full-bleed onto 800×1200
        ctx.drawImage(templateImg, 0, 0, W, H)

        // 3. Draw user photo in square/rounded frame at blank space (center 400, 518; size 230x230)
        await drawUserPhoto(ctx, builderData)
        if (isCancelled) return

        // 4. Draw all dynamic content with managed typography & positions
        await drawDynamicContent(ctx, builderData)
        if (isCancelled) return

        // 4b. Draw Hacker House Goa Logo at bottom center
        try {
          const logoImg = await loadImage('/hhgoa-logo.png')
          // Draw centered at x=400, y=940
          // Logo dimensions (approx 200x120 for proportional scaling)
          const logoW = 180
          const logoH = 100
          ctx.drawImage(logoImg, 400 - (logoW / 2), 910, logoW, logoH)
        } catch (e) {
          console.error('Failed to load logo onto canvas', e)
        }

        // 5. Fire render-complete callback
        onRenderComplete?.(canvas.toDataURL('image/png', 1.0))
      }

      render().catch(console.error)

      return () => {
        isCancelled = true
      }
    }, [builderData, onRenderComplete, canvasRef])

    return (
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="card-canvas-renderer"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '480px',
          borderRadius: '8px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      />
    )
  }
)

export default CardCanvas

// ==========================================================================
// PHOTO — Rounded Square Frame in the photo space
// Center (400, 518), Size 230×230 (Radius 24px)
// ==========================================================================
// PHOTO — Vertical Rectangular Frame in the photo space
// Center (400, 475), Width 270×Height 330 (Radius 20px)
// Fits inside the main photo blank space, perfectly below HACKER HOUSE
// ==========================================================================

async function drawUserPhoto(ctx: CanvasRenderingContext2D, data: BuilderData) {
  const cx = 400
  const cy = 475
  const width = 270
  const height = 330
  const halfW = width / 2
  const halfH = height / 2
  const cornerRadius = 20

  if (data.imageUrl) {
    try {
      const img = await loadImage(data.imageUrl)
      ctx.save()

      // Rounded rectangular frame clipping path
      ctx.beginPath()
      ctx.roundRect(cx - halfW, cy - halfH, width, height, cornerRadius)
      ctx.clip()

      // Cover-fit image into rectangular frame
      const targetAspect = width / height
      const imgAspect = img.width / img.height
      let sx = 0, sy = 0, sw = img.width, sh = img.height
      if (imgAspect > targetAspect) {
        sw = img.height * targetAspect
        sx = (img.width - sw) / 2
      } else {
        sh = img.width / targetAspect
        sy = (img.height - sh) / 2
      }
      ctx.drawImage(img, sx, sy, sw, sh, cx - halfW, cy - halfH, width, height)
      ctx.restore()

      // Outer Gold / Green Accent Frame Border
      ctx.save()
      ctx.strokeStyle = C.yellow
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.roundRect(cx - halfW - 2, cy - halfH - 2, width + 4, height + 4, cornerRadius + 2)
      ctx.stroke()

      ctx.strokeStyle = C.green
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(cx - halfW - 5, cy - halfH - 5, width + 10, height + 10, cornerRadius + 4)
      ctx.stroke()
      ctx.restore()
    } catch {
      drawPhotoPlaceholder(ctx, data, cx, cy, width, height, cornerRadius)
    }
  } else {
    drawPhotoPlaceholder(ctx, data, cx, cy, width, height, cornerRadius)
  }
}

function drawPhotoPlaceholder(
  ctx: CanvasRenderingContext2D,
  data: BuilderData,
  cx: number, cy: number, width: number, height: number, cornerRadius: number
) {
  const halfW = width / 2
  const halfH = height / 2
  ctx.save()

  // Rectangular frame fill
  ctx.beginPath()
  ctx.roundRect(cx - halfW, cy - halfH, width, height, cornerRadius)
  ctx.fillStyle = C.cream
  ctx.fill()

  // Dashed border
  ctx.setLineDash([8, 6])
  ctx.strokeStyle = C.green
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.setLineDash([])

  // Outer gold accent frame
  ctx.strokeStyle = C.yellow
  ctx.lineWidth = 3
  ctx.strokeRect(cx - halfW - 3, cy - halfH - 3, width + 6, height + 6)

  // Initials inside placeholder
  const initials = (data.name || 'HH')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  ctx.font = `900 64px ${FONTS.sans}`
  ctx.fillStyle = C.green
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.globalAlpha = 0.35
  ctx.fillText(initials || 'HH', cx, cy)
  ctx.globalAlpha = 1.0
  ctx.restore()
}

// ==========================================================================
// DYNAMIC CONTENT — Managed Production Typography & Pixel Positions
// ==========================================================================

async function drawDynamicContent(ctx: CanvasRenderingContext2D, data: BuilderData) {

  // ──────────────────────────────────────────────────────────────
  // 1. PROFILE NAME — Directly below photo frame
  //    Position: Centered at y = 675
  //    Font Size: 42px Bold (scales down for length)
  // ──────────────────────────────────────────────────────────────
  if (data.name) {
    ctx.save()
    const nameText = data.name.toUpperCase()
    let fontSize = 42
    if (nameText.length > 24) fontSize = 24
    else if (nameText.length > 18) fontSize = 32

    ctx.font = `900 ${fontSize}px ${FONTS.sans}`
    ctx.fillStyle = C.green
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(nameText, 400, 675)
    ctx.restore()
  }

  // ──────────────────────────────────────────────────────────────
  // 2. COLLEGE / ORGANIZATION — Subtitle below name
  //    Position: Centered at y = 720
  //    Font Size: 26px Bold Dark Green
  // ──────────────────────────────────────────────────────────────
  if (data.college) {
    ctx.save()
    ctx.font = `700 26px ${FONTS.sans}`
    ctx.fillStyle = C.darkGreen
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const collegeText = data.college.toUpperCase()
    ctx.fillText(
      collegeText.length > 38 ? collegeText.slice(0, 36) + '…' : collegeText,
      400, 720
    )
    ctx.restore()
  }

  // ──────────────────────────────────────────────────────────────
  // 3. TITLE BADGE (e.g. "✦ FULL-MOON MERGE MONK ✦")
  //    Position: Centered at y = 755 (above BUILDER ID capsule)
  //    Font Size: 20px JetBrains Mono Dark Green
  // ──────────────────────────────────────────────────────────────
  if (data.titleBadge) {
    ctx.save()
    ctx.font = `700 20px ${FONTS.mono}`
    ctx.fillStyle = C.darkGreen
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`✦ ${data.titleBadge.toUpperCase()} ✦`, 400, 755)
    ctx.restore()
  }

  // ──────────────────────────────────────────────────────────────
  // 4. ROLE TEXT — Placed inside yellow ribbon placeholder below BUILDER ID
  //    Position: Centered at y = 855 (inside yellow ribbon banner)
  //    Font Size: 18px Heavy Italic Dark Green
  // ──────────────────────────────────────────────────────────────
  ctx.save()
  ctx.font = `italic 800 18px ${FONTS.sans}`
  ctx.fillStyle = C.darkGreen
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const roleText = (data.role || 'FULL STACK DEVELOPER').toUpperCase()
  ctx.fillText(roleText, 400, 855)
  ctx.restore()

  // ──────────────────────────────────────────────────────────────
  // 5. QR CODE — Bottom-left white container
  //    Position: (82, 995), size 105×105
  // ──────────────────────────────────────────────────────────────
  const idNumber = data.builderNo || `HHGOA26-${Math.floor(1000 + Math.random() * 9000)}`

  try {
    const qrDataUrl = await QRCode.toDataURL(idNumber, {
      width: 105,
      margin: 0,
      color: { dark: C.green, light: '#FFFFFF00' },
    })
    const qrImg = await loadImage(qrDataUrl)
    ctx.drawImage(qrImg, 82, 995, 105, 105)
  } catch (e) {
    console.error('QR Generation failed', e)
  }

  // ──────────────────────────────────────────────────────────────
  // 6. BUILDER ID LABEL & NUMBER
  //    Position: (215, 1005) and (215, 1028)
  // ──────────────────────────────────────────────────────────────
  ctx.save()
  ctx.font = `700 12px ${FONTS.mono}`
  ctx.fillStyle = C.green
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('BUILDER ID', 215, 1005)

  ctx.font = `900 26px ${FONTS.sans}`
  ctx.fillStyle = C.red
  ctx.fillText(idNumber, 215, 1028)
  ctx.restore()

  // ──────────────────────────────────────────────────────────────
  // 7. BARCODE — Below Builder ID number
  //    Position: (215, 1062), size 270×24
  // ──────────────────────────────────────────────────────────────
  try {
    const barcodeCanvas = document.createElement('canvas')
    JsBarcode(barcodeCanvas, idNumber, {
      format: 'CODE128',
      displayValue: false,
      width: 1.8,
      height: 22,
      lineColor: C.green,
      background: 'transparent',
      margin: 0,
    })
    ctx.drawImage(barcodeCanvas, 215, 1062, 270, 24)
  } catch (e) {
    console.error('Barcode generation failed', e)
  }

  // ──────────────────────────────────────────────────────────────
  // 8. EVENT DATES — Below barcode
  // ──────────────────────────────────────────────────────────────
  if (data.dates) {
    ctx.save()
    ctx.font = `600 10px ${FONTS.mono}`
    ctx.fillStyle = C.green
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(data.dates, 215, 1090)
    ctx.restore()
  }
}


// Image loader utility
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
