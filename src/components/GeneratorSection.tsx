import { useState, useRef, useCallback } from 'react'
import { Upload, X, CheckCircle, Wand2, Download, RefreshCw, User, MapPin, Users, BookOpen, AlignRight } from 'lucide-react'
import CardCanvas from './CardCanvas'
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
  const [builderData, setBuilderData] = useState<BuilderData>({
    name: '',
    role: '',
    groupNo: '',
    headerTitle: '',
    sideText: '',
    location: '',
    stack: '',
    cardType: 'id-card',
    imageUrl: null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    await new Promise(r => setTimeout(r, 1800))
    setGenerating(false)
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
    const text = encodeURIComponent(`${name}just generated my @HackerHouseGoa 2026 Builder Identity! 🏗️🌴 #FrameInGoa #HHGoa2026`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  const handleReset = () => {
    setBuilderData({ name: '', role: '', groupNo: '', headerTitle: '', sideText: '', location: '', stack: '', cardType: 'id-card', imageUrl: null })
    setMode('upload')
    setError(null)
  }

  return (
    <section className="generator section" id="generator">
      <div className="container">
        {/* Header */}
        <div className="generator__header">
          <span className="badge badge-green">
            <Wand2 size={12} />
            Builder Identity Generator
          </span>
          <h2 className="display-medium">
            Create Your{' '}
            <span className="gradient-text-green">Builder ID</span>
          </h2>
          <p className="body-lg generator__subtitle">
            Free. No login. Instant results.
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
        <div className="generator__panel glass-card">

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
                <p className="upload-zone__subtitle">or click to browse</p>
                <div className="upload-zone__formats">
                  {['JPG', 'PNG', 'HEIC'].map(f => (
                    <span key={f} className="upload-zone__format">{f}</span>
                  ))}
                  <span className="upload-zone__format-text">· Max 10MB</span>
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
                <p>📸 Works best with portrait photos. Any aspect ratio accepted — we'll crop smartly.</p>
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
                  <button className="generator__thumb-change" onClick={handleReset}>
                    <RefreshCw size={14} />
                    Change
                  </button>
                </div>

                {/* Form fields */}
                <div className="generator__form-fields">

                  {/* Name */}
                  <div className="form-group">
                    <label className="form-label">
                      <User size={14} />
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. NAMA ANGGOTA"
                      value={builderData.name}
                      onChange={e => setBuilderData(prev => ({ ...prev, name: e.target.value }))}
                      maxLength={30}
                    />
                  </div>

                  {/* Role / Title (bottom-left footer label) */}
                  <div className="form-group">
                    <label className="form-label">
                      <BookOpen size={14} />
                      Role / Title
                      <span className="form-optional">e.g. KETUA</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. KETUA"
                      value={builderData.role}
                      onChange={e => setBuilderData(prev => ({ ...prev, role: e.target.value }))}
                      maxLength={30}
                    />
                  </div>

                  {/* Group Number */}
                  <div className="form-group">
                    <label className="form-label">
                      <Users size={14} />
                      Group / Batch Number
                      <span className="form-optional">optional</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. KELOMPOK 76"
                      value={builderData.groupNo}
                      onChange={e => setBuilderData(prev => ({ ...prev, groupNo: e.target.value }))}
                      maxLength={30}
                    />
                  </div>

                  {/* Main Headline (e.g. KKN 2026 / HH GOA 2026) */}
                  <div className="form-group">
                    <label className="form-label">
                      <Wand2 size={14} />
                      Card Headline
                      <span className="form-optional">optional</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. HH GOA 2026"
                      value={builderData.headerTitle}
                      onChange={e => setBuilderData(prev => ({ ...prev, headerTitle: e.target.value }))}
                      maxLength={20}
                    />
                  </div>

                  {/* Vertical Side Text */}
                  <div className="form-group">
                    <label className="form-label">
                      <AlignRight size={14} />
                      Vertical Side Text
                      <span className="form-optional">optional</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. UNIVERSITAS NEGERI"
                      value={builderData.sideText}
                      onChange={e => setBuilderData(prev => ({ ...prev, sideText: e.target.value }))}
                      maxLength={30}
                    />
                  </div>

                  {/* Location / Department */}
                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={14} />
                      Location / Department
                      <span className="form-optional">optional</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. DESA KECAMATAN KABUPATEN"
                      value={builderData.location}
                      onChange={e => setBuilderData(prev => ({ ...prev, location: e.target.value }))}
                      maxLength={40}
                    />
                  </div>

                  {/* Card type selector */}
                  <div className="form-group">
                    <label className="form-label">Card Type</label>
                    <div className="card-type-toggle">
                      <button
                        className={`card-type-btn ${builderData.cardType === 'id-card' ? 'active' : ''}`}
                        onClick={() => setBuilderData(prev => ({ ...prev, cardType: 'id-card' }))}
                      >
                        🪪 Builder ID Card
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
                <button className="btn btn-outline" onClick={handleReset}>
                  ← Back
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <div className="spinner" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} />
                      Generate My ID
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Preview */}
          {mode === 'preview' && (
            <div className="generator__preview">
              <div className="generator__canvas-wrap">
                <CardCanvas
                  ref={canvasRef}
                  builderData={builderData}
                />
              </div>
              <div className="generator__preview-actions">
                <button className="btn btn-outline" onClick={() => setMode('form')}>
                  ← Edit Details
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleDownload}>
                  <Download size={18} />
                  Download PNG
                </button>
                <button className="btn btn-ghost btn-lg" onClick={handleShareX}>
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
                <CheckCircle size={48} />
              </div>
              <h3 className="heading-lg generator__success-title">You're all set! 🎉</h3>
              <p className="body-md generator__success-sub">
                Your Builder ID has been downloaded. Share it on X and inspire the community!
              </p>
              <div className="generator__success-actions">
                <button className="btn btn-primary btn-lg" onClick={handleShareX}>
                  <span style={{fontWeight:700}}>𝕏</span>
                  Share to X — #FrameInGoa
                </button>
                <button className="btn btn-outline" onClick={handleReset}>
                  Generate Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
