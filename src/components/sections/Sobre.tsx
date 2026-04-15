import { useRef } from 'react'
import { motion, useTransform, MotionValue } from 'framer-motion'
import { TypewriterTextScroll } from '../animations/ScrollTypewriter'
import './Sobre.css'

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

export function Sobre({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const TITLE_TEXT = 'Design meets Technology'

  // -- VISIBILITY & POINTER EVENTS --
  // Active segment centered at 0.25. 
  // Enters: 0.12 -> 0.18
  // Plateau: 0.18 -> 0.32 (Snap point at 0.25)
  // Exits: 0.32 -> 0.38
  const sobreOpacity = useTransform(scrollYProgress, [0.12, 0.18, 0.32, 0.38], [0, 1, 1, 0])
  const sobrePointerEvents = useTransform(scrollYProgress, (v) => (v > 0.15 && v < 0.35) ? 'auto' : 'none')

  // Avatar / Internal Animations
  const avatarX = useTransform(scrollYProgress, [0.12, 0.18, 0.32, 0.38], [-40, 0, 0, -40])
  const avatarOpacity = useTransform(scrollYProgress, [0.12, 0.18, 0.32, 0.38], [0, 1, 1, 0])
  return (
    <motion.section 
      className="sobre section" 
      id="sobre" 
      style={{ 
        position: 'absolute', 
        inset: 0, 
        opacity: sobreOpacity,
        pointerEvents: sobrePointerEvents as any
      }}
    >
      <div className="container" style={{ pointerEvents: 'auto' }}>
        <motion.div
          style={{ opacity: avatarOpacity }}
          className="section-label"
        >
          Sobre mim
        </motion.div>

        <div className="sobre__grid">
          {/* Left: Avatar/Image */}
          <motion.div 
            className="sobre__image-wrap"
            style={{ x: avatarX, opacity: avatarOpacity }}
          >
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
              ].map((stat, i) => {
                const statOpacity = useTransform(scrollYProgress, [0.2 + (i * 0.02), 0.25 + (i * 0.02), 0.32, 0.38], [0, 1, 1, 0])
                return (
                  <motion.div key={stat.label} className="stat-card glass-card" style={{ opacity: statOpacity }}>
                    <span className="stat-card__value gradient-text">{stat.value}</span>
                    <span className="stat-card__label">{stat.label}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right: Text */}
          <div className="sobre__text">
            <h2 className="sobre__heading">
              <TypewriterTextScroll
                text={TITLE_TEXT}
                scrollYProgress={scrollYProgress}
                range={[0.18, 0.25]}
                hideCursorOnDone
              />
            </h2>

            <div className="sobre__bio-wrap">
              <p className="sobre__bio mono" style={{ margin: 0 }}>
                <TypewriterTextScroll
                  text={BIO_FULL}
                  scrollYProgress={scrollYProgress}
                  range={[0.2, 0.3]} 
                  isBlock
                />
              </p>
            </div>

            {/* Skills */}
            <div className="sobre__skills">
              {SKILLS.map((skill, i) => {
                const scaleX = useTransform(scrollYProgress, [0.22 + (i * 0.02), 0.28 + (i * 0.02), 0.32, 0.38], [0, skill.level / 100, skill.level / 100, 0])
                
                return (
                <div key={skill.label} className="skill-bar">
                  <div className="skill-bar__header">
                    <span className="skill-bar__label">{skill.label}</span>
                    <span className="skill-bar__value">{skill.level}%</span>
                  </div>
                  <div className="skill-bar__track">
                    <motion.div className="skill-bar__fill" style={{ scaleX, transformOrigin: 'left' }} />
                  </div>
                </div>
                )
              })}
            </div>

            {/* Tags */}
            <div className="sobre__tags">
              {TAGS.map((tag, i) => {
                const tagOpacity = useTransform(scrollYProgress, [0.25 + (i * 0.01), 0.3 + (i * 0.01), 0.32, 0.38], [0, 1, 1, 0])
                const tagScale = useTransform(scrollYProgress, [0.25 + (i * 0.01), 0.3 + (i * 0.01), 0.32, 0.38], [0.85, 1, 1, 0.85])
                
                return (
                <motion.span
                  key={tag}
                  className="tag"
                  style={{ opacity: tagOpacity, scale: tagScale }}
                >
                  {tag}
                </motion.span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
