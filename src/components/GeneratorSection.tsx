import { useState, useRef, useCallback } from 'react'
import { Upload, X, CheckCircle, Wand2, Download, RefreshCw, User, BookOpen, GraduationCap, Phone, Hash, Calendar, Tag } from 'lucide-react'
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
    name: 'EKLAVYA DILIP JHA',
    titleBadge: 'Full-Moon Merge Monk',
    role: 'Frontend + AI Developer',
    college: 'Gandhinagar University',
    phone: '....91',
    builderNo: '108',
    totalBuilders: '247',
    dates: 'OPEN TRIALS · OCT 28–31',
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
    await new Promise(r => setTimeout(r, 1600))
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
    const text = encodeURIComponent(`${name}just generated my official @HackerHouseGoa 2026 Builder Ticket! 🏗️🌴 #FrameInGoa #HHGoa2026`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  const handleReset = () => {
    setBuilderData({
      name: '',
      titleBadge: '',
      role: '',
      college: '',
      phone: '',
      builderNo: '108',
      totalBuilders: '247',
      dates: 'OPEN TRIALS · OCT 28–31',
      cardType: 'id-card',
      imageUrl: null,
    })
    setMode('upload')
    setError(null)
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
                <p>📸 Portrait photos work best. Automatically fitted to the official sunburst ticket frame.</p>
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
                      placeholder="e.g. Frontend + AI Developer"
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

                  {/* Builder Serial Number */}
                  <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">
                        <Hash size={14} />
                        Builder No.
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="108"
                        value={builderData.builderNo}
                        onChange={e => setBuilderData(prev => ({ ...prev, builderNo: e.target.value }))}
                        maxLength={6}
                      />
                    </div>
                    <div>
                      <label className="form-label">
                        Total Builders
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="247"
                        value={builderData.totalBuilders}
                        onChange={e => setBuilderData(prev => ({ ...prev, totalBuilders: e.target.value }))}
                        maxLength={6}
                      />
                    </div>
                  </div>

                  {/* Event Dates */}
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={14} />
                      Event Dates Header
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="OPEN TRIALS · OCT 28–31"
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
              <div className="generator__canvas-wrap">
                <CardCanvas
                  ref={canvasRef}
                  builderData={builderData}
                />
              </div>
              <div className="generator__preview-actions">
                <button className="btn btn-outline" style={{ color: 'var(--hh-forest-dark)', borderColor: 'var(--hh-forest-dark)' }} onClick={() => setMode('form')}>
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
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
