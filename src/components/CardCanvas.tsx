import { useEffect, useRef, forwardRef } from 'react'
import QRCode from 'qrcode'
import type { BuilderData } from '../types'
import JsBarcode from 'jsbarcode'

interface CardCanvasProps {
  builderData: BuilderData
  onRenderComplete?: (dataUrl: string) => void
}

// Canvas dimensions — 2:3 ratio matching the 1024×1536 original
const W = 800
const H = 1200

// Scale factor: 800 / 1024 = 0.78125
const S = 0.78125

// Colors sampled from the original template
const C = {
  cream: '#FAF5EB',
  green: '#113A28',
  red: '#DA443F',
  yellow: '#F9B42A',
  white: '#FFFFFF',
}

const FONTS = {
  sans: 'Space Grotesk, sans-serif',
  mono: 'JetBrains Mono, monospace',
}

// ==========================================================================
// COMPONENT
// ==========================================================================

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
        // 1. Load the cleaned template image with cache buster
        const templateImg = await loadImage('/card-template-clean.png?v=' + Date.now())
        if (isCancelled) return

        // 2. Draw template scaled to 800×1200
        ctx.drawImage(templateImg, 0, 0, W, H)

        // 3. Draw user photo into the circle area
        await drawUserPhoto(ctx, builderData)
        if (isCancelled) return

        // 5. Draw all dynamic text, QR code, and barcode
        await drawDynamicContent(ctx, builderData)
        if (isCancelled) return

        // 6. Notify parent (for lanyard texture)
        onRenderComplete?.(canvas.toDataURL('image/png', 1.0))
      }

      render().catch(console.error)

      return () => { isCancelled = true }
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

// Placeholders are now removed from the base image itself.

// ==========================================================================
// PHOTO — Draw the user's photo clipped to the dashed circle area
// Original circle: center≈(512, 850), radius≈170
// Canvas: center≈(400, 664), radius≈133
// ==========================================================================

async function drawUserPhoto(ctx: CanvasRenderingContext2D, data: BuilderData) {
  const cx = 400
  const cy = 652
  const r = 139

  if (data.imageUrl) {
    try {
      const img = await loadImage(data.imageUrl)
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.clip()

      // Cover-fit the image into the circle
      const aspect = img.width / img.height
      let sx = 0, sy = 0, sw = img.width, sh = img.height
      if (aspect > 1) {
        sw = img.height
        sx = (img.width - img.height) / 2
      } else {
        sh = img.width
        sy = (img.height - img.width) / 2
      }
      ctx.drawImage(img, sx, sy, sw, sh, cx - r, cy - r, r * 2, r * 2)
      ctx.restore()
    } catch (e) {
      drawFallbackAvatar(ctx, cx, cy, r)
    }
  } else {
    drawFallbackAvatar(ctx, cx, cy, r)
  }
}

function drawFallbackAvatar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  // Do nothing. The base card-template-clean.png already has a perfectly blank white circle.
  // This fulfills the requirement to just show the blank template if no photo is uploaded.
}

// ==========================================================================
// DYNAMIC CONTENT — Text, QR code, barcode
// ==========================================================================

async function drawDynamicContent(ctx: CanvasRenderingContext2D, data: BuilderData) {
  // 1. Role text on yellow ribbon
  ctx.font = `900 13px ${FONTS.sans}`
  ctx.fillStyle = C.green
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const roleText = (data.role || data.name || 'FULL STACK DEVELOPER').toUpperCase()
  ctx.fillText(roleText, 400, 882)

  // 2. Badge values (red text under each icon)
  // Original: y≈1252 → canvas y≈978
  ctx.font = `900 11px ${FONTS.sans}`
  ctx.fillStyle = C.red
  const classText = (data.builderClass || 'TERMINAL WIZARD').toUpperCase()
  ctx.fillStyle = '#1D7A44' // Green for coconut
  const bagText = (data.beachBag || 'COCONUT · VS CODE').toUpperCase()
  ctx.fillStyle = '#E35A24' // Orange for shipping
  const shipText = (data.shipping || 'BUILDING THE FUTURE').toUpperCase()

  // Draw them
  ctx.fillStyle = C.red
  ctx.fillText(classText.length > 18 ? classText.slice(0, 16) + '…' : classText, 170, 980)
  ctx.fillStyle = '#1D7A44'
  ctx.fillText(bagText.length > 18 ? bagText.slice(0, 16) + '…' : bagText, 400, 980)
  ctx.fillStyle = '#E35A24'
  ctx.fillText(shipText.length > 18 ? shipText.slice(0, 16) + '…' : shipText, 610, 980)

  // 3. ID Number
  const idNumber = data.builderNo || `HHGOA26-${Math.floor(1000 + Math.random() * 9000)}`
  ctx.font = `900 20px ${FONTS.sans}`
  ctx.fillStyle = C.red // The ID string should be red
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(idNumber, 280, 1075)

  // 4. QR Code
  // Original: QR inner at x≈148..270, y≈1360..1470
  // Canvas: x≈116..211, y≈1062..1148
  try {
    const qrDataUrl = await QRCode.toDataURL(idNumber, {
      width: 95,
      margin: 0,
      color: { dark: C.green, light: C.white },
    })
    const qrImg = await loadImage(qrDataUrl)
    ctx.drawImage(qrImg, 111, 1027, 118, 118)
  } catch (e) {
    console.error('QR Generation failed', e)
  }

  // 5. Barcode
  try {
    const barcodeCanvas = document.createElement('canvas')
    JsBarcode(barcodeCanvas, idNumber, {
      format: 'CODE128',
      displayValue: false,
      width: 1.5,
      height: 22,
      lineColor: C.green,
      background: C.cream,
      margin: 0,
    })
    ctx.drawImage(barcodeCanvas, 280, 1105, 250, 24)
  } catch (e) {
    console.error('Barcode generation failed', e)
  }
}

// ==========================================================================
// UTILITY
// ==========================================================================

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
