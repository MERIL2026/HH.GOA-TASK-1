import { useState, useRef, useCallback, useEffect, Suspense } from 'react'
import { Upload, X, CheckCircle, Wand2, Download, RefreshCw, User, BookOpen, GraduationCap, Phone, Hash, Calendar, Tag, Code, Coffee, Truck, Camera, Video, VideoOff } from 'lucide-react'
import CardCanvas from './CardCanvas'
import Lanyard from './lanyard/Lanyard'
import LanyardErrorBoundary from './lanyard/LanyardErrorBoundary'
import { generateBuilderId } from '../hooks/useQRCode'
import type { GeneratorMode, BuilderData } from '../types'
import './GeneratorSection.css'

export type { BuilderData }

const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']
const MAX_SIZE_MB = 10

export default function GeneratorSection() {
  const [mode, setMode] = useState<GeneratorMode>('upload')
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [lanyardCardImage, setLanyardCardImage] = useState<string | null>(null)
  const [previewTab, setPreviewTab] = useState<'3d' | '2d'>('3d')

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
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-generate unique Builder ID whenever name or phone changes
  useEffect(() => {
    const id = generateBuilderId(builderData.name, builderData.phone)
    setBuilderData(prev => {
      if (prev.builderNo === id) return prev
      return { ...prev, builderNo: id }
    })
  }, [builderData.name, builderData.phone])

  // Camera: Start stream
  const startCamera = useCallback(async (mode: 'user' | 'environment' = 'user') => {
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
    } catch (err: any) {
      setCameraError('Camera access denied. Please allow camera permission and try again.')
    }
  }, [cameraStream])

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
      // Mirror front-facing camera
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setBuilderData(prev => ({ ...prev, imageUrl: dataUrl }))
    closeCamera()
    setMode('form')
  }, [facingMode, closeCamera])

  // Sync video srcObject when stream updates
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play().catch(() => {})
    }
  }, [cameraStream])

  // Cleanup camera on unmount
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
  }

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1200))
    setGenerating(false)
    setPreviewTab('3d')
    setMode('preview')
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `hh-goa-builder-${builderData.name || 'id'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setMode('success')
  }

  const handleShareX = () => {
    const name = builderData.name ? `${builderData.name} ` : ''
    const text = encodeURIComponent(`${name}just generated my official @HackerHouseGoa 2026 Builder Ticket! 🏗️⚡ #FrameInGoa #HHGoa2026`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
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
    })
    setMode('upload')
    setError(null)
    setLanyardCardImage(null)
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
            Create Your <span style={{ color: 'var(--hh-sun-yellow)' }}>Builder Ticket</span>
          </h2>
          <p className="body-lg generator__subtitle">
            Free. No login required. Instant official export.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="generator__progress">
          {['Upload', 'Personalize', 'Preview', 'Share'].map((step, i) => {
            const modeIndex = ['upload', 'form', 'preview', 'success'].indexOf(mode)
            const isActive = i === modeIndex
            const isDone = i < modeIndex
            return (
              <div key={step} className={`gen-step ${isActive ? 'gen-step--active' : ''} ${isDone ? 'gen-step--done' : ''}`}>
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
        <div className="generator__panel panel-paper">

          {/* STEP 1: Upload */}
          {mode === 'upload' && (
            <div className="generator__upload">
              <div
                className={`upload-zone ${dragOver ? 'upload-zone--drag' : ''} ${error ? 'upload-zone--error' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
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
                    <span key={f} className="upload-zone__format">{f}</span>
                  ))}
                  <span className="upload-zone__format-text">· Max 10MB</span>
                </div>

                {/* Action buttons row */}
                <div className="upload-zone__actions" onClick={e => e.stopPropagation()}>
                  {/* Camera button */}
                  <button
                    type="button"
                    className="btn btn-sm upload-zone__camera-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      openCamera()
                    }}
                  >
                    <Camera size={15} />
                    Take Photo
                  </button>
                  {/* Sample photo button */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={(e) => {
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
                <p>📸 Portrait photos work best. Automatically fitted to the official circular frame.</p>
              </div>
            </div>
          )}

          {/* STEP 2: Form */}
          {mode === 'form' && (
            <div className="generator__form">
              <div className="generator__form-layout">
                {/* Preview thumb */}
                <div className="generator__form-thumb">
                  {builderData.imageUrl && (
                    <img src={builderData.imageUrl} alt="Your photo" className="generator__thumb-img" />
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

                {/* Form fields */}
                <div className="generator__form-fields">

                  {/* Name */}
                  <div className="form-group">
                    <label className="form-label">
                      <User size={14} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Eklavya Dilip Jha"
                      value={builderData.name}
                      onChange={e => setBuilderData(prev => ({ ...prev, name: e.target.value }))}
                      maxLength={32}
                    />
                  </div>

                  {/* Fun Title Badge */}
                  <div className="form-group">
                    <label className="form-label">
                      <Tag size={14} />
                      Builder Title / Badge
                      <span className="form-optional">e.g. Full-Moon Merge Monk</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Full-Moon Merge Monk"
                      value={builderData.titleBadge}
                      onChange={e => setBuilderData(prev => ({ ...prev, titleBadge: e.target.value }))}
                      maxLength={30}
                    />
                  </div>

                  {/* Role */}
                  <div className="form-group">
                    <label className="form-label">
                      <BookOpen size={14} />
                      Role
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Full Stack Developer"
                      value={builderData.role}
                      onChange={e => setBuilderData(prev => ({ ...prev, role: e.target.value }))}
                      maxLength={35}
                    />
                  </div>

                  {/* College / Organization */}
                  <div className="form-group">
                    <label className="form-label">
                      <GraduationCap size={14} />
                      College / Organization
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Gandhinagar University"
                      value={builderData.college}
                      onChange={e => setBuilderData(prev => ({ ...prev, college: e.target.value }))}
                      maxLength={35}
                    />
                  </div>

                  {/* Phone / Contact */}
                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={14} />
                      Phone / Handle
                      <span className="form-optional">e.g. ....91</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. ....91"
                      value={builderData.phone}
                      onChange={e => setBuilderData(prev => ({ ...prev, phone: e.target.value }))}
                      maxLength={20}
                    />
                  </div>

                  {/* Builder Class */}
                  <div className="form-group">
                    <label className="form-label">
                      <Code size={14} />
                      Builder Class
                      <span className="form-optional">e.g. Terminal Wizard</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Terminal Wizard"
                      value={builderData.builderClass}
                      onChange={e => setBuilderData(prev => ({ ...prev, builderClass: e.target.value }))}
                      maxLength={25}
                    />
                  </div>

                  {/* Beach Bag */}
                  <div className="form-group">
                    <label className="form-label">
                      <Coffee size={14} />
                      Beach Bag
                      <span className="form-optional">What you're bringing</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Coconut · VS Code · Lo-Fi Beats"
                      value={builderData.beachBag}
                      onChange={e => setBuilderData(prev => ({ ...prev, beachBag: e.target.value }))}
                      maxLength={40}
                    />
                  </div>

                  {/* Shipping */}
                  <div className="form-group">
                    <label className="form-label">
                      <Truck size={14} />
                      Shipping
                      <span className="form-optional">What you're building</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Building The Future"
                      value={builderData.shipping}
                      onChange={e => setBuilderData(prev => ({ ...prev, shipping: e.target.value }))}
                      maxLength={30}
                    />
                  </div>

                  {/* Builder ID (auto-generated, read-only) */}
                  <div className="form-group">
                    <label className="form-label">
                      <Hash size={14} />
                      Builder ID
                      <span className="form-optional">Auto-generated</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={builderData.builderNo}
                      placeholder="HHGOA26-XXXX"
                      readOnly
                      style={{ opacity: 0.7, cursor: 'default' }}
                    />
                  </div>

                  {/* Event Dates */}
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={14} />
                      Event Dates
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="28 OCT – 31 OCT 2026"
                      value={builderData.dates}
                      onChange={e => setBuilderData(prev => ({ ...prev, dates: e.target.value }))}
                      maxLength={30}
                    />
                  </div>

                  {/* Card type selector */}
                  <div className="form-group">
                    <label className="form-label">Card Format</label>
                    <div className="card-type-toggle">
                      <button
                        className={`card-type-btn ${builderData.cardType === 'id-card' ? 'active' : ''}`}
                        onClick={() => setBuilderData(prev => ({ ...prev, cardType: 'id-card' }))}
                      >
                        🪪 Ticket ID Card
                      </button>
                      <button
                        className={`card-type-btn ${builderData.cardType === 'pfp-frame' ? 'active' : ''}`}
                        onClick={() => setBuilderData(prev => ({ ...prev, cardType: 'pfp-frame' }))}
                      >
                        🖼️ PFP Frame
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="generator__form-actions">
                <button className="btn btn-outline" style={{ color: 'var(--hh-forest-dark)', borderColor: 'var(--hh-forest-dark)' }} onClick={handleReset}>
                  ← Back
                </button>
                <button
                  className="btn btn-terracotta btn-lg"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <div className="spinner" />
                      Generating Ticket...
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} />
                      Generate Official Ticket
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Preview */}
          {mode === 'preview' && (
            <div className="generator__preview">
              {/* Tab Switcher */}
              <div className="preview-tab-toggle">
                <button
                  className={`preview-tab-btn ${previewTab === '3d' ? 'preview-tab-btn--active' : ''}`}
                  onClick={() => setPreviewTab('3d')}
                >
                  🎪 3D Interactive Lanyard
                </button>
                <button
                  className={`preview-tab-btn ${previewTab === '2d' ? 'preview-tab-btn--active' : ''}`}
                  onClick={() => setPreviewTab('2d')}
                >
                  📄 2D High-Res Print View
                </button>
              </div>

              {/* 3D Lanyard Interactive Display (Default) */}
              {previewTab === '3d' && (
                <div className="generator__lanyard-container">
                  <div className="generator__lanyard-canvas">
                    <LanyardErrorBoundary>
                      <Suspense fallback={
                        <div className="lanyard-loading">
                          <div className="spinner" style={{width:32,height:32,borderWidth:3}} />
                          <span>Loading 3D Physics…</span>
                        </div>
                      }>
                        <Lanyard
                          position={[0, 0, 16]}
                          gravity={[0, -40, 0]}
                          frontImage={lanyardCardImage}
                          imageFit="cover"
                          lanyardWidth={1}
                        />
                      </Suspense>
                    </LanyardErrorBoundary>
                  </div>
                  <p className="generator__lanyard-hint">✦ Drag to swing & rotate your official pass ✦</p>
                </div>
              )}

              {/* Single 2D CardCanvas: Always mounted so texture capture and PNG download work instantly */}
              <div
                className="generator__canvas-wrap"
                style={
                  previewTab === '2d'
                    ? { display: 'flex', justifyContent: 'center' }
                    : { position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }
                }
              >
                <CardCanvas
                  ref={canvasRef}
                  builderData={builderData}
                  onRenderComplete={(url) => setLanyardCardImage(url)}
                />
              </div>

              <div className="generator__preview-actions">
                <button className="btn btn-outline btn-lg" style={{ color: 'var(--hh-forest-dark)', borderColor: 'var(--hh-forest-dark)' }} onClick={() => setMode('form')}>
                  ← Edit Details
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleDownload}>
                  <Download size={18} />
                  Download PNG
                </button>
                <button className="btn btn-terracotta btn-lg" onClick={handleShareX}>
                  <span style={{fontWeight:700}}>𝕏</span>
                  Share to X
                </button>
              </div>
              <p className="generator__preview-note">#FrameInGoa · Hacker House Goa 2026</p>
            </div>
          )}

          {/* STEP 4: Success */}
          {mode === 'success' && (
            <div className="generator__success">
              <div className="success-icon animate-scale-in">
                <CheckCircle size={56} style={{ color: 'var(--hh-forest)' }} />
              </div>
              <h3 className="display-medium" style={{ color: 'var(--hh-forest-dark)' }}>Ticket Downloaded! 🎉</h3>
              <p className="body-md generator__success-sub" style={{ color: 'var(--hh-forest)' }}>
                Your Official Hacker House Goa Builder Ticket is saved. Share it on X and tag #FrameInGoa!
              </p>
              <div className="generator__success-actions">
                <button className="btn btn-primary btn-lg" onClick={handleShareX}>
                  <span style={{fontWeight:700}}>𝕏</span>
                  Share to X — #FrameInGoa
                </button>
                <button className="btn btn-outline" style={{ color: 'var(--hh-forest-dark)', borderColor: 'var(--hh-forest-dark)' }} onClick={handleReset}>
                  Generate Another
                </button>
              </div>

              {/* 3D Lanyard Showcase in Success */}
              {lanyardCardImage && (
                <div className="generator__lanyard-container" style={{ marginTop: '24px' }}>
                  <div className="generator__lanyard-canvas" style={{ height: '480px' }}>
                    <LanyardErrorBoundary>
                      <Suspense fallback={<div className="lanyard-loading"><div className="spinner" /></div>}>
                        <Lanyard
                          position={[0, 0, 24]}
                          gravity={[0, -40, 0]}
                          frontImage={lanyardCardImage}
                          imageFit="cover"
                          lanyardWidth={1}
                        />
                      </Suspense>
                    </LanyardErrorBoundary>
                  </div>
                  <p className="generator__lanyard-hint">✦ Drag to swing your saved pass ✦</p>
                </div>
              )}
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
                    className={`camera-modal__video ${facingMode === 'user' ? 'camera-modal__video--mirrored' : ''}`}
                  />
                  <div className="camera-modal__guide-circle" />
                </div>
                <div className="camera-modal__controls">
                  <button
                    className="camera-modal__flip"
                    onClick={flipCamera}
                    title="Flip camera"
                  >
                    <Video size={18} />
                    Flip
                  </button>
                  <button
                    className="camera-modal__capture"
                    onClick={capturePhoto}
                    aria-label="Capture photo"
                  >
                    <div className="camera-modal__shutter" />
                  </button>
                  <button className="camera-modal__cancel" onClick={closeCamera}>
                    Cancel
                  </button>
                </div>
                <p className="camera-modal__hint">Position your face in the circle, then tap the shutter</p>
              </>
            )}
            {/* Hidden canvas for capture */}
            <canvas ref={cameraCanvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      )}
    </section>
  )
}
