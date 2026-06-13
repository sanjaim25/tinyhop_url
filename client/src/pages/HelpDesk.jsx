import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

const V = '#7c3aed'
const INK = '#15141c'
const LINE = 'rgba(20,20,28,0.1)'
const P2 = '#f5f3ef'
const GRN = '#16a34a'

function FAQItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  
  return (
    <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '20px 24px', background: 'transparent',
          border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.0625rem',
          fontWeight: 600, color: INK, textAlign: 'left', transition: 'background .2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = P2}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {question}
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          style={{ transition: 'transform .3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
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
            {answer}
          </div>
        </div>
      )}
    </div>
  )
}

export default function HelpDesk() {
  return (
    <div style={{ minHeight: '100vh', background: '#eceae4', paddingTop: 64 }}>
      <style>{`
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp .6s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 14px', background: `${V}12`, border: `1px solid ${V}28`, borderRadius: 99, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: V }}>Support</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.93, color: INK, marginBottom: 14 }}>
            Help <em style={{ fontStyle: 'italic', color: V }}>Desk</em>
          </h1>
          <p style={{ fontSize: '1rem', color: '#8d8b94', maxWidth: 600, margin: '0 auto', lineHeight: 1.65 }}>
            Find answers to common questions or reach out to our support team
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 48, animation: 'fadeUp .6s cubic-bezier(0.16,1,0.3,1) .1s both' }}>
          <a href="mailto:support@TinyHop.io" style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: '24px', textDecoration: 'none', transition: 'all .2s', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(20,20,28,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${V}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={V} strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: INK, marginBottom: 4 }}>Email Support</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.875rem', color: '#8d8b94' }}>support@TinyHop.io</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: GRN, marginTop: 8 }}>Response within 24 hours</div>
            </div>
          </a>

          <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${GRN}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GRN} strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: INK, marginBottom: 4 }}>Support Hours</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.875rem', color: '#8d8b94' }}>Monday - Friday</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.875rem', color: '#8d8b94' }}>9 AM - 6 PM EST</div>
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#d9770615', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: INK, marginBottom: 4 }}>Average Response</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.875rem', color: '#8d8b94' }}>2-4 hours during business hours</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.875rem', color: '#8d8b94' }}>24 hours on weekends</div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 900, color: INK, marginBottom: 24, textAlign: 'center' }}>
            Frequently Asked <em style={{ fontStyle: 'italic', color: V }}>Questions</em>
          </h2>
        </div>

        <div style={{ animation: 'fadeUp .6s cubic-bezier(0.16,1,0.3,1) .2s both' }}>
          
          <FAQItem 
            question="How do I create a short link?"
            answer={<>Simply paste your long URL into the input field on the homepage or dashboard, optionally add a custom alias, and click "Shorten this link". Your shortened URL will be generated instantly!</>}
            defaultOpen={true}
          />

          <FAQItem 
            question="Can I customize my short links?"
            answer={<>Yes! You can create custom aliases for your links. Instead of a random code like "tinyhop-url.onrender.com/xK9pQ", you can have something memorable like "tinyhop-url.onrender.com/summer-sale". Just enter your desired alias when creating the link.</>}
          />

          <FAQItem 
            question="How do I track link analytics?"
            answer={<>Every link comes with built-in analytics. Click on any link in your dashboard to see detailed statistics including total clicks, geographic location, device types, browsers, and referral sources. All data is updated in real-time.</>}
          />

          <FAQItem 
            question="Can I set an expiration date for my links?"
            answer={<>Absolutely! When creating a link, you can set a specific expiration date and time. After the link expires, visitors will see a friendly expiration message instead of the original destination. This is perfect for time-sensitive campaigns or limited offers.</>}
          />

          <FAQItem 
            question="How do I password protect a link?"
            answer={<>Enable password protection when creating a link by toggling the "Password protection" option and entering your desired password. Anyone trying to access the link will need to enter the password first.</>}
          />

          <FAQItem 
            question="Can I generate QR codes for my links?"
            answer={<>Yes! Every shortened link automatically has a QR code available. Click the QR code icon on any link in your dashboard to view and download it as a PNG image. Perfect for print materials and bridging offline to online.</>}
          />

          <FAQItem 
            question="What happens if I delete my account?"
            answer={<>If you delete your account, all your shortened links will be deactivated and your data will be permanently deleted within 30 days. We recommend exporting your analytics data before deletion if you need to keep it.</>}
          />

          <FAQItem 
            question="Is there a limit on how many links I can create?"
            answer={<>Free accounts can create up to 1,000 links per month. Premium plans offer unlimited link creation along with additional features like custom domains, advanced analytics, and priority support.</>}
          />

          <FAQItem 
            question="How secure are my links?"
            answer={<>Very secure! All connections use HTTPS encryption, passwords are hashed with bcrypt, and we implement industry-standard security measures. We also monitor for malicious activity and spam to keep the platform safe for everyone.</>}
          />

          <FAQItem 
            question="Can I edit a link after creating it?"
            answer={<>Yes, you can edit certain aspects like the destination URL and link metadata. However, the short code or custom alias cannot be changed once created to maintain link permanence. If you need a different alias, you'll need to create a new link.</>}
          />

          <FAQItem 
            question="Do shortened links expire automatically?"
            answer={<>No, links do not expire unless you set an expiration date. Links without an expiration date will work indefinitely as long as your account remains active and you don't delete the link.</>}
          />

          <FAQItem 
            question="How do I export my analytics data?"
            answer={<>Click on any link to view its analytics, then use the export button to download your data as CSV or JSON format. You can also request a full account export by contacting our support team.</>}
          />

        </div>

        {/* Still Need Help */}
        <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 22, padding: '40px', marginTop: 48, textAlign: 'center', animation: 'fadeUp .6s cubic-bezier(0.16,1,0.3,1) .3s both' }}>
          <div style={{display:"flex", justifyContent:"center", marginBottom:16}}><MessageCircle size={48}/></div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', fontWeight: 900, color: INK, marginBottom: 12 }}>
            Still need help?
          </h3>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#8d8b94', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a href="mailto:support@TinyHop.io" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: V, color: '#fff', borderRadius: 99, fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none', transition: 'all .2s', boxShadow: `0 4px 14px ${V}40` }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = V; e.currentTarget.style.transform = '' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Contact Support
          </a>
        </div>

      </div>
    </div>
  )
}




