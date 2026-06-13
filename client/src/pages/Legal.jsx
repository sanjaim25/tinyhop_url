import { useState } from 'react'

const V = '#7c3aed'
const INK = '#15141c'
const LINE = 'rgba(20,20,28,0.1)'
const P2 = '#f5f3ef'

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  
  return (
    <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '20px 24px', background: 'transparent',
          border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.125rem',
          fontWeight: 700, color: INK, textAlign: 'left', transition: 'background .2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = P2}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {title}
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          style={{ transition: 'transform .3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{
          padding: '0 24px 24px', borderTop: `1px solid ${LINE}`,
          animation: 'slideDown .3s ease both'
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9375rem',
            lineHeight: 1.7, color: '#5d5b65'
          }}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Legal() {
  return (
    <div style={{ minHeight: '100vh', background: '#eceae4', paddingTop: 64 }}>
      <style>{`
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Grain texture */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp .6s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 14px', background: `${V}12`, border: `1px solid ${V}28`, borderRadius: 99, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: V }}>Legal</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.93, color: INK, marginBottom: 14 }}>
            Terms &amp; <em style={{ fontStyle: 'italic', color: V }}>Privacy</em>
          </h1>
          <p style={{ fontSize: '1rem', color: '#8d8b94', maxWidth: 600, margin: '0 auto', lineHeight: 1.65 }}>
            Our terms of service, privacy policy, and other legal information — written in plain language.
          </p>
        </div>

        {/* Sections */}
        <div style={{ animation: 'fadeUp .6s cubic-bezier(0.16,1,0.3,1) .1s both' }}>
          
          <Section title="Terms of Service" defaultOpen={true}>
            <p style={{ marginTop: 16, marginBottom: 16 }}>
              <strong>Last updated:</strong> June 13, 2026
            </p>
            <p style={{ marginBottom: 16 }}>
              By using TinyHop, you agree to these terms. We provide a URL shortening service that allows you to create, manage, and track short links.
            </p>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginTop: 24, marginBottom: 12 }}>Acceptable Use</h3>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Do not use our service for illegal activities, spam, or malicious content</li>
              <li style={{ marginBottom: 8 }}>Do not create links that violate intellectual property rights</li>
              <li style={{ marginBottom: 8 }}>Do not attempt to abuse or exploit our systems</li>
              <li style={{ marginBottom: 8 }}>Maintain accurate account information</li>
            </ul>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginTop: 24, marginBottom: 12 }}>Service Availability</h3>
            <p style={{ marginBottom: 16 }}>
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We may suspend service for maintenance or improvements.
            </p>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginTop: 24, marginBottom: 12 }}>Account Termination</h3>
            <p style={{ marginBottom: 16 }}>
              We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time.
            </p>
          </Section>

          <Section title="Privacy Policy">
            <p style={{ marginTop: 16, marginBottom: 16 }}>
              <strong>Last updated:</strong> June 13, 2026
            </p>
            <p style={{ marginBottom: 16 }}>
              We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information.
            </p>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginTop: 24, marginBottom: 12 }}>Information We Collect</h3>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}><strong>Account Information:</strong> Name, email address, and password</li>
              <li style={{ marginBottom: 8 }}><strong>Usage Data:</strong> Links you create, click analytics, and usage patterns</li>
              <li style={{ marginBottom: 8 }}><strong>Analytics Data:</strong> Country, device type, browser, and referrer for link clicks</li>
              <li style={{ marginBottom: 8 }}><strong>Technical Data:</strong> IP address, cookies, and device information</li>
            </ul>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginTop: 24, marginBottom: 12 }}>How We Use Your Data</h3>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Provide and improve our service</li>
              <li style={{ marginBottom: 8 }}>Generate analytics and insights for your links</li>
              <li style={{ marginBottom: 8 }}>Communicate important updates</li>
              <li style={{ marginBottom: 8 }}>Prevent fraud and abuse</li>
            </ul>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginTop: 24, marginBottom: 12 }}>Data Security</h3>
            <p style={{ marginBottom: 16 }}>
              We use industry-standard encryption and security measures to protect your data. Passwords are hashed using bcrypt, and all connections use HTTPS.
            </p>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginTop: 24, marginBottom: 12 }}>Your Rights</h3>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Access your personal data</li>
              <li style={{ marginBottom: 8 }}>Request data correction or deletion</li>
              <li style={{ marginBottom: 8 }}>Export your data</li>
              <li style={{ marginBottom: 8 }}>Opt out of marketing communications</li>
            </ul>
          </Section>

          <Section title="Cookie Policy">
            <p style={{ marginTop: 16, marginBottom: 16 }}>
              <strong>Last updated:</strong> June 13, 2026
            </p>
            <p style={{ marginBottom: 16 }}>
              We use cookies and similar technologies to improve your experience and analyze service usage.
            </p>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginTop: 24, marginBottom: 12 }}>Types of Cookies</h3>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}><strong>Essential Cookies:</strong> Required for authentication and core functionality</li>
              <li style={{ marginBottom: 8 }}><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
              <li style={{ marginBottom: 8 }}><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginTop: 24, marginBottom: 12 }}>Managing Cookies</h3>
            <p style={{ marginBottom: 16 }}>
              You can control cookies through your browser settings. Note that disabling certain cookies may affect service functionality.
            </p>
          </Section>

          <Section title="Data Retention">
            <p style={{ marginTop: 16, marginBottom: 16 }}>
              We retain your data for as long as your account is active or as needed to provide services.
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}><strong>Account Data:</strong> Retained until you delete your account</li>
              <li style={{ marginBottom: 8 }}><strong>Link Data:</strong> Retained indefinitely unless you delete the link</li>
              <li style={{ marginBottom: 8 }}><strong>Analytics Data:</strong> Aggregated and retained for service improvement</li>
              <li style={{ marginBottom: 8 }}><strong>Backup Data:</strong> May be retained for up to 90 days</li>
            </ul>
          </Section>

          <Section title="Third-Party Services">
            <p style={{ marginTop: 16, marginBottom: 16 }}>
              We may use third-party services to help operate our platform:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}><strong>Hosting:</strong> Our infrastructure is hosted on secure cloud platforms</li>
              <li style={{ marginBottom: 8 }}><strong>Analytics:</strong> We use analytics tools to understand service usage</li>
              <li style={{ marginBottom: 8 }}><strong>Payment Processing:</strong> Payment data is handled by certified payment processors</li>
            </ul>
            <p style={{ marginBottom: 16 }}>
              These services have their own privacy policies and we ensure they meet our security standards.
            </p>
          </Section>

          <Section title="Contact Us">
            <p style={{ marginTop: 16, marginBottom: 16 }}>
              If you have questions about these policies or want to exercise your rights, contact us:
            </p>
            <div style={{ background: P2, padding: 20, borderRadius: 12, marginTop: 16 }}>
              <p style={{ marginBottom: 8 }}><strong>Email:</strong> legal@TinyHop.io</p>
              <p style={{ marginBottom: 8 }}><strong>Support:</strong> support@TinyHop.io</p>
              <p><strong>Response Time:</strong> We aim to respond within 2 business days</p>
            </div>
          </Section>

        </div>

      </div>
    </div>
  )
}




