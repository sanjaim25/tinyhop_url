import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

export default function SuccessConfetti({ active, onComplete }) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (active && onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, 4000) // Stop after 4 seconds

      return () => clearTimeout(timer)
    }
  }, [active, onComplete])

  if (!active) return null

  return (
    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={200}
      colors={['#c9a84c', '#dbbf6e', '#a8893a', '#f0ecea', '#10d878']}
      gravity={0.3}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
    />
  )
}




