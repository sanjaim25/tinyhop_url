const V = '#7c3aed'
const INK = '#15141c'
const LINE = 'rgba(20,20,28,0.1)'
const P2 = '#f5f3ef'

export default function TermsOfService() {
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
            Terms of <em style={{ fontStyle: 'italic', color: V }}>Service</em>
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#8d8b94', maxWidth: 600, margin: '0 auto', lineHeight: 1.65 }}>
            Last updated: June 13, 2026
          </p>
        </div>

        <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 22, padding: '40px', boxShadow: '0 6px 32px rgba(20,20,28,0.09)', animation: 'fadeUp .6s cubic-bezier(0.16,1,0.3,1) .1s both' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9375rem', lineHeight: 1.8, color: '#5d5b65' }}>
            
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', fontWeight: 900, color: INK, marginTop: 0, marginBottom: 24 }}>
              Agreement to Terms
            </h2>
            <p style={{ marginBottom: 20 }}>
              By accessing and using TinyHop ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              1. Service Description
            </h3>
            <p style={{ marginBottom: 20 }}>
              TinyHop provides URL shortening services that allow you to create, manage, and track shortened links. We offer both free and premium plans with various features including:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Custom branded short links</li>
              <li style={{ marginBottom: 12 }}>Real-time click analytics and tracking</li>
              <li style={{ marginBottom: 12 }}>QR code generation</li>
              <li style={{ marginBottom: 12 }}>Link expiration and password protection</li>
              <li style={{ marginBottom: 12 }}>Geographic and device-based routing</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              2. Acceptable Use Policy
            </h3>
            <p style={{ marginBottom: 16 }}>
              You agree not to use the Service for:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Illegal activities or content that violates any law or regulation</li>
              <li style={{ marginBottom: 12 }}>Distributing malware, viruses, or malicious code</li>
              <li style={{ marginBottom: 12 }}>Phishing, fraud, or deceptive practices</li>
              <li style={{ marginBottom: 12 }}>Spam, unsolicited marketing, or harassment</li>
              <li style={{ marginBottom: 12 }}>Infringing on intellectual property rights</li>
              <li style={{ marginBottom: 12 }}>Adult content, hate speech, or violence</li>
              <li style={{ marginBottom: 12 }}>Attempting to circumvent security measures or abuse the system</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              3. Account Responsibilities
            </h3>
            <p style={{ marginBottom: 20 }}>
              You are responsible for:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Maintaining the security of your account credentials</li>
              <li style={{ marginBottom: 12 }}>All activities that occur under your account</li>
              <li style={{ marginBottom: 12 }}>Keeping your contact information up to date</li>
              <li style={{ marginBottom: 12 }}>Notifying us immediately of any unauthorized access</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              4. Service Availability and Modifications
            </h3>
            <p style={{ marginBottom: 20 }}>
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We may:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Suspend service for maintenance, updates, or improvements</li>
              <li style={{ marginBottom: 12 }}>Modify features or pricing with reasonable notice</li>
              <li style={{ marginBottom: 12 }}>Discontinue features that are underutilized or unsustainable</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              5. Content and Data Ownership
            </h3>
            <p style={{ marginBottom: 20 }}>
              You retain ownership of all content and data you submit to the Service. By using TinyHop, you grant us a limited license to:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Store and process your data to provide the Service</li>
              <li style={{ marginBottom: 12 }}>Generate analytics and aggregate statistics</li>
              <li style={{ marginBottom: 12 }}>Display your shortened links publicly (they are accessible by anyone with the link)</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              6. Termination
            </h3>
            <p style={{ marginBottom: 20 }}>
              We reserve the right to suspend or terminate your account if you violate these terms. You may delete your account at any time from your account settings. Upon termination:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Your access to the Service will cease immediately</li>
              <li style={{ marginBottom: 12 }}>Your short links may be deactivated</li>
              <li style={{ marginBottom: 12 }}>Your data will be deleted according to our retention policy</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              7. Limitation of Liability
            </h3>
            <p style={{ marginBottom: 20 }}>
              The Service is provided "as is" without warranties of any kind. We are not liable for:
            </p>
            <ul style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}>Any indirect, incidental, or consequential damages</li>
              <li style={{ marginBottom: 12 }}>Loss of data, revenue, or business opportunities</li>
              <li style={{ marginBottom: 12 }}>Content accessed through shortened links</li>
              <li style={{ marginBottom: 12 }}>Service interruptions or data loss</li>
            </ul>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              8. Changes to Terms
            </h3>
            <p style={{ marginBottom: 20 }}>
              We may update these terms from time to time. We will notify you of significant changes via email or through the Service. Your continued use after changes constitutes acceptance of the updated terms.
            </p>

            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.25rem', color: INK, marginTop: 32, marginBottom: 16 }}>
              9. Contact Information
            </h3>
            <p style={{ marginBottom: 12 }}>
              For questions about these Terms of Service, contact us at:
            </p>
            <div style={{ background: P2, padding: 24, borderRadius: 12, marginTop: 16 }}>
              <p style={{ marginBottom: 8, fontWeight: 600 }}>Email: legal@TinyHop.io</p>
              <p style={{ marginBottom: 8, fontWeight: 600 }}>Support: support@TinyHop.io</p>
              <p style={{ fontWeight: 600 }}>Response Time: Within 2 business days</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}




