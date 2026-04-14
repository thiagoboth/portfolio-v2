import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollTypewriterProps {
  fromText: string
  toText: string
  triggerRef: React.RefObject<HTMLElement | null>
  className?: string
}

export function ScrollTypewriter({
  fromText,
  toText,
  triggerRef,
  className = '',
}: ScrollTypewriterProps) {
  const elRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = elRef.current
    const trigger = triggerRef.current
    if (!el || !trigger) return

    let progress = 0

    const updateText = (p: number) => {
      if (p === progress) return
      progress = p

      if (p < 0.5) {
        const erasedChars = Math.round(fromText.length * (p / 0.5))
        el.textContent = fromText.slice(0, fromText.length - erasedChars)
      } else {
        const typedChars = Math.round(toText.length * ((p - 0.5) / 0.5))
        el.textContent = toText.slice(0, typedChars)
      }
    }

    const st = ScrollTrigger.create({
      trigger,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => updateText(self.progress),
    })

    return () => st.kill()
  }, [fromText, toText, triggerRef])

  return (
    <span ref={elRef} className={`typewriter-text ${className}`}>
      {fromText}
    </span>
  )
}
