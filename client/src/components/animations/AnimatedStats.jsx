import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const startTime = Date.now()
    const startValue = 0
    
    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease out cubic)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(startValue + (value - startValue) * eased)
      
      setDisplayValue(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }
    
    animate()
  }, [value])

  return <span>{displayValue.toLocaleString()}</span>
}

export default function AnimatedStats({ icon, label, value, change, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="stat-card"
      style={{ cursor: 'default' }}
    >
      {/* Animated background glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ delay: delay + 0.2 }}
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          pointerEvents: 'none',
          filter: 'blur(20px)'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, position: 'relative' }}>
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${color}18`,
            border: `1px solid ${color}28`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20
          }}
        >
          {icon}
        </motion.div>

        {change !== undefined && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring' }}
            className={`stat-change ${change >= 0 ? 'up' : 'down'}`}
            style={{ display: 'flex', alignItems: 'center', gap: 3 }}
          >
            {change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(change)}%
          </motion.span>
        )}
      </div>

      <div className="stat-number" style={{ color, position: 'relative' }}>
        <AnimatedNumber value={value} />
      </div>
      <div className="stat-label">{label}</div>
    </motion.div>
  )
}




