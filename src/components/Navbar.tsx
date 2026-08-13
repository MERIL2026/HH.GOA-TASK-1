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

        {/* Logo — Uses provided brand image */}
        <div className="navbar__logo" onClick={() => scrollToSection('home')}>
          <img src="/hhgoa-logo.png" alt="Hacker House Goa Logo" className="navbar__logo-img" />
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
            className="navbar__mobile-cta"
            onClick={() => scrollToSection('generator')}
          >
            Generate Your ID →
          </button>
        </div>
      )}
    </nav>
  )
}
