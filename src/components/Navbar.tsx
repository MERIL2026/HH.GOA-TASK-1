import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import './Navbar.css'

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const navLinks = [
  { id: 'home',         label: 'Home' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'generator',    label: 'Generator' },
  { id: 'roadmap',      label: 'Roadmap' },
  { id: 'community',    label: 'Community' },
]

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(id)
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container-wide">

        {/* Logo */}
        <div className="navbar__logo" onClick={() => scrollToSection('home')}>
          <div className="navbar__logo-wordmark">
            HH <span>Goa</span>
          </div>
          <div className="navbar__logo-year">2026</div>
        </div>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                className={`navbar__link ${activeSection === link.id ? 'navbar__link--active' : ''}`}
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="navbar__cta">
          <button onClick={() => scrollToSection('generator')}>
            Generate Your ID →
          </button>
        </div>

        {/* Hamburger */}
        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`navbar__mobile-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </button>
          ))}
          <button
            style={{
              marginTop: '12px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'var(--hh-yellow)',
              color: '#022C19',
              border: '2px solid var(--hh-yellow)',
              padding: '12px 24px',
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #022C19',
              width: '100%',
            }}
            onClick={() => scrollToSection('generator')}
          >
            Generate Your ID →
          </button>
        </div>
      )}
    </nav>
  )
}
