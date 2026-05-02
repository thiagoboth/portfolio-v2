import { useState, useEffect } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useScrollStore } from '../../store/scrollStore'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Início', href: '#hero' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
]

const SECTION_IDS = ['hero', 'sobre', 'servicos', 'projetos', 'contato']

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Reads active section directly from the scroll machine's source of truth
  const activeSectionId = useScrollStore(s => s.activeSectionId)
  const sections = useScrollStore(s => s.sections)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    const sectionId = href.slice(1)
    const idx = SECTION_IDS.indexOf(sectionId)

    // The correct snap target for section[idx] is sections[idx-1].bottom:
    // that's the pixel where the previous section finishes its transition zone
    // and the next one becomes fully visible and stable (no crossfade).
    let targetScroll = 0
    if (idx > 0 && sections.length > 0) {
      targetScroll = sections[idx - 1]?.bottom ?? 0
    }

    setTimeout(() => {
      const lenis = (window as any).lenis
      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: 1.0,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        })
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      }
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
                className={`navbar__link ${activeSectionId === link.href.slice(1) ? 'navbar__link--active' : ''}`}
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
