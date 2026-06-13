import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--paper)',
      fontFamily: "'Space Grotesk', sans-serif",
      paddingTop: 80,
      paddingBottom: 80,
    }}>
      <div style={{
        maxWidth: 800,
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
            About TinyHop
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            lineHeight: 1.1,
            color: 'var(--inkd)',
            marginBottom: 20,
          }}>
            The Link Intelligence Layer for Modern Teams
          </h1>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.7,
            color: 'rgba(20,20,28,0.6)',
            maxWidth: 640,
            margin: '0 auto',
          }}>
            TinyHop transforms how businesses share, track, and optimize their links with powerful analytics and seamless management.
          </p>
        </div>

        {/* Mission Section */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--inkd)',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '2px solid rgba(124, 58, 237, 0.2)',
          }}>
            Our Mission
          </h2>
          <p style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'rgba(20,20,28,0.7)',
            marginBottom: 16,
          }}>
            In today's digital landscape, every link represents an opportunity—to connect, to convert, to understand your audience. At TinyHop, we believe managing these connections should be simple, powerful, and intelligent.
          </p>
          <p style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'rgba(20,20,28,0.7)',
          }}>
            Our mission is to empower businesses and individuals with the tools they need to make every link count. From instant shortening to real-time analytics, we provide the intelligence layer that turns simple URLs into strategic assets.
          </p>
        </section>

        {/* What We Do Section */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--inkd)',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '2px solid rgba(124, 58, 237, 0.2)',
          }}>
            What We Do
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              {
                title: 'Link Shortening Made Simple',
                description: 'Transform long, unwieldy URLs into clean, shareable links in seconds. Our intelligent shortening algorithm creates memorable links that are perfect for social media, marketing campaigns, and professional communications.',
              },
              {
                title: 'Real-Time Analytics',
                description: 'Track every click with precision. Our advanced analytics dashboard provides insights into geographic distribution, device types, referral sources, and engagement patterns—helping you understand your audience like never before.',
              },
              {
                title: 'Custom Branding',
                description: 'Create custom aliases that reflect your brand identity. Whether it\'s for a product launch, campaign, or event, branded short links build trust and recognition with your audience.',
              },
              {
                title: 'Smart Link Management',
                description: 'Organize, search, and manage thousands of links with ease. Set expiration dates, password protection, and access controls to maintain security and relevance across your entire link portfolio.',
              },
              {
                title: 'QR Code Generation',
                description: 'Bridge physical and digital experiences with instant QR code generation for every shortened link. Perfect for print materials, product packaging, and offline marketing.',
              },
            ].map((feature, idx) => (
              <div key={idx} style={{
                padding: 24,
                background: 'rgba(124, 58, 237, 0.03)',
                borderRadius: 12,
                border: '1px solid rgba(124, 58, 237, 0.1)',
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#7c3aed',
                  marginBottom: 10,
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.7,
                  color: 'rgba(20,20,28,0.7)',
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose TinyHop Section */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--inkd)',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '2px solid rgba(124, 58, 237, 0.2)',
          }}>
            Why Choose TinyHop?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            marginTop: 24,
          }}>
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Links shortened in milliseconds with 99.9% uptime' },
              { icon: '🔒', title: 'Enterprise Security', desc: 'Bank-grade encryption and password protection' },
              { icon: '📊', title: 'Detailed Insights', desc: 'Comprehensive analytics and reporting tools' },
              { icon: '🎨', title: 'Full Customization', desc: 'Custom aliases, domains, and branding options' },
              { icon: '🌍', title: 'Global Scale', desc: 'CDN-powered infrastructure for worldwide reach' },
              { icon: '💡', title: 'Intuitive Design', desc: 'Clean interface that anyone can master' },
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: 20,
                background: '#fff',
                borderRadius: 10,
                border: '1px solid rgba(20,20,28,0.08)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
                <h4 style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--inkd)',
                  marginBottom: 8,
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: 'rgba(20,20,28,0.6)',
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Who We Serve Section */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--inkd)',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '2px solid rgba(124, 58, 237, 0.2)',
          }}>
            Who We Serve
          </h2>
          <p style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'rgba(20,20,28,0.7)',
            marginBottom: 24,
          }}>
            From startups to enterprises, content creators to marketing teams, TinyHop serves thousands of users who demand excellence in link management:
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {[
              { title: 'Marketing Teams', desc: 'Track campaign performance and optimize conversion rates with detailed click analytics' },
              { title: 'Social Media Managers', desc: 'Create clean, branded links perfect for Instagram, Twitter, LinkedIn, and more' },
              { title: 'E-commerce Businesses', desc: 'Drive sales with trackable product links and promotional campaigns' },
              { title: 'Content Creators', desc: 'Monetize content with affiliate links and track audience engagement' },
              { title: 'Event Organizers', desc: 'Share registration links and track attendance with QR codes' },
              { title: 'Developers', desc: 'Integrate our API for automated link management at scale' },
            ].map((audience, idx) => (
              <li key={idx} style={{
                display: 'flex',
                gap: 16,
                padding: 16,
                background: '#fff',
                borderRadius: 10,
                border: '1px solid rgba(20,20,28,0.08)',
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  background: '#7c3aed',
                  borderRadius: '50%',
                  marginTop: 8,
                  flexShrink: 0,
                }}></div>
                <div>
                  <strong style={{ color: 'var(--inkd)', fontSize: '0.9375rem' }}>
                    {audience.title}:
                  </strong>
                  <span style={{ color: 'rgba(20,20,28,0.7)', fontSize: '0.9375rem', marginLeft: 6 }}>
                    {audience.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Our Values Section */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--inkd)',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '2px solid rgba(124, 58, 237, 0.2)',
          }}>
            Our Values
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { title: 'Simplicity First', desc: 'Powerful features shouldn\'t require complex workflows. We design for intuitive, effortless experiences.' },
              { title: 'Privacy & Security', desc: 'Your data is yours. We employ industry-leading security practices and never sell your information.' },
              { title: 'Transparency', desc: 'No hidden fees, no surprises. What you see is what you get, with clear pricing and honest communication.' },
              { title: 'Continuous Innovation', desc: 'The digital landscape evolves rapidly. We stay ahead with regular updates and new features.' },
              { title: 'Customer Success', desc: 'Your success is our success. We provide responsive support and resources to help you thrive.' },
            ].map((value, idx) => (
              <div key={idx} style={{
                borderLeft: '3px solid #7c3aed',
                paddingLeft: 20,
              }}>
                <h3 style={{
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  color: 'var(--inkd)',
                  marginBottom: 8,
                }}>
                  {value.title}
                </h3>
                <p style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.7,
                  color: 'rgba(20,20,28,0.7)',
                }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--inkd)',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '2px solid rgba(124, 58, 237, 0.2)',
          }}>
            Built with Modern Technology
          </h2>
          <p style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'rgba(20,20,28,0.7)',
            marginBottom: 20,
          }}>
            TinyHop is built on a cutting-edge technology stack designed for speed, reliability, and scalability:
          </p>
          <div style={{
            padding: 24,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(124, 58, 237, 0.02))',
            borderRadius: 12,
            border: '1px solid rgba(124, 58, 237, 0.15)',
          }}>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {[
                'React & Modern JavaScript',
                'Node.js Backend',
                'Prisma ORM',
                'PostgreSQL Database',
                'RESTful API Architecture',
                'Real-time Analytics Engine',
                'CDN-Powered Delivery',
                'Enterprise-Grade Security',
              ].map((tech, idx) => (
                <li key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: '0.9375rem',
                  color: 'rgba(20,20,28,0.7)',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Get Started CTA */}
        <section style={{
          marginTop: 64,
          padding: 48,
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          borderRadius: 16,
          textAlign: 'center',
          color: '#fff',
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: 16,
            color: '#fff',
          }}>
            Ready to Transform Your Links?
          </h2>
          <p style={{
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            marginBottom: 32,
            opacity: 0.9,
            maxWidth: 560,
            margin: '0 auto 32px',
          }}>
            Join thousands of businesses already using TinyHop to shorten, track, and optimize their links.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 32px',
              background: '#fff',
              color: '#7c3aed',
              borderRadius: 99,
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
              }}
            >
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/contact" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 32px',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              borderRadius: 99,
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              }}
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}




