import { useTransform, MotionValue } from 'framer-motion'
import { useScrollStore } from '../store/scrollStore'

/**
 * Traduz o scrollY (pixels) para a escala percentual histórica (0..1)
 * que cada sessão usava antigamente (quando o track era 500vh fixos).
 */
export function useSimulatedScroll(
  scrollY: MotionValue<number>,
  sectionId: string,
  oldStart: number,
  oldEnd: number
) {
  // We use the raw transform mapping.
  // Note: we fetch the store dynamically inside the callback, so it's always reading 
  // the freshly measured DOM limits without stale closures.
  
  return useTransform(scrollY, (y) => {
    const metrics = useScrollStore.getState().sections.find(s => s.id === sectionId)
    // Se ainda não mediu o DOM, trava na posição zero inicial
    if (!metrics) return oldStart

    const totalHeight = metrics.bottom - metrics.top
    const localRatio = totalHeight === 0 ? 0 : (y - metrics.top) / totalHeight
    
    return oldStart + (oldEnd - oldStart) * Math.max(0, Math.min(localRatio, 1))
  })
}
