import { CheckCircle2, Circle, Clock } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Roadmap.css'

const phases = [
  {
    phase: 'Phase 1',
    title: 'Planning & Design',
    items: ['Requirements gathering', 'Editorial UI/UX design', 'Goa palette system', 'Implementation plan'],
    status: 'done',
  },
  {
    phase: 'Phase 2',
    title: 'Foundation',
    items: ['Vite + React setup', 'Canela Display font stack', 'Canvas engine', 'GitHub pipeline'],
    status: 'done',
  },
  {
    phase: 'Phase 3',
    title: 'Official Ticket Engine',
    items: ['Image upload & validation', 'Sunburst ray generator', 'Official Ticket layout', 'PFP Frame generator'],
    status: 'done',
  },
  {
    phase: 'Phase 4',
    title: 'Goa Tropical Motion',
    items: ['Swaying palm tree SVG', 'Ocean wave dividers', 'Watermark marquee text', 'Canela Display typography'],
    status: 'done',
  },
  {
    phase: 'Phase 5',
    title: 'Download & Share',
    items: ['PNG high-res export', 'Direct X share', '#FrameInGoa hashtag', 'Instant mobile export'],
    status: 'active',
  },
  {
    phase: 'Phase 6',
    title: 'Community Launch',
    items: ['Live tunnel sharing', 'Production deployment', 'Leaderboard showcase', 'Hackathon live integration'],
    status: 'upcoming',
  },
]

const futureItems = [
  '⚡ AI-generated Goa Builder Titles',
  '☀️ Custom Sunburst Color Themes',
  '🎟️ QR Code Verification',
  '🌊 Live Event Leaderboards',
  '✨ Reusable Hackathon Templates',
]

export default function Roadmap() {
  const futureRef = useScrollReveal<HTMLDivElement>()

  return (
    <>
      <section className="roadmap section section-goa-accent" id="roadmap">
        {/* Background Watermark Strip */}
        <div className="bg-watermark-strip" style={{ top: '15%' }}>
          BUILDING IN PUBLIC · HACKER HOUSE GOA · ROADMAP · TROPICAL BUILDERS · BUILDING IN PUBLIC ·
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <ScrollReveal className="roadmap__header">
            <span className="badge badge-yellow">⚡ Product Roadmap</span>
            <h2 className="display-medium">
              Building in <span className="gradient-text-goa">Public</span>
            </h2>
            <p className="body-lg roadmap__subtitle">
              A transparent view of how we built the official Hacker House Goa 2026 Builder Identity Generator.
            </p>
          </ScrollReveal>

          {/* Phase grid */}
          <div className="roadmap__grid">
            {phases.map((phase, i) => (
              <ScrollReveal
                key={i}
                className={`roadmap__phase roadmap__phase--${phase.status}`}
                delay={((i % 3) + 1) as 1 | 2 | 3}
              >
                <div className="roadmap__phase-header">
                  <div className="roadmap__phase-label">{phase.phase}</div>
                  <div className={`roadmap__phase-status-icon roadmap__phase-status-icon--${phase.status}`}>
                    {phase.status === 'done' && <CheckCircle2 size={18} />}
                    {phase.status === 'active' && <Clock size={18} />}
                    {phase.status === 'upcoming' && <Circle size={18} />}
                  </div>
                </div>
                <h3 className="roadmap__phase-title">{phase.title}</h3>
                <ul className="roadmap__phase-items">
                  {phase.items.map((item, j) => (
                    <li key={j} className="roadmap__phase-item">
                      <span className="roadmap__phase-dot" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className={`roadmap__phase-badge roadmap__phase-badge--${phase.status}`}>
                  {phase.status === 'done' ? 'Completed' : phase.status === 'active' ? 'In Progress' : 'Upcoming'}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Future */}
          <div className="roadmap__future">
            <ScrollReveal className="roadmap__future-header">
              <span className="badge badge-yellow">⚡ Future Vision</span>
              <h3 className="heading-lg" style={{ color: 'var(--hh-sun-yellow)' }}>What's Coming Next</h3>
            </ScrollReveal>
            <div ref={futureRef} className="roadmap__future-items stagger-children">
              {futureItems.map((item) => (
                <div key={item} className="roadmap__future-item">
                  <span>✦</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Animated Ocean Wave Separator */}
      <div className="wave-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,-30 1200,30 L1200,120 L0,120 Z"
            fill="var(--hh-forest-dark)"
            className="animate-wave"
          />
        </svg>
      </div>
    </>
  )
}
