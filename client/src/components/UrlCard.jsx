import { useState } from 'react'

export default function UrlCard({ url, index, onDelete, onCopy, onEdit, onQR, onAnalytics }) {
  const [copied, setCopied] = useState(false)
  const shortUrl = `${window.location.origin.replace('5173','5000')}/${url.shortCode}`
  const clicks   = url.clickCount || 0
  const expired  = url.expiresAt && new Date(url.expiresAt) < new Date()

  const handleCopy = () => { onCopy(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const domain = (u) => { try { return new URL(u).hostname } catch { return u } }
  const fmt    = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const ActionBtn = ({ id, onClick, title, danger, children }) => (
    <button
      id={id} onClick={onClick} title={title}
      className="btn-icon"
      onMouseEnter={e => { if (danger) { e.currentTarget.style.background='var(--err-bg)'; e.currentTarget.style.color='var(--err)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.2)' } }}
      onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color=''; e.currentTarget.style.borderColor='' }}
    >
      {children}
    </button>
  )

  return (
    <div className="url-card" id={`url-card-${url.id}`} style={{ animationDelay: `${index * 55}ms` }}>
      <div className="url-card-head">
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Short + status row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
            {/* Favicon */}
            <div style={{ width: 24, height: 24, borderRadius: 6, overflow: 'hidden', background: 'var(--s2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--b1)' }}>
              <img src={`https://www.google.com/s2/favicons?domain=${domain(url.originalUrl)}&sz=32`} alt="" width={14} height={14} onError={e => { e.target.style.display = 'none' }} />
            </div>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="url-short" id={`url-short-link-${url.id}`}>
              TinyHop.link/{url.shortCode}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <span className={`badge ${expired ? 'badge-err' : 'badge-g'}`}>{expired ? 'Expired' : 'Active'}</span>
          </div>
          {/* Original */}
          <p className="url-orig" title={url.originalUrl}>{url.originalUrl}</p>
        </div>

        {/* Actions */}
        <div className="url-actions">
          <ActionBtn id={`url-copy-${url.id}`} onClick={handleCopy} title="Copy">
            {copied
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            }
          </ActionBtn>
          <ActionBtn id={`url-qr-${url.id}`} onClick={() => onQR(url)} title="QR Code">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>
          </ActionBtn>
          <ActionBtn id={`url-analytics-${url.id}`} onClick={onAnalytics} title="Analytics">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </ActionBtn>
          <ActionBtn id={`url-edit-${url.id}`} onClick={onEdit} title="Edit">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </ActionBtn>
          <ActionBtn id={`url-delete-${url.id}`} onClick={() => onDelete(url.id)} title="Delete" danger>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </ActionBtn>
        </div>
      </div>

      {/* Meta row */}
      <div className="url-meta">
        <div className="url-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span className="url-clicks">{clicks.toLocaleString()}</span>
          <span>click{clicks !== 1 ? 's' : ''}</span>
        </div>
        <div className="url-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>{fmt(url.createdAt)}</span>
        </div>
        {url.expiresAt && (
          <div className="url-meta-item" style={{ color: expired ? 'var(--err)' : 'var(--warn)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{expired ? 'Expired' : 'Expires'} {fmt(url.expiresAt)}</span>
          </div>
        )}
        <div className="url-meta-item" style={{ marginLeft: 'auto' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          <span>{domain(url.originalUrl)}</span>
        </div>
      </div>
    </div>
  )
}




