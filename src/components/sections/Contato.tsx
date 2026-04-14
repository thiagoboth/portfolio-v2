import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Linkedin, Send, CheckCircle } from 'lucide-react'
import './Contato.css'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const FIELD_ORDER = ['name', 'email', 'subject', 'message'] as const

export function Contato() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1500))
    setSending(false)
    setSubmitted(true)
  }

  const CONTACT_INFO = [
    {
      id: 'email-contact',
      icon: Mail,
      label: 'Email',
      value: 'thiagobotelho.dev@gmail.com',
      href: 'mailto:thiagobotelho.dev@gmail.com',
    },
    {
      id: 'phone-contact',
      icon: Phone,
      label: 'WhatsApp',
      value: '+55 (17) 99611-1461',
      href: 'https://wa.me/5517996111461',
    },
    {
      id: 'linkedin-contact',
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'thiago-botelho',
      href: 'https://www.linkedin.com/in/thiago-botelho-6a255b205/',
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="contato section" id="contato">
      {/* Animated background mesh */}
      <div className="contato__mesh" aria-hidden="true">
        <div className="mesh-blob mesh-blob--1" />
        <div className="mesh-blob mesh-blob--2" />
        <div className="mesh-blob mesh-blob--3" />
      </div>

      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="section-label">
            Vamos conversar
          </motion.div>

          <motion.h2 variants={itemVariants} className="contato__title">
            Pronto para transformar
            <br />sua <span className="gradient-text">ideia em realidade</span>?
          </motion.h2>

          <motion.p variants={itemVariants} className="contato__subtitle">
            Entre em contato e descubra como posso ajudar seu projeto a décolar.
            Respondo em até 24 horas.
          </motion.p>

          <div className="contato__grid">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="contato__info">
              {CONTACT_INFO.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.id}
                    id={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-item glass-card"
                  >
                    <div className="contact-item__icon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className="contact-item__label">{item.label}</span>
                      <span className="contact-item__value">{item.value}</span>
                    </div>
                  </a>
                )
              })}

              {/* Availability badge */}
              <div className="availability">
                <span className="availability__dot" />
                <span>Disponível para novos projetos</span>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div variants={itemVariants}>
              {submitted ? (
                <div className="form-success">
                  <CheckCircle size={56} className="form-success__icon" />
                  <h3>Mensagem enviada!</h3>
                  <p>Obrigado pelo contato, Thiago responderá em breve.</p>
                  <button className="btn-ghost" onClick={() => setSubmitted(false)}>
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="contato__form" id="contact-form">
                  {FIELD_ORDER.map((field) => (
                    <motion.div
                      key={field}
                      className={`form-field ${focused === field ? 'form-field--focused' : ''} ${formData[field] ? 'form-field--filled' : ''}`}
                      whileInView={{ opacity: 1, x: 0 }}
                      initial={{ opacity: 0, x: 30 }}
                      viewport={{ once: true }}
                      transition={{ delay: FIELD_ORDER.indexOf(field) * 0.08 + 0.2 }}
                    >
                      <label className="form-label" htmlFor={`contact-${field}`}>
                        {field === 'name' ? 'Seu nome' :
                         field === 'email' ? 'E-mail' :
                         field === 'subject' ? 'Assunto' : 'Mensagem'}
                      </label>

                      {field === 'message' ? (
                        <textarea
                          id={`contact-${field}`}
                          name={field}
                          rows={5}
                          className="form-input form-textarea"
                          value={formData[field]}
                          onChange={handleChange}
                          onFocus={() => setFocused(field)}
                          onBlur={() => setFocused(null)}
                          required
                        />
                      ) : (
                        <input
                          id={`contact-${field}`}
                          type={field === 'email' ? 'email' : 'text'}
                          name={field}
                          className="form-input"
                          value={formData[field]}
                          onChange={handleChange}
                          onFocus={() => setFocused(field)}
                          onBlur={() => setFocused(null)}
                          required
                        />
                      )}
                      <div className="form-field__border" />
                    </motion.div>
                  ))}

                  <motion.button
                    type="submit"
                    className="btn-primary form-submit"
                    id="contact-submit"
                    disabled={sending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {sending ? (
                      <>
                        <span className="spinner" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Enviar Mensagem
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="container footer__inner">
          <span className="footer__copy mono">
            © 2025 Thiago Botelho. Feito com ♥ e muito café.
          </span>
          <span className="footer__back">
            <button
              className="footer__top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              id="back-to-top"
            >
              ↑ Voltar ao topo
            </button>
          </span>
        </div>
      </div>
    </section>
  )
}
