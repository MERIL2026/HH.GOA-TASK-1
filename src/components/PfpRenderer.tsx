import { useEffect, useRef, forwardRef } from 'react'
import type { BuilderData, PfpFrameStyle } from '../types'

interface PfpRendererProps {
  builderData: BuilderData
  frameStyle?: PfpFrameStyle
  onRenderComplete?: (dataUrl: string) => void
}

const W = 1024
const H = 1024

const C = {
  green: '#064F36',
  darkGreen: '#0B3D2E',
  cream: '#F6EED8',
  yellow: '#F5C842',
  pink: '#E72B68',
  coral: '#F28A8A',
  ink: '#111111',
  terracotta: '#DA443F',
  white: '#FFFFFF',
}

export const PfpRenderer = forwardRef<HTMLCanvasElement, PfpRendererProps>(
  ({ builderData, frameStyle = 'classic-goa', onRenderComplete }, forwardedRef) => {
    const internalRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = (forwardedRef as React.RefObject<HTMLCanvasElement>) || internalRef

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      let isCancelled = false

      const render = async () => {
        // Clear canvas
        ctx.clearRect(0, 0, W, H)

        const activeFrame = builderData.pfpFrame || frameStyle

        // 1. Draw frame background & photo area
        if (activeFrame === 'builder-mode') {
          drawBuilderModeFrame(ctx)
        } else if (activeFrame === 'ship-from-paradise') {
          drawShipFromParadiseFrame(ctx)
        } else {
          drawClassicGoaFrame(ctx)
        }

        // 2. Draw user photo cover-fitted in center
        await drawCenterPhoto(ctx, builderData, activeFrame)
        if (isCancelled) return

        // 3. Draw foreground overlay badge & frame elements
        drawFrameOverlay(ctx, builderData, activeFrame)

        // 4. Trigger render complete
        onRenderComplete?.(canvas.toDataURL('image/png', 1.0))
      }

      render().catch(console.error)
      return () => { isCancelled = true }
    }, [builderData, frameStyle, onRenderComplete, canvasRef])

    return (
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="pfp-canvas-renderer"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '420px',
          aspectRatio: '1/1',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        }}
      />
    )
  }
)

export default PfpRenderer

// ==========================================================================
// FRAME RENDERING LOGIC
// ==========================================================================

function drawClassicGoaFrame(ctx: CanvasRenderingContext2D) {
  // Background paper texture
  ctx.fillStyle = C.cream
  ctx.fillRect(0, 0, W, H)

  // Outer green border
  ctx.fillStyle = C.green
  ctx.fillRect(0, 0, W, 48)
  ctx.fillRect(0, H - 48, W, 48)
  ctx.fillRect(0, 0, 48, H)
  ctx.fillRect(W - 48, 0, 48, H)

  // Gold inner accent border
  ctx.strokeStyle = C.yellow
  ctx.lineWidth = 8
  ctx.strokeRect(56, 56, W - 112, H - 112)
}

function drawBuilderModeFrame(ctx: CanvasRenderingContext2D) {
  // Cyber dark green background
  ctx.fillStyle = C.darkGreen
  ctx.fillRect(0, 0, W, H)

  // Neon yellow accent frame
  ctx.strokeStyle = C.yellow
  ctx.lineWidth = 12
  ctx.strokeRect(40, 40, W - 80, H - 80)

  // Corner brackets
  ctx.fillStyle = C.yellow
  ctx.fillRect(30, 30, 60, 16)
  ctx.fillRect(30, 30, 16, 60)
  ctx.fillRect(W - 90, 30, 60, 16)
  ctx.fillRect(W - 46, 30, 16, 60)
  ctx.fillRect(30, H - 46, 60, 16)
  ctx.fillRect(30, H - 90, 16, 60)
  ctx.fillRect(W - 90, H - 46, 60, 16)
  ctx.fillRect(W - 46, H - 90, 16, 60)
}

function drawShipFromParadiseFrame(ctx: CanvasRenderingContext2D) {
  // Sunset terracotta background
  ctx.fillStyle = C.terracotta
  ctx.fillRect(0, 0, W, H)

  // Cream inner margin
  ctx.fillStyle = C.cream
  ctx.fillRect(36, 36, W - 72, H - 72)

  // Pink border
  ctx.strokeStyle = C.pink
  ctx.lineWidth = 14
  ctx.strokeRect(50, 50, W - 100, H - 100)
}

// ==========================================================================
// PHOTO RENDERING
// ==========================================================================

async function drawCenterPhoto(ctx: CanvasRenderingContext2D, data: BuilderData, frame: PfpFrameStyle) {
  const cx = W / 2
  const cy = H / 2 - 20
  const r = frame === 'builder-mode' ? 360 : 380

  if (!data.imageUrl) {
    // Default avatar circle placeholder
    ctx.save()
    ctx.fillStyle = C.green
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '900 120px Space Grotesk, sans-serif'
    ctx.fillStyle = C.yellow
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const initials = (data.name || 'HH GOA').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    ctx.fillText(initials || 'GOA', cx, cy)
    ctx.restore()
    return
  }

  try {
    const img = await loadImage(data.imageUrl)
    ctx.save()
    ctx.beginPath()

    if (frame === 'builder-mode') {
      // Rounded octagon / squircle shape
      const sz = r * 2
      ctx.roundRect(cx - r, cy - r, sz, sz, 48)
    } else {
      // Circle shape
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
    }
    ctx.clip()

    // Cover fit image
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
    console.error('PFP Image draw failed', e)
  }
}

// ==========================================================================
// OVERLAY BADGES & BRANDING
// ==========================================================================

function drawFrameOverlay(ctx: CanvasRenderingContext2D, data: BuilderData, frame: PfpFrameStyle) {
  ctx.save()

  const name = (data.name || 'HACKER HOUSE BUILDER').toUpperCase()
  const idNumber = data.builderNo || 'HHGOA26-BUILDER'

  if (frame === 'builder-mode') {
    // Header Banner
    ctx.fillStyle = C.yellow
    ctx.fillRect(100, 50, W - 200, 56)
    ctx.font = '900 24px Space Grotesk, sans-serif'
    ctx.fillStyle = C.ink
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('⚡ BUILDER MODE // HH GOA 2026', W / 2, 78)

    // Bottom Badge
    ctx.fillStyle = C.green
    ctx.fillRect(120, H - 120, W - 240, 70)
    ctx.strokeStyle = C.yellow
    ctx.lineWidth = 4
    ctx.strokeRect(120, H - 120, W - 240, 70)

    ctx.font = '900 26px Space Grotesk, sans-serif'
    ctx.fillStyle = C.white
    ctx.fillText(name.length > 24 ? name.slice(0, 22) + '…' : name, W / 2, H - 95)
    ctx.font = '700 16px JetBrains Mono, monospace'
    ctx.fillStyle = C.yellow
    ctx.fillText(idNumber, W / 2, H - 72)

  } else if (frame === 'ship-from-paradise') {
    // Top Stamp Badge
    ctx.fillStyle = C.pink
    ctx.beginPath()
    ctx.arc(W / 2, 80, 50, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '900 20px Space Grotesk, sans-serif'
    ctx.fillStyle = C.white
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('⛵ GOA', W / 2, 80)

    // Bottom Ribbon
    ctx.fillStyle = C.terracotta
    ctx.beginPath()
    ctx.roundRect(140, H - 130, W - 280, 80, 20)
    ctx.fill()
    ctx.strokeStyle = C.yellow
    ctx.lineWidth = 4
    ctx.stroke()

    ctx.font = '900 26px Space Grotesk, sans-serif'
    ctx.fillStyle = C.yellow
    ctx.fillText('SHIP FROM PARADISE', W / 2, H - 100)
    ctx.font = '700 16px Space Grotesk, sans-serif'
    ctx.fillStyle = C.white
    ctx.fillText(name, W / 2, H - 75)

  } else {
    // Classic Goa Frame
    // Top Event Tag
    ctx.fillStyle = C.green
    ctx.beginPath()
    ctx.roundRect(W / 2 - 180, 48, 360, 54, [0, 0, 16, 16])
    ctx.fill()
    ctx.font = '900 22px Space Grotesk, sans-serif'
    ctx.fillStyle = C.yellow
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🌴 HH GOA 2026 🌴', W / 2, 75)

    // Bottom Identity Pill Badge
    ctx.fillStyle = C.green
    ctx.beginPath()
    ctx.roundRect(100, H - 135, W - 200, 85, 42)
    ctx.fill()
    ctx.strokeStyle = C.yellow
    ctx.lineWidth = 5
    ctx.stroke()

    ctx.font = '900 28px Space Grotesk, sans-serif'
    ctx.fillStyle = C.white
    ctx.fillText(name.length > 22 ? name.slice(0, 20) + '…' : name, W / 2, H - 102)
    ctx.font = '900 18px JetBrains Mono, monospace'
    ctx.fillStyle = C.yellow
    ctx.fillText(`${(data.role || 'BUILDER').toUpperCase()} · ${idNumber}`, W / 2, H - 74)
  }

  ctx.restore()
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
