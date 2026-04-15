import { useState, useEffect } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Início', href: '#hero' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 40)
      
      const vh = window.innerHeight
      if (scrollY < vh * 0.5) {
        setActiveSection('hero')
      } else if (scrollY < vh * 1.5) {
        setActiveSection('sobre')
      } else if (scrollY < vh * 2.5) {
        setActiveSection('servicos')
      } else if (scrollY < vh * 3.5) {
        setActiveSection('projetos')
      } else {
        setActiveSection('contato')
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    const vh = window.innerHeight
    let targetScroll = 0
    
    switch (href) {
      case '#hero': targetScroll = 0; break;
      case '#sobre': targetScroll = vh * 1; break; // 100vh => progress 0.25
      case '#servicos': targetScroll = vh * 2; break; // 200vh => progress 0.50
      case '#projetos': targetScroll = vh * 3; break; // 300vh => progress 0.75
      case '#contato': targetScroll = vh * 4; break; // 400vh => progress 1.00
    }

    // Small timeout to allow menu close animation
    setTimeout(() => {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }, 50)
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#hero" className="navbar__logo" onClick={() => handleNav('#hero')}>
          <span className="logo-tb">TB</span>
          <span className="logo-dot">.</span>
        </a>

        <ul className="navbar__links">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <button
                className={`navbar__link ${activeSection === link.href.slice(1) ? 'navbar__link--active' : ''}`}
                onClick={() => handleNav(link.href)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            id="theme-toggle-btn"
          >
            <span className={`theme-toggle__icon ${theme === 'dark' ? 'theme-toggle__icon--visible' : ''}`}>
              <Sun size={18} />
            </span>
            <span className={`theme-toggle__icon ${theme === 'light' ? 'theme-toggle__icon--visible' : ''}`}>
              <Moon size={18} />
            </span>
          </button>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            id="mobile-menu-btn"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        {NAV_LINKS.map(link => (
          <button
            key={link.href}
            className="mobile-menu__link"
            onClick={() => handleNav(link.href)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
