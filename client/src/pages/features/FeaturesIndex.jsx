import { BarChart2, Smartphone, Zap, Target, Clock, Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'

/* ── Scroll-reveal hook ── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.unobserve(el) }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Reveal({ children, delay = 0, from = 'up' }) {
  const { ref, visible } = useReveal()
  const transforms = { up: 'translateY(44px)', left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.9)' }
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : transforms[from],
      transition: `opacity .85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform .85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

function DrawLine({ color = 'var(--inkd)', delay = 0 }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{
      height: 1, background: color, transformOrigin: 'left',
      transform: visible ? 'scaleX(1)' : 'scaleX(0)',
      transition: `transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }} />
  )
}

const FEATURES = [
  { n: '01', label: 'Link Shortening', title: 'Instantly shorter. Infinitely smarter.', body: 'Paste any URL, get a clean branded link in milliseconds. Every short link comes with a full analytics dashboard, QR code, and custom alias.', to: '/features/link-shortening', accent: '#7c3aed', icon: <Zap size={24}/> },
  { n: '02', label: 'Real-Time Analytics', title: 'Every click tells a story.', body: 'Watch live traffic as it happens. Country, city, device, browser — every signal captured and visualized the moment someone taps your link.', to: '/features/analytics', accent: '#16a34a', icon: <BarChart2 size={24}/> },
  { n: '03', label: 'Custom Aliases', title: 'Your brand in every link.', body: 'tinyhop-url.onrender.com/launch24 earns 3× more clicks than tinyhop-url.onrender.com/xK9pQ. Memorable slugs build trust, reinforce campaigns, and work beautifully in print.', to: '/features/custom-aliases', accent: '#6d28d9', icon: <Target size={24}/> },
  { n: '04', label: 'QR Code Generator', title: 'Bridge print and digital.', body: 'Every link gets a scannable QR code — custom colours, sizes, and styles. Scans flow into your analytics exactly like link clicks.', to: '/features/qr-codes', accent: '#7c3aed', icon: <Smartphone size={24}/> },
  { n: '05', label: 'Link Expiry', title: 'Links that know when to stop.', body: 'Flash sales end. Events close. Your links should too. Set exact expiry dates down to the minute — with clean, branded expiry pages.', to: '/features/link-expiry', accent: '#5b21b6', icon: <Clock size={24}/> },
  { n: '06', label: 'Smart Routing', title: 'One link. Six continents.', body: 'Route by country or device type. Send French visitors to the French page, mobile users to the app download — from a single short link.', to: '/features/smart-routing', accent: '#7c3aed', icon: <Globe size={24}/> },
]

const PAD = 'max(32px, calc((100vw - 1100px)/2 + 32px))'

export default function FeaturesIndex() {
  return (
    <div className="lp" style={{ minHeight: '100vh' }}>
      <div className="lp-grain" />

      {/* ═══ HERO ═══ */}
      <section style={{
        paddingTop: 130, paddingBottom: 100,
        paddingLeft: PAD, paddingRight: PAD,
        minHeight: '80vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid var(--line)',
      }}>
        {/* grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(124,58,237,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.07) 1px,transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 85% 70% at 50% 40%,black,transparent)', WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 40%,black,transparent)', pointerEvents: 'none' }} />
        {/* orb */}
        <div style={{ position: 'absolute', top: '5%', right: '-5%', width: 560, height: 560, background: 'radial-gradient(circle,rgba(124,58,237,0.13) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 820 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, animation: 'fadeUp .6s var(--ease-out) .1s both' }}>
            <span className="lp-eyebrow" style={{ animation: 'none' }}>All Features</span>
            <div style={{ height: 1, width: 48, background: '#7c3aed' }} />
            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', color: 'var(--inkfaint)', letterSpacing: '0.1em' }}>6 CAPABILITIES</span>
          </div>

          <div style={{ overflow: 'hidden', marginBottom: 8 }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(3rem,7vw,6.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.93, color: 'var(--inkd)', animation: 'lineUp .9s var(--ease-out) .25s both' }}>
              Everything your<br /><em style={{ fontStyle: 'italic', color: '#7c3aed' }}>links need.</em>
            </h1>
          </div>

          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1rem,1.8vw,1.2rem)', lineHeight: 1.7, color: 'var(--inksoft)', maxWidth: 560, marginTop: 28, marginBottom: 44, animation: 'fadeUp .7s var(--ease-out) .55s both' }}>
            From the moment you shorten a URL to every click it ever receives — TinyHop gives you full visibility and control.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, animation: 'fadeUp .7s var(--ease-out) .7s both' }}>
            <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 32px', background: 'var(--inkd)', color: 'var(--paper)', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.9375rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px rgba(20,20,28,0.18)', transition: 'all .25s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#7c3aed'; e.currentTarget.style.boxShadow='0 12px 36px rgba(124,58,237,0.45)'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--inkd)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(20,20,28,0.18)'; e.currentTarget.style.transform='' }}>
              Start free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
            </Link>
            <Link to="/" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', color: 'var(--inkfaint)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--inkd)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--inkfaint)'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to home
            </Link>
          </div>
        </div>

        {/* scroll cue */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0, animation: 'fadeIn 1s ease 1.4s forwards' }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--inkfaint)' }}>Explore</span>
          <div style={{ width: 1, height: 32, background: 'var(--inkfaint)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', width: '100%', height: '50%', background: 'var(--inkd)', animation: 'scrollDot 1.8s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══ FEATURE CHAPTERS ═══ */}
      {FEATURES.map((f, i) => (
        <section key={f.n} style={{
          paddingTop: 90, paddingBottom: 90,
          paddingLeft: PAD, paddingRight: PAD,
          borderBottom: '1px solid var(--line)',
          background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper-2)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* faint chapter number watermark */}
          <div style={{ position: 'absolute', top: '50%', right: PAD, transform: 'translateY(-50%)', fontFamily: "'Playfair Display',serif", fontSize: 'clamp(8rem,18vw,18rem)', fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1, color: `${f.accent}06`, pointerEvents: 'none', userSelect: 'none' }}>
            {f.n}
          </div>

          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: 64, alignItems: 'center', direction: i % 2 !== 0 ? 'rtl' : 'ltr' }}>

            {/* Text side */}
            <div style={{ direction: 'ltr' }}>
              <Reveal delay={0}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', color: 'var(--inkfaint)', letterSpacing: '0.1em' }}>CHAPTER {f.n}</span>
                  <div style={{ height: 1, width: 36, background: `${f.accent}60` }} />
                  <span className="lp-eyebrow" style={{ animation: 'none', color: f.accent, borderColor: `${f.accent}40`, background: `${f.accent}10` }}>{f.label}</span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.02, color: 'var(--inkd)', marginBottom: 18 }}>
                  {f.title}
                </h2>
              </Reveal>

              <Reveal delay={150}>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.0625rem', lineHeight: 1.75, color: 'var(--inksoft)', marginBottom: 32 }}>
                  {f.body}
                </p>
              </Reveal>

              <Reveal delay={220}>
                <DrawLine color={`${f.accent}40`} />
                <div style={{ marginTop: 24 }}>
                  <Link to={f.to} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '11px 24px', background: 'transparent',
                    border: `1.5px solid ${f.accent}`,
                    borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: '0.875rem', fontWeight: 600,
                    color: f.accent, textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background=f.accent; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${f.accent}40` }}
                    onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=f.accent; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}>
                    Explore {f.label}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Visual side */}
            <div style={{ direction: 'ltr' }}>
              <Reveal delay={100} from={i % 2 === 0 ? 'right' : 'left'}>
                <div style={{
                  background: 'var(--paper)', border: `1px solid ${f.accent}20`,
                  borderRadius: 20, padding: 32, position: 'relative',
                  overflow: 'hidden', boxShadow: `0 16px 48px rgba(20,20,28,0.08)`,
                }}>
                  {/* top accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${f.accent}, transparent)` }} />

                  {/* window dots */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
                    {['#ef4444','#f59e0b','#22c55e'].map((c,j) => <div key={j} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                  </div>

                  {/* icon + chapter */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.accent}15`, border: `1px solid ${f.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                      {f.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.125rem', fontWeight: 700, color: 'var(--inkd)', lineHeight: 1.2 }}>{f.label}</div>
                      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)', marginTop: 4 }}>Included in all plans</div>
                    </div>
                  </div>

                  {/* mock stat row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {[
                      { v: '—', l: 'Total' },
                      { v: '—', l: 'Active' },
                      { v: '—', l: 'Clicks' },
                    ].map((s,j) => (
                      <div key={j} style={{ padding: '12px 10px', background: `${f.accent}08`, borderRadius: 10, textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', fontWeight: 900, color: f.accent }}>✦</div>
                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6875rem', color: 'var(--inkfaint)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* mono code hint */}
                  <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--paper-3)', borderRadius: 8, fontFamily: "'Fragment Mono',monospace", fontSize: '0.75rem', lineHeight: 1.8 }}>
                    <span style={{ color: f.accent }}>TinyHop</span>
                    <span style={{ color: 'var(--inkd)' }}>.</span>
                    <span style={{ color: '#16a34a' }}>{f.label.toLowerCase().replace(/\s+/g, '_')}</span>
                    <span style={{ color: 'var(--inkd)' }}>()</span>
                    <span style={{ color: 'var(--inkfaint)' }}> // ready</span>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </section>
      ))}

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: '100px max(32px,calc((100vw - 1100px)/2 + 32px))', background: 'var(--inkd)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-30%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(124,58,237,0.35) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40%', right: '10%', width: 360, height: 360, background: 'radial-gradient(circle,rgba(200,255,61,0.15) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
          <Reveal>
            <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>All 6 features. Free to start.</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.25rem,5vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.97, color: 'var(--paper)', fontStyle: 'italic', marginBottom: 20 }}>
              Every tool.<br />One workspace.
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', marginBottom: 40, lineHeight: 1.7 }}>
              Sign up in 30 seconds. No credit card. All features included from day one.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '15px 36px', background: '#7c3aed', color: '#fff', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 28px rgba(124,58,237,0.55)', transition: 'all .25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 14px 40px rgba(124,58,237,0.7)' }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 28px rgba(124,58,237,0.55)' }}>
                Create free account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '15px 28px', background: 'rgba(255,255,255,0.08)', color: 'var(--paper)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', fontWeight: 600, textDecoration: 'none', transition: 'background .2s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}>
                Back to home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}




