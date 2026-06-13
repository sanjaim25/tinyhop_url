import { Calendar, Clock, Copy, QrCode, BarChart3, Edit, Trash2, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function AnimatedURLCard({ url, index, onDelete, onCopy, onEdit, onQR, onAnalytics }) {
  const [showActions, setShowActions] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -3 }}
      className="url-card"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{ position: 'relative' }}
    >
      <div className="url-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <motion.a
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${url.shortCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="url-short-link"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink size={14} />
            lnkfg.io/{url.shortCode}
          </motion.a>
          <div className="url-original">{url.originalUrl}</div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: showActions ? 1 : 0, x: showActions ? 0 : 20 }}
          transition={{ duration: 0.2 }}
          className="url-card-actions"
        >
          {[
            { icon: Copy, onClick: () => onCopy(url), label: 'Copy' },
            { icon: QrCode, onClick: () => onQR(url), label: 'QR Code' },
            { icon: BarChart3, onClick: () => onAnalytics(), label: 'Analytics' },
            { icon: Edit, onClick: () => onEdit(url), label: 'Edit' },
            { icon: Trash2, onClick: () => onDelete(url.id), label: 'Delete' }
          ].map(({ icon: Icon, onClick, label }) => (
            <motion.button
              key={label}
              className="btn-icon"
              onClick={onClick}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              title={label}
              style={{ position: 'relative' }}
            >
              <Icon size={14} />
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div className="url-card-meta">
        <div className="url-meta-item">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
            className="url-clicks"
          >
            {url.clickCount || 0}
          </motion.span>
          {' '}clicks
        </div>
        <div className="url-meta-item">
          <Calendar size={14}/> {new Date(url.createdAt).toLocaleDateString()}
        </div>
        {url.expiresAt && (
          <div className="url-meta-item">
            <Clock size={14}/> Expires {new Date(url.expiresAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Hover border effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showActions ? 1 : 0 }}
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--brand), transparent)',
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
    </motion.div>
  )
}




