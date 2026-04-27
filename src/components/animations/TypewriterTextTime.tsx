import { useState, useEffect } from 'react'

interface TypewriterTextTimeProps {
  text: string
  start: boolean
  speed?: number
  className?: string
  style?: React.CSSProperties
  isBlock?: boolean
  hideCursorOnDone?: boolean
}

export function TypewriterTextTime({
  text,
  start,
  speed = 15,
  className = '',
  style = {},
  isBlock = false,
  hideCursorOnDone = false,
}: TypewriterTextTimeProps) {
  const [chars, setChars] = useState(0)

  useEffect(() => {
    if (!start) {
      setChars(0)
      return
    }
    let current = 0
    const interval = setInterval(() => {
      current++
      setChars(current)
      if (current >= text.length) {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [start, text, speed])

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
