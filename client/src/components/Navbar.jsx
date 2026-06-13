import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import Logo from './Logo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef  = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isAuthPage = ['/login', '/signup'].includes(location.pathname)
  if (isAuthPage) return null

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }
  const isActive = (p) => location.pathname === p

  const scrollTo = (e, href) => {
    if (!href.startsWith('/#')) return
    e.preventDefault()
    const id = href.slice(2)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const authLinks = [
    { href: '/shorten',   label: 'Shorten' },
    { href: '/bulk',      label: 'Bulk' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/analytics', label: 'Analytics' },
  ]

  const isLanding = location.pathname === '/'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 200, height: 64,
      background: 'rgba(245,243,239,0.97)',
      backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(20,20,28,0.09)',
      boxShadow: '0 1px 12px rgba(20,20,28,0.06)',
      display: 'flex', alignItems: 'center',
      animation: 'fadeDown .5s cubic-bezier(0.16,1,0.3,1) both',
    }}>
      <div style={{
        width: '100%', maxWidth: 1300, margin: '0 auto',
        padding: '0 max(32px, calc((100vw - 1300px)/2 + 32px))',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 32,
        position: 'relative',
      }}>

        {/* ── Logo ── */}
        <Link to={user ? "/shorten" : "/"} style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Logo size="sm" tone="light" animate />
        </Link>

        {/* ── Centre nav links — centered in the bar ── */}
        {!isLanding && user && (
          <ul style={{
            listStyle: 'none', display: 'flex', alignItems: 'center', gap: 2,
            margin: 0, padding: 0,
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          }}>
            {authLinks.map(link => (
              <li key={link.href}>
                <Link to={link.href} style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.875rem', fontWeight: 500,
                  color: isActive(link.href) ? '#7c3aed' : '#8d8b94',
                  padding: '7px 16px', borderRadius: 99,
                  display: 'block', textDecoration: 'none',
                  letterSpacing: '0.01em',
                  background: isActive(link.href) ? 'rgba(124,58,237,0.08)' : 'transparent',
                  transition: 'color .15s, background .15s',
                }}
                  onMouseEnter={e => { if (!isActive(link.href)) { e.currentTarget.style.background = 'rgba(20,20,28,0.05)'; e.currentTarget.style.color = '#15141c' } }}
                  onMouseLeave={e => { if (!isActive(link.href)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8d8b94' } }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* ── Actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 'auto' }}>
          {user ? (
            <>
              {/* New link pill */}
              <Link to="/shorten" id="nav-new-link-btn" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', background: '#7c3aed', color: '#fff',
                borderRadius: 99, fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.01em',
                textDecoration: 'none', boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
                transition: 'all .2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.3)' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                New link
              </Link>

              {/* Avatar + dropdown */}
              <div style={{ position: 'relative' }} ref={menuRef}>
                <button onClick={() => setMenuOpen(!menuOpen)} id="user-menu-btn" title={user.name || user.email} style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                  border: '2px solid transparent', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.9375rem', fontWeight: 700, color: '#fff',
                  cursor: 'pointer', transition: 'all .2s',
                  boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.transform = 'scale(1.07)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = '' }}
                >
                  {(user.name?.[0] || user.email?.[0])?.toUpperCase()}
                </button>

                {menuOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: '#fff', border: '1px solid rgba(20,20,28,0.12)',
                    borderRadius: 14, boxShadow: '0 16px 48px rgba(20,20,28,0.14)',
                    minWidth: 210, overflow: 'hidden', zIndex: 300,
                    animation: 'scaleIn .2s cubic-bezier(0.34,1.56,0.64,1) both',
                    transformOrigin: 'top right',
                  }}>
                    <div style={{ padding: '13px 16px 10px', borderBottom: '1px solid rgba(20,20,28,0.07)' }}>
                      {user.name && (
                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.9375rem', fontWeight: 700, color: '#15141c', marginBottom: 3 }}>
                          {user.name}
                        </div>
                      )}
                      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', fontWeight: user.name ? 400 : 600, color: user.name ? '#8d8b94' : '#15141c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </div>
                      <div style={{ marginTop: 5 }}>
                        <span style={{ display: 'inline-block', padding: '2px 9px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed' }}>
                          Free Plan
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => { setMenuOpen(false); navigate('/profile') }} 
                      id="edit-profile-btn"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 16px', fontFamily: "'Space Grotesk',sans-serif",
                        fontSize: '0.875rem', fontWeight: 500, color: '#15141c', 
                        background: 'none', border: 'none', cursor: 'pointer', 
                        width: '100%', textAlign: 'left', transition: 'background .12s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Edit Profile
                    </button>
                    <div style={{ height: 1, background: 'rgba(20,20,28,0.07)', margin: '4px 0' }} />
                    <button onClick={handleLogout} id="logout-btn" style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 16px', fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: '0.875rem', color: '#ef4444', background: 'none',
                      border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                      transition: 'background .12s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Sign in */}
              <Link to="/login" id="nav-login-btn" className="nav-signin-link" style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.875rem', fontWeight: 500,
                color: '#8d8b94', textDecoration: 'none',
                padding: '7px 12px', position: 'relative',
                letterSpacing: '0.01em',
              }}>
                Sign in
              </Link>

              {/* Get started — split pill, always light variant */}
              <Link to="/signup" id="nav-signup-btn" className="nav-cta-pill nav-cta-light">
                <span className="nav-cta-text">Get started</span>
                <span className="nav-cta-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H8M17 7v9"/>
                  </svg>
                </span>
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}




