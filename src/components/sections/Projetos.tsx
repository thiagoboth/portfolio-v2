import { useState } from 'react'
import { motion, AnimatePresence, useTransform, MotionValue } from 'framer-motion'
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react'
import { TypewriterTextScroll } from '../animations/ScrollTypewriter'
import './Projetos.css'

const PROJECTS = [
  {
    id: 'ecommerce',
    title: 'E-Commerce Platform',
    category: 'Web Application',
    description: 'Plataforma completa de e-commerce com painel administrativo, gestão de estoque, checkout integrado com gateway de pagamentos e dashboard de analytics em tempo real.',
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
    year: '2024',
    color: '#7c6cf0',
    gradient: 'linear-gradient(135deg, #7c6cf0 0%, #4338ca 100%)',
    mockupBg: '#1a1535',
  },
  {
    id: 'saas-dashboard',
    title: 'SaaS Analytics Dashboard',
    category: 'Web Application',
    description: 'Dashboard SaaS para análise de dados empresariais com visualizações interativas, relatórios automatizados, sistema de notificações e exportação em múltiplos formatos.',
    tech: ['React', 'TypeScript', 'D3.js', 'Node.js', 'MongoDB'],
    year: '2024',
    color: '#00d9ff',
    gradient: 'linear-gradient(135deg, #00d9ff 0%, #0891b2 100%)',
    mockupBg: '#001b24',
  },
  {
    id: 'health-app',
    title: 'HealthTrack Mobile App',
    category: 'Mobile Application',
    description: 'Aplicativo de saúde e bem-estar para iOS e Android com monitoramento de atividades físicas, controle nutricional, agendamento de consultas e integração com wearables.',
    tech: ['React Native', 'TypeScript', 'Firebase', 'HealthKit', 'GraphQL'],
    year: '2023',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
    mockupBg: '#001c10',
  },
  {
    id: 'realestate',
    title: 'ImóvelPRO Platform',
    category: 'Full-Stack System',
    description: 'Sistema completo para imobiliárias com gestão de imóveis, contratos digitais, portal do cliente, assinatura eletrônica, chat integrado e relatórios financeiros.',
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS S3', 'Socket.io'],
    year: '2023',
    color: '#f472b6',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #be185d 100%)',
    mockupBg: '#1c0012',
  },
]

export function Projetos({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const project = PROJECTS[activeIndex]

  const navigate = (dir: number) => {
    setDirection(dir)
    setActiveIndex(prev => (prev + dir + PROJECTS.length) % PROJECTS.length)
  }

  // -- VISIBILITY & POINTER EVENTS --
  // Active segment centered at 0.75. 
  // Enters: 0.62 -> 0.68
  // Plateau: 0.68 -> 0.82 (Snap point at 0.75)
  // Exits: 0.82 -> 0.88
  const sectionOpacity = useTransform(scrollYProgress, [0.62, 0.68, 0.82, 0.88], [0, 1, 1, 0])
  const sectionPointerEvents = useTransform(scrollYProgress, (v) => (v > 0.65 && v < 0.85) ? 'auto' : 'none')

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '60%' : '-60%',
      opacity: 0,
      scale: 0.95,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? '-60%' : '60%',
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <motion.section 
      className="projetos section" 
      id="projetos" 
      style={{ 
        position: 'absolute', 
        inset: 0, 
        opacity: sectionOpacity, 
        pointerEvents: sectionPointerEvents as any
      }}
    >
      <div className="container" style={{ pointerEvents: 'auto' }}>
        <div className="projetos__header">
          <div className="section-label">Portfólio</div>
          <h2 className="projetos__title">
            <TypewriterTextScroll
              text="Projetos que"
              scrollYProgress={scrollYProgress}
              range={[0.65, 0.69]}
              hideCursorOnDone
            />{' '}
            <span className="gradient-text">
              <TypewriterTextScroll
                text="falam"
                scrollYProgress={scrollYProgress}
                range={[0.69, 0.72]}
                hideCursorOnDone
              />
            </span>
            <br />
            <TypewriterTextScroll
              text="por si mesmos"
              scrollYProgress={scrollYProgress}
              range={[0.72, 0.76]}
              hideCursorOnDone
            />
          </h2>
        </div>

        {/* Project counter */}
        <div className="projetos__counter">
          <span className="counter-current mono">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <div className="counter-bar">
            <motion.div
              className="counter-bar__fill"
              animate={{ scaleX: (activeIndex + 1) / PROJECTS.length }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span className="counter-total mono">{String(PROJECTS.length).padStart(2, '0')}</span>
        </div>

        {/* Main project display */}
        <div className="projetos__display">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="project-card"
            >
              <div className="project-card__visual" style={{ background: project.mockupBg }}>
                {/* Animated mockup */}
                <div className="project-mockup">
                  <div className="mockup-browser">
                    <div className="mockup-browser__bar">
                      <div className="mockup-dots">
                        <span style={{ background: '#ff5f57' }} />
                        <span style={{ background: '#ffbe2e' }} />
                        <span style={{ background: '#28ca42' }} />
                      </div>
                    </div>
                    <div
                      className="mockup-browser__screen"
                      style={{ background: `linear-gradient(135deg, ${project.mockupBg}, ${project.color}30)` }}
                    >
                      <div className="mockup-content">
                        <div className="mockup-sidebar" style={{ background: `${project.color}20` }}>
                          {[1,2,3,4].map(i => (
                            <div key={i} className="mockup-nav-item" style={{ background: i === 1 ? `${project.color}50` : `${project.color}15` }} />
                          ))}
                        </div>
                        <div className="mockup-main">
                          <div className="mockup-header-bar" style={{ background: `${project.color}25` }} />
                          {[1,2,3].map(i => (
                            <div key={i} className="mockup-card-row">
                              <div className="mockup-mini-card" style={{ background: `${project.color}20`, border: `1px solid ${project.color}30` }}>
                                <div className="mockup-mini-dot" style={{ background: project.color }} />
                                <div className="mockup-mini-line" />
                                <div className="mockup-mini-line short" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gradient overlay */}
                <div
                  className="project-card__glow"
                  style={{ background: `radial-gradient(circle at 70% 50%, ${project.color}30, transparent 70%)` }}
                />
              </div>

              <div className="project-card__info">
                <div className="project-meta">
                  <span className="project-category">{project.category}</span>
                  <span className="project-year mono">{project.year}</span>
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <div className="project-tech">
                  {project.tech.map(t => (
                    <span key={t} className="project-tech-tag" style={{ borderColor: `${project.color}40`, color: project.color }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="project-actions">
                  <button className="btn-primary" id={`project-demo-${project.id}`}>
                    <ExternalLink size={16} />
                    Ver Demo
                  </button>
                  <button className="btn-ghost" id={`project-code-${project.id}`}>
                    <Github size={16} />
                    Código
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="projetos__nav">
            <button
              className="nav-btn"
              onClick={() => navigate(-1)}
              id="project-prev"
              aria-label="Projeto anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              className="nav-btn"
              onClick={() => navigate(1)}
              id="project-next"
              aria-label="Próximo projeto"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="projetos__thumbs">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              className={`thumb ${i === activeIndex ? 'thumb--active' : ''}`}
              onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i) }}
              id={`project-thumb-${p.id}`}
              style={{ '--thumb-color': p.color } as React.CSSProperties}
            >
              <span className="thumb__dot" />
              <span className="thumb__label">{p.title}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
