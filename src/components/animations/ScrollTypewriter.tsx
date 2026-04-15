import { useState, useEffect } from 'react'
import { MotionValue } from 'framer-motion'

interface TypewriterTextScrollProps {
  text: string
  scrollYProgress: MotionValue<number>
  range: [number, number]
  className?: string
  style?: React.CSSProperties
  isBlock?: boolean
  hideCursorOnDone?: boolean
}

export function TypewriterTextScroll({
  text,
  scrollYProgress,
  range,
  className = '',
  style = {},
  isBlock = false,
  hideCursorOnDone = false,
}: TypewriterTextScrollProps) {
  const [chars, setChars] = useState(() => {
    const [start, end] = range
    const isReverse = start > end
    const min = Math.min(start, end)
    const max = Math.max(start, end)
    const latest = scrollYProgress.get()
    let percent = 0
    if (latest <= min) {
      percent = isReverse ? 1 : 0
    } else if (latest >= max) {
      percent = isReverse ? 0 : 1
    } else {
      percent = (latest - start) / (end - start)
    }
    return Math.round(percent * text.length)
  })

  // Map progress: 
  // Before range[0]: 0 chars
  // Between range[0] and range[1]: 0 to text.length
  // Past range[1]: text.length chars
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const [start, end] = range
      const isReverse = start > end
      
      const min = Math.min(start, end)
      const max = Math.max(start, end)
      
      let percent = 0
      if (latest <= min) {
        percent = isReverse ? 1 : 0
      } else if (latest >= max) {
        percent = isReverse ? 0 : 1
      } else {
        percent = (latest - start) / (end - start)
      }
      
      const currentChars = Math.round(percent * text.length)
      setChars(currentChars)
    })
  }, [scrollYProgress, range, text.length])

  const isTyping = chars > 0 && chars < text.length
  const isDone = chars === text.length
  const showCursor = isTyping || (!hideCursorOnDone && isDone)

  const Tag = isBlock ? 'div' : 'span'

  return (
    <Tag className={`typewriter-wrap ${className}`} style={{ position: 'relative', display: isBlock ? 'block' : 'inline-block', width: '100%', textAlign: 'inherit', ...style }}>
      {/* Invisible placeholder for height preservation */}
      <Tag style={{ opacity: 0, pointerEvents: 'none', userSelect: 'none', display: 'inline' }}>
        {text}
      </Tag>
      
      {/* Absolute positioned typing text */}
      <Tag style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, textAlign: 'inherit', display: 'inline' }}>
        {text.slice(0, chars)}
        {showCursor && <span className="cursor-blink" aria-hidden="true" />}
      </Tag>
    </Tag>
  )
}
