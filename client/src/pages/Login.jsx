import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'

/* ── Botanical SVG (white strokes on dark left panel) ── */
function LeftBotanical() {
  return (
    <svg className="ap-botanical" viewBox="0 0 240 520" fill="none" aria-hidden="true">
      <path d="M120 520 C120 430 118 360 120 290 C122 230 120 170 120 110" />
      <path d="M120 310 C96 293 76 283 54 270" />
      <path d="M120 280 C144 264 164 254 188 240" />
      <path d="M120 240 C98 224 80 215 62 200" />
      <path d="M120 210 C142 196 160 187 180 173" />
      <path d="M120 165 C104 150 92 140 80 124" />
      <path d="M120 148 C136 134 150 124 165 110" />
      <circle cx="54"  cy="270" r="5" /><circle cx="45"  cy="263" r="3.5" /><circle cx="62"  cy="262" r="3.5" />
      <circle cx="188" cy="240" r="5" /><circle cx="197" cy="232" r="3.5" /><circle cx="180" cy="231" r="3.5" />
      <circle cx="62"  cy="200" r="5" /><circle cx="53"  cy="193" r="3" />
      <circle cx="180" cy="173" r="5" /><circle cx="189" cy="165" r="3" />
      <circle cx="80"  cy="124" r="4" /><circle cx="165" cy="110" r="4" />
      <circle cx="120" cy="106" r="6" /><circle cx="120" cy="94"  r="3.5" />
      <circle cx="129" cy="99"  r="3.5" /><circle cx="111" cy="99" r="3.5" />
      <ellipse cx="120" cy="390" rx="14" ry="4.5" transform="rotate(-20 120 390)" />
      <ellipse cx="120" cy="440" rx="12" ry="4"   transform="rotate(18 120 440)" />
    </svg>
  )
}

/* ── Animated number counter ── */
function AnimNum({ n }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const t0 = Date.now(), dur = 1400
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1)
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * n))
      if (p < 1) requestAnimationFrame(tick); else setV(n)
    }
    const id = setTimeout(() => requestAnimationFrame(tick), 1700)
    return () => clearTimeout(id)
  }, [n])
  return <>{v.toLocaleString()}</>
}

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const emailRef   = useRef(null)
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]   = useState({})
  const [focused, setFocused] = useState(null)

  useEffect(() => { emailRef.current?.focus() }, [])

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors({}) }

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setLoading(true)
    try {
      const res = await api.post('/api/auth/login', form)
      login(res.data.user, res.data.token)
      toast.success(`Welcome back, ${res.data.user.name || res.data.user.email.split('@')[0]} 👋`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Check your credentials.'
      toast.error(msg)
      msg.toLowerCase().includes('password') ? setErrors({ password: msg }) : setErrors({ email: msg })
    } finally { setLoading(false) }
  }

  return (
    <div className="ap">

      {/* ════ LEFT VISUAL PANEL ════ */}
      <div className="ap-left">
        <div className="ap-left-block" />
        <div className="ap-grain" />

        {/* stripes */}
        <div className="ap-left-stripe" style={{ top: '33.3%' }} />
        <div className="ap-left-stripe" style={{ top: '66.6%' }} />

        {/* Top logo */}
        <div className="ap-left-content">
          <Link to="/" className="ap-left-logo" id="login-logo">
            <Logo size="lg" tone="dark" animate tagline="Link Intelligence" />
          </Link>
        </div>

        {/* Top-right stats */}
        <div className="ap-left-stats">
          {[
            { k: 'Links Shortened', v: <><AnimNum n={50} />M+</> },
            { k: 'Clicks Tracked',  v: <><AnimNum n={2} />B+</>  },
            { k: 'Uptime',          v: '99.9%'                    },
          ].map((s, i) => (
            <div key={s.k} className="ap-left-stat" style={{ animationDelay: `${1.8 + i * 0.12}s` }}>
              <div className="ap-left-stat-k">{s.k}</div>
              <div className="ap-left-stat-v">{s.v}</div>
            </div>
          ))}
        </div>

        {/* Botanical */}
        <LeftBotanical />

        {/* Bottom headline */}
        <div className="ap-left-headline">
          <div className="ap-left-hl r1"><span>Welcome</span></div>
          <div className="ap-left-hl r2"><span className="acc">Back.</span></div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', marginTop: 18, fontWeight: 500, opacity: 0, animation: 'fadeIn .6s ease 1.8s forwards' }}>
            Sign in to manage your links, track<br />clicks, and grow with data.
          </p>
        </div>
      </div>

      {/* ════ RIGHT FORM PANEL ════ */}
      <div className="ap-right">
        <div className="ap-right-lines" />

        {/* Top-right nav */}
        <div className="ap-nav">
          <span style={{ fontSize: '0.8125rem', color: 'var(--inkfaint)' }}>No account?</span>
          <Link to="/signup" className="ap-nav-pill" id="login-to-signup">Create one free</Link>
        </div>

        {/* Mobile logo */}
        <div className="ap-mobile-logo">
          <Logo size="md" tone="light" />
        </div>

        <div className="ap-form-area">
          {/* Big decorative step number */}
          <div className="ap-step-num">01</div>

          {/* Page title */}
          <h1 className="ap-page-title">
            Sign <em>in</em>
          </h1>
          <p className="ap-sub">Enter your credentials to access your workspace.</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="ap-field" style={{ animation: 'fadeUp .6s var(--ease-out) .5s both' }}>
              <label className="ap-label" htmlFor="login-email">Email address</label>
              <input
                ref={emailRef}
                id="login-email"
                type="email"
                className={`ap-input ${errors.email ? 'err' : ''}`}
                placeholder="you@company.com"
                value={form.email}
                onChange={set('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
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
            <div className="ap-field" style={{ animation: 'fadeUp .6s var(--ease-out) .62s both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="ap-label" htmlFor="login-password">Password</label>
              </div>
              <div className="ap-pass-wrap">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className={`ap-input ${errors.password ? 'err' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  id="login-toggle-pass"
                  className="ap-pass-toggle"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                >
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && (
                <span className="ap-field-err">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errors.password}
                </span>
              )}
            </div>

            {/* Submit */}
            <div style={{ animation: 'fadeUp .6s var(--ease-out) .74s both' }}>
              <button
                type="submit"
                id="login-submit-btn"
                className="ap-submit"
                disabled={loading}
              >
                {loading
                  ? <span style={{ margin: '0 auto' }}>
                      <svg className="ap-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.2-8.5"/></svg>
                    </span>
                  : <>
                      <span>Sign in to workspace</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </>
                }
              </button>
            </div>
          </form>

          <div className="ap-divider" style={{ animation: 'fadeUp .6s var(--ease-out) .86s both' }}>or</div>

          <div style={{ animation: 'fadeUp .6s var(--ease-out) .92s both' }}>
            <Link to="/signup" id="login-signup-link" className="ap-alt-btn">
              Create a free account
            </Link>
          </div>

          <p className="ap-legal" style={{ animation: 'fadeUp .6s var(--ease-out) 1s both' }}>
            By continuing you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>

    </div>
  )
}




