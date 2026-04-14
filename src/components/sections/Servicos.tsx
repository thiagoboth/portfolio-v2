import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Globe, Smartphone, Database, Layers, BarChart, Shield } from 'lucide-react'
import './Servicos.css'

gsap.registerPlugin(ScrollTrigger)

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

export function Servicos() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('.service-card')
    if (!cards) return

    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: (i % 3) * 0.12,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        }
      )
    })
  }, [])

  return (
    <section className="servicos section" id="servicos" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          O que faço
        </motion.div>

        <div className="servicos__header">
          <motion.h2
            className="servicos__title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Serviços que <span className="gradient-text">transformam</span>
            <br />negócios
          </motion.h2>

          <motion.p
            className="servicos__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Do conceito à produção, ofereço soluções end-to-end para
            cada fase da sua jornada digital.
          </motion.p>
        </div>

        <div ref={cardsRef} className="servicos__grid">
          {SERVICES.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service }: { service: typeof SERVICES[0] }) {
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
    <div
      ref={cardRef}
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
