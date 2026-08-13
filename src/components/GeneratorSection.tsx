import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload,
  X,
  CheckCircle,
  Wand2,
  Download,
  RefreshCw,
  User,
  Hash,
  Camera,
  Video,
  VideoOff,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react'
import CardCanvas from './CardCanvas'
import PfpRenderer from './PfpRenderer'
import TiltCard from './TiltCard'
import MagneticButton from './MagneticButton'
import { generateBuilderId } from '../hooks/useQRCode'
import type { GeneratorMode, BuilderData, PfpFrameStyle } from '../types'
import './GeneratorSection.css'

export type { BuilderData }

const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']
const MAX_SIZE_MB = 10

/** Sanitize user text input — strip HTML/script tags to prevent XSS */
function sanitize(input: string): string {
  return input.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim()
}

export default function GeneratorSection() {
  const [mode, setMode] = useState<GeneratorMode>('upload')
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [previewTab, setPreviewTab] = useState<'2d' | 'pfp'>('2d')

  // Camera states
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const videoRef = useRef<HTMLVideoElement>(null)
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null)

  const [builderData, setBuilderData] = useState<BuilderData>({
    name: '',
    titleBadge: '',
    role: '',
    college: '',
    phone: '',
    builderNo: '',
    totalBuilders: '247',
    dates: '28 OCT – 31 OCT 2026',
    cardType: 'id-card',
    imageUrl: null,
    builderClass: '',
    beachBag: '',
    shipping: '',
    pfpFrame: 'classic-goa',
    location: 'Goa, India',
    tagline: 'Building the Future',
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pfpCanvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-generate unique Builder ID whenever name or phone changes
  useEffect(() => {
    const id = generateBuilderId(builderData.name, builderData.phone)
    setBuilderData(prev => {
      if (prev.builderNo === id) return prev
      return { ...prev, builderNo: id }
    })
  }, [builderData.name, builderData.phone])

  // Camera: Start stream
  const startCamera = useCallback(
    async (mode: 'user' | 'environment' = 'user') => {
      setCameraError(null)
      try {
        if (cameraStream) {
          cameraStream.getTracks().forEach(t => t.stop())
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        setCameraStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      } catch {
        setCameraError('Camera access denied. Please allow camera permission and try again.')
      }
    },
    [cameraStream]
  )

  const openCamera = useCallback(async () => {
    setCameraOpen(true)
    await startCamera(facingMode)
  }, [facingMode, startCamera])

  const closeCamera = useCallback(() => {
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop())
    setCameraStream(null)
    setCameraOpen(false)
    setCameraError(null)
  }, [cameraStream])

  const flipCamera = useCallback(async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newMode)
    await startCamera(newMode)
  }, [facingMode, startCamera])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !cameraCanvasRef.current) return
    const video = videoRef.current
    const canvas = cameraCanvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setBuilderData(prev => ({ ...prev, imageUrl: dataUrl }))
    closeCamera()
    setMode('form')
  }, [facingMode, closeCamera])

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play().catch(() => {})
    }
  }, [cameraStream])

  useEffect(() => {
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop())
    }
  }, [cameraStream])

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
      return 'Please upload a JPG, PNG, or HEIC image file.'
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File must be under ${MAX_SIZE_MB}MB.`
    }
    return null
  }

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    const url = URL.createObjectURL(file)
    setBuilderData(prev => ({ ...prev, imageUrl: url }))
    setMode('form')
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = '' // Allow selecting the same file again
  }

  const handleGenerate = async () => {
    if (!builderData.name.trim() || !builderData.role.trim() || !builderData.college.trim()) {
      setError("Please fill out your Full Name, Role, and College to generate your ID.")
      setTimeout(() => setError(null), 4000)
      return
    }

    setGenerating(true)
    await new Promise(r => setTimeout(r, 1000))
    setGenerating(false)
    setPreviewTab('2d')
    setMode('preview')
  }

  // Download handlers
  const handleDownloadIdCard = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `hh-goa-builder-id-${sanitize(builderData.name) || 'card'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setMode('success')
  }

  const handleDownloadPfp = () => {
    const canvas = pfpCanvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `hh-goa-pfp-${sanitize(builderData.name) || 'avatar'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setMode('success')
  }

  const handleDownloadBoth = () => {
    handleDownloadIdCard()
    setTimeout(() => {
      handleDownloadPfp()
    }, 500)
  }

  const handleShareX = () => {
    const text = encodeURIComponent(
      `I just generated my official @HackerHouseGoa 2026 Builder Ticket & PFP! 🌴\n\nCan't wait to build with everyone in Goa. 🏗️⚡\n\n#FrameInGoa #HHGoa2026`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const handleReset = () => {
    setBuilderData({
      name: '',
      titleBadge: '',
      role: '',
      college: '',
      phone: '',
      builderNo: '',
      totalBuilders: '247',
      dates: '28 OCT – 31 OCT 2026',
      cardType: 'id-card',
      imageUrl: null,
      builderClass: '',
      beachBag: '',
      shipping: '',
      pfpFrame: 'classic-goa',
      location: 'Goa, India',
      tagline: 'Building the Future',
    })
    setMode('upload')
    setError(null)
  }

  /** Sanitized setter for text fields */
  const updateField = (field: keyof BuilderData, value: string) => {
    setBuilderData(prev => ({ ...prev, [field]: sanitize(value) }))
  }

  return (
    <section className="generator section" id="generator">
      <div className="container">
        {/* Header */}
        <div className="generator__header">
          <span className="badge badge-yellow">
            <Wand2 size={12} />
            Official Builder Ticket Generator
          </span>
          <h2 className="display-medium" style={{ color: 'var(--hh-cream)' }}>
            Create Your <span style={{ color: 'var(--hh-sun-yellow)' }}>Builder Ticket & PFP</span>
          </h2>
          <p className="body-lg generator__subtitle">
            Free. No login required. Instant high-res export (1200×1800 ID & 1024×1024 PFP).
          </p>
        </div>

        {/* Progress Steps */}
        <div className="generator__progress">
          {['Upload', 'Personalize', 'Preview', 'Share'].map((step, i) => {
            const modeIndex = ['upload', 'form', 'preview', 'success'].indexOf(mode)
            const isActive = i === modeIndex
            const isDone = i < modeIndex
            return (
              <div
                key={step}
                className={`gen-step ${isActive ? 'gen-step--active' : ''} ${
                  isDone ? 'gen-step--done' : ''
                }`}
              >
                <div className="gen-step__circle">
                  {isDone ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
                </div>
                <span className="gen-step__label">{step}</span>
                {i < 3 && <div className={`gen-step__line ${isDone ? 'gen-step__line--done' : ''}`} />}
              </div>
            )
          })}
        </div>

        {/* Main Panel */}
        <div className="generator__panel">

          {/* STEP 1: Upload */}
          {mode === 'upload' && (
            <div className="generator__upload">
              <div
                className={`upload-zone ${dragOver ? 'upload-zone--drag' : ''} ${
                  error ? 'upload-zone--error' : ''
                }`}
                onDragOver={e => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.heic,.heif"
                  style={{ display: 'none' }}
                  onChange={handleFileInput}
                />
                <div className="upload-zone__icon">
                  <Upload size={32} />
                </div>
                <h3 className="upload-zone__title">Drop your photo here</h3>
                <p className="upload-zone__subtitle">or click to browse from device</p>
                <div className="upload-zone__formats">
                  {['JPG', 'PNG', 'HEIC'].map(f => (
                    <span key={f} className="upload-zone__format">
                      {f}
                    </span>
                  ))}
                  <span className="upload-zone__format-text">· Max 10MB</span>
                </div>

                {/* Action buttons row */}
                <div className="upload-zone__actions" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn btn-sm upload-zone__camera-btn"
                    onClick={e => {
                      e.stopPropagation()
                      openCamera()
                    }}
                  >
                    <Camera size={15} />
                    Take Photo
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={e => {
                      e.stopPropagation()
                      const sampleSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23044A29"/><circle cx="200" cy="150" r="70" fill="%23F4B728"/><ellipse cx="200" cy="340" rx="130" ry="100" fill="%23D9432F"/></svg>`
                      setBuilderData(prev => ({ ...prev, imageUrl: sampleSvg }))
                      setMode('form')
                    }}
                  >
                    ✨ Sample Photo
                  </button>
                </div>

                {dragOver && (
                  <div className="upload-zone__overlay">
                    <span>Drop to Upload!</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="generator__error">
                  <X size={14} />
                  {error}
                </div>
              )}

              <div className="upload-note">
                <p>📸 Portrait photos work best. Automatically fitted to the circular frame & PFP generator.</p>
              </div>
            </div>
          )}

          {/* STEP 2: Grouped Form Editor */}
          {mode === 'form' && (
            <div className="generator__form">
              <div className="generator__form-layout">
                {/* Photo Preview Thumb */}
                <div className="generator__form-thumb">
                  {builderData.imageUrl ? (
                    <img src={builderData.imageUrl} alt="Your photo" className="generator__thumb-img" />
                  ) : (
                    <div className="generator__thumb-placeholder">
                      <User size={48} />
                      <span>No Photo Uploaded</span>
                    </div>
                  )}
                  <div className="generator__thumb-btns">
                    <button
                      className="generator__thumb-change"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <RefreshCw size={14} />
                      Change Photo
                    </button>
                    <button
                      className="generator__thumb-change generator__thumb-camera"
                      onClick={openCamera}
                    >
                      <Camera size={14} />
                      Retake
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.heic,.heif"
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                  />
                </div>

                {/* Grouped Form Fields */}
                <div className="generator__form-fields">

                  {/* Section 1: Profile Information */}
                  <div className="form-section-block">
                    <h4 className="form-section-title">
                      <User size={16} />
                      1. Profile Information
                    </h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Eklavya Dilip Jha"
                          value={builderData.name}
                          onChange={e => updateField('name', e.target.value)}
                          maxLength={32}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Role</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Full Stack Developer"
                          value={builderData.role}
                          onChange={e => updateField('role', e.target.value)}
                          maxLength={35}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">College / Organization</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Gandhinagar University"
                          value={builderData.college}
                          onChange={e => updateField('college', e.target.value)}
                          maxLength={35}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Title / Badge</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Full-Moon Merge Monk"
                          value={builderData.titleBadge}
                          onChange={e => updateField('titleBadge', e.target.value)}
                          maxLength={30}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Identity & Contact */}
                  <div className="form-section-block">
                    <h4 className="form-section-title">
                      <Hash size={16} />
                      2. Identity & Contact
                    </h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Phone / Handle</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. ....91 or @handle"
                          value={builderData.phone}
                          onChange={e => updateField('phone', e.target.value)}
                          maxLength={20}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Builder ID (Auto-generated)</label>
                        <input
                          type="text"
                          className="form-input form-input--readonly"
                          value={builderData.builderNo}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Goa Event Details */}
                  <div className="form-section-block">
                    <h4 className="form-section-title">
                      <Sparkles size={16} />
                      3. Goa Event Details
                    </h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Event Dates</label>
                        <input
                          type="text"
                          className="form-input"
                          value={builderData.dates}
                          onChange={e => updateField('dates', e.target.value)}
                          maxLength={30}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: PFP Frame Style Selection */}
                  <div className="form-section-block">
                    <h4 className="form-section-title">
                      <ImageIcon size={16} />
                      4. PFP Frame Variant
                    </h4>
                    <div className="pfp-frame-selector">
                      {[
                        { id: 'classic-goa', label: '🌴 Classic Goa', desc: 'Tropical paper & gold accent border' },
                        { id: 'builder-mode', label: '⚡ Builder Mode', desc: 'Cyber green terminal & code brackets' },
                        { id: 'ship-from-paradise', label: '⛵ Ship Paradise', desc: 'Sunset terracotta & nautical vibe' },
                      ].map(f => (
                        <button
                          key={f.id}
                          type="button"
                          className={`pfp-frame-card ${builderData.pfpFrame === f.id ? 'active' : ''}`}
                          onClick={() => setBuilderData(prev => ({ ...prev, pfpFrame: f.id as PfpFrameStyle }))}
                        >
                          <div className="pfp-frame-card__name">{f.label}</div>
                          <div className="pfp-frame-card__desc">{f.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {error && (
                <div className="generator__error" style={{ marginBottom: '16px', justifyContent: 'center' }}>
                  <X size={14} />
                  {error}
                </div>
              )}

              <div className="generator__form-actions">
                <button className="btn btn-outline" onClick={handleReset}>
                  ← Back
                </button>
                <MagneticButton className="btn btn-terracotta btn-lg" onClick={handleGenerate} disabled={generating}>
                  {generating ? (
                    <>
                      <div className="spinner" />
                      Generating Assets...
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} />
                      Generate Official Assets
                    </>
                  )}
                </MagneticButton>
              </div>
            </div>
          )}

          {/* STEP 3: Preview */}
          {mode === 'preview' && (
            <div className="generator__preview">
              {/* Tab Switcher — 2D Card & PFP only */}
              <div className="preview-tab-toggle">
                <button
                  className={`preview-tab-btn ${previewTab === '2d' ? 'preview-tab-btn--active' : ''}`}
                  onClick={() => setPreviewTab('2d')}
                >
                  📄 2D ID Card (1200×1800)
                </button>
                <button
                  className={`preview-tab-btn ${previewTab === 'pfp' ? 'preview-tab-btn--active' : ''}`}
                  onClick={() => setPreviewTab('pfp')}
                >
                  🖼️ PFP Avatar (1024×1024)
                </button>
              </div>

              {/* 2D ID Card Tab */}
              <div
                className="generator__canvas-wrap"
                style={
                  previewTab === '2d'
                    ? { display: 'flex', justifyContent: 'center' }
                    : { position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }
                }
              >
                <TiltCard maxTilt={8}>
                  <CardCanvas
                    ref={canvasRef}
                    builderData={builderData}
                  />
                </TiltCard>
              </div>

              {/* PFP Avatar Tab */}
              <div
                className="generator__pfp-wrap"
                style={
                  previewTab === 'pfp'
                    ? { display: 'flex', justifyContent: 'center' }
                    : { position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }
                }
              >
                <TiltCard maxTilt={8}>
                  <PfpRenderer
                    ref={pfpCanvasRef}
                    builderData={builderData}
                    frameStyle={builderData.pfpFrame}
                  />
                </TiltCard>
              </div>

              {/* Actions */}
              <div className="generator__preview-actions">
                <button className="btn btn-outline btn-lg" onClick={() => setMode('form')}>
                  ← Edit Details
                </button>
                <MagneticButton className="btn btn-primary btn-lg" onClick={handleDownloadIdCard}>
                  <Download size={18} />
                  Download ID (1200×1800)
                </MagneticButton>
                <MagneticButton className="btn btn-primary btn-lg" onClick={handleDownloadPfp}>
                  <ImageIcon size={18} />
                  Download PFP (1024×1024)
                </MagneticButton>
                <MagneticButton className="btn btn-terracotta btn-lg" onClick={handleDownloadBoth}>
                  <Layers size={18} />
                  Download Both
                </MagneticButton>
                <MagneticButton className="btn btn-outline btn-lg" onClick={handleShareX}>
                  <span style={{ fontWeight: 700 }}>𝕏</span>
                  Post to X (Attach Assets)
                </MagneticButton>
              </div>
              <p className="generator__preview-note">#FrameInGoa · Hacker House Goa 2026</p>
            </div>
          )}

          {/* STEP 4: Success */}
          {mode === 'success' && (
            <div className="generator__success">
              <div className="success-icon animate-scale-in">
                <CheckCircle size={56} />
              </div>
              <h3 className="display-medium generator__success-heading">
                Assets Downloaded! 🎉
              </h3>
              <p className="body-md generator__success-sub">
                Your Official Hacker House Goa Builder Ticket & PFP Avatar are saved. Share it on X and tag #FrameInGoa!
              </p>
              <div className="generator__success-actions">
                <MagneticButton className="btn btn-primary btn-lg" onClick={handleShareX}>
                  <span style={{ fontWeight: 700 }}>𝕏</span>
                  Post to X (Don't forget to attach your PFP!)
                </MagneticButton>
                <button className="btn btn-outline" onClick={handleReset}>
                  Generate Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      {cameraOpen && (
        <div className="camera-modal" role="dialog" aria-modal="true" aria-label="Camera Capture">
          <div className="camera-modal__backdrop" onClick={closeCamera} />
          <div className="camera-modal__box">
            <div className="camera-modal__header">
              <span className="camera-modal__title">
                <Camera size={18} />
                Take Your Photo
              </span>
              <button className="camera-modal__close" onClick={closeCamera} aria-label="Close camera">
                <X size={20} />
              </button>
            </div>

            {cameraError ? (
              <div className="camera-modal__error">
                <VideoOff size={40} />
                <p>{cameraError}</p>
                <button className="btn btn-outline btn-sm" onClick={() => startCamera(facingMode)}>
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="camera-modal__viewfinder">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`camera-modal__video ${
                      facingMode === 'user' ? 'camera-modal__video--mirrored' : ''
                    }`}
                  />
                  <div className="camera-modal__guide-circle" />
                </div>
                <div className="camera-modal__controls">
                  <button className="camera-modal__flip" onClick={flipCamera} title="Flip camera">
                    <Video size={18} />
                    Flip
                  </button>
                  <button className="camera-modal__capture" onClick={capturePhoto} aria-label="Capture photo">
                    <div className="camera-modal__shutter" />
                  </button>
                  <button className="camera-modal__cancel" onClick={closeCamera}>
                    Cancel
                  </button>
                </div>
                <p className="camera-modal__hint">Position your face in the circle, then tap the shutter</p>
              </>
            )}
            <canvas ref={cameraCanvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      )}
    </section>
  )
}
