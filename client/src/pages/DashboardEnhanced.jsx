import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { Search, SlidersHorizontal, Plus, BarChart3 } from 'lucide-react'

// Import new animated components
import AnimatedStats from '../components/animations/AnimatedStats'
import AnimatedURLCard from '../components/animations/AnimatedURLCard'
import SuccessConfetti from '../components/effects/SuccessConfetti'
import QRModal from '../components/QRModal'

// Skeleton loader
function SkeletonCard() {
  return (
    <div className="url-card" style={{ cursor: 'default' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton skeleton-text" style={{ width: '40%' }} />
          <div className="skeleton skeleton-text" style={{ width: '70%' }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-text" style={{ width: 80 }} />)}
      </div>
    </div>
  )
}

// Create URL Modal with animations
function CreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ originalUrl: '', customCode: '', expiresAt: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.originalUrl.trim()) { setError('Please enter a URL'); return }
    setError('')
    setLoading(true)
    try {
      const payload = { originalUrl: form.originalUrl }
      if (form.customCode.trim()) payload.customCode = form.customCode.trim()
      if (form.expiresAt) payload.expiresAt = new Date(form.expiresAt).toISOString()
      const res = await api.post('/api/urls', payload)
      toast.success('Link created! 🎉')
      onCreated(res.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="modal"
        style={{ maxWidth: 520 }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gradient-brand)', borderRadius: '24px 24px 0 0' }} />

        <div className="modal-header">
          <div>
            <div className="modal-title">Create new link</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Shorten a URL and start tracking clicks instantly
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="btn-icon"
            style={{ width: 32, height: 32, flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </motion.button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label" htmlFor="modal-original-url">
                  Destination URL <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <div className="input-icon-wrapper">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                  </svg>
                  <input
                    autoFocus
                    type="url"
                    className={`input ${error ? 'input-error' : ''}`}
                    placeholder="https://your-very-long-url.com/..."
                    value={form.originalUrl}
                    onChange={(e) => { setForm({ ...form, originalUrl: e.target.value }); setError('') }}
                  />
                </div>
                {error && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="input-error-msg"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </motion.span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">
                    Custom alias
                    <span className="badge badge-neutral" style={{ marginLeft: 6, fontSize: '0.6rem' }}>Optional</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      position: 'absolute', left: 12,
                      fontSize: '0.75rem', color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-mono)', fontWeight: 600,
                      pointerEvents: 'none'
                    }}>lnkfg.io/</span>
                    <input
                      type="text"
                      className="input"
                      placeholder="my-brand"
                      value={form.customCode}
                      onChange={(e) => setForm({ ...form, customCode: e.target.value })}
                      style={{ paddingLeft: 72, fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">
                    Expiry date
                    <span className="badge badge-neutral" style={{ marginLeft: 6, fontSize: '0.6rem' }}>Optional</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer" style={{ gap: 10 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            onClick={handleSubmit}
            className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {!loading && (
              <>
                <Plus size={15} />
                Create link
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Edit Modal
function EditModal({ url, onClose, onUpdated }) {
  const [originalUrl, setOriginalUrl] = useState(url.originalUrl)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!originalUrl.trim()) return
    setLoading(true)
    try {
      const res = await api.put(`/api/urls/${url.id}`, { originalUrl })
      toast.success('Link updated!')
      onUpdated(res.data)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring' }}
        className="modal"
        style={{ maxWidth: 480 }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gradient-brand)', borderRadius: '24px 24px 0 0' }} />
        <div className="modal-header">
          <div>
            <div className="modal-title">Edit link</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Update the destination for <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-brand)' }}>/{url.shortCode}</span>
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="btn-icon"
            style={{ width: 32, height: 32 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </motion.button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Destination URL</label>
              <div className="input-icon-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
                <input
                  type="url"
                  className="input"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            onClick={handleSubmit}
            className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {!loading && 'Save changes'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Main Dashboard
export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showCreate, setShowCreate] = useState(false)
  const [editUrl, setEditUrl] = useState(null)
  const [qrUrl, setQrUrl] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [page, setPage] = useState(1)

  const PER_PAGE = 8

  const fetchUrls = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/urls')
      setUrls(res.data)
    } catch {
      toast.error('Failed to load links')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUrls() }, [fetchUrls])

  const filtered = urls
    .filter((u) =>
      u.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      u.shortCode.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'most-clicks') return (b.clickCount || 0) - (a.clickCount || 0)
      return 0
    })

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const totalClicks = urls.reduce((s, u) => s + (u.clickCount || 0), 0)

  const handleDelete = async (id) => {
    if (!confirm('Delete this link permanently?')) return
    try {
      await api.delete(`/api/urls/${id}`)
      setUrls((prev) => prev.filter((u) => u.id !== id))
      toast.success('Link deleted')
    } catch {
      toast.error('Failed to delete link')
    }
  }

  const handleCopy = (url) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const short = `${baseUrl}/${url.shortCode}`
    navigator.clipboard.writeText(short)
    toast.success('Copied to clipboard!')
  }

  const handleCreated = (newUrl) => {
    setUrls((prev) => [newUrl, ...prev])
    setShowConfetti(true)
  }

  const handleUpdated = (updated) => {
    setUrls((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
  }

  return (
    <div className="dashboard-layout">
      <SuccessConfetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-header"
      >
        <div className="dashboard-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                My Links
              </h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                {urls.length} link{urls.length !== 1 ? 's' : ''} in your workspace
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="search-bar">
                <Search className="search-icon" size={15} />
                <input
                  type="text"
                  placeholder="Search links..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                />
              </div>

              <motion.select
                whileHover={{ scale: 1.02 }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  colorScheme: 'dark',
                }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="most-clicks">Most clicks</option>
              </motion.select>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                onClick={() => setShowCreate(true)}
              >
                <Plus size={15} />
                New link
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="dashboard-content">
        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          <AnimatedStats icon="🔗" label="Total Links" value={urls.length} change={12} color="#0052ff" delay={0} />
          <AnimatedStats icon="👆" label="Total Clicks" value={totalClicks} change={8} color="#10d878" delay={0.1} />
          <AnimatedStats icon="📈" label="Avg. CTR" value={urls.length ? ((totalClicks / urls.length) || 0).toFixed(1) : 0} color="#f5a623" delay={0.2} />
          <AnimatedStats icon="⚡" label="Active Links" value={urls.filter(u => !u.expiresAt || new Date(u.expiresAt) > new Date()).length} color="#a78bfa" delay={0.3} />
        </div>

        {/* Analytics Banner */}
        {urls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -2, borderColor: 'rgba(0,82,255,0.4)' }}
            onClick={() => navigate('/analytics')}
            style={{
              background: 'linear-gradient(135deg, rgba(0,82,255,0.08) 0%, rgba(123,47,255,0.08) 100%)',
              border: '1px solid rgba(0,82,255,0.2)',
              borderRadius: 'var(--radius-xl)',
              padding: '16px 20px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s var(--ease-out)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--brand-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={18} color="var(--brand)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>View detailed analytics</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 1 }}>Click-through rates, geographic data, device breakdown</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-brand)', fontSize: '0.875rem', fontWeight: 600 }}>
              Open Analytics
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </motion.div>
        )}

        {/* URL List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="empty-state"
          >
            <div className="empty-state-icon">
              {search ? '🔍' : '🔗'}
            </div>
            <div className="empty-state-title">
              {search ? 'No links found' : 'No links yet'}
            </div>
            <p className="empty-state-desc">
              {search
                ? `No links match "${search}". Try a different search.`
                : 'Create your first short link and start tracking clicks in real time.'}
            </p>
            {!search && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                onClick={() => setShowCreate(true)}
              >
                <Plus size={15} />
                Create your first link
              </motion.button>
            )}
          </motion.div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnimatePresence mode="popLayout">
                {paginated.map((url, i) => (
                  <AnimatedURLCard
                    key={url.id}
                    url={url}
                    index={i}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                    onEdit={setEditUrl}
                    onQR={setQrUrl}
                    onAnalytics={() => navigate(`/analytics?id=${url.id}`)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                  Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-secondary btn-sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Prev
                  </motion.button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }
                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`btn btn-sm ${pageNum === page ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </motion.button>
                    )
                  })}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-secondary btn-sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next →
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
        {editUrl && <EditModal url={editUrl} onClose={() => setEditUrl(null)} onUpdated={handleUpdated} />}
        {qrUrl && <QRModal url={qrUrl} onClose={() => setQrUrl(null)} />}
      </AnimatePresence>
    </div>
  )
}




