import { ArrowRight, Sparkles, Play } from 'lucide-react'
import './Hero.css'

export default function Hero() {
  const scrollToGenerator = () => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="home">
      {/* Background effects */}
      <div className="hero__bg">
        <div className="hero__bg-orb hero__bg-orb--1" />
        <div className="hero__bg-orb hero__bg-orb--2" />
        <div className="hero__bg-orb hero__bg-orb--3" />
        <div className="hero__bg-grid" />
      </div>

      <div className="hero__inner container">
        {/* Left Content */}
        <div className="hero__content">
          <div className="hero__badge animate-fade-up">
            <span className="badge badge-green">
              <Sparkles size={12} />
              HH Goa 2026 — Builder Identity
            </span>
          </div>

          <h1 className="hero__title animate-fade-up delay-1">
            <span className="hero__title-line hero__title-line--white">Build Your</span>
            <br />
            <span className="hero__title-line hero__title-line--green gradient-text-green">
              Builder
            </span>
            <br />
            <span className="hero__title-line hero__title-line--outline">
              Identity.
            </span>
          </h1>

          <p className="hero__subtitle animate-fade-up delay-2">
            Upload your photo. Get a branded <strong>Hacker House Goa</strong> Builder ID Card or
            Profile Frame — ready to download & share on X in seconds.
          </p>

          <div className="hero__actions animate-fade-up delay-3">
            <button className="btn btn-primary btn-lg" onClick={scrollToGenerator}>
              Generate Your ID
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
            <button className="btn btn-ghost btn-lg">
              <Play size={16} strokeWidth={2.5} />
              Watch Demo
            </button>
          </div>

          <div className="hero__tags animate-fade-up delay-4">
            {['No Login Required', 'Instant Generation', 'Mobile Friendly', '#FrameInGoa'].map((tag) => (
              <span key={tag} className="hero__tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Right Visual */}
        <div className="hero__visual animate-scale-in delay-2">
          <div className="hero__card-preview">
            {/* Mock ID Card Visual */}
            <div className="hero__mock-card animate-float">
              <div className="hero__mock-card-header">
                <div className="hero__mock-card-logo">HH GOA</div>
                <div className="hero__mock-card-year">2026</div>
              </div>
              <div className="hero__mock-card-photo">
                <div className="hero__mock-photo-placeholder">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="30" r="18" fill="rgba(4,106,56,0.3)" stroke="rgba(4,106,56,0.6)" strokeWidth="2"/>
                    <path d="M10 72 Q10 54 40 54 Q70 54 70 72" fill="rgba(4,106,56,0.3)" stroke="rgba(4,106,56,0.6)" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="hero__mock-card-glow" />
              </div>
              <div className="hero__mock-card-info">
                <div className="hero__mock-card-name">Builder Name</div>
                <div className="hero__mock-card-role">Full Stack • Web3 • AI</div>
                <div className="hero__mock-card-id">HH·GOA·2026·00X</div>
              </div>
              <div className="hero__mock-card-tag">#FrameInGoa</div>
            </div>

            {/* Floating elements */}
            <div className="hero__float-badge hero__float-badge--1 animate-float-slow">
              <Sparkles size={14} />
              Instant Preview
            </div>
            <div className="hero__float-badge hero__float-badge--2 animate-float-slow delay-2">
              ↓ Download PNG
            </div>
            <div className="hero__float-badge hero__float-badge--3 animate-float-slow delay-4">
              𝕏 Share Now
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-indicator">
        <div className="hero__scroll-dot" />
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}
