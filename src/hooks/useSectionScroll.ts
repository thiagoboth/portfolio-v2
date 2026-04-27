import { useState, useEffect, useRef } from 'react'
import { MotionValue, useTransform } from 'framer-motion'

export function useSectionScroll(
  scrollYProgress: MotionValue<number>,
  plateauRange: [number, number]
) {
  const ref = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState(0)

  useEffect(() => {
    const updateMeasurements = () => {
      if (ref.current) {
        // Calculate how much the content extends beyond the viewport
        const maxScroll = Math.max(0, ref.current.scrollHeight - window.innerHeight)
        
        // Add a small 60px buffer if there is overflow so we don't hard stop on the very last pixel
        setOverflow(maxScroll > 0 ? maxScroll + 60 : 0)
      }
    }

    // Initial check
    updateMeasurements()
    
    // Check on resize (orientation change, resizing window)
    window.addEventListener('resize', updateMeasurements)
    
    // Check if internal content length changes (e.g. fonts loading, dynamic content)
    const observer = new ResizeObserver(updateMeasurements)
    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      window.removeEventListener('resize', updateMeasurements)
      observer.disconnect()
    }
  }, [])

  // The actual Y translation
  // It maps the progress interval where the section is full opacity to [0, -overflow]
  const y = useTransform(scrollYProgress, plateauRange, [0, -overflow])

  return { ref, y }
}
