import { useState, useCallback } from 'react'

export default function useMagneticButton(strength = 0.3) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    
    setPosition({ x: deltaX, y: deltaY })
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  return {
    position,
    handleMouseMove,
    handleMouseLeave,
    magneticProps: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      style: {
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }
  }
}




