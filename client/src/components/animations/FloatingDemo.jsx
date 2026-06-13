import { Link, BarChart3, Globe, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function FloatingDemo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delay: 0.5
      }}
      whileHover={{ scale: 1.02, y: -5 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-gold)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 22px',
        width: 320,
        maxWidth: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1)',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* Floating animation */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'var(--brand-muted)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13
            }}
          >
            <Link size={18}/>
          </motion.div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-brand)', fontFamily: 'var(--font-mono)' }}>
              lnkfg.io/launch24
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: 1 }}>
              → yoursite.com/product-launch
            </div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="badge badge-success"
          >
            Live
          </motion.div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Clicks', value: '4.7K', icon: BarChart3 },
            { label: 'Countries', value: '23', icon: Globe },
            { label: 'CTR', value: '11.2%', icon: TrendingUp }
          ].map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'var(--bg-secondary)',
                padding: 12,
                borderRadius: 12,
                textAlign: 'center',
                border: '1px solid var(--border)'
              }}
            >
              <Icon size={14} style={{ margin: '0 auto 6px', color: 'var(--brand)' }} />
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                {value}
              </div>
              <div style={{
                fontSize: 10,
                color: 'var(--text-tertiary)',
                marginTop: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                {label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini chart */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-end', gap: 3, height: 36 }}>
          {[30, 55, 40, 70, 45, 85, 60, 92, 75, 100, 88, 95].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 1 + i * 0.05, type: 'spring' }}
              whileHover={{ height: `${Math.min(h + 10, 100)}%` }}
              style={{
                flex: 1,
                background: i === 11 ? 'var(--brand)' : `rgba(201,168,76,${0.1 + (i / 12) * 0.4})`,
                borderRadius: 3,
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
        <div style={{
          fontSize: '0.6rem',
          color: 'var(--text-tertiary)',
          marginTop: 6,
          textAlign: 'right',
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.04em'
        }}>
          LAST 12 HOURS
        </div>
      </motion.div>

      {/* Glow effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: 'absolute',
          inset: -20,
          background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
          borderRadius: 'var(--radius-xl)',
          pointerEvents: 'none',
          zIndex: -1,
          filter: 'blur(20px)'
        }}
      />
    </motion.div>
  )
}




