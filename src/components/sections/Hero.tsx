import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import { ParticlesBg } from '../animations/ParticlesBg'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const TYPED_WORDS = ['Desenvolvedor', 'Consultora', 'Criador', 'Estrategista']

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLSpanElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)

  // Typewriter loop for the animated word
  useEffect(() => {
    const el = wordRef.current
    if (!el) return
    let wordIndex = 0
    let charIndex = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout>

    const type = () => {
      const word = TYPED_WORDS[wordIndex]
      if (!deleting) {
        charIndex++
        el.textContent = word.slice(0, charIndex)
        if (charIndex === word.length) {
          deleting = true
          timer = setTimeout(type, 1800)
          return
        }
      } else {
        charIndex--
        el.textContent = word.slice(0, charIndex)
        if (charIndex === 0) {
          deleting = false
          wordIndex = (wordIndex + 1) % TYPED_WORDS.length
        }
      }
      timer = setTimeout(type, deleting ? 50 : 80)
    }

    timer = setTimeout(type, 600)
    return () => clearTimeout(timer)
  }, [])

  // Scroll-out animations
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    tl.to(titleRef.current, { y: -80, opacity: 0, ease: 'none' }, 0)
      .to(subtitleRef.current, { y: -50, opacity: 0, ease: 'none' }, 0.05)
      .to(ctaRef.current, { y: -30, opacity: 0, ease: 'none' }, 0.1)
      .to(taglineRef.current, { x: 120, opacity: 0, ease: 'none' }, 0)

    return () => { tl.kill() }
  }, [])

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      <ParticlesBg />

      <div className="hero__content container">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero__tagline"
        >
          <span ref={taglineRef} className="section-label mono">
            Olá, sou Thiago Botelho
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          ref={titleRef}
          className="hero__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="gradient-text">
            <span ref={wordRef}>Desenvolvedor</span>
          </span>
          <br />
          <span>& Consultor</span>
          <br />
          <span className="hero__title-outline">Tecnológico</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          ref={subtitleRef}
          className="hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          Soluções completas para transformar seu negócio através da tecnologia.
          <br />
          Design + Desenvolvimento + Estratégia.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          ref={ctaRef}
          className="hero__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
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
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="hero__socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            id="hero-social-github"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/thiago-botelho-6a255b205/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            id="hero-social-linkedin"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:thiagobotelho.dev@gmail.com"
            className="social-link"
            id="hero-social-email"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <ArrowDown size={18} className="scroll-indicator__arrow" />
        <span>scroll</span>
      </motion.div>

      {/* Grid overlay */}
      <div className="hero__grid" aria-hidden="true" />
    </section>
  )
}
