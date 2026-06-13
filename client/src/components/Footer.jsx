import { Link } from 'react-router-dom'
import Logo from './Logo'

const cols = [
  {
    heading: 'Features',
    links: [
      { label: 'Link Shortening',   to: '/features/link-shortening' },
      { label: 'Link Management',   to: '/features/link-shortening' },
      { label: 'Real-Time Analytics', to: '/analytics-showcase' },
      { label: 'Custom Aliases',    to: '/features/custom-aliases' },
      { label: 'QR Code Generator', to: '/features/qr-codes' },
      { label: 'Link Expiry',       to: '/features/link-expiry' },
      { label: 'Smart Routing',     to: '/features/smart-routing' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Analytics Preview', to: '/analytics-showcase' },
      { label: 'About TinyHop',        to: '/about' },
    ],
  },
  {
    heading: 'Contact Us',
    links: [
      { label: 'Help Desk',        to: '/help' },
      { label: 'Contact Support',  to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Privacy Policy',   to: '/privacy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--inkd)',
      color: 'var(--paper)',
      padding: '72px max(32px, calc((100vw - 1300px)/2 + 32px)) 40px',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>

      {/* ── Top: logo + tagline ── */}
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap', paddingBottom: 56, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Brand column */}
          <div style={{ maxWidth: 260 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
              <Logo size="md" tone="dark" />
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
              The link intelligence layer for modern teams. Shorten, track, and scale with precision.
            </p>
            {/* CTA pill */}
            <Link to="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', background: '#7c3aed', color: '#fff',
              borderRadius: 99, fontSize: '0.8125rem', fontWeight: 600,
              textDecoration: 'none', letterSpacing: '0.01em',
              boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
              transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='#6d28d9'; e.currentTarget.style.transform='translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background='#7c3aed'; e.currentTarget.style.transform='' }}
            >
              Start for free
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Link columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '40px 24px', flex: 1, minWidth: 0, width: '100%' }}>
            {cols.map(col => (
              <div key={col.heading}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>
                  {col.heading}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(link => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color .15s' }}
                        onMouseEnter={e => e.target.style.color='#fff'}
                        onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.65)'}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} TinyHop. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 28 }}>
            {['Privacy', 'Terms', 'Cookies'].map(t => (
              <a key={t} href="#" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.target.style.color='rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.3)'}>
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}




