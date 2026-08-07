import { useState, useEffect } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import './Navbar.css'

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'generator', label: 'Generator' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'community', label: 'Community' },
]

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(id)
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container-wide">
        {/* Logo */}
        <div className="navbar__logo" onClick={() => scrollToSection('home')}>
          <div className="navbar__logo-icon">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <span className="navbar__logo-text">
            HH <span className="navbar__logo-accent">Goa</span>
          </span>
          <span className="badge badge-green">2026</span>
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
          <button className="btn btn-primary btn-sm" onClick={() => scrollToSection('generator')}>
            Generate Your ID →
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
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
          <button className="btn btn-primary btn-sm" onClick={() => scrollToSection('generator')}>
            Generate Your ID →
          </button>
        </div>
      )}
    </nav>
  )
}
