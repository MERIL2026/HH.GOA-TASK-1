import { Globe, Zap, Code2, Share2 } from 'lucide-react'
import './Community.css'

export default function Community() {
  return (
    <section className="community section" id="community">
      <div className="container">
        {/* Main CTA banner */}
        <div className="community__banner">
          <div className="community__banner-bg" />
          <div className="community__banner-content">
            <span className="badge badge-green">Join the Movement</span>
            <h2 className="display-medium community__banner-title">
              Ready to Claim Your{' '}
              <span className="gradient-text-green">Builder Identity?</span>
            </h2>
            <p className="body-lg community__banner-sub">
              Generate your HH Goa 2026 Builder ID in seconds. Show the world you're building.
            </p>
            <div className="community__banner-actions">
              <button
                className="btn btn-primary btn-xl"
                onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Generate Your ID — It's Free
                <Zap size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="community__banner-hashtag">#FrameInGoa</div>
          </div>

          {/* Floating social cards */}
          <div className="community__social-cards">
            <div className="community__social-card community__social-card--1">
              <Share2 size={20} className="community__social-icon" />
              <span>Follow updates on X</span>
            </div>
            <div className="community__social-card community__social-card--2">
              <Code2 size={20} className="community__social-icon" />
              <span>Open source project</span>
            </div>
            <div className="community__social-card community__social-card--3">
              <Globe size={20} className="community__social-icon" />
              <span>HH Goa Community</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="community__stats">
          {[
            { value: '< 2s', label: 'Generation time' },
            { value: 'Zero', label: 'Login required' },
            { value: '3', label: 'Simple steps' },
            { value: '100%', label: 'HH Goa branded' },
          ].map((stat, i) => (
            <div key={i} className="community__stat">
              <div className="community__stat-value">{stat.value}</div>
              <div className="community__stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
