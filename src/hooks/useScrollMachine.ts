import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useScrollStore, SectionMetrics } from '../store/scrollStore'

// ─── Constants ────────────────────────────────────────────────────────────────
const TRANSITION_ZONE_PX = 300  // px zone before end of section where crossfade begins
const SNAP_THRESHOLD     = 0.30 // 30% of transition zone → snap forward, else rollback
const VELOCITY_THRESHOLD = 0.05 // Lenis easing never reaches exactly 0; use tolerance

// ─── Helper ───────────────────────────────────────────────────────────────────
/** Polls window.lenis every 50ms until available, then calls cb */
export function waitForLenis(cb: (lenis: Lenis) => void): () => void {
  let cancelled = false
  const check = () => {
    if (cancelled) return
    const lenis = (window as any).lenis as Lenis | undefined
    if (lenis) cb(lenis)
    else setTimeout(check, 50)
  }
  check()
  return () => { cancelled = true }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useScrollMachine() {
  const { setSections } = useScrollStore()

  // ── 1. MEASUREMENT ──────────────────────────────────────────────────────────
  useEffect(() => {
    let rafId: number

    // Sections with internal scroll (useSectionScroll) translate their content
    // upward as the user reads through them. This collapses scrollHeight from the
    // natural content height back down to the viewport height, which would shrink
    // the scroll track mid-session and push scrollY past the end of the track.
    // Fix: keep the maximum observed height per section — heights only grow.
    const maxHeights = new Map<string, number>()

    const updateMetrics = () => {
      // Never recalculate while a programmatic snap is in flight
      if (useScrollStore.getState().state === 'TRANSITIONING') return

      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>('[data-section]')
      )

      let accumulatedTop = 0

      const metrics: SectionMetrics[] = nodes.map((node, i) => {
        // Use the element's real rendered height; fallback to viewport only as minimum.
        // Clamp to the max ever observed: sections that scroll their inner content
        // upward (useSectionScroll) will temporarily report a smaller scrollHeight,
        // but the track must remain stable at the maximum it ever needed.
        const liveHeight    = Math.max(node.scrollHeight, window.innerHeight)
        const contentHeight = Math.max(liveHeight, maxHeights.get(node.id) ?? 0)
        maxHeights.set(node.id, contentHeight)

        // Each section's scroll-start: first section starts at 0,
        // subsequent ones start where the previous one's transition zone began
        // (creating a 300px overlap between sections for crossfade)
        const top             = i === 0 ? 0 : accumulatedTop - TRANSITION_ZONE_PX
        const transitionStart = top + contentHeight          // content ends → crossfade begins
        const bottom          = transitionStart + TRANSITION_ZONE_PX // section fully exited

        accumulatedTop = bottom

        return {
          id: node.id,
          top,
          transitionStart,
          bottom,
          height: contentHeight,
        }
      })

      setSections(metrics)

      // Physically resize the scroll track so the browser knows total scrollable height
      const trackEl = document.getElementById('magnetic-scroll-track')
      if (trackEl && metrics.length > 0) {
        trackEl.style.height = `${metrics[metrics.length - 1].bottom}px`
      }
    }

    // Defer one frame so the browser finishes layout before we read scrollHeight.
    // This is critical on mobile: ResizeObserver fires during the resize, but
    // scrollHeight may not reflect the new layout until the next paint.
    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateMetrics)
    }

    // Recompute on any section resize (font load, image load, dynamic content, etc.)
    const observer = new ResizeObserver(scheduleUpdate)
    document.querySelectorAll('[data-section]').forEach(node => observer.observe(node))

    // window resize covers desktop viewport changes
    window.addEventListener('resize', scheduleUpdate)

    // orientationchange covers phone/tablet rotation — fires separately from resize
    // on some iOS versions and is more reliable for catching viewport height changes
    window.addEventListener('orientationchange', scheduleUpdate)

    scheduleUpdate()

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('orientationchange', scheduleUpdate)
    }
  }, [setSections])

  // ── 2. SCROLL LOGIC (event-based, shares Lenis/GSAP ticker) ─────────────────
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const cancelWait = waitForLenis((lenis) => {
      let snapTimer: ReturnType<typeof setTimeout> | null = null

      const triggerSnap = (progress: number, activeSec: SectionMetrics) => {
        const { state, setState, getNextSection, getPrevSection } = useScrollStore.getState()
        if (state === 'TRANSITIONING') return
        setState('TRANSITIONING')

        if (progress >= SNAP_THRESHOLD) {
          const nextSec = getNextSection(activeSec.id)
          const target  = nextSec ? activeSec.bottom : activeSec.transitionStart
          lenis.scrollTo(target, {
            duration  : 0.8,
            lock      : true,
            easing    : (t: number) => 1 - Math.pow(1 - t, 4),
            onComplete: () => useScrollStore.getState().setState('READING'),
          })
        } else if (progress > 0) {
          // For the first section there is no previous section, so roll all the way
          // back to section.top (scrollY = 0). This fully restores scroll-driven
          // animations that consume content as the user reads (e.g. Hero's reverse
          // typewriters). For every other section, transitionStart is enough —
          // their content is fully visible at that point.
          const hasPrev      = getPrevSection(activeSec.id) !== undefined
          const rollbackTarget = hasPrev ? activeSec.transitionStart : activeSec.top
          lenis.scrollTo(rollbackTarget, {
            duration  : 0.6,
            lock      : true,
            easing    : (t: number) => 1 - Math.pow(1 - t, 3),
            onComplete: () => useScrollStore.getState().setState('READING'),
          })
        } else {
          setState('READING')
        }
      }

      const onScroll = ({ velocity }: { velocity: number }) => {
        const {
          state,
          sections,
          setActiveSectionId,
          setTransitionProgress,
        } = useScrollStore.getState()

        const scrollY   = window.scrollY
        const activeSec = sections.find(
          s => scrollY >= s.top && scrollY < s.bottom
        )
        if (!activeSec) return

        // Always keep active section current
        setActiveSectionId(activeSec.id)

        // ── FREE SCROLL ZONE: between top and transitionStart ──
        if (scrollY <= activeSec.transitionStart) {
          if (activeSec.id === 'hero' && scrollY > 0) {
            if (snapTimer) { clearTimeout(snapTimer) }
            snapTimer = setTimeout(() => {
              const currentScrollY = window.scrollY
              if (currentScrollY > 0 && currentScrollY <= activeSec.transitionStart) {
                lenis.scrollTo(0, {
                  duration: 0.8,
                  lock: true,
                  easing: (t) => 1 - Math.pow(1 - t, 4),
                  onComplete: () => useScrollStore.getState().setState('READING')
                })
              }
            }, 150)
          } else {
            if (snapTimer) { clearTimeout(snapTimer); snapTimer = null }
          }
          setTransitionProgress(0)
          return
        }

        // ── TRANSITION ZONE ──────────────────────────────────────────────────
        const delta    = scrollY - activeSec.transitionStart
        const progress = Math.min(delta / TRANSITION_ZONE_PX, 1) // 0.0 → 1.0

        // Publish progress every frame so section components can drive animations.
        // This runs even during TRANSITIONING so the snap plays out smoothly.
        setTransitionProgress(progress)

        if (state === 'TRANSITIONING') return

        // ── SNAP DETECTION: immediate path for touch/trackpad (gradual velocity decay) ──
        if (Math.abs(velocity) < VELOCITY_THRESHOLD) {
          if (snapTimer) { clearTimeout(snapTimer); snapTimer = null }
          triggerSnap(progress, activeSec)
          return
        }

        // ── SNAP DETECTION: debounce path for mouse wheel ────────────────────
        // Lenis stops firing scroll events when its easing animation completes,
        // so velocity never reaches near-zero. If no new scroll event arrives
        // within 150ms, Lenis has settled and we trigger the snap decision.
        if (snapTimer) clearTimeout(snapTimer)
        snapTimer = setTimeout(() => {
          snapTimer = null
          const { state: s } = useScrollStore.getState()
          if (s === 'TRANSITIONING') return
          const currentScrollY  = window.scrollY
          const secs            = useScrollStore.getState().sections
          const currentSec      = secs.find(sec => currentScrollY >= sec.top && currentScrollY < sec.bottom)
          if (!currentSec || currentScrollY <= currentSec.transitionStart) return
          const currentProgress = Math.min((currentScrollY - currentSec.transitionStart) / TRANSITION_ZONE_PX, 1)
          triggerSnap(currentProgress, currentSec)
        }, 150)
      }

      lenis.on('scroll', onScroll)

      // Store cleanup so we can remove listener on unmount
      cleanupRef.current = () => {
        lenis.off('scroll', onScroll)
        if (snapTimer) clearTimeout(snapTimer)
      }
    })

    return () => {
      cancelWait()
      cleanupRef.current?.()
    }
  }, [])
}
