import { CheckCircle2, Circle, Clock } from 'lucide-react'
import './Roadmap.css'

const phases = [
  {
    phase: 'Phase 1',
    title: 'Planning & Design',
    items: ['Requirements gathering', 'UI/UX design', 'Architecture planning', 'Implementation plan'],
    status: 'done',
  },
  {
    phase: 'Phase 2',
    title: 'Foundation',
    items: ['Project setup', 'Frontend scaffolding', 'Design system', 'CI/CD basics'],
    status: 'done',
  },
  {
    phase: 'Phase 3',
    title: 'Core Features',
    items: ['Image upload & validation', 'Builder ID generation', 'PFP Frame generation', 'Canvas preview'],
    status: 'active',
  },
  {
    phase: 'Phase 4',
    title: 'User Experience',
    items: ['Responsive design', 'Animations & micro-interactions', 'Loading states', 'Accessibility'],
    status: 'active',
  },
  {
    phase: 'Phase 5',
    title: 'Download & Share',
    items: ['PNG export', 'X share integration', '#FrameInGoa hashtag', 'OG image preview'],
    status: 'upcoming',
  },
  {
    phase: 'Phase 6',
    title: 'Quality & Launch',
    items: ['QA testing', 'Performance optimization', 'Production deployment', 'Demo preparation'],
    status: 'upcoming',
  },
]

const futureItems = [
  'AI-generated Builder Titles',
  'Multiple card themes',
  'QR code verification',
  'Public builder profiles',
  'Event leaderboards',
  'Reusable event templates',
]

export default function Roadmap() {
  return (
    <section className="roadmap section" id="roadmap">
      <div className="container">
        {/* Header */}
        <div className="roadmap__header">
          <span className="badge badge-yellow">Product Roadmap</span>
          <h2 className="display-medium">
            Building in <span className="gradient-text-green">Public</span>
          </h2>
          <p className="body-lg roadmap__subtitle">
            A transparent view of how we're building HH Goa 2026 Builder Identity Generator — phase by phase.
          </p>
        </div>

        {/* Phase grid */}
        <div className="roadmap__grid">
          {phases.map((phase, i) => (
            <div key={i} className={`roadmap__phase roadmap__phase--${phase.status}`}>
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
            </div>
          ))}
        </div>

        {/* Future */}
        <div className="roadmap__future">
          <div className="roadmap__future-header">
            <span className="badge badge-red">Future Vision</span>
            <h3 className="heading-lg">What's Coming Next</h3>
          </div>
          <div className="roadmap__future-items">
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
  )
}
