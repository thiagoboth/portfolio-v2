import { useState, useEffect } from 'react'
import { motion, MotionValue } from 'framer-motion'
import { TypewriterTextTime } from '../animations/TypewriterTextTime'
import { useSectionScroll } from '../../hooks/useSectionScroll'
import { useSectionTransition } from '../../hooks/useSectionTransition'
import './Sobre.css'

const BIO_FULL = `Sou um desenvolvedor fullstack apaixonado por criar soluções que fazem a diferença. Com mais de 8 anos de experiência, combino desenvolvimento web de ponta com o poder da Inteligência Artificial — construindo agentes autônomos, automações inteligentes com N8N e produtos digitais que unem performance técnica com experiências excepcionais ao usuário.`

const SKILLS = [
  { label: 'React / Next.js', level: 95 },
  { label: 'Node.js / APIs', level: 92 },
  { label: 'TypeScript', level: 90 },
  { label: 'React Native', level: 85 },
  { label: 'Banco de Dados', level: 88 },
  { label: 'UI/UX Design', level: 80 },
]

const TAGS = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'React Native', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Figma', 'GraphQL', 'N8N']

export function Sobre({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const TITLE_TEXT = 'Design meets Technology'

  // ── Wrapper transition (controlled by scrollStore) ────────
  const { opacity: wrapperOpacity, y: wrapperY, pointerEvents: wrapperPointerEvents } = useSectionTransition('sobre')
  const [isLoaded, setIsLoaded] = useState(false)

  // Trigger animations only AFTER the section is fully visible
  useEffect(() => {
    if (wrapperOpacity >= 0.99 && !isLoaded) {
      setIsLoaded(true)
    } else if (wrapperOpacity <= 0.1 && isLoaded) {
      setIsLoaded(false)
    }
  }, [wrapperOpacity, isLoaded])

  // Hook for internal scrolling
  const { ref: scrollRef, y: scrollY } = useSectionScroll(scrollYProgress, [0.18, 0.32])

  return (
    <motion.section 
      className="sobre section" 
      id="sobre" 
      data-section="sobre"
      style={{ 
        position: 'absolute', 
        inset: 0, 
        opacity: wrapperOpacity,
        y: wrapperY,
        pointerEvents: wrapperPointerEvents,
      }}
    >
      <motion.div ref={scrollRef} style={{ y: scrollY, width: '100%' }}>
        <div className="container" style={{ pointerEvents: 'auto' }}>
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            className="section-label"
          >
          Sobre mim
        </motion.div>

        <div className="sobre__grid">
          {/* Left: Avatar/Image */}
          <motion.div 
            className="sobre__image-wrap"
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, x: -40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
            }}
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
                { value: 'IA', label: '& Agentes' },
                { value: 'Full', label: 'stack' },
              ].map((stat, i) => {
                return (
                  <motion.div 
                    key={stat.label} 
                    className="stat-card glass-card"
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 + i * 0.1 } }
                    }}
                  >
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
              <TypewriterTextTime
                text={TITLE_TEXT}
                start={isLoaded}
                hideCursorOnDone
                speed={30}
              />
            </h2>

            <div className="sobre__bio-wrap">
              <div className="sobre__bio mono" style={{ margin: 0 }}>
                <TypewriterTextTime
                  text={BIO_FULL}
                  start={isLoaded}
                  isBlock
                  speed={15}
                />
              </div>
            </div>

            {/* Skills */}
            <div className="sobre__skills">
              {SKILLS.map((skill, i) => {
                return (
                <div key={skill.label} className="skill-bar">
                  <div className="skill-bar__header">
                    <span className="skill-bar__label">{skill.label}</span>
                    <span className="skill-bar__value">{skill.level}%</span>
                  </div>
                  <div className="skill-bar__track">
                    <motion.div 
                      className="skill-bar__fill" 
                      initial="hidden"
                      animate={isLoaded ? "visible" : "hidden"}
                      variants={{
                        hidden: { scaleX: 0 },
                        visible: { scaleX: skill.level / 100, transition: { duration: 0.8, delay: 0.4 + i * 0.05 } }
                      }}
                      style={{ transformOrigin: 'left' }} 
                    />
                  </div>
                </div>
                )
              })}
            </div>

            {/* Tags */}
            <div className="sobre__tags">
              {TAGS.map((tag, i) => {
                return (
                <motion.span
                  key={tag}
                  className="tag"
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  variants={{
                    hidden: { opacity: 0, scale: 0.85 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.6 + i * 0.03 } }
                  }}
                >
                  {tag}
                </motion.span>
                )
              })}
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.section>
  )
}

