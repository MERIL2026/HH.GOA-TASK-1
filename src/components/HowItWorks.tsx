import { Upload, Wand2, Download } from 'lucide-react'
import './HowItWorks.css'

const steps = [
  {
    number: '01',
    icon: <Upload size={28} />,
    title: 'Upload Your Photo',
    description: 'Drag & drop or click to upload. Supports JPG, PNG, and HEIC from iPhone. We handle any aspect ratio or crop automatically.',
    color: 'green',
  },
  {
    number: '02',
    icon: <Wand2 size={28} />,
    title: 'Personalize & Generate',
    description: 'Add your name, tech stack, and role. Choose between a Builder ID Card or a PFP Frame. Hit generate — it\'s near-instant.',
    color: 'yellow',
  },
  {
    number: '03',
    icon: <Download size={28} />,
    title: 'Download & Share',
    description: 'Preview your branded graphic, download a high-quality PNG, then share directly to X with a pre-filled caption and #FrameInGoa.',
    color: 'red',
  },
]

export default function HowItWorks() {
  return (
    <section className="howitworks section" id="how-it-works">
      <div className="container">
        {/* Header */}
        <div className="howitworks__header">
          <span className="badge badge-green">How It Works</span>
          <h2 className="display-medium howitworks__title">
            From Photo to{' '}
            <span className="gradient-text-green">Builder ID</span>
            {' '}in 3 Steps
          </h2>
          <p className="body-lg howitworks__subtitle">
            No accounts. No login walls. Just upload, generate, and flex your identity.
          </p>
        </div>

        {/* Steps */}
        <div className="howitworks__steps">
          {steps.map((step, i) => (
            <div key={i} className={`howitworks__step howitworks__step--${step.color}`}>
              <div className="howitworks__step-number">{step.number}</div>
              <div className={`howitworks__step-icon howitworks__step-icon--${step.color}`}>
                {step.icon}
              </div>
              <h3 className="heading-md howitworks__step-title">{step.title}</h3>
              <p className="body-md howitworks__step-desc">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="howitworks__connector">
                  <svg viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="6" x2="85" y2="6" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4"/>
                    <polygon points="85,2 100,6 85,10" fill="rgba(4,106,56,0.5)"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div className="howitworks__features">
          {[
            '✓ JPG, PNG, HEIC supported',
            '✓ Smart auto-crop',
            '✓ HH Goa branded output',
            '✓ High-quality PNG export',
            '✓ Pre-filled X share',
            '✓ Mobile-first design',
          ].map((feat) => (
            <div key={feat} className="howitworks__feature-pill">{feat}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
