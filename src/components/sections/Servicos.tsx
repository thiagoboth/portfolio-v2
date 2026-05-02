import { useState, useEffect } from 'react'
import { motion, MotionValue } from 'framer-motion'
import { Globe, Smartphone, Database, Layers, BarChart, Shield } from 'lucide-react'
import { TypewriterTextTime } from '../animations/TypewriterTextTime'
import { useSectionScroll } from '../../hooks/useSectionScroll'
import { useSectionTransition } from '../../hooks/useSectionTransition'
import './Servicos.css'

const SERVICES = [
  {
    id: 'web',
    icon: Globe,
    title: 'Desenvolvimento Web',
    description: 'Sites institucionais, landing pages e sistemas web completos com as melhores tecnologias do mercado. Performance, SEO e design que converte.',
    tags: ['React', 'Next.js', 'Node.js'],
    color: '#7c6cf0',
  },
  {
    id: 'app',
    icon: Smartphone,
    title: 'Aplicativos Mobile',
    description: 'Apps nativos e híbridos para iOS e Android. Da concepção ao lançamento nas lojas, com UX fluida e performance otimizada.',
    tags: ['React Native', 'iOS', 'Android'],
    color: '#00d9ff',
  },
  {
    id: 'backend',
    icon: Database,
    title: 'Sistemas & Back-end',
    description: 'APIs robustas, banco de dados escaláveis e arquiteturas que crescem com seu negócio. Integração com serviços externos e automações.',
    tags: ['Node.js', 'PostgreSQL', 'Docker'],
    color: '#f472b6',
  },
  {
    id: 'consulting',
    icon: Layers,
    title: 'Consultoria Tecnológica',
    description: 'Diagnóstico completo da sua infraestrutura digital. Estratégia, escolha de tecnologias certas e roadmap de evolução para seu produto.',
    tags: ['Estratégia', 'Arquitetura', 'Roadmap'],
    color: '#34d399',
  },
  {
    id: 'analytics',
    icon: BarChart,
    title: 'Analytics & Performance',
    description: 'Implementação de métricas, dashboards e otimização de performance. Decisões baseadas em dados para acelerar seu crescimento.',
    tags: ['Analytics', 'Otimização', 'KPIs'],
    color: '#fbbf24',
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Segurança & Infraestrutura',
    description: 'Configuração de servidores, SSL, CI/CD e boas práticas de segurança para proteger sua aplicação e dados dos usuários.',
    tags: ['AWS', 'CI/CD', 'DevOps'],
    color: '#e879f9',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.3 + i * 0.07 },
  }),
}

export function Servicos({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const { opacity: wrapperOpacity, y: wrapperY, pointerEvents: wrapperPointerEvents } = useSectionTransition('servicos')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (wrapperOpacity >= 0.99 && !isLoaded) setIsLoaded(true)
    else if (wrapperOpacity <= 0.1 && isLoaded) setIsLoaded(false)
  }, [wrapperOpacity, isLoaded])

  const { ref: scrollRef, y: scrollY } = useSectionScroll(scrollYProgress, [0.43, 0.57])

  return (
    <motion.section
      className="servicos section"
      id="servicos"
      data-section="servicos"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: wrapperOpacity,
        y: wrapperY,
        pointerEvents: wrapperPointerEvents
      }}
    >
      <motion.div ref={scrollRef} style={{ y: scrollY, width: '100%' }}>
        <div className="container" style={{ pointerEvents: 'auto' }}>
          <motion.div
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="section-label"
          >
            O que faço
          </motion.div>

          <div className="servicos__header">
            <h2 className="servicos__title">
              <TypewriterTextTime text="Serviços que" start={isLoaded} hideCursorOnDone speed={30} />
              {' '}
              <motion.span
                className="gradient-text"
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                transformam
              </motion.span>
              <br />
              <TypewriterTextTime text="negócios" start={isLoaded} hideCursorOnDone speed={30} />
            </h2>

            <div className="servicos__subtitle" style={{ margin: 0 }}>
              <TypewriterTextTime
                text="Do conceito à produção, ofereço soluções end-to-end para cada fase da sua jornada digital."
                start={isLoaded}
                isBlock
                speed={15}
                hideCursorOnDone
              />
            </div>
          </div>

          <div className="servicos__grid">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.id}
                custom={i}
                initial="hidden"
                animate={isLoaded ? 'visible' : 'hidden'}
                variants={cardVariants}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}

function ServiceCard({ service }: { service: typeof SERVICES[0] }) {
  const Icon = service.icon

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <div
      className="service-card glass-card"
      onMouseMove={handleMouseMove}
      style={{ '--service-color': service.color } as React.CSSProperties}
      id={`service-card-${service.id}`}
    >
      <div className="service-card__spotlight" />

      <div className="service-card__icon-wrap">
        <Icon size={24} />
      </div>

      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__desc">{service.description}</p>

      <div className="service-card__tags">
        {service.tags.map(tag => (
          <span key={tag} className="service-tag">{tag}</span>
        ))}
      </div>
    </div>
  )
}
