import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

/* Generic light page for Blog, Legal, Contact, etc. */
export default function SimplePage({ tag, title, subtitle, children }) {
  return (
    <div className="lp" style={{ minHeight: '100vh' }}>
      <div className="lp-grain" />

      {/* Hero */}
      <section style={{
        paddingTop: 130, paddingBottom: 80,
        paddingLeft: 'max(32px, calc((100vw - 1300px)/2 + 32px))',
        paddingRight: 'max(32px, calc((100vw - 1300px)/2 + 32px))',
        borderBottom: '1px solid var(--line)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, left: '35%', width: 500, height: 350, background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
        <div style={{ position: 'relative', maxWidth: 680 }}>
          <span className="lp-eyebrow" style={{ animation: 'none', marginBottom: 20, display: 'inline-flex' }}>{tag}</span>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.02, color: 'var(--inkd)', marginBottom: 20 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--inksoft)', maxWidth: 520 }}>
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Body content */}
      {children && (
        <section style={{
          paddingTop: 64, paddingBottom: 80,
          paddingLeft: 'max(32px, calc((100vw - 1300px)/2 + 32px))',
          paddingRight: 'max(32px, calc((100vw - 1300px)/2 + 32px))',
        }}>
          <div style={{ maxWidth: 680 }}>
            {children}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}




