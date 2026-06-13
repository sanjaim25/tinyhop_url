import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { QRCodeCanvas } from 'qrcode.react'

/* ── constants ── */
const V    = '#7c3aed'
const VD   = '#6d28d9'
const INK  = '#15141c'
const LINE = 'rgba(20,20,28,0.1)'
const P2   = '#f5f3ef'
const P3   = '#e3e0d8'
const GRN  = '#16a34a'
const AMB  = '#d97706'

/* ── helpers ── */
const shortBase = () =>
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

const domain = (u) => { try { return new URL(u).hostname } catch { return u } }
const fmt    = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const fmtD   = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/* ── Copy button ── */
function CopyBtn({ text, sm }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
    setCopied(true); setTimeout(() => setCopied(false), 2200)
  }
  return (
    <button onClick={handle} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: sm ? '6px 12px' : '8px 18px',
      background: copied ? GRN : V,
      color: '#fff', border: 'none', borderRadius: 99,
      fontFamily: "'Space Grotesk',sans-serif",
      fontSize: sm ? '0.75rem' : '0.875rem', fontWeight: 700,
      cursor: 'pointer', transition: 'all .2s', flexShrink: 0,
      boxShadow: copied ? `0 3px 10px ${GRN}45` : `0 3px 10px ${V}40`,
    }}>
      {copied
        ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      }
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

/* ── Field wrapper ── */
function Field({ label, hint, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7 }}>
        <label style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8d8b94' }}>
          {label}
        </label>
        {hint && <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6875rem', color: '#b0adb8' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

/* ── Input styles ── */
const inputStyle = (err) => ({
  width: '100%', padding: '11px 13px',
  background: P2, border: `1.5px solid ${err ? '#ef4444' : LINE}`,
  borderRadius: 10, color: INK,
  fontSize: '0.9375rem', fontFamily: "'Space Grotesk',sans-serif",
  outline: 'none', transition: 'all .2s', boxSizing: 'border-box',
})
const focusIn  = (e) => { e.target.style.borderColor = V; e.target.style.boxShadow = `0 0 0 3px ${V}15`; e.target.style.background = '#fff' }
const focusOut = (e, err) => { e.target.style.borderColor = err ? '#ef4444' : LINE; e.target.style.boxShadow = ''; e.target.style.background = P2 }

/* ── Toggle switch ── */
function Toggle({ on, onChange, label, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${LINE}` }}>
      <div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: INK }}>{label}</div>
        {sub && <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: '#8d8b94', marginTop: 2 }}>{sub}</div>}
      </div>
      <button type="button" onClick={() => onChange(!on)} style={{
        width: 42, height: 24, borderRadius: 99,
        background: on ? V : P3, border: 'none', cursor: 'pointer',
        position: 'relative', transition: 'background .2s', flexShrink: 0,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3,
          left: on ? 21 : 3,
          transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  )
}

/* ── Stat pill ── */
function StatPill({ icon, value, label, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '16px 12px', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, textAlign: 'center', flex: 1 }}>
      <span style={{ fontSize: '1.35rem' }}>{icon}</span>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', fontWeight: 900, color: color || INK, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', color: '#8d8b94', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

/* ════════ MAIN PAGE ════════ */
export default function Shorten() {
  const { user } = useAuth()

  /* form state */
  const [url,         setUrl]         = useState('')
  const [alias,       setAlias]       = useState('')
  const [expiry,      setExpiry]      = useState('')
  const [password,    setPassword]    = useState('')
  const [showAdv,     setShowAdv]     = useState(false)
  const [usePassword, setUsePassword] = useState(false)

  /* process state */
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [aliasError, setAliasError] = useState('')
  const [result,  setResult]  = useState(null)
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('result') // 'result' | 'qr'

  const inputRef = useRef(null)
  const base     = shortBase()

  const shortUrl = result ? `${base}/${result.shortCode}` : ''

  const submit = async (e) => {
    e.preventDefault()
    if (!url.trim()) {
      setError('Please paste a URL first')
      inputRef.current?.focus()
      return
    }
    if (alias.trim() && alias.trim().length < 3) {
      setAliasError('Alias must be at least 3 characters')
      return
    }
    setError(''); setAliasError(''); setLoading(true); setResult(null)
    try {
      const payload = { originalUrl: url.trim() }
      if (alias.trim())    payload.customCode = alias.trim()
      if (expiry)          payload.expiresAt  = new Date(expiry).toISOString()
      if (usePassword && password.trim()) payload.password = password.trim()
      const res = await api.post('/api/urls', payload)
      setResult(res.data)
      setHistory(h => [res.data, ...h.slice(0, 9)])
      setUrl(''); setAlias(''); setExpiry(''); setPassword('')
      setUsePassword(false)
      setActiveTab('result')
      toast.success('Link created!')
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong'
      if (msg.toLowerCase().includes('alias')) {
        setAliasError(msg)
      } else {
        setError(msg)
      }
      toast.error(msg)
    } finally { setLoading(false) }
  }

  const totalClicks = history.reduce((s, h) => s + (h.clickCount || 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#eceae4', paddingTop: 64, fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleSpring{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
      `}</style>

      {/* grain */}
      <div style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:0,opacity:0.04,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:1400, margin:'0 auto', padding:'40px max(24px, calc((100vw - 1400px)/2 + 24px)) 80px' }}>

        {/* ── HERO HEADER ── */}
        <div style={{ textAlign:'center', marginBottom:48, animation:'fadeUp .6s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'4px 14px', background:`${V}12`, border:`1px solid ${V}28`, borderRadius:99, marginBottom:16 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:GRN }} />
            <span style={{ fontFamily:"'Fragment Mono',monospace", fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:V }}>URL Shortener</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.5rem,6vw,4.5rem)', fontWeight:900, letterSpacing:'-0.04em', lineHeight:0.93, color:INK, marginBottom:14 }}>
            Make it <em style={{ fontStyle:'italic', color:V }}>short.</em>
          </h1>
          <p style={{ fontSize:'1rem', color:'#8d8b94', maxWidth:580, margin:'0 auto', lineHeight:1.65 }}>
            Paste any long URL and get a clean trackable short link instantly — with custom aliases, expiry, and password protection.
          </p>
        </div>

        {/* ── MAIN CENTERED LAYOUT ── */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* ── FORM ── */}
          <div>
            <div style={{ background:'#fff', border:`1px solid ${LINE}`, borderRadius:22, overflow:'hidden', boxShadow:'0 6px 32px rgba(20,20,28,0.09)', animation:'scaleSpring .5s cubic-bezier(0.34,1.56,0.64,1) .05s both' }}>
              <div style={{ height:3, background:`linear-gradient(90deg,${V},${VD})` }} />

              <form onSubmit={submit} style={{ padding:'32px 40px' }}>
                {/* URL input */}
                <div style={{ marginBottom:20 }}>
                  <Field label="Long URL">
                    <div style={{ position:'relative' }}>
                      <svg style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#b0adb8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                      </svg>
                      <input ref={inputRef} type="url" value={url} placeholder="https://your-very-long-url.com/path?with=parameters&and=more"
                        onChange={e => { setUrl(e.target.value); setError('') }}
                        style={{ ...inputStyle(!!error), paddingLeft:42, paddingTop:14, paddingBottom:14, fontSize:'0.9375rem' }}
                        onFocus={focusIn} onBlur={e => focusOut(e, !!error)}
                      />
                    </div>
                    {error && <p style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.75rem', color:'#ef4444', marginTop:6, animation:'slideDown .2s ease both' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}
                    </p>}
                  </Field>
                </div>

                {/* Optional fields - always visible */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:20 }}>
                  {/* Custom alias */}
                  <Field label="Custom alias" hint="optional">
                    <div style={{ position:'relative' }}>
                      <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', fontFamily:"'Fragment Mono',monospace", fontSize:'0.8125rem', color:'#b0adb8', pointerEvents:'none', whiteSpace:'nowrap', fontWeight:500, zIndex:1, userSelect:'none' }}>TinyHop.link/</span>
                      {!alias && <span style={{ position:'absolute', left:118, top:'50%', transform:'translateY(-50%)', fontFamily:"'Fragment Mono',monospace", fontSize:'0.875rem', color:'#b0adb8', pointerEvents:'none', fontWeight:400 }}>my-brand</span>}
                      <input type="text" value={alias} placeholder="" onChange={e => { setAlias(e.target.value); setAliasError('') }}
                        style={{ ...inputStyle(!!aliasError), paddingLeft:118, fontFamily:"'Fragment Mono',monospace", fontSize:'0.875rem' }}
                        onFocus={focusIn} onBlur={e => focusOut(e, !!aliasError)}
                        autoComplete="off"
                      />
                    </div>
                    {aliasError && <p style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.75rem', color:'#ef4444', marginTop:6, animation:'slideDown .2s ease both' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{aliasError}
                    </p>}
                  </Field>

                  {/* Link expiry */}
                  <Field label="Link expiry" hint="optional">
                    <input type="datetime-local" value={expiry} onChange={e => setExpiry(e.target.value)} min={new Date().toISOString().slice(0,16)}
                      style={{ ...inputStyle(false), colorScheme:'light' }}
                      onFocus={focusIn} onBlur={e => focusOut(e, false)}
                      autoComplete="off"
                    />
                  </Field>
                </div>

                {/* Password protection toggle */}
                <div style={{ background:P2, borderRadius:16, padding:'6px 20px', marginBottom:20 }}>
                  <Toggle on={usePassword} onChange={setUsePassword} label="Password protection" sub="Require a password to open" />
                </div>

                {/* Password field - conditional */}
                {usePassword && (
                  <div style={{ marginBottom:20, animation:'slideDown .25s ease both' }}>
                    <Field label="Password">
                      <input type="password" value={password} placeholder="Enter password" onChange={e => setPassword(e.target.value)}
                        style={inputStyle(false)}
                        onFocus={focusIn} onBlur={e => focusOut(e, false)}
                        autoComplete="new-password"
                      />
                    </Field>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading}
                  style={{ width:'100%', padding:'16px', background: loading ? '#9f67f5' : INK, color:'#eceae4', border:'none', borderRadius:14, fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'1.25rem', fontWeight:700, letterSpacing:'-0.01em', cursor: loading ? 'not-allowed':'pointer', transition:'all .25s', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 4px 16px rgba(20,20,28,0.16)' }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.background=V; e.currentTarget.style.boxShadow=`0 8px 28px ${V}50` } }}
                  onMouseLeave={e => { e.currentTarget.style.background=loading?'#9f67f5':INK; e.currentTarget.style.boxShadow='0 4px 16px rgba(20,20,28,0.16)' }}>
                  {loading
                    ? <span style={{ margin:'0 auto', display:'flex', alignItems:'center', gap:10 }}>
                        <svg style={{ animation:'spin .7s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.2-8.5"/></svg>
                        Shortening…
                      </span>
                    : <><span>Shorten this link</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg></>
                  }
                </button>
              </form>
            </div>

            {/* ── SESSION HISTORY TABLE ── */}
            {history.length > 0 && (
              <div style={{ marginTop:24, background:'#fff', border:`1px solid ${LINE}`, borderRadius:18, overflow:'hidden', boxShadow:'0 4px 16px rgba(20,20,28,0.07)', animation:'fadeUp .4s cubic-bezier(0.16,1,0.3,1) both' }}>
                <div style={{ padding:'16px 20px', borderBottom:`1px solid ${LINE}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:GRN, boxShadow:`0 0 8px ${GRN}60` }} />
                    <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.75rem', fontWeight:700, color:INK, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                      Session history ({history.length})
                    </span>
                  </div>
                  <Link to="/dashboard" style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8125rem', fontWeight:600, color:V, textDecoration:'none', display:'flex', alignItems:'center', gap:5 }}>
                    View all <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8125rem' }}>
                    <thead>
                      <tr style={{ background:P2 }}>
                        {['Short Link','Original URL','Clicks','Created','Actions'].map(h => (
                          <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontWeight:700, color:'#8d8b94', letterSpacing:'0.06em', textTransform:'uppercase', fontSize:'0.65rem', whiteSpace:'nowrap', borderBottom:`1px solid ${LINE}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item, i) => (
                        <tr key={item.id || i} style={{ borderBottom: i < history.length-1 ? `1px solid ${LINE}` : 'none', transition:'background .15s' }}
                          onMouseEnter={e => e.currentTarget.style.background=P2}
                          onMouseLeave={e => e.currentTarget.style.background=''}>
                          <td style={{ padding:'11px 16px', whiteSpace:'nowrap' }}>
                            <a href={`${base}/${item.shortCode}`} target="_blank" rel="noopener noreferrer"
                              style={{ fontFamily:"'Fragment Mono',monospace", fontWeight:600, color:V, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
                              TinyHop.link/{item.shortCode}
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </a>
                          </td>
                          <td style={{ padding:'11px 16px', maxWidth:220 }}>
                            <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'#8d8b94' }} title={item.originalUrl}>{item.originalUrl}</div>
                          </td>
                          <td style={{ padding:'11px 16px', whiteSpace:'nowrap' }}>
                            <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, color:V, fontSize:'1rem' }}>{item.clickCount || 0}</span>
                          </td>
                          <td style={{ padding:'11px 16px', color:'#8d8b94', whiteSpace:'nowrap' }}>{fmtD(item.createdAt)}</td>
                          <td style={{ padding:'11px 16px' }}>
                            <CopyBtn text={`${base}/${item.shortCode}`} sm />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── RESULT + QR ── */}
          {result && (
            <div style={{ marginTop: 24 }}>
              <div style={{ background:'#fff', border:`1.5px solid ${V}35`, borderRadius:18, overflow:'hidden', boxShadow:`0 8px 32px ${V}18`, animation:'scaleSpring .4s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                <div style={{ height:3, background:`linear-gradient(90deg,${V},${GRN})` }} />

                {/* Tabs */}
                <div style={{ display:'flex', borderBottom:`1px solid ${LINE}` }}>
                  {['result','qr'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)}
                      style={{ flex:1, padding:'12px', border:'none', background: activeTab===t ? '#fff' : P2, fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8125rem', fontWeight: activeTab===t ? 700 : 500, color: activeTab===t ? V : '#8d8b94', cursor:'pointer', transition:'all .15s', borderBottom: activeTab===t ? `2px solid ${V}` : '2px solid transparent' }}>
                      {t === 'result' ? '🔗 Short Link' : '📱 QR Code'}
                    </button>
                  ))}
                </div>

                {activeTab === 'result' && (
                  <div style={{ padding:'22px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:14 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:GRN, boxShadow:`0 0 8px ${GRN}60` }} />
                      <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.7rem', fontWeight:700, color:GRN, letterSpacing:'0.1em', textTransform:'uppercase' }}>Link ready</span>
                    </div>
                    {/* Big short URL display */}
                    <div style={{ background:`${V}08`, border:`1px solid ${V}20`, borderRadius:12, padding:'16px 18px', marginBottom:14 }}>
                      <div style={{ fontFamily:"'Fragment Mono',monospace", fontSize:'1.125rem', fontWeight:700, color:V, marginBottom:6, wordBreak:'break-all' }}>
                        TinyHop.link/{result.shortCode}
                      </div>
                      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.75rem', color:'#8d8b94', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        → {result.originalUrl}
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div style={{ display:'flex', gap:8 }}>
                      <CopyBtn text={shortUrl} />
                      <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 18px', background:P2, color:INK, border:`1px solid ${LINE}`, borderRadius:99, fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.875rem', fontWeight:600, textDecoration:'none', transition:'all .2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background=INK; e.currentTarget.style.color='#eceae4' }}
                        onMouseLeave={e => { e.currentTarget.style.background=P2; e.currentTarget.style.color=INK }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Open
                      </a>
                    </div>
                    {/* Meta badges */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:14 }}>
                      {result.expiresAt && <span style={{ padding:'3px 10px', background:AMB+'15', border:`1px solid ${AMB}30`, borderRadius:99, fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.7rem', fontWeight:600, color:AMB }}>⏰ Expires {fmtD(result.expiresAt)}</span>}
                      {result.password  && <span style={{ padding:'3px 10px', background:`${V}10`, border:`1px solid ${V}25`, borderRadius:99, fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.7rem', fontWeight:600, color:V }}>🔒 Password protected</span>}
                      <span style={{ padding:'3px 10px', background:`${GRN}10`, border:`1px solid ${GRN}25`, borderRadius:99, fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.7rem', fontWeight:600, color:GRN }}>✓ Active</span>
                    </div>
                  </div>
                )}

                {activeTab === 'qr' && (
                  <div style={{ padding:'22px', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                    <div style={{ background:'#fff', border:`1px solid ${LINE}`, borderRadius:14, padding:16, boxShadow:'0 4px 20px rgba(20,20,28,0.08)' }}>
                      <QRCodeCanvas value={shortUrl} size={180} fgColor={V} bgColor="#ffffff" level="H" includeMargin={false} />
                    </div>
                    <div style={{ fontFamily:"'Fragment Mono',monospace", fontSize:'0.8125rem', color:V, fontWeight:600 }}>TinyHop.link/{result.shortCode}</div>
                    <button
                      onClick={() => {
                        const canvas = document.querySelector('canvas')
                        if (!canvas) return
                        const a = document.createElement('a'); a.download = `qr-${result.shortCode}.png`; a.href = canvas.toDataURL('image/png'); a.click()
                        toast.success('QR downloaded!')
                      }}
                      style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 22px', background:INK, color:'#eceae4', border:'none', borderRadius:99, fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.875rem', fontWeight:700, cursor:'pointer', transition:'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background=V; e.currentTarget.style.boxShadow=`0 6px 20px ${V}45` }}
                      onMouseLeave={e => { e.currentTarget.style.background=INK; e.currentTarget.style.boxShadow='' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download PNG
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Session stats */}
          {history.length > 0 && (
            <div style={{ display:'flex', gap:10, marginTop: 24, animation:'fadeUp .4s cubic-bezier(0.16,1,0.3,1) .1s both' }}>
              <StatPill icon="🔗" value={history.length} label="Links created" color={V} />
              <StatPill icon="👆" value={totalClicks} label="Total clicks" color={GRN} />
              <StatPill icon="⚡" value="Live" label="Tracking" color={AMB} />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}




