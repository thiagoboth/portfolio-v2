import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Sobre.css'

gsap.registerPlugin(ScrollTrigger)

const BIO_FULL = `Sou um desenvolvedor apaixonado por criar soluções tecnológicas que fazem a diferença. Com mais de 8 anos de experiência em desenvolvimento de software e consultoria, ajudo empresas a transformar suas ideias em realidade digital — combinando habilidades técnicas sólidas com um olhar de designer para criar produtos que geram experiências excepcionais ao usuário.`

const SKILLS = [
  { label: 'React / Next.js', level: 95 },
  { label: 'Node.js / APIs', level: 92 },
  { label: 'TypeScript', level: 90 },
  { label: 'React Native', level: 85 },
  { label: 'Banco de Dados', level: 88 },
  { label: 'UI/UX Design', level: 80 },
]

const TAGS = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'React Native', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Figma', 'GraphQL']

export function Sobre() {
  const sectionRef = useRef<HTMLElement>(null)
  const bioRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const [visibleChars, setVisibleChars] = useState(0)

  // Typewriter bio via scroll
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'center 30%',
      scrub: 1.5,
      onUpdate: (self) => {
        const chars = Math.round(self.progress * BIO_FULL.length)
        setVisibleChars(chars)
      },
    })

    return () => st.kill()
  }, [])

  // Image slide in
  useEffect(() => {
    const img = imageRef.current
    if (!img) return

    gsap.fromTo(img,
      { x: -80, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: img,
          start: 'top 75%',
        },
      }
    )
  }, [])

  // Skills bars
  useEffect(() => {
    const el = skillsRef.current
    if (!el) return

    const bars = el.querySelectorAll('.skill-bar__fill')
    bars.forEach((bar, i) => {
      const level = SKILLS[i].level
      gsap.fromTo(bar,
        { scaleX: 0 },
        {
          scaleX: level / 100,
          duration: 1.2,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
          },
        }
      )
    })
  }, [])

  const displayedBio = BIO_FULL.slice(0, visibleChars)
  const isComplete = visibleChars >= BIO_FULL.length

  return (
    <section className="sobre section" id="sobre" ref={sectionRef}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-label"
        >
          Sobre mim
        </motion.div>

        <div className="sobre__grid">
          {/* Left: Avatar/Image */}
          <div ref={imageRef} className="sobre__image-wrap">
            <div className="sobre__avatar">
              <div className="sobre__avatar-inner">
                <span className="sobre__initials">TB</span>
              </div>
              <div className="sobre__avatar-ring" />
              <div className="sobre__avatar-badge">
                <span>8+</span>
                <small>anos</small>
              </div>
            </div>

            {/* Stats */}
            <div className="sobre__stats">
              {[
                { value: '50+', label: 'Projetos' },
                { value: '30+', label: 'Clientes' },
                { value: '8+', label: 'Anos' },
              ].map(stat => (
                <div key={stat.label} className="stat-card glass-card">
                  <span className="stat-card__value gradient-text">{stat.value}</span>
                  <span className="stat-card__label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Text */}
          <div className="sobre__text">
            <h2 className="sobre__heading">
              Design meets <span className="gradient-text">Technology</span>
            </h2>

            <div className="sobre__bio-wrap">
              <p ref={bioRef} className="sobre__bio mono">
                {displayedBio || BIO_FULL}
                {!isComplete && visibleChars > 0 && (
                  <span className="cursor-blink" aria-hidden="true" />
                )}
              </p>
            </div>

            {/* Skills */}
            <div ref={skillsRef} className="sobre__skills">
              {SKILLS.map(skill => (
                <div key={skill.label} className="skill-bar">
                  <div className="skill-bar__header">
                    <span className="skill-bar__label">{skill.label}</span>
                    <span className="skill-bar__value">{skill.level}%</span>
                  </div>
                  <div className="skill-bar__track">
                    <div className="skill-bar__fill" />
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="sobre__tags">
              {TAGS.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
