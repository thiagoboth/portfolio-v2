import { useRef } from 'react'
import { motion, useTransform, MotionValue } from 'framer-motion'
import { Globe, Smartphone, Database, Layers, BarChart, Shield } from 'lucide-react'
import { TypewriterTextScroll } from '../animations/ScrollTypewriter'
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

export function Servicos({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const sectionRef = useRef<HTMLElement>(null)
  
  // -- VISIBILITY & POINTER EVENTS --
  // Active segment centered at 0.50. 
  // Enters: 0.37 -> 0.43
  // Plateau: 0.43 -> 0.57 (Snap point at 0.50)
  // Exits: 0.57 -> 0.63
  const sectionOpacity = useTransform(scrollYProgress, [0.37, 0.43, 0.57, 0.63], [0, 1, 1, 0])
  const sectionPointerEvents = useTransform(scrollYProgress, (v) => (v > 0.40 && v < 0.60) ? 'auto' : 'none')

  return (
    <motion.section 
      className="servicos section" 
      id="servicos" 
      ref={sectionRef}
      style={{ 
        position: 'absolute', 
        inset: 0, 
        opacity: sectionOpacity, 
        pointerEvents: sectionPointerEvents as any
      }}
    >
      <div className="container" style={{ pointerEvents: 'auto' }}>
        <motion.div className="section-label">
          O que faço
        </motion.div>

        <div className="servicos__header">
          <h2 className="servicos__title">
            <TypewriterTextScroll
              text="Serviços que"
              scrollYProgress={scrollYProgress}
              range={[0.4, 0.44]}
              hideCursorOnDone
            />{' '}
            <span className="gradient-text">
              <TypewriterTextScroll
                text="transformam"
                scrollYProgress={scrollYProgress}
                range={[0.44, 0.48]}
                hideCursorOnDone
              />
            </span>
            <br />
            <TypewriterTextScroll
              text="negócios"
              scrollYProgress={scrollYProgress}
              range={[0.48, 0.52]}
              hideCursorOnDone
            />
          </h2>

          <p className="servicos__subtitle" style={{ margin: 0 }}>
            <TypewriterTextScroll
              text="Do conceito à produção, ofereço soluções end-to-end para cada fase da sua jornada digital."
              scrollYProgress={scrollYProgress}
              range={[0.42, 0.54]}
              isBlock
            />
          </p>
        </div>

        <div className="servicos__grid">
          {SERVICES.map((service, i) => {
            const cardOpacity = useTransform(scrollYProgress, [0.45 + (i * 0.01), 0.5 + (i * 0.01), 0.57, 0.63], [0, 1, 1, 0])
            const cardY = useTransform(scrollYProgress, [0.45 + (i * 0.01), 0.5 + (i * 0.01), 0.57, 0.63], [40, 0, 0, 40])
            return <ServiceCard key={service.id} service={service} style={{ opacity: cardOpacity, y: cardY }} />
          })}
        </div>
      </div>
    </motion.section>
  )
}

function ServiceCard({ service, style }: { service: typeof SERVICES[0], style: React.CSSProperties | any }) {
  const Icon = service.icon
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current?.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current?.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <motion.div
      ref={cardRef}
      className="service-card glass-card"
      onMouseMove={handleMouseMove}
      style={{ '--service-color': service.color, ...style } as any}
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
    </motion.div>
  )
}
