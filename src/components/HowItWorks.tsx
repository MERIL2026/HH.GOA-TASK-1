import { Upload, Wand2, Download } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './HowItWorks.css'

const steps = [
  {
    number: '01',
    icon: <Upload size={28} />,
    title: 'Upload Your Photo',
    description: 'Drag & drop or click to upload. Supports JPG, PNG, and HEIC from iPhone. We handle any aspect ratio or crop automatically.',
    color: 'yellow',
  },
  {
    number: '02',
    icon: <Wand2 size={28} />,
    title: 'Personalize & Generate',
    description: 'Add your name, role, college, and builder number. Choose between an official Builder Ticket or PFP Frame.',
    color: 'yellow',
  },
  {
    number: '03',
    icon: <Download size={28} />,
    title: 'Download & Share',
    description: 'Preview your official Goa branded graphic, download high-quality PNG, then share directly to X with #FrameInGoa.',
    color: 'yellow',
  },
]

const features = [
  '⚡ Official Goa Ticket Frame',
  '☀️ Smart Auto-Crop',
  '🌊 #FrameInGoa Hashtag',
  '✨ High-Res PNG Export',
  '🚀 1-Click X Share',
  '🥥 No Account Required',
]

export default function HowItWorks() {
  const pillsRef = useScrollReveal<HTMLDivElement>()

  return (
    <>
      <section className="howitworks section section-goa-accent" id="how-it-works">
        {/* Background Watermark Strip */}
        <div className="bg-watermark-strip" style={{ top: '10%' }}>
          HOW IT WORKS · GOA VIBES · 3 SIMPLE STEPS · TROPICAL BUILDERS · HOW IT WORKS · GOA VIBES ·
        </div>

        {/* Decorative palm silhouettes */}
        <div className="howitworks__palm howitworks__palm--left animate-palm-sway" aria-hidden="true">⚡</div>
        <div className="howitworks__palm howitworks__palm--right animate-palm-sway delay-2" aria-hidden="true">⚡</div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <ScrollReveal className="howitworks__header">
            <span className="badge badge-yellow">⚡ How It Works</span>
            <h2 className="display-medium howitworks__title" style={{ color: 'var(--hh-cream)' }}>
              From Photo to <span className="text-goa-wave" style={{ color: 'var(--hh-sun-yellow)' }}>Builder Ticket</span> in 3 Steps
            </h2>
            <p className="body-lg howitworks__subtitle">
              No accounts. No login walls. Just upload, personalize, and flex your Goa builder identity.
            </p>
          </ScrollReveal>

          {/* Steps */}
          <div className="howitworks__steps">
            {steps.map((step, i) => (
              <ScrollReveal key={i} className="howitworks__step" delay={(i + 1) as 1 | 2 | 3}>
                <div className="howitworks__step-number">{step.number}</div>
                <div className="howitworks__step-icon">
                  {step.icon}
                </div>
                <h3 className="heading-md howitworks__step-title">{step.title}</h3>
                <p className="body-md howitworks__step-desc">{step.description}</p>
              </ScrollReveal>
            ))}
          </div>

          {/* Feature pills */}
          <div ref={pillsRef} className="howitworks__features stagger-children">
            {features.map((feat) => (
              <div key={feat} className="howitworks__feature-pill">{feat}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Ocean Wave Separator */}
      <div className="wave-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,-30 1200,30 L1200,120 L0,120 Z"
            fill="var(--hh-forest)"
            className="animate-wave"
          />
        </svg>
      </div>
    </>
  )
}
