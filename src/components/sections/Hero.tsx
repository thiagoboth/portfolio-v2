import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useTransform, useMotionValue, MotionValue } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import { TypewriterTextScroll } from '../animations/ScrollTypewriter'
import { FigmaSelectableBlock } from '../ui/FigmaSelectableBlock'
import { useSectionScroll } from '../../hooks/useSectionScroll'
import { useSectionTransition } from '../../hooks/useSectionTransition'
import './Hero.css'

const TYPED_WORDS = ['Desenvolvedor', 'Consultora', 'Criador', 'Estrategista']

/* ── Easing / Math ─────────────────────────────────────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (t: number) => Math.max(0, Math.min(1, t))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

/* ══════════════════════════════════════════════════════════════
   Cursor SVG — fundo azul arredondado + seta branca
   (Replica o ícone de referência do usuário)
   ══════════════════════════════════════════════════════════════ */
function MouseCursorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
      <path d="M5.45 2.65L19.76 11.66C20.66 12.23 20.47 13.63 19.42 13.86L13.93 15.05C13.51 15.14 13.16 15.45 12.99 15.85L10.68 21.05C10.24 22.05 8.72 22.06 8.26 21.07L5.45 2.65Z"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  )
}

/* ── Posições-alvo ─────────────────────────────────────────── */
interface TargetPositions {
  ctaCenter: { x: number; y: number }
  ctaTrash: { x: number; y: number }
  socialsCenter: { x: number; y: number }
  socialsTrash: { x: number; y: number }
}

/* ══════════════════════════════════════════════════════════════
   SCROLL THRESHOLDS (dentro do range 0 – 0.2 do Hero)
   
   CTA Phase:
     0.025 → 0.048  cursor aparece e anda até os CTAs (arco)
     0.048           cursor chega → borda aparece
     0.048 → 0.058  cursor move para a lixeira
       0.054 → 0.058  lixeira recebe hover glow
     0.058 → 0.060  cursor faz click (scale down + trash red)
     0.060           CTAs somem instantaneamente

   Socials Phase:
     0.063 → 0.080  cursor anda até os Socials
     0.080           borda aparece
     0.080 → 0.090  cursor move para a lixeira
       0.086 → 0.090  lixeira recebe hover glow
     0.090 → 0.092  cursor faz click
     0.092           Socials somem
     0.092 → 0.110  cursor desaparece
   ══════════════════════════════════════════════════════════════ */

export function Hero({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const sectionRef = useRef<HTMLElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const ctaGroupRef = useRef<HTMLDivElement>(null)
  const socialsGroupRef = useRef<HTMLDivElement>(null)

  // ── Wrapper transition (controlled by scrollStore) ────────
  const { opacity: wrapperOpacity, y: wrapperY, pointerEvents: wrapperPointerEvents } = useSectionTransition('hero')

  // ── Internal animations (still driven by scrollYProgress) ─
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.1, 0.18], [1, 1, 0])
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])
  const exitX = useTransform(scrollYProgress, [0, 0.2], [0, 80])

  // Hook for internal scrolling
  const { ref: scrollRef, y: scrollY } = useSectionScroll(scrollYProgress, [0, 0.1])

  // ── FigmaSelectableBlock states ───────────────────────────
  const [ctaVisible, setCtaVisible] = useState(true)
  const [socialsVisible, setSocialsVisible] = useState(true)
  const [ctaActive, setCtaActive] = useState(false)
  const [socialsActive, setSocialsActive] = useState(false)
  const [ctaTrashHovered, setCtaTrashHovered] = useState(false)
  const [ctaTrashClicked, setCtaTrashClicked] = useState(false)
  const [socialsTrashHovered, setSocialsTrashHovered] = useState(false)
  const [socialsTrashClicked, setSocialsTrashClicked] = useState(false)

  // ── Cursor Motion Values ──────────────────────────────────
  const [showCursor, setShowCursor] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(400)
  const cursorOpacity = useMotionValue(0)
  const cursorScale = useMotionValue(1)

  // ── Scroll-driven cursor animation ────────────────────────
  useEffect(() => {
    let cachedCtaRect: DOMRect | null = null
    let cachedSocialsRect: DOMRect | null = null

    return scrollYProgress.on('change', (v) => {
      // ══ VISIBILITY — bidirecional ══
      setCtaVisible(v < 0.060)
      setSocialsVisible(v < 0.092)

      const ctaEl = ctaGroupRef.current
      const socialsEl = socialsGroupRef.current

      // getBoundingClientRect() gets the real transformed position!
      if (ctaEl) cachedCtaRect = ctaEl.getBoundingClientRect()
      if (socialsEl) cachedSocialsRect = socialsEl.getBoundingClientRect()

      if (!cachedCtaRect || !cachedSocialsRect) return

      // SVG Hotspot (tip of the arrow) offset
      const HOTSPOT_X = 5.5
      const HOTSPOT_Y = 2.7

      const pos = {
        ctaCenter: {
          x: cachedCtaRect.left + cachedCtaRect.width / 2 - HOTSPOT_X,
          y: cachedCtaRect.top + cachedCtaRect.height / 2 - HOTSPOT_Y,
        },
        ctaTrash: {
          x: cachedCtaRect.right - 5 - HOTSPOT_X,
          y: cachedCtaRect.top - 16 - HOTSPOT_Y,
        },
        socialsCenter: {
          x: cachedSocialsRect.left + cachedSocialsRect.width / 2 - HOTSPOT_X,
          y: cachedSocialsRect.top + cachedSocialsRect.height / 2 - HOTSPOT_Y,
        },
        socialsTrash: {
          x: cachedSocialsRect.right - 5 - HOTSPOT_X,
          y: cachedSocialsRect.top - 16 - HOTSPOT_Y,
        },
      }

      const startX = -100

      // ══ RESET all states before applying current phase ══
      let _showCursor = false
      let _ctaActive = false
      let _socialsActive = false
      let _ctaTrashHovered = false
      let _ctaTrashClicked = false
      let _socialsTrashHovered = false
      let _socialsTrashClicked = false

      // ── PHASE: Before anything ──
      if (v < 0.025) {
        cursorOpacity.set(0)
        cursorScale.set(1)
      }

      // ── PHASE: Cursor approaches CTAs ──
      else if (v < 0.048) {
        _showCursor = true
        const t = clamp01((v - 0.025) / 0.023)
        const easedT = easeOutCubic(t)

        cursorOpacity.set(Math.min(t * 3.5, 1))
        cursorScale.set(1)

        // Arc path — leve curva para cima para parecer humano
        const arcY = Math.sin(t * Math.PI) * -30
        cursorX.set(lerp(startX, pos.ctaCenter.x, easedT))
        cursorY.set(lerp(pos.ctaCenter.y + 70, pos.ctaCenter.y, easedT) + arcY)
      }

      // ── PHASE: Cursor sobre CTAs → borda, movendo pro trash ──
      else if (v < 0.060) {
        _showCursor = true
        _ctaActive = true
        cursorOpacity.set(1)

        const t = clamp01((v - 0.048) / 0.012)
        const easedT = easeInOutQuart(t)

        const arcY = Math.sin(t * Math.PI) * -12 // Arco natural pro lixo
        cursorX.set(lerp(pos.ctaCenter.x, pos.ctaTrash.x, easedT))
        cursorY.set(lerp(pos.ctaCenter.y, pos.ctaTrash.y, easedT) + arcY)

        // Hover mais natural só quando chega pertinho
        _ctaTrashHovered = t > 0.8
        _ctaTrashClicked = t > 0.95
        cursorScale.set(t > 0.95 ? lerp(1, 0.7, (t - 0.95) / 0.05) : 1)
      }

      // ── PHASE: Gap CTA → Socials ──
      else if (v < 0.063) {
        _showCursor = true
        cursorOpacity.set(1)
        cursorScale.set(1)
        cursorX.set(pos.ctaTrash.x)
        cursorY.set(pos.ctaTrash.y)
      }

      // ── PHASE: Cursor anda até Socials ──
      else if (v < 0.080) {
        _showCursor = true
        cursorOpacity.set(1)
        cursorScale.set(1)

        const t = clamp01((v - 0.063) / 0.017)
        const easedT = easeOutCubic(t)

        const arcY = Math.sin(t * Math.PI) * -15
        cursorX.set(lerp(pos.ctaTrash.x, pos.socialsCenter.x, easedT))
        cursorY.set(lerp(pos.ctaTrash.y, pos.socialsCenter.y, easedT) + arcY)
      }

      // ── PHASE: Cursor sobre Socials → borda, movendo pro trash ──
      else if (v < 0.092) {
        _showCursor = true
        _socialsActive = true
        cursorOpacity.set(1)

        const t = clamp01((v - 0.080) / 0.012)
        const easedT = easeInOutQuart(t)

        const arcY = Math.sin(t * Math.PI) * -12
        cursorX.set(lerp(pos.socialsCenter.x, pos.socialsTrash.x, easedT))
        cursorY.set(lerp(pos.socialsCenter.y, pos.socialsTrash.y, easedT) + arcY)

        _socialsTrashHovered = t > 0.8
        _socialsTrashClicked = t > 0.95
        cursorScale.set(t > 0.95 ? lerp(1, 0.7, (t - 0.95) / 0.05) : 1)
      }

      // ── PHASE: Cursor desaparece ──
      else if (v < 0.115) {
        _showCursor = true
        cursorScale.set(1)
        const t = clamp01((v - 0.092) / 0.023)
        cursorOpacity.set(1 - easeOutCubic(t))
      }

      // ── PHASE: Tudo finalizado ──
      else {
        cursorOpacity.set(0)
      }

      // ══ BATCH STATE UPDATES ══
      setShowCursor(_showCursor)
      setCtaActive(_ctaActive)
      setSocialsActive(_socialsActive)
      setCtaTrashHovered(_ctaTrashHovered)
      setCtaTrashClicked(_ctaTrashClicked)
      setSocialsTrashHovered(_socialsTrashHovered)
      setSocialsTrashClicked(_socialsTrashClicked)
    })
  }, [scrollYProgress, cursorX, cursorY, cursorOpacity, cursorScale])


  // ── Typewriter loop ───────────────────────────────────────
  useEffect(() => {
    const el = wordRef.current
    if (!el) return
    let wordIndex = 0, charIndex = 0, deleting = false
    let timer: ReturnType<typeof setTimeout>

    const type = () => {
      const word = TYPED_WORDS[wordIndex]
      if (!deleting) {
        charIndex++
        el.textContent = word.slice(0, charIndex)
        if (charIndex === word.length) { deleting = true; timer = setTimeout(type, 1800); return }
      } else {
        charIndex--
        el.textContent = word.slice(0, charIndex)
        if (charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % TYPED_WORDS.length }
      }
      timer = setTimeout(type, deleting ? 50 : 80)
    }

    timer = setTimeout(type, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* ── Cursor Fixo (position:fixed escapa do overflow) ── */}
      {showCursor && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            x: cursorX,
            y: cursorY,
            opacity: cursorOpacity,
            scale: cursorScale,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <MouseCursorIcon />
        </motion.div>
      )}

      {/* ── Hero Section ─────────────────────────────────────── */}
      <motion.section
        className="hero section"
        id="hero"
        data-section="hero"
        ref={sectionRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: wrapperOpacity,
          y: wrapperY,
          pointerEvents: wrapperPointerEvents,
        }}
      >
        <motion.div ref={scrollRef} style={{ y: scrollY, width: '100%', pointerEvents: 'none' }}>
        <div className="hero__content container" style={{ pointerEvents: 'auto' }}>

          {/* Tagline — deleta no scroll */}
          <motion.div
            className="hero__tagline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ x: exitX }}
          >
            <span className="section-label mono">
              <TypewriterTextScroll
                text="Olá, sou Thiago Botelho"
                scrollYProgress={scrollYProgress}
                range={[0.07, 0.01]}
                hideCursorOnDone
              />
            </span>
          </motion.div>

          {/* Título Principal — mantido */}
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: exitX }}
          >
            <span className="gradient-text">
              <span ref={wordRef}>Desenvolvedor</span>
            </span>
            <br />
            <span>
              <TypewriterTextScroll
                text="& Consultor"
                scrollYProgress={scrollYProgress}
                range={[0.1, 0.02]}
                hideCursorOnDone
              />
            </span>
            <br />
            <span className="hero__title-outline">
              <TypewriterTextScroll
                text="Tecnológico"
                scrollYProgress={scrollYProgress}
                range={[0.15, 0.05]}
                hideCursorOnDone
              />
            </span>
          </motion.h1>

          {/* Subtitle — deleta no scroll */}
          <motion.div
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{ x: exitX }}
          >
            <TypewriterTextScroll
              text="Soluções completas para transformar seu negócio através da tecnologia. Design + Desenvolvimento + Estratégia."
              scrollYProgress={scrollYProgress}
              range={[0.2, 0.08]}
              isBlock
              hideCursorOnDone
            />
          </motion.div>

          {/* CTAs — Figma Selectable */}
          <motion.div
            className="hero__cta-outer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            style={{ opacity: ctaOpacity, x: exitX }}
          >
            <FigmaSelectableBlock
              isActive={ctaActive}
              visible={ctaVisible}
              trashHovered={ctaTrashHovered}
              trashClicked={ctaTrashClicked}
              onDelete={() => setCtaVisible(false)}
            >
              <div className="hero__cta" ref={ctaGroupRef}>
                <button
                  className="btn-primary"
                  id="hero-cta-projetos"
                  onClick={() => document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Projetos
                </button>
                <button
                  className="btn-ghost"
                  id="hero-cta-contato"
                  onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Entre em Contato
                </button>
              </div>
            </FigmaSelectableBlock>
          </motion.div>

          {/* Social Links — Figma Selectable */}
          <motion.div
            className="hero__socials-outer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            style={{ opacity: ctaOpacity, x: exitX }}
          >
            <FigmaSelectableBlock
              isActive={socialsActive}
              visible={socialsVisible}
              trashHovered={socialsTrashHovered}
              trashClicked={socialsTrashClicked}
              onDelete={() => setSocialsVisible(false)}
            >
              <div className="hero__socials" ref={socialsGroupRef}>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="social-link" id="hero-social-github" aria-label="GitHub">
                  <Github size={20} />
                </a>
                <a href="https://www.linkedin.com/in/thiago-botelho-6a255b205/" target="_blank" rel="noopener noreferrer"
                  className="social-link" id="hero-social-linkedin" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="mailto:thiagobotelho.dev@gmail.com"
                  className="social-link" id="hero-social-email" aria-label="Email">
                  <Mail size={20} />
                </a>
              </div>
            </FigmaSelectableBlock>
          </motion.div>
        </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <ArrowDown size={18} className="scroll-indicator__arrow" />
          <span>scroll</span>
        </motion.div>

        {/* Grid Overlay */}
        <div className="hero__grid" aria-hidden="true" />
      </motion.section>
    </>
  )
}
