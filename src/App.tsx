import { useEffect, useRef, useState } from 'react'
import { useScroll, MotionValue, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navbar } from './components/layout/Navbar'
import { ParticlesBg } from './components/animations/ParticlesBg'
import { Hero } from './components/sections/Hero'
import { Sobre } from './components/sections/Sobre'
import { Servicos } from './components/sections/Servicos'
import { Projetos } from './components/sections/Projetos'
import { Contato } from './components/sections/Contato'
import { Loader } from './components/ui/Loader'
import { useLenis } from './hooks/useLenis'
import { useScrollProgress } from './hooks/useScrollProgress'

function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const update = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`
      }
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Give enough time to show off the loader animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2800)
    
    return () => clearTimeout(timer)
  }, [])

  useLenis()
  useScrollProgress()

  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  })

  // GSAP Snapping
  useEffect(() => {
    if (!trackRef.current) return

    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: [0, 0.25, 0.5, 0.75, 1], // 5 sections = 4 intervals
        duration: { min: 0.5, max: 0.8 },
        delay: 0.1,
        ease: "power2.inOut"
      }
    })

    return () => st.kill()
  }, [])

  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>

      {/* Scroll progress bar */}
      <div id="scroll-progress" />
      
      {/* Global Background */}
      <ParticlesBg />

      {/* Custom cursor (desktop only) */}
      <CursorDot />

      <Navbar />

      <main>
        {/* Full Single Screen Track For Every Section */}
        <div ref={trackRef} style={{ height: '500vh', position: 'relative' }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
            <Hero scrollYProgress={scrollYProgress} />
            <Sobre scrollYProgress={scrollYProgress} />
            <Servicos scrollYProgress={scrollYProgress} />
            <Projetos scrollYProgress={scrollYProgress} />
            <Contato scrollYProgress={scrollYProgress} />
          </div>
        </div>
      </main>
    </>
  )
}
