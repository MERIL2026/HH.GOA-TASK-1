import { ExternalLink, Code2, Share2 } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* INFINITE MARQUEE */}
      <div className="footer__marquee">
        <div className="footer__marquee-track">
          <span>WEB3</span><span>✦</span>
          <span>ARTIFICIAL INTELLIGENCE</span><span>✦</span>
          <span>DEFI</span><span>✦</span>
          <span>ZERO KNOWLEDGE</span><span>✦</span>
          <span>RUST</span><span>✦</span>
          <span>SOLANA</span><span>✦</span>
          <span>ETHEREUM</span><span>✦</span>
          <span>FULL STACK</span><span>✦</span>
          <span>WEB3</span><span>✦</span>
          <span>ARTIFICIAL INTELLIGENCE</span><span>✦</span>
          <span>DEFI</span><span>✦</span>
          <span>ZERO KNOWLEDGE</span><span>✦</span>
          <span>RUST</span><span>✦</span>
          <span>SOLANA</span><span>✦</span>
          <span>ETHEREUM</span><span>✦</span>
          <span>FULL STACK</span><span>✦</span>
        </div>
      </div>

      {/* BIG BOTTOM CTA */}
      <div className="footer__cta container-wide">
        <h2 className="footer__cta-title">Ready to Frame Your Identity?</h2>
        <p className="footer__cta-desc">
          Generate your official Builder ID, download your PFP, and join the most anticipated hacker house event.
        </p>
        <div className="footer__cta-actions">
          <a href="#generator" className="footer__cta-btn">Generate ID Now →</a>
          <a href="https://forms.gle/jM5hTaGvsrfEfixPA" target="_blank" rel="noopener noreferrer" className="footer__cta-btn footer__cta-btn--secondary">Apply For Waitlist</a>
        </div>
      </div>

      <div className="footer__top container-wide">
        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <img src="/hhgoa-logo.png" alt="Hacker House Goa Logo" className="footer__logo-img" />
          </div>
          <p className="footer__brand-desc">
            Builder Identity Generator for Hacker House Goa 2026. Built by Aether Labs.
          </p>
          <div className="footer__social">
            <a href="https://x.com/search?q=%23FrameInGoa" target="_blank" rel="noopener noreferrer" className="footer__social-link" title="Twitter / X">
              <Share2 size={16} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" title="GitHub">
              <Code2 size={16} />
            </a>
            <a href="https://x.com/search?q=%23HHGoa2026" target="_blank" rel="noopener noreferrer" className="footer__social-link" title="Official Hashtag">
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="footer__links-group">
          <div className="footer__links-col">
            <h4 className="footer__links-title">Product</h4>
            <ul className="footer__links">
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#generator">Generator</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
              <li><a href="#community">Community</a></li>
            </ul>
          </div>
          <div className="footer__links-col">
            <h4 className="footer__links-title">Features</h4>
            <ul className="footer__links">
              <li><a href="#generator">Builder ID Card</a></li>
              <li><a href="#generator">PFP Frame</a></li>
              <li><a href="#generator">Download PNG</a></li>
              <li><a href="#generator">Share to X</a></li>
            </ul>
          </div>
          <div className="footer__links-col">
            <h4 className="footer__links-title">Event</h4>
            <ul className="footer__links">
              <li><a href="#home">Hacker House Goa</a></li>
              <li><a href="https://x.com/search?q=%23FrameInGoa" target="_blank" rel="noopener noreferrer">#FrameInGoa</a></li>
              <li><a href="https://forms.gle/jM5hTaGvsrfEfixPA" target="_blank" rel="noopener noreferrer">Submit Your Build</a></li>
              <li><a href="https://forms.gle/jM5hTaGvsrfEfixPA" target="_blank" rel="noopener noreferrer">Submission Form</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="footer__bottom container-wide">
        <p className="footer__copy">
          © {year} Aether Labs · HH Goa 2026 Builder Identity Generator
        </p>
        <div className="footer__bottom-tags">
          <span className="footer__tag">#FrameInGoa</span>
          <span className="footer__tag">#HHGoa2026</span>
          <span className="footer__tag">Built with ♥</span>
        </div>
      </div>
    </footer>
  )
}
