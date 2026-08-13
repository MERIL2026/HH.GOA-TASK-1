import './GoaAmbience.css'

const particles = [
  { emoji: '??', top: '8%',  left: '5%',  delay: '0s',   dur: '18s', size: '1.4rem' },
  { emoji: '??', top: '22%', left: '88%', delay: '2s',   dur: '14s', size: '1.2rem' },
  { emoji: '??', top: '12%', left: '72%', delay: '1s',   dur: '20s', size: '1.6rem' },
  { emoji: '??', top: '45%', left: '3%',  delay: '3s',   dur: '16s', size: '1.1rem' },
  { emoji: '?', top: '60%', left: '92%', delay: '0.5s', dur: '12s', size: '0.9rem' },
  { emoji: '??', top: '75%', left: '15%', delay: '4s',  dur: '22s', size: '1.3rem' },
  { emoji: '??', top: '35%', left: '50%', delay: '1.5s', dur: '17s', size: '1rem' },
  { emoji: '???', top: '55%', left: '78%', delay: '2.5s', dur: '19s', size: '1.2rem' },
  { emoji: '??', top: '85%', left: '60%', delay: '0.8s', dur: '15s', size: '1.1rem' },
  { emoji: '??', top: '30%', left: '25%', delay: '3.5s', dur: '21s', size: '1rem' },
  { emoji: '?', top: '18%', left: '40%', delay: '5s',   dur: '13s', size: '0.85rem' },
  { emoji: '??', top: '68%', left: '45%', delay: '1.2s', dur: '18s', size: '1.15rem' },
]

const fireflies = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  top: `${10 + (i * 37) % 80}%`,
  left: `${5 + (i * 23) % 90}%`,
  delay: `${(i * 0.7) % 5}s`,
  dur: `${3 + (i % 4)}s`,
}))

export default function GoaAmbience() {
  return (
    <>
      {/* Fixed Goa beach illustration background */}
      <div className="goa-ambience__bg-image" aria-hidden="true" />

      {/* Multi-layer dark overlay for readability */}
      <div className="goa-ambience__overlay" aria-hidden="true" />

    <div className="goa-ambience" aria-hidden="true">
      {/* Sunset gradient horizon */}
      <div className="goa-ambience__horizon" />

      {/* Ocean shimmer band */}
      <div className="goa-ambience__ocean">
        <div className="goa-ambience__ocean-wave goa-ambience__ocean-wave--1" />
        <div className="goa-ambience__ocean-wave goa-ambience__ocean-wave--2" />
        <div className="goa-ambience__ocean-wave goa-ambience__ocean-wave--3" />
      </div>

      {/* Floating tropical particles */}
      <div className="goa-ambience__particles">
        {particles.map((p, i) => (
          <span
            key={i}
            className="goa-ambience__particle"
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.dur,
              fontSize: p.size,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* Firefly sparkles */}
      <div className="goa-ambience__fireflies">
        {fireflies.map((f) => (
          <span
            key={f.id}
            className="goa-ambience__firefly"
            style={{
              top: f.top,
              left: f.left,
              animationDelay: f.delay,
              animationDuration: f.dur,
            }}
          />
        ))}
      </div>

      {/* Ambient glow orbs (fixed, subtle) */}
      <div className="goa-ambience__orb goa-ambience__orb--sun animate-glow" />
      <div className="goa-ambience__orb goa-ambience__orb--coral animate-glow delay-2" />
      <div className="goa-ambience__orb goa-ambience__orb--sea animate-glow delay-3" />
    </div>
    </>
  )
}
