import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import toast from 'react-hot-toast'

export default function QRModal({ url, onClose }) {
  const canvasRef = useRef(null)
  const [fg, setFg]   = useState('#7c3aed')
  const [bg, setBg]   = useState('#0a0a14')
  const [size, setSize] = useState(256)
  const [copied, setCopied] = useState(false)

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const shortUrl = `${baseUrl}/${url.shortCode}`

  const download = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const a = document.createElement('a'); a.download = `qr-${url.shortCode}.png`; a.href = canvas.toDataURL('image/png'); a.click()
    toast.success('QR downloaded!')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shortUrl); setCopied(true); setTimeout(() => setCopied(false), 2000)
    toast.success('Link copied!')
  }

  const presets = [
    { fg: '#7c3aed', bg: '#eceae4', label: 'Violet Paper' },
    { fg: '#15141c', bg: '#eceae4', label: 'Ink Paper' },
    { fg: '#ffffff', bg: '#7c3aed', label: 'White Violet' },
    { fg: '#000000', bg: '#ffffff', label: 'Classic' },
    { fg: '#7c3aed', bg: '#ffffff', label: 'Violet Light' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,28,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn .2s ease both' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 20, width: '100%', maxWidth: 460, boxShadow: '0 32px 80px rgba(20,20,28,0.25)', animation: 'scaleIn .3s var(--ease-out) both', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#7c3aed,#6d28d9)' }} />
        <div style={{ padding: '24px 24px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.025em', color: 'var(--inkd)' }}>QR <em style={{ fontStyle: 'italic', color: '#7c3aed' }}>Code</em></h2>
            <p style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.8125rem', color: 'var(--inkfaint)', marginTop: 4 }}>
              tinyhop-url/{url.shortCode}
            </p>
          </div>
          <button onClick={onClose} id="qr-modal-close"
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--paper-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--inkfaint)', transition: 'all .15s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--inkd)'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--paper-2)'; e.currentTarget.style.color='var(--inkfaint)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding: '0 24px 8px' }}>
          {/* QR preview */}
          <div className="qr-preview">
            <div ref={canvasRef} className="qr-wrap" style={{ background: bg, padding: 16, borderRadius: 14 }}>
              <QRCodeCanvas value={shortUrl} size={size} fgColor={fg} bgColor={bg} level="H" includeMargin={false} />
            </div>
          </div>

          {/* Style presets */}
          <div style={{ marginTop: 4 }}>
            <p style={{ fontSize: '0.6875rem', color: 'var(--inkfaint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Style</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {presets.map(({ fg: pFg, bg: pBg, label }) => (
                <button key={label} id={`qr-preset-${label.toLowerCase().replace(/\s/g,'-')}`} onClick={() => { setFg(pFg); setBg(pBg) }} title={label}
                  style={{ width: 34, height: 34, borderRadius: 8, border: `2px solid ${fg === pFg && bg === pBg ? 'var(--violet-lite)' : 'var(--b1)'}`, cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'border-color .15s' }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: pBg }} />
                  <div style={{ position: 'relative', width: 16, height: 16, margin: '0 auto', top: '50%', transform: 'translateY(-50%)' }}>
                    <div style={{ width: 7, height: 7, background: pFg, position: 'absolute', top: 0, left: 0 }} />
                    <div style={{ width: 4, height: 4, background: pFg, position: 'absolute', bottom: 0, left: 0 }} />
                    <div style={{ width: 4, height: 4, background: pFg, position: 'absolute', top: 0, right: 0 }} />
                    <div style={{ width: 7, height: 4, background: pFg, position: 'absolute', bottom: 0, right: 0 }} />
                  </div>
                </button>
              ))}
              {/* Custom color */}
              <div style={{ position: 'relative' }}>
                <button style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--b1)', background: 'var(--s2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t2)' }} onClick={() => document.getElementById('qr-custom').click()} title="Custom color">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 2v20M2 12h20" opacity=".4"/></svg>
                </button>
                <input id="qr-custom" type="color" value={fg} onChange={e => setFg(e.target.value)} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />
              </div>
            </div>
          </div>

          {/* Size */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: '0.6875rem', color: 'var(--inkfaint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Size</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--inkd)', fontFamily: "'Fragment Mono',monospace", fontWeight: 600 }}>{size}×{size}px</span>
            </div>
            <input id="qr-size-slider" type="range" min={128} max={512} step={64} value={size} onChange={e => setSize(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--violet)', height: 4, cursor: 'pointer' }} />
          </div>

          {/* Link row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '10px 13px', background: 'var(--paper-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
            <span style={{ flex: 1, fontFamily: "'Fragment Mono',monospace", fontSize: '0.8125rem', color: 'var(--inkfaint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shortUrl}</span>
            <button id="qr-copy-link" onClick={copyLink}
              style={{ flexShrink: 0, padding: '5px 12px', background: copied ? '#16a34a' : 'var(--inkd)', color: copied ? '#fff' : 'var(--paper)', border: 'none', borderRadius: 6, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--line)' }}>
          <button onClick={onClose}
            style={{ padding: '10px 22px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 500, color: 'var(--inksoft)', cursor: 'pointer' }}>
            Close
          </button>
          <button id="qr-download-btn" onClick={download}
            style={{ padding: '10px 22px', background: 'var(--inkd)', color: 'var(--paper)', border: 'none', borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(20,20,28,0.18)', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='#7c3aed'; e.currentTarget.style.boxShadow='0 6px 20px rgba(124,58,237,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--inkd)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(20,20,28,0.18)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PNG
          </button>
        </div>
      </div>
    </div>
  )
}




