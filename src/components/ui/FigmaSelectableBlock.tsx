import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import './FigmaSelectableBlock.css'

interface Props {
  children: React.ReactNode
  /** Borda ativada pelo scroll (cursor chegou) */
  isActive?: boolean
  visible?: boolean
  /** Trash hover — controlado pelo scroll */
  trashHovered?: boolean
  /** Trash click — controlado pelo scroll */
  trashClicked?: boolean
  onDelete?: () => void
  id?: string
  className?: string
}

export function FigmaSelectableBlock({
  children,
  isActive = false,
  visible = true,
  trashHovered = false,
  trashClicked = false,
  onDelete,
  id,
  className = '',
}: Props) {
  const [manualHover, setManualHover] = useState(false)
  const showBorder = isActive || manualHover

  if (!visible) return null

  return (
    <div
      id={id}
      className={`figma-selectable ${className}`}
      onMouseEnter={() => setManualHover(true)}
      onMouseLeave={() => setManualHover(false)}
    >
      {/* Borda estilo Figma */}
      <AnimatePresence>
        {showBorder && (
          <motion.div
            key="selection"
            className="figma-selection-frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <span className="figma-handle figma-handle--tl" />
            <span className="figma-handle figma-handle--tr" />
            <span className="figma-handle figma-handle--bl" />
            <span className="figma-handle figma-handle--br" />

            <motion.button
              className="figma-trash-btn"
              onClick={onDelete}
              animate={{
                scale: trashClicked ? 0.7 : trashHovered ? 1.25 : 1,
                backgroundColor: trashClicked
                  ? 'rgba(239, 68, 68, 0.95)'
                  : trashHovered
                    ? 'rgba(124, 108, 240, 1)'
                    : 'rgba(124, 108, 240, 0.88)',
                boxShadow: trashHovered
                  ? '0 0 14px rgba(124, 108, 240, 0.7)'
                  : '0 2px 6px rgba(124, 108, 240, 0.3)',
              }}
              transition={{ duration: 0.12 }}
              whileHover={{ scale: 1.25, backgroundColor: 'rgba(239, 68, 68, 0.95)' }}
              whileTap={{ scale: 0.75 }}
              title="Remover elemento"
            >
              <Trash2 size={10} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}
