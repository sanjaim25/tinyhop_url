const V = '#7c3aed'
const INK = '#15141c'
const LINE = 'rgba(20,20,28,0.1)'
const P2 = '#f5f3ef'

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: '#eceae4', paddingTop: 64 }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp .6s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 14px', background: `${V}12`, border: `1px solid ${V}28`, borderRadius: 99, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: V }}>Legal</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.93, color: INK, marginBottom: 14 }}>
            Privacy <em style={{ fontStyle: 'italic', color: V }}>Policy</em>
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#8d8b94', maxWidth: 600, margin: '0 auto', lineHeight: 1.65 }}>
            Last updated: June 13, 2026
          </p>
        </div>

        <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 22, padding: '40px', boxShadow: '0 6px 32px rgba(20,20,28,0.09)', animation: 'fadeUp .6s cubic-bezier(0.16,1,0.3,1) .1s both' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9375rem', lineHeight: 1.8, color: '#5d5b65' }}>
            
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', fontWeight: 900, color: INK, marginTop: 0, marginBottom: 24 }}>
              Our Commitment to Privacy
            </h2>
            <p style={{ marginBottom: 20 }}>
              At TinyHop, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our service.
            </p>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              1. Information We Collect
            </h3>
            
            <h4 style={{ fontWeight: 600, fontSize: '1rem', color: INK, marginTop: 20, marginBottom: 12 }}>
              Account Information
            </h4>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Name and email address</li>
              <li style={{ marginBottom: 12 }}>Password (encrypted using bcrypt)</li>
              <li style={{ marginBottom: 12 }}>Account preferences and settings</li>
            </ul>

            <h4 style={{ fontWeight: 600, fontSize: '1rem', color: INK, marginTop: 20, marginBottom: 12 }}>
              Link and Usage Data
            </h4>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Original URLs and shortened link codes</li>
              <li style={{ marginBottom: 12 }}>Custom aliases and link metadata</li>
              <li style={{ marginBottom: 12 }}>Link creation and expiration dates</li>
              <li style={{ marginBottom: 12 }}>Click counts and usage patterns</li>
            </ul>

            <h4 style={{ fontWeight: 600, fontSize: '1rem', color: INK, marginTop: 20, marginBottom: 12 }}>
              Analytics Data
            </h4>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Geographic location (country and city)</li>
              <li style={{ marginBottom: 12 }}>Device type (mobile, tablet, desktop)</li>
              <li style={{ marginBottom: 12 }}>Browser and operating system</li>
              <li style={{ marginBottom: 12 }}>Referrer information</li>
              <li style={{ marginBottom: 12 }}>Timestamp of clicks</li>
            </ul>

            <h4 style={{ fontWeight: 600, fontSize: '1rem', color: INK, marginTop: 20, marginBottom: 12 }}>
              Technical Data
            </h4>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>IP address (used for analytics and security)</li>
              <li style={{ marginBottom: 12 }}>Cookies and similar tracking technologies</li>
              <li style={{ marginBottom: 12 }}>Device identifiers</li>
              <li style={{ marginBottom: 12 }}>Log files and error reports</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              2. How We Use Your Information
            </h3>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Provide and maintain our URL shortening service</li>
              <li style={{ marginBottom: 12 }}>Generate analytics and insights for your links</li>
              <li style={{ marginBottom: 12 }}>Improve and optimize our service</li>
              <li style={{ marginBottom: 12 }}>Communicate important updates and changes</li>
              <li style={{ marginBottom: 12 }}>Detect and prevent fraud, abuse, and security threats</li>
              <li style={{ marginBottom: 12 }}>Comply with legal obligations</li>
              <li style={{ marginBottom: 12 }}>Provide customer support</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              3. Data Security
            </h3>
            <p style={{ marginBottom: 16 }}>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>All connections use HTTPS encryption</li>
              <li style={{ marginBottom: 12 }}>Passwords are hashed using bcrypt (12 rounds)</li>
              <li style={{ marginBottom: 12 }}>Data is stored on secure cloud infrastructure</li>
              <li style={{ marginBottom: 12 }}>Regular security audits and updates</li>
              <li style={{ marginBottom: 12 }}>Access controls and authentication mechanisms</li>
              <li style={{ marginBottom: 12 }}>Automated backups with encryption</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              4. Data Sharing and Disclosure
            </h3>
            <p style={{ marginBottom: 16 }}>
              We do not sell your personal data. We may share information only in these circumstances:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}><strong>With your consent:</strong> When you explicitly authorize sharing</li>
              <li style={{ marginBottom: 12 }}><strong>Service providers:</strong> Third-party services that help operate our platform (hosting, analytics)</li>
              <li style={{ marginBottom: 12 }}><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              <li style={{ marginBottom: 12 }}><strong>Business transfers:</strong> In case of merger, acquisition, or sale of assets</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              5. Your Privacy Rights
            </h3>
            <p style={{ marginBottom: 16 }}>
              You have the following rights regarding your personal data:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}><strong>Access:</strong> Request a copy of your personal data</li>
              <li style={{ marginBottom: 12 }}><strong>Correction:</strong> Update inaccurate or incomplete data</li>
              <li style={{ marginBottom: 12 }}><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li style={{ marginBottom: 12 }}><strong>Export:</strong> Download your data in a portable format</li>
              <li style={{ marginBottom: 12 }}><strong>Restriction:</strong> Limit how we process your data</li>
              <li style={{ marginBottom: 12 }}><strong>Objection:</strong> Object to certain types of processing</li>
              <li style={{ marginBottom: 12 }}><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              6. Data Retention
            </h3>
            <p style={{ marginBottom: 16 }}>
              We retain your data for different periods depending on its type:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}><strong>Account data:</strong> Until you delete your account</li>
              <li style={{ marginBottom: 12 }}><strong>Link data:</strong> Indefinitely unless you delete specific links</li>
              <li style={{ marginBottom: 12 }}><strong>Analytics data:</strong> Aggregated for service improvement</li>
              <li style={{ marginBottom: 12 }}><strong>Backup data:</strong> Up to 90 days in encrypted backups</li>
              <li style={{ marginBottom: 12 }}><strong>Log files:</strong> 30-90 days for security and troubleshooting</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              7. Cookies and Tracking
            </h3>
            <p style={{ marginBottom: 16 }}>
              We use cookies and similar technologies for:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}><strong>Essential cookies:</strong> Required for authentication and core functionality</li>
              <li style={{ marginBottom: 12 }}><strong>Analytics cookies:</strong> Help us understand usage patterns</li>
              <li style={{ marginBottom: 12 }}><strong>Preference cookies:</strong> Remember your settings</li>
            </ul>
            <p style={{ marginBottom: 20 }}>
              You can control cookies through your browser settings, though this may affect functionality.
            </p>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              8. International Data Transfers
            </h3>
            <p style={{ marginBottom: 20 }}>
              Your data may be processed in countries outside your residence. We ensure appropriate safeguards are in place to protect your data during international transfers.
            </p>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              9. Children's Privacy
            </h3>
            <p style={{ marginBottom: 20 }}>
              Our service is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.
            </p>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              10. Changes to This Policy
            </h3>
            <p style={{ marginBottom: 20 }}>
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or through the service. Your continued use after changes constitutes acceptance.
            </p>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              11. Contact Us
            </h3>
            <p style={{ marginBottom: 12 }}>
              For privacy-related questions or to exercise your rights, contact us:
            </p>
            <div style={{ background: P2, padding: 24, borderRadius: 12, marginTop: 16 }}>
              <p style={{ marginBottom: 8, fontWeight: 600 }}>Privacy Officer: privacy@TinyHop.io</p>
              <p style={{ marginBottom: 8, fontWeight: 600 }}>General Contact: legal@TinyHop.io</p>
              <p style={{ marginBottom: 8, fontWeight: 600 }}>Support: support@TinyHop.io</p>
              <p style={{ fontWeight: 600 }}>Response Time: Within 2 business days</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}




