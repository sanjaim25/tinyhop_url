import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'

/* ── Botanical SVG (left panel) ── */
function LeftBotanical() {
  return (
    <svg className="ap-botanical" viewBox="0 0 240 520" fill="none" aria-hidden="true">
      <path d="M120 520 C120 430 118 360 120 290 C122 230 120 170 120 110" />
      <path d="M120 330 C94 312 72 302 48 288" />
      <path d="M120 298 C146 280 168 270 194 256" />
      <path d="M120 255 C96 238 77 228 56 213" />
      <path d="M120 222 C144 207 163 198 184 184" />
      <path d="M120 172 C102 156 88 145 74 128" />
      <path d="M120 154 C138 138 154 128 170 114" />
      <circle cx="48"  cy="288" r="6" /><circle cx="38"  cy="281" r="4" /><circle cx="57"  cy="280" r="4" />
      <circle cx="194" cy="256" r="6" /><circle cx="204" cy="248" r="4" /><circle cx="185" cy="247" r="4" />
      <circle cx="56"  cy="213" r="5.5" /><circle cx="46"  cy="206" r="3.5" />
      <circle cx="184" cy="184" r="5.5" /><circle cx="194" cy="176" r="3.5" />
      <circle cx="74"  cy="128" r="4.5" /><circle cx="170" cy="114" r="4.5" />
      <circle cx="120" cy="106" r="7"   /><circle cx="120" cy="93"  r="4"   />
      <circle cx="130" cy="98"  r="4"   /><circle cx="110" cy="98"  r="4"   />
      <ellipse cx="120" cy="400" rx="15" ry="5" transform="rotate(-18 120 400)" />
      <ellipse cx="120" cy="455" rx="13" ry="4.5" transform="rotate(16 120 455)" />
      <path d="M74 128 C64 120 58 112 54 102" />
      <path d="M170 114 C180 106 187 96 190 86" />
    </svg>
  )
}

/* ── Password strength ── */
function PassStrength({ password }) {
  const score = (p) => {
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }
  if (!password) return (
    <div className="ap-strength">
      {[0,1,2,3].map(i => <div key={i} className="ap-strength-seg" />)}
    </div>
  )
  const s = score(password)
  const colors = ['', '#ef4444', '#f59e0b', '#60a5fa', '#22d17a']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return (
    <div>
      <div className="ap-strength">
        {[1,2,3,4].map(i => (
          <div key={i} className="ap-strength-seg" style={{ background: i <= s ? colors[s] : undefined }} />
        ))}
      </div>
      <span style={{ fontSize: '0.6875rem', color: colors[s], fontWeight: 700, display: 'block', marginTop: 4 }}>
        {labels[s]}
      </span>
    </div>
  )
}

/* ── Floating feature pill ── */
function FeaturePill({ text, delay }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '6px 13px',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 99, backdropFilter: 'blur(8px)',
      fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)',
      opacity: 0,
      animation: `fadeIn .5s ease ${delay}s forwards`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8ff3d', flexShrink: 0 }} />
      {text}
    </div>
  )
}

export default function Signup() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const emailRef  = useRef(null)
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]   = useState({})
  const [step, setStep]       = useState(1) // 1 = email, 2 = password

  useEffect(() => { emailRef.current?.focus() }, [])

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors({}) }

  const validate = () => {
    const e = {}
    if (!form.name) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setLoading(true)
    try {
      const res = await api.post('/api/auth/signup', { name: form.name, email: form.email, password: form.password })
      login(res.data.user, res.data.token)
      toast.success('Account created! Welcome to TinyHop')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || 'Signup failed. Please try again.'
      toast.error(msg); setErrors({ email: msg })
    } finally { setLoading(false) }
  }

  const FEATS = ['1,000 links/month', 'Real-time analytics', 'QR code generator', 'Custom aliases', 'Link expiration']

  return (
    <div className="ap">

      {/* ════ LEFT VISUAL PANEL ════ */}
      <div className="ap-left">
        <div className="ap-left-block" />
        <div className="ap-grain" />

        {/* stripes */}
        <div className="ap-left-stripe" style={{ top: '25%' }} />
        <div className="ap-left-stripe" style={{ top: '50%' }} />
        <div className="ap-left-stripe" style={{ top: '75%' }} />

        {/* Top logo */}
        <div className="ap-left-content">
          <Link to="/" className="ap-left-logo" id="signup-logo">
            <Logo size="lg" tone="dark" animate tagline="Link Intelligence" />
          </Link>
        </div>

        {/* Feature pills cluster — mid panel */}
        <div style={{
          position: 'absolute', top: '42%', left: 52, right: 52,
          transform: 'translateY(-50%)',
          zIndex: 2, display: 'flex', flexDirection: 'column', gap: 8,
          alignItems: 'flex-start',
        }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10, opacity: 0, animation: 'fadeIn .5s ease 1.5s forwards' }}>
            Everything included, free
          </p>
          {FEATS.map((f, i) => <FeaturePill key={f} text={f} delay={1.5 + i * 0.1} />)}
        </div>

        {/* Botanical */}
        <LeftBotanical />

        {/* Top-right: small stat */}
        <div className="ap-left-stats" style={{ gap: 14 }}>
          <div className="ap-left-stat" style={{ animationDelay: '1.8s' }}>
            <div className="ap-left-stat-k">Free forever</div>
            <div className="ap-left-stat-v">$0 / mo</div>
          </div>
          <div className="ap-left-stat" style={{ animationDelay: '1.92s' }}>
            <div className="ap-left-stat-k">Setup time</div>
            <div className="ap-left-stat-v">30 sec</div>
          </div>
        </div>

        {/* Bottom headline */}
        <div className="ap-left-headline">
          <div className="ap-left-hl r1"><span>Start</span></div>
          <div className="ap-left-hl r2"><span>for</span></div>
          <div className="ap-left-hl r3"><span className="acc">free.</span></div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: 18, fontWeight: 500, opacity: 0, animation: 'fadeIn .6s ease 1.9s forwards' }}>
            No credit card required.<br />
            Upgrade anytime you need more.
          </p>
        </div>
      </div>

      {/* ════ RIGHT FORM PANEL ════ */}
      <div className="ap-right">
        <div className="ap-right-lines" />

        {/* Top-right nav */}
        <div className="ap-nav">
          <span style={{ fontSize: '0.8125rem', color: 'var(--inkfaint)' }}>Already a member?</span>
          <Link to="/login" className="ap-nav-pill inv" id="signup-to-login">Sign in</Link>
        </div>

        {/* Mobile logo */}
        <div className="ap-mobile-logo">
          <Logo size="md" tone="light" />
        </div>

        <div className="ap-form-area">
          {/* Decorative number */}
          <div className="ap-step-num">02</div>

          <h1 className="ap-page-title">
            Create <em>account</em>
          </h1>
          <p className="ap-sub">
            Join thousands of teams shortening, tracking, and scaling their links.
          </p>

          {/* Perks */}
          <div className="ap-perks">
            {['✦ Free forever', '✦ 1,000 links/mo', '✦ Real-time analytics'].map(t => (
              <div key={t} className="ap-perk">
                <span className="ap-perk-dot" />
                {t.slice(2)}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="ap-field" style={{ animation: 'fadeUp .6s var(--ease-out) .5s both' }}>
              <label className="ap-label" htmlFor="signup-name">Full name</label>
              <input
                ref={emailRef}
                id="signup-name"
                type="text"
                className={`ap-input ${errors.name ? 'err' : ''}`}
                placeholder="John Doe"
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
              />
              {errors.name && (
                <span className="ap-field-err">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="ap-field" style={{ animation: 'fadeUp .6s var(--ease-out) .56s both' }}>
              <label className="ap-label" htmlFor="signup-email">Work email</label>
              <input
                id="signup-email"
                type="email"
                className={`ap-input ${errors.email ? 'err' : ''}`}
                placeholder="you@company.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
              {errors.email && (
                <span className="ap-field-err">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="ap-field" style={{ animation: 'fadeUp .6s var(--ease-out) .68s both' }}>
              <label className="ap-label" htmlFor="signup-password">Password</label>
              <div className="ap-pass-wrap">
                <input
                  id="signup-password"
                  type={showPass ? 'text' : 'password'}
                  className={`ap-input ${errors.password ? 'err' : ''}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  id="signup-toggle-pass"
                  className="ap-pass-toggle"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                >
                  {showPass
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <PassStrength password={form.password} />
              {errors.password && (
                <span className="ap-field-err" style={{ marginTop: 4 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errors.password}
                </span>
              )}
            </div>

            {/* Confirm password */}
            <div className="ap-field" style={{ animation: 'fadeUp .6s var(--ease-out) .8s both' }}>
              <label className="ap-label" htmlFor="signup-confirm-password">Confirm password</label>
              <input
                id="signup-confirm-password"
                type="password"
                className={`ap-input ${errors.confirmPassword ? 'err' : ''}`}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className="ap-field-err">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit */}
            <div style={{ animation: 'fadeUp .6s var(--ease-out) .92s both' }}>
              <button
                type="submit"
                id="signup-submit-btn"
                className="ap-submit"
                disabled={loading}
              >
                {loading
                  ? <span style={{ margin: '0 auto' }}>
                      <svg className="ap-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.2-8.5"/></svg>
                    </span>
                  : <>
                      <span>Create free account</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </>
                }
              </button>
            </div>
          </form>

          <div className="ap-divider" style={{ animation: 'fadeUp .6s var(--ease-out) 1s both' }}>or</div>

          <div style={{ animation: 'fadeUp .6s var(--ease-out) 1.06s both' }}>
            <Link to="/login" id="signup-login-link" className="ap-alt-btn">
              Sign in to existing account
            </Link>
          </div>

          <p className="ap-legal" style={{ animation: 'fadeUp .6s var(--ease-out) 1.14s both' }}>
            By creating an account you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>

    </div>
  )
}




