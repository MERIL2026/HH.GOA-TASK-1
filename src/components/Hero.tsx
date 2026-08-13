import './Hero.css'
import TiltCard from './TiltCard'
import MagneticButton from './MagneticButton'

const tickerItems = [
  '⚡ Hacker House Goa 2026',
  '🌊 #FrameInGoa',
  '☀️ Official Builder Ticket Generator',
  '🥥 Upload · Personalise · Download',
  '✨ No Login · Free · Instant Export',
  '⚡ Goa, India — Feb 2026',
]

export default function Hero() {
  const scrollToGenerator = () => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero" id="home">
        {/* Top yellow rule */}
        <div className="hero__top-rule" />

        {/* Goa Rotating Sunburst Background Ray Animation */}
        <div className="hero__sunburst-bg animate-sunburst" />
        <div className="hero__sun-ring" />

        {/* Ambient Goa Sunset Glow Orbs */}
        <div className="hero__glow-orb hero__glow-orb--1 animate-glow" />
        <div className="hero__glow-orb hero__glow-orb--2 animate-glow delay-2" />

        {/* Background Watermark Marquee Text */}
        <div className="bg-watermark-strip">
          HACKER HOUSE GOA 2026 · BUILDERS IN PARADISE · #FRAMEINGOA · HACKER HOUSE GOA 2026 · BUILDERS IN PARADISE · #FRAMEINGOA ·
        </div>

        {/* Swaying Palm Tree Silhouettes (Left & Right) */}
        <div className="hero__palm hero__palm-left animate-palm-sway">
          <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 180 Q40 100 20 10" stroke="var(--hh-sun-yellow)" strokeWidth="4" opacity="0.2" />
            <path d="M20 10 Q60 5 90 30" stroke="var(--hh-sun-yellow)" strokeWidth="3" opacity="0.25" />
            <path d="M20 10 Q70 25 100 60" stroke="var(--hh-sun-yellow)" strokeWidth="3" opacity="0.25" />
            <path d="M20 10 Q10 40 40 80" stroke="var(--hh-sun-yellow)" strokeWidth="3" opacity="0.25" />
            <path d="M20 10 Q-20 30 -10 70" stroke="var(--hh-sun-yellow)" strokeWidth="3" opacity="0.25" />
          </svg>
        </div>

        <div className="hero__palm hero__palm-right animate-palm-sway delay-2">
          <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M110 180 Q80 100 100 10" stroke="var(--hh-sun-yellow)" strokeWidth="4" opacity="0.2" />
            <path d="M100 10 Q60 5 30 30" stroke="var(--hh-sun-yellow)" strokeWidth="3" opacity="0.25" />
            <path d="M100 10 Q30 25 0 60" stroke="var(--hh-sun-yellow)" strokeWidth="3" opacity="0.25" />
            <path d="M100 10 Q110 40 80 80" stroke="var(--hh-sun-yellow)" strokeWidth="3" opacity="0.25" />
          </svg>
        </div>

        <div className="hero__inner container-wide">
          {/* LEFT — Editorial Typography */}
          <div className="hero__content">
            {/* Eyebrow */}
            <div className="hero__eyebrow animate-fade-up">
              <div className="hero__eyebrow-line" />
              <span className="hero__eyebrow-text">⚡ Hacker House Goa · Official Builder Identity</span>
            </div>

            {/* Main Title — Canela Display */}
            <h1 className="hero__title">
              <span className="hero__title-main animate-fade-up delay-1">
                HACKER
              </span>
              <span className="hero__title-main animate-fade-up delay-2">
                HOUSE
              </span>
              <span className="hero__title-sub animate-fade-up delay-3">
                Goa 2026
              </span>
              {/* Terracotta Hindi accent — THE focal point */}
              <span className="hero__hindi animate-fade-up delay-4 text-goa-wave">
                बिल्डर्स का मेला ⚡
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero__subtitle animate-fade-up delay-4">
              Upload your photo. Get your official <strong>Hacker House Goa</strong> branded
              Builder Ticket or Profile Frame — ready to download &amp; share on X in seconds.
            </p>

            {/* CTA Actions */}
            <div className="hero__actions animate-fade-up delay-5">
              <MagneticButton className="btn btn-primary btn-lg" onClick={scrollToGenerator}>
                Generate Your Ticket →
              </MagneticButton>
              <MagneticButton
                className="btn btn-outline btn-lg"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works ↓
              </MagneticButton>
            </div>

            {/* Meta row */}
            <div className="hero__meta animate-fade-up delay-5">
              <div className="hero__meta-item">
                <span className="hero__meta-label">Location</span>
                <span className="hero__meta-value">⚡ Goa, India</span>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-label">Edition</span>
                <span className="hero__meta-value">☀️ February 2026</span>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-label">Hashtag</span>
                <span className="hero__meta-value" style={{ color: 'var(--hh-terracotta)' }}>#FrameInGoa</span>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-label">Access</span>
                <span className="hero__meta-value">Free · Instant</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Premium Animated Mock Card */}
          <div className="hero__visual animate-fade-up delay-3">
            <div className="hero__card-showcase">
              <TiltCard maxTilt={15}>
                <div className="hero__mock-card animate-float">
                  <div className="hero__mock-card-stripe" />
                  <div className="hero__mock-card-header">
                    <img src="/hhgoa-logo.png" alt="HH Goa Logo" className="hero__mock-card-logo-img" />
                  </div>
                  <div className="hero__mock-card-photo">
                    <div className="hero__mock-photo-placeholder">
                      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="40" cy="30" r="18" fill="rgba(244,183,40,0.12)" stroke="rgba(244,183,40,0.35)" strokeWidth="1.5"/>
                        <path d="M10 72 Q10 54 40 54 Q70 54 70 72" fill="rgba(244,183,40,0.12)" stroke="rgba(244,183,40,0.35)" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  </div>
                  <div className="hero__mock-card-info">
                    <div className="hero__mock-card-name">BUILDER #108</div>
                    <div className="hero__mock-card-role">Full Stack · AI · Web3</div>
                    <div className="hero__mock-card-tag">#FrameInGoa</div>
                  </div>
                </div>
              </TiltCard>

              {/* Floating Badges */}
              <div className="hero__float-badge hero__float-badge--1 animate-badge-float">⚡ Official ID</div>
              <div className="hero__float-badge hero__float-badge--2 animate-badge-float delay-2">☀️ Goa 2026</div>
              <div className="hero__float-badge hero__float-badge--3 animate-badge-float delay-3">🌊 #FrameInGoa</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-indicator animate-scroll-bounce">
          <div className="hero__scroll-dot" />
          <span>Scroll ↓</span>
        </div>
      </section>

      {/* TICKER STRIP — below hero */}
      <div className="hero__ticker">
        <div className="hero__ticker-track">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="hero__ticker-item">
              {item}
              <span className="hero__ticker-dot" />
            </span>
          ))}
        </div>
      </div>

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
