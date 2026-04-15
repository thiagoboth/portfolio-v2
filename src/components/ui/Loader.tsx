import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './Loader.css'

export function Loader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress from 0 to 100% over the loader duration
    const duration = 2200 // 2.2s for the progress bar to fill
    const intervalTime = 20
    const step = 100 / (duration / intervalTime)
    
    let currentProgress = 0
    const intervalId = setInterval(() => {
      currentProgress += step
      if (currentProgress >= 100) {
        setProgress(100)
        clearInterval(intervalId)
      } else {
        setProgress(currentProgress)
      }
    }, intervalTime)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <motion.div 
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="loader__content">
        <h1 className="loader__title">Portfolio</h1>
        <div className="loader__progress-bar">
          <motion.div 
            className="loader__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
