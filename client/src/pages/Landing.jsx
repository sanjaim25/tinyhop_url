import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

/* ── Animated counter ── */
function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    const dur = 1800, t0 = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 4)) * end))
      if (p < 1) requestAnimationFrame(tick); else setCount(end)
    }
    requestAnimationFrame(tick)
  }, [started, end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

/* ── Scroll reveal wrapper ── */
function Reveal({ children, delay = 0, style }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ ...style, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(36px)', transition: `opacity .7s var(--ease-out) ${delay}ms, transform .7s var(--ease-out) ${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── Botanical line-art (mimics reference silhouette) ── */
function Botanical({ show }) {
  return (
    <svg className={`lp-botanical ${show ? 'show' : ''}`} viewBox="0 0 300 600" fill="none" aria-hidden="true">
      {/* main stem */}
      <path d="M150 600 C150 480 148 400 150 320 C152 250 150 180 150 110" />
      {/* branches */}
      <path d="M150 330 C120 310 95 300 70 285" />
      <path d="M150 300 C180 282 205 272 232 258" />
      <path d="M150 250 C124 232 104 222 84 205" />
      <path d="M150 220 C176 204 198 194 220 178" />
      <path d="M150 170 C132 152 120 140 108 122" />
      <path d="M150 150 C168 134 182 124 198 108" />
      {/* little flower clusters (circles) */}
      <circle cx="70" cy="285" r="6" /><circle cx="60" cy="278" r="4" /><circle cx="78" cy="276" r="4" />
      <circle cx="232" cy="258" r="6" /><circle cx="242" cy="250" r="4" /><circle cx="224" cy="249" r="4" />
      <circle cx="84" cy="205" r="6" /><circle cx="74" cy="198" r="4" />
      <circle cx="220" cy="178" r="6" /><circle cx="230" cy="170" r="4" />
      <circle cx="108" cy="122" r="5" /><circle cx="198" cy="108" r="5" />
      <circle cx="150" cy="105" r="7" /><circle cx="150" cy="92" r="4" /><circle cx="160" cy="98" r="4" /><circle cx="140" cy="98" r="4" />
      {/* small leaves */}
      <ellipse cx="150" cy="420" rx="16" ry="5" transform="rotate(-22 150 420)" />
      <ellipse cx="150" cy="470" rx="14" ry="4" transform="rotate(20 150 470)" />
    </svg>
  )
}

export const FEATURES = [
  { n: '01', t: 'Instant Shortening', d: 'Create short links in milliseconds with smart deduplication and a clean workspace.', to: '/features/link-shortening' },
  { n: '02', t: 'Real-Time Analytics', d: 'Click tracking, device breakdown, and geo heatmaps — live as events happen.', to: '/features/analytics' },
  { n: '03', t: 'Custom Aliases', d: 'Brand your links with memorable slugs. Perfect for campaigns, social, and print.', to: '/features/custom-aliases' },
  { n: '04', t: 'QR Generation', d: 'Beautiful, customizable QR codes for any link, instantly downloadable.', to: '/features/qr-codes' },
  { n: '05', t: 'Link Expiry', d: 'Set expiration dates and password protection for secure, time-limited sharing.', to: '/features/link-expiry' },
  { n: '06', t: 'Smart Routing', d: 'Geo and device routing — send visitors to different destinations intelligently.', to: '/features/smart-routing' },
]

export const PRICING_PLANS = [
  { name: 'Free', price: '$0', period: '/mo', feats: ['1,000 links/month', 'Basic analytics', 'QR codes', 'Link expiration'], cta: 'Get started', pop: false },
  { name: 'Pro', price: '$29', period: '/mo', feats: ['50,000 links/month', 'Advanced analytics', 'Custom domains', 'Password protection', 'API access'], cta: 'Start free trial', pop: true },
  { name: 'Enterprise', price: 'Custom', period: '', feats: ['Unlimited links', 'White-label', 'SSO & SAML', 'Dedicated support', 'SLA guarantee'], cta: 'Contact sales', pop: false },
]

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => { setMounted(true) }, [])

  // mouse parallax on hero block + plant
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const onMove = (e) => {
      const { width, height, left, top } = hero.getBoundingClientRect()
      const x = (e.clientX - left - width / 2) / width
      const y = (e.clientY - top - height / 2) / height
      hero.style.setProperty('--px', `${x * 18}px`)
      hero.style.setProperty('--py', `${y * 18}px`)
      hero.style.setProperty('--pxb', `${x * -10}px`)
    }
    hero.addEventListener('mousemove', onMove)
    return () => hero.removeEventListener('mousemove', onMove)
  }, [])

  const shorten = async (e) => {
    e.preventDefault()
    if (!url.trim()) return toast.error('Paste a URL first')
    if (!user) return navigate('/signup')
    setLoading(true)
    try {
      const res = await api.post('/api/urls', { originalUrl: url })
      setResult(res.data); setUrl('')
      toast.success('Link shortened!')
    } catch (err) { toast.error(err.response?.data?.error || 'Something went wrong') }
    finally { setLoading(false) }
  }

  const rail = [
    { label: 'Shorten', href: '#features' },
    { label: 'Features', to: '/features' },
    { label: 'Analytics', to: '/analytics-showcase' },
    { label: 'Pricing', to: '/pricing' },
  ]
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const handleRailClick = (item) => {
    if (item.to) return navigate(item.to)
    goTo(item.href.slice(1))
  }

  return (
    <div className="lp">
      <div className="lp-grain" />

      {/* ═══════════ HERO ═══════════ */}
      <section className="lp-hero" ref={heroRef}>

        {/* Left service rail */}
        <div className="lp-rail">
          {rail.map((r, i) => (
            <div
              key={r.label}
              className={`lp-rail-item ${i === 0 ? 'on' : ''}`}
              style={{
                animationDelay: `${0.9 + i * 0.12}s`,
                fontSize: i === 0 ? '1.15rem' : `${1.05 - i * 0.02}rem`,
              }}
              onClick={() => handleRailClick(r)}
            >
              <span className="dot" />
              <span className="rail-num">0{i + 1}</span>
              {r.label}
            </div>
          ))}
        </div>

        {/* Color block */}
        <div className="lp-block" style={{ transform: 'translate(calc(-50% + var(--pxb,0px)), -50%) skewY(-4deg)' }} />

        {/* Botanical */}
        <Botanical show={mounted} />

        {/* Title */}
        <div className="lp-title-wrap" style={{ transform: 'translate(calc(-50% + var(--px,0px)), calc(-50% + var(--py,0px)))' }}>
          <div className="lp-title-line"><span className="lp-title l1">Short</span></div>
          <div className="lp-title-line"><span className="lp-title l2"><em>Links</em></span></div>
        </div>

        {/* Right stats */}
        <div className="lp-stats">
          {[
            { k: 'Links', v: <Counter end={50} suffix="M+" /> },
            { k: 'Clicks', v: <Counter end={2} suffix="B+" /> },
            { k: 'Countries', v: <Counter end={150} suffix="+" /> },
            { k: 'Uptime', v: '99.9%' },
          ].map((s, i) => (
            <div key={s.k} className="lp-stat" style={{ animationDelay: `${1.1 + i * 0.1}s` }}>
              <div className="lp-stat-k">{s.k}</div>
              <div className="lp-stat-v">{s.v}</div>
            </div>
          ))}
        </div>

        {/* Bottom-left description + mini shortener */}
        <div className="lp-desc">
          <p>Turn long, messy URLs into intelligent short links with real-time analytics — built for modern teams.</p>
          <form onSubmit={shorten}>
            <div className="lp-mini-form">
              <input className="lp-mini-input" type="url" id="hero-url-input" placeholder="Paste a long URL…" value={url} onChange={e => setUrl(e.target.value)} />
              <button type="submit" id="hero-shorten-btn" className="lp-mini-btn" disabled={loading}>
                {loading
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ animation: 'spinFast .7s linear infinite' }}><path d="M21 12a9 9 0 11-6.2-8.5"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
              </button>
            </div>
          </form>
          {result && (
            <div className="lp-result">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              tinyhop-url.onrender.com/{result.shortCode}
            </div>
          )}
        </div>

        {/* Circular rotating CTA */}
        <Link to="/signup" className="lp-circle" id="hero-circle-cta">
          <div className="lp-circle-bg" />
          <svg className="lp-circle-text" viewBox="0 0 140 140" width="116" height="116">
            <defs>
              <path id="circlePath" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
            </defs>
            <text>
              <textPath href="#circlePath" startOffset="0%">START FREE · SHORTEN NOW · TRACK LINKS · </textPath>
            </text>
          </svg>
          <svg className="lp-circle-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
        </Link>

        {/* Scroll cue */}
        <div className="lp-scroll-cue">
          <span>Scroll</span>
          <span className="lp-scroll-line" />
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="lp-section" id="how">
        <div className="wrap">
          <Reveal style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="lp-eyebrow">How it works</span>
            <h2 className="lp-h2">Three steps to scale</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 40, maxWidth: 880, margin: '0 auto' }}>
            {[
              { n: '1', t: 'Paste your URL', d: 'Drop any long URL into the homepage or dashboard to get started instantly.' },
              { n: '2', t: 'Customize & brand', d: 'Add a custom alias, set expiry, or password-protect your link.' },
              { n: '3', t: 'Track & optimize', d: 'Watch real-time clicks, geo data, and device analytics roll in.' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120} style={{ textAlign: 'center' }}>
                <div className="lp-step-num">{s.n}</div>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--inkd)', marginBottom: 8, letterSpacing: '-0.02em' }}>{s.t}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--inksoft)', lineHeight: 1.65 }}>{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="lp-section">
        <div className="wrap">
          <Reveal>
            <div className="lp-cta">
              <div className="lp-cta-blob" style={{ width: 400, height: 400, background: 'rgba(124,58,237,0.4)', top: '-30%', left: '10%' }} />
              <div className="lp-cta-blob" style={{ width: 360, height: 360, background: 'rgba(200,255,61,0.18)', bottom: '-40%', right: '8%' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="lp-eyebrow" style={{ justifyContent: 'center', color: 'var(--acid)' }}>Free to start</span>
                <h2 className="lp-h2" style={{ color: 'var(--paper)', marginBottom: 18, fontStyle: 'italic' }}>Ready to make<br />every link count?</h2>
                <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.7)', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.7 }}>
                  Join thousands of teams using TinyHop to manage, track, and scale their link strategy.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/signup" id="cta-signup-btn" className="lp-btn lp-btn-violet">
                    Create free account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                  {!user && <Link to="/login" className="lp-btn lp-btn-light">Sign in</Link>}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <Footer />
    </div>
  )
}




