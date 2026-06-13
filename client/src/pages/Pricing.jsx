import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Footer from '../components/Footer'
import { PRICING_PLANS } from './Landing'

export default function Pricing() {
  return (
    <div className="lp" style={{ minHeight: '100vh' }}>
      <div className="lp-grain" />

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 64, display: 'flex', alignItems: 'center',
        padding: '0 max(32px, calc((100vw - 1300px)/2 + 32px))',
        background: 'rgba(236,234,228,0.92)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(20,20,28,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1300, margin: '0 auto' }}>
          <Link to="/" style={{ textDecoration: 'none' }}><Logo size="sm" tone="light" /></Link>
          <Link to="/features" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', color: 'var(--inksoft)', textDecoration: 'none' }}>
            Features
          </Link>
        </div>
      </div>

      <section className="lp-section alt" style={{ paddingTop: 130 }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="lp-eyebrow" style={{ justifyContent: 'center' }}>Pricing</span>
            <h1 className="lp-h2">Simple, honest pricing</h1>
            <p className="lp-lead" style={{ marginTop: 14 }}>Start free. Scale without surprises.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, maxWidth: 980, margin: '0 auto' }}>
            {PRICING_PLANS.map((plan) => (
              <div key={plan.name} className={`lp-price ${plan.pop ? 'pop' : ''}`}>
                {plan.pop && <div className="lp-price-badge">Most Popular</div>}
                <div className="lp-price-name">{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                  <span className="lp-price-num">{plan.price}</span>
                  {plan.period && <span style={{ fontSize: '1rem', color: 'var(--inkfaint)', marginBottom: 8 }}>{plan.period}</span>}
                </div>
                <div className="lp-price-feat">
                  {plan.feats.map((feature) => (
                    <div key={feature} className="lp-price-feat-item">
                      <svg className="lp-price-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {feature}
                    </div>
                  ))}
                </div>
                <Link to="/signup" className={`lp-btn w-full ${plan.pop ? 'lp-btn-light' : 'lp-btn-dark'}`} style={{ justifyContent: 'center' }}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}




