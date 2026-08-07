import './Hero.css'

const tickerItems = [
  'Hacker House Goa 2026',
  '#FrameInGoa',
  'Builder Identity Generator',
  'Upload · Personalise · Download',
  'No Login · Free · Instant',
  'Goa, India — Feb 2026',
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

        <div className="hero__inner container-wide">
          {/* LEFT — Editorial Typography */}
          <div className="hero__content">
            {/* Eyebrow */}
            <div className="hero__eyebrow animate-fade-up">
              <div className="hero__eyebrow-line" />
              <span className="hero__eyebrow-text">Hacker House Goa · Builder Identity Generator</span>
            </div>

            {/* Main Title */}
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
              {/* Pink Hindi accent — THE focal point */}
              <span className="hero__hindi animate-fade-up delay-4">
                बिल्डर्स का मेला
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero__subtitle animate-fade-up delay-4">
              Upload your photo. Get a <strong>Hacker House Goa</strong> branded
              Builder ID Card or Profile Frame — ready to download &amp; share on X in seconds.
            </p>

            {/* CTA Actions */}
            <div className="hero__actions animate-fade-up delay-5">
              <button className="btn btn-primary btn-lg" onClick={scrollToGenerator}>
                Generate Your ID →
              </button>
              <button className="btn btn-outline btn-lg">
                See Examples ↓
              </button>
            </div>

            {/* Meta row */}
            <div className="hero__meta animate-fade-up delay-5">
              <div className="hero__meta-item">
                <span className="hero__meta-label">Location</span>
                <span className="hero__meta-value">Goa, India</span>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-label">Edition</span>
                <span className="hero__meta-value">February 2026</span>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-label">Hashtag</span>
                <span className="hero__meta-value" style={{ color: 'var(--hh-pink)' }}>#FrameInGoa</span>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-label">Cost</span>
                <span className="hero__meta-value">Free · No Login</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Mock ID Card */}
          <div className="hero__visual animate-scale-in delay-3">
            <div style={{ position: 'relative' }}>
              <div className="hero__mock-card animate-float">
                <div className="hero__mock-card-stripe" />
                <div className="hero__mock-card-header">
                  <div className="hero__mock-card-logo">HH Goa</div>
                  <div className="hero__mock-card-year">2026</div>
                </div>
                <div className="hero__mock-card-photo">
                  <div className="hero__mock-photo-placeholder">
                    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="40" cy="30" r="18" fill="rgba(246,214,74,0.15)" stroke="rgba(246,214,74,0.4)" strokeWidth="1.5"/>
                      <path d="M10 72 Q10 54 40 54 Q70 54 70 72" fill="rgba(246,214,74,0.15)" stroke="rgba(246,214,74,0.4)" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
                <div className="hero__mock-card-info">
                  <div className="hero__mock-card-name">Builder Name</div>
                  <div className="hero__mock-card-role">Full Stack · Web3 · AI</div>
                  <div className="hero__mock-card-tag">#FrameInGoa</div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="hero__float-badge hero__float-badge--1 animate-float-slow">
                ✦ Instant Preview
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
          <span>Scroll</span>
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
    </>
  )
}
