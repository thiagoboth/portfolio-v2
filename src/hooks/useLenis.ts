import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration   : 1.2,
      easing     : (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,

      // ── Mobile / touch ──────────────────────────────────────────────────────
      // syncTouch: true  → Lenis stays in sync with native momentum scroll on iOS/Android.
      // The velocity it reports via onScroll will be accurate on touch devices,
      // which is what the scroll machine needs to detect "user stopped scrolling".
      // (smoothTouch:true would replace native momentum entirely — feels artificial)
      syncTouch      : true,
      touchMultiplier: 2,   // default; fine-tune if touch feels too fast or slow
    })

    lenisRef.current = lenis

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // GSAP ticker passes time in SECONDS; lenis.raf() expects MILLISECONDS.
    // Correct conversion: multiply by 1000.
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    // Expose lenis globally for the scroll machine
    ;(window as any).lenis = lenis

    return () => {
      gsap.ticker.remove(rafCallback)
      lenis.destroy()
      delete (window as any).lenis
    }
  }, [])

  return lenisRef
}
