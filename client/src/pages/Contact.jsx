import { MessageCircle, Rocket, Bug } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll respond within 2-4 hours.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--paper)',
      fontFamily: "'Space Grotesk', sans-serif",
      paddingTop: 80,
      paddingBottom: 80,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 18px',
            background: 'rgba(124, 58, 237, 0.08)',
            borderRadius: 99,
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#7c3aed',
            marginBottom: 24,
          }}>
            Contact Us
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            lineHeight: 1.1,
            color: 'var(--inkd)',
            marginBottom: 20,
          }}>
            We're Here to <em style={{ fontStyle: 'italic', color: '#7c3aed' }}>Help</em>
          </h1>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.7,
            color: 'rgba(20,20,28,0.6)',
            maxWidth: 640,
            margin: '0 auto',
          }}>
            Reach our team for support, sales enquiries, or to report an issue. We respond within 2-4 hours during business hours.
          </p>
        </div>

        {/* Contact Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          marginBottom: 64,
        }}>
          {[
            {
              icon: <MessageCircle size={24} color="#15141c" strokeWidth={2.5} />,
              title: 'General Support',
              desc: 'Questions about your account or features',
              contact: 'support@tinyhop-url',
              action: 'Email Support'
            },
            {
              icon: <Rocket size={24} color="#15141c" strokeWidth={2.5} />,
              title: 'Sales & Enterprise',
              desc: 'Discuss custom plans and solutions',
              contact: 'sales@tinyhop-url',
              action: 'Contact Sales'
            },
            {
              icon: <Bug size={24} color="#15141c" strokeWidth={2.5} />,
              title: 'Report an Issue',
              desc: 'Found a bug or technical problem?',
              contact: 'bugs@tinyhop-url',
              action: 'Report Bug'
            },
          ].map((card, idx) => (
            <div key={idx} style={{
              padding: 32,
              background: '#fff',
              borderRadius: 12,
              border: '1px solid rgba(20,20,28,0.08)',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(124, 58, 237, 0.12)'
                e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.borderColor = 'rgba(20,20,28,0.08)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>{card.icon}</div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--inkd)',
                marginBottom: 10,
              }}>
                {card.title}
              </h3>
              <p style={{
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: 'rgba(20,20,28,0.6)',
                marginBottom: 20,
              }}>
                {card.desc}
              </p>
              <a href={`mailto:${card.contact}`} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: 'rgba(124, 58, 237, 0.08)',
                color: '#7c3aed',
                borderRadius: 8,
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#7c3aed'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(124, 58, 237, 0.08)'
                  e.currentTarget.style.color = '#7c3aed'
                }}
              >
                {card.action}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: 40,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(20,20,28,0.08)',
          boxShadow: '0 8px 24px rgba(20,20,28,0.06)',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--inkd)',
            marginBottom: 10,
            textAlign: 'center',
          }}>
            Send us a Message
          </h2>
          <p style={{
            fontSize: '0.9375rem',
            color: 'rgba(20,20,28,0.6)',
            marginBottom: 32,
            textAlign: 'center',
          }}>
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--inkd)',
                marginBottom: 8,
              }}>
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '0.9375rem',
                  border: '1px solid rgba(20,20,28,0.12)',
                  borderRadius: 8,
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#7c3aed'
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(20,20,28,0.12)'
                  e.target.style.boxShadow = ''
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--inkd)',
                marginBottom: 8,
              }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '0.9375rem',
                  border: '1px solid rgba(20,20,28,0.12)',
                  borderRadius: 8,
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#7c3aed'
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(20,20,28,0.12)'
                  e.target.style.boxShadow = ''
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--inkd)',
                marginBottom: 8,
              }}>
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '0.9375rem',
                  border: '1px solid rgba(20,20,28,0.12)',
                  borderRadius: 8,
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#7c3aed'
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(20,20,28,0.12)'
                  e.target.style.boxShadow = ''
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--inkd)',
                marginBottom: 8,
              }}>
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '0.9375rem',
                  border: '1px solid rgba(20,20,28,0.12)',
                  borderRadius: 8,
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: "'Space Grotesk', sans-serif",
                  resize: 'vertical',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#7c3aed'
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(20,20,28,0.12)'
                  e.target.style.boxShadow = ''
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '14px 32px',
                background: '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'Space Grotesk', sans-serif",
                opacity: isSubmitting ? 0.6 : 1,
              }}
              onMouseEnter={e => !isSubmitting && (e.target.style.background = '#6d28d9')}
              onMouseLeave={e => !isSubmitting && (e.target.style.background = '#7c3aed')}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div style={{
          marginTop: 64,
          padding: 32,
          background: 'rgba(124, 58, 237, 0.05)',
          borderRadius: 12,
          border: '1px solid rgba(124, 58, 237, 0.15)',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--inkd)',
            marginBottom: 12,
          }}>
            Response Time
          </h3>
          <p style={{
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: 'rgba(20,20,28,0.7)',
            maxWidth: 600,
            margin: '0 auto',
          }}>
            Our support team typically responds within <strong>2-4 hours</strong> during business hours (Monday-Friday, 9 AM - 6 PM EST). For urgent issues, please mark your message as "Urgent" in the subject line.
          </p>
        </div>
      </div>
    </div>
  )
}




