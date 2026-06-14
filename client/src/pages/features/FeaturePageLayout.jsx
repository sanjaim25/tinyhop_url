import { Clock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import Logo from '../../components/Logo'

/* ── Scroll-reveal hook ── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.unobserve(el) }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ── Chapter reveal component ── */
function Chapter({ children, delay = 0 }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(44px)',
      transition: `opacity .85s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                   transform .85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

/* ── Horizontal reveal (from left/right) ── */
function SlideIn({ children, from = 'left', delay = 0 }) {
  const { ref, visible } = useReveal(0.1)
  const x = from === 'left' ? '-48px' : '48px'
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : `translateX(${x})`,
      transition: `opacity .9s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                   transform .9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

/* ── Line drawer ── */
function DrawLine({ accent, delay = 0 }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ height: 2, background: accent, transformOrigin: 'left', transform: visible ? 'scaleX(1)' : 'scaleX(0)', transition: `transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }} />
  )
}

/* ── Big counter ── */
function BigNum({ value, label, accent, delay = 0 }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.82)', transition: `all 0.8s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms` }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(3rem,7vw,6rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, color: accent }}>
        {value}
      </div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', color: 'var(--inkfaint)', marginTop: 8, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  )
}

/* ─────────────────────────────────
   STORY BLOCKS — per feature
───────────────────────────────── */
const STORIES = {
  'Link Shortening': [
    { type: 'statement', text: 'Long URLs break layouts, kill vibes, and leak UTM data to anyone who sees them.' },
    { type: 'solution', heading: 'One paste. One click.', body: 'Drop any URL — no matter how deeply nested — into TinyHop. A clean short link appears instantly, ready to share, track, and manage.' },
    { type: 'demo', label: 'BEFORE', value: 'yoursite.com/blog/2024/how-to-grow-your-startup-with-content-marketing', outcome: 'tinyhop-url/grow24', outLabel: 'AFTER' },
    { type: 'trio', items: ['Smart deduplication', 'Custom slugs', 'Instant generation'] },
  ],
  'Real-Time Analytics': [
    { type: 'statement', text: 'Every click is a signal. Most tools bury them in dashboards you open once a quarter.' },
    { type: 'solution', heading: 'Watch clicks happen.', body: 'Your analytics dashboard updates the moment a visitor lands on your link. No refresh, no delay, no guessing.' },
    { type: 'metrics', items: [{ v: 'Live', l: 'Updates' }, { v: 'Geo', l: 'Breakdowns' }, { v: 'Device', l: 'Data' }] },
    { type: 'trio', items: ['Country & city data', 'Desktop / mobile / tablet', 'Time-series charts'] },
  ],
  'Custom Aliases': [
    { type: 'statement', text: '"tinyhop-url/xK9pQ" works. "tinyhop-url/launch24" converts. Brand is worth 3× the click-through rate.' },
    { type: 'solution', heading: 'Your name in every link.', body: 'Replace auto-generated codes with slugs that carry context, reinforce your brand, and earn more clicks — on every channel.' },
    { type: 'demo', label: 'GENERIC', value: 'tinyhop-url/xK9pQ', outcome: 'tinyhop-url/launch24', outLabel: 'BRANDED' },
    { type: 'trio', items: ['Campaign clarity', 'Instant validation', 'Print-ready links'] },
  ],
  'QR Code Generator': [
    { type: 'statement', text: 'Print is not dead. QR codes are the bridge between your physical and digital presence.' },
    { type: 'solution', heading: 'Every link gets a scannable code.', body: 'Generate beautiful, customizable QR codes for any short link in seconds. Download as PNG, embed anywhere.' },
    { type: 'metrics', items: [{ v: 'PNG', l: 'Download' }, { v: 'Custom', l: 'Colours' }, { v: 'Tracked', l: 'Scans' }] },
    { type: 'trio', items: ['Colour presets', 'Adjustable size', 'Scan analytics'] },
  ],
  'Link Expiry': [
    { type: 'statement', text: 'Flash sales end at midnight. Event registrations close on Thursday. Your links should know that.' },
    { type: 'solution', heading: 'Links that live on a schedule.', body: 'Set an exact expiry date and time. After that moment, the short URL shows a clean expired page — no dead clicks, no stale content.' },
    { type: 'demo', label: 'WHEN ACTIVE', value: 'tinyhop-url/summer-sale → yoursite.com/sale', outcome: '<span style={{display:"flex", alignItems:"center", gap:4}}><Clock size={16} color="#15141c" strokeWidth={2.5} /> Link expired gracefully</span>', outLabel: 'AFTER DEADLINE' },
    { type: 'trio', items: ['Precise to the minute', 'Custom expiry message', 'Easy extension'] },
  ],
  'Smart Routing': [
    { type: 'statement', text: 'One link. Six continents. Sixteen device types. The same destination for all of them? That is a missed opportunity.' },
    { type: 'solution', heading: 'One link, infinite destinations.', body: 'Route visitors to different pages based on their country or device. The same short link intelligently adapts for every audience.' },
    { type: 'metrics', items: [{ v: '150+', l: 'Countries' }, { v: 'Geo', l: 'Routing' }, { v: 'Device', l: 'Routing' }] },
    { type: 'trio', items: ['Country-level targeting', 'Mobile / desktop splits', 'Graceful fallback URL'] },
  ],
}

/* ─────────────────────────────────
   LAYOUT
───────────────────────────────── */
export default function FeaturePageLayout({ tag, title, subtitle, heroStat, accent = '#7c3aed' }) {
  const story = STORIES[tag] || []
  const PAD = 'max(32px, calc((100vw - 1060px)/2 + 32px))'

  return (
    <div className="lp" style={{ minHeight: '100vh' }}>
      <div className="lp-grain" />

      {/* ═══ MINI NAV ═══ */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64,
        background: 'rgba(236,234,228,0.92)', backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 max(32px, calc((100vw - 1300px)/2 + 32px))', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none' }}><Logo size="sm" tone="light" /></Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link to="/#features" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', color: 'var(--inksoft)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--inkd)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--inksoft)'}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              All features
            </Link>
            <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 20px', background: 'var(--inkd)', color: 'var(--paper)', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background=accent; e.currentTarget.style.boxShadow=`0 6px 18px ${accent}50` }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--inkd)'; e.currentTarget.style.boxShadow='none' }}>
              Get started free
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ CHAPTER 1 — CINEMATIC HERO ═══ */}
      <section style={{
        paddingTop: 120, paddingBottom: 100,
        paddingLeft: PAD, paddingRight: PAD,
        minHeight: '88vh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--line)',
      }}>
        {/* grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${accent}07 1px,transparent 1px),linear-gradient(90deg,${accent}07 1px,transparent 1px)`, backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%,black,transparent)', WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%,black,transparent)', pointerEvents: 'none' }} />
        {/* accent orb */}
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 520, height: 520, background: `radial-gradient(circle,${accent}18 0%,transparent 65%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 840 }}>
          {/* chapter label */}
          <div style={{ animation: 'fadeUp .6s var(--ease-out) .1s both', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <span className="lp-eyebrow" style={{ animation: 'none' }}>{tag}</span>
            <div style={{ height: 1, width: 48, background: accent, animation: 'none' }} />
            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', color: 'var(--inkfaint)', letterSpacing: '0.1em' }}>CHAPTER 01</span>
          </div>

          {/* Big headline — word by word */}
          <div style={{ overflow: 'hidden', marginBottom: 6 }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(3rem,7vw,6.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.93, color: 'var(--inkd)', animation: 'lineUp .9s var(--ease-out) .25s both', transform: 'translateY(0)' }}>
              {title}
            </h1>
          </div>

          {/* Subtitle */}
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1rem,1.8vw,1.2rem)', lineHeight: 1.7, color: 'var(--inksoft)', maxWidth: 580, marginTop: 28, marginBottom: 44, animation: 'fadeUp .7s var(--ease-out) .55s both' }}>
            {subtitle}
          </p>

          {/* CTA row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', animation: 'fadeUp .7s var(--ease-out) .7s both' }}>
            <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 32px', background: 'var(--inkd)', color: 'var(--paper)', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.9375rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px rgba(20,20,28,0.18)', transition: 'all .25s' }}
              onMouseEnter={e => { e.currentTarget.style.background=accent; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 14px 36px ${accent}55` }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--inkd)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 24px rgba(20,20,28,0.18)' }}>
              Start for free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
            </Link>

            {heroStat && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 24, borderLeft: `1px solid var(--line)` }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', color: accent, lineHeight: 1 }}>{heroStat.value}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{heroStat.label}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0, animation: 'fadeIn 1s ease 1.4s forwards' }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--inkfaint)' }}>Scroll to explore</span>
          <div style={{ width: 1, height: 36, background: 'var(--inkfaint)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', left: 0, width: '100%', height: '50%', background: 'var(--inkd)', animation: 'scrollDot 1.8s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══ STORY CHAPTERS ═══ */}
      {story.map((block, i) => {
        if (block.type === 'statement') return (
          <section key={i} style={{ paddingTop: 100, paddingBottom: 100, paddingLeft: PAD, paddingRight: PAD, borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper-2)', position: 'relative', overflow: 'hidden' }}>
            <Chapter delay={0}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 32 }}>
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', color: 'var(--inkfaint)', letterSpacing: '0.1em', paddingTop: 6, flexShrink: 0 }}>0{i + 2}</span>
                <DrawLine accent={accent} />
              </div>
              <blockquote style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.75rem,4vw,3.25rem)', fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.02em', lineHeight: 1.25, color: 'var(--inkd)', maxWidth: 820, borderLeft: `4px solid ${accent}`, paddingLeft: 28 }}>
                "{block.text}"
              </blockquote>
            </Chapter>
          </section>
        )

        if (block.type === 'solution') return (
          <section key={i} style={{ paddingTop: 100, paddingBottom: 100, paddingLeft: PAD, paddingRight: PAD, borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper-2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', maxWidth: 1060, margin: '0 auto' }}>
              <SlideIn from="left">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', color: 'var(--inkfaint)', letterSpacing: '0.1em' }}>THE SOLUTION</span>
                  <div style={{ height: 1, flex: 1, background: `${accent}40` }} />
                </div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3.25rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.02, color: 'var(--inkd)', marginBottom: 20 }}>
                  {block.heading}
                </h2>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.0625rem', lineHeight: 1.75, color: 'var(--inksoft)' }}>
                  {block.body}
                </p>
              </SlideIn>
              <SlideIn from="right" delay={120}>
                {/* decorative visual panel */}
                <div style={{ background: 'var(--paper-2)', border: `1px solid ${accent}25`, borderRadius: 18, padding: 32, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${accent},transparent)` }} />
                  <div style={{ display: 'flex', gap: 7, marginBottom: 20 }}>
                    {['#ef4444','#f59e0b','#22c55e'].map((c,j) => <div key={j} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                  </div>
                  <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.75rem', lineHeight: 1.8 }}>
                    <div style={{ color: 'var(--inkfaint)', marginBottom: 6 }}>// {block.heading.toLowerCase()}</div>
                    <div style={{ color: accent, fontWeight: 600 }}>TinyHop</div>
                    <div style={{ color: 'var(--inkd)', paddingLeft: 16 }}>.<span style={{ color: '#16a34a' }}>shorten</span>(<span style={{ color: '#d97706' }}>yourLongUrl</span>)</div>
                    <div style={{ color: 'var(--inkd)', paddingLeft: 16 }}>.<span style={{ color: '#16a34a' }}>track</span>()</div>
                    <div style={{ color: 'var(--inkd)', paddingLeft: 16 }}>.<span style={{ color: '#16a34a' }}>analyze</span>()</div>
                    <div style={{ color: 'var(--inkfaint)', marginTop: 10 }}>// → tinyhop-url/your-link</div>
                  </div>
                </div>
              </SlideIn>
            </div>
          </section>
        )

        if (block.type === 'demo') return (
          <section key={i} style={{ paddingTop: 100, paddingBottom: 100, paddingLeft: PAD, paddingRight: PAD, borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper-2)' }}>
            <Chapter>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', color: 'var(--inkfaint)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>See the difference</span>
              </div>
              <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Before */}
                <Chapter delay={0}>
                  <div style={{ padding: '24px 28px', background: 'var(--paper-3)', border: '1px solid var(--line)', borderRadius: '12px 12px 0 0', borderBottom: 'none' }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--inkfaint)', marginBottom: 10 }}>{block.label}</div>
                    <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.9rem', color: 'var(--inksoft)', wordBreak: 'break-all', lineHeight: 1.6 }}>{block.value}</div>
                  </div>
                </Chapter>
                {/* Arrow */}
                <Chapter delay={180}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44, background: `${accent}12`, borderLeft: '1px solid var(--line)', borderRight: '1px solid var(--line)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                  </div>
                </Chapter>
                {/* After */}
                <Chapter delay={340}>
                  <div style={{ padding: '24px 28px', background: 'var(--paper)', border: `2px solid ${accent}40`, borderRadius: '0 0 12px 12px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: 10 }}>{block.outLabel}</div>
                    <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '1.125rem', fontWeight: 700, color: accent }}>{block.outcome}</div>
                  </div>
                </Chapter>
              </div>
            </Chapter>
          </section>
        )

        if (block.type === 'metrics') return (
          <section key={i} style={{ paddingTop: 80, paddingBottom: 80, paddingLeft: PAD, paddingRight: PAD, borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper-2)' }}>
            <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
              {block.items.map((item, j) => (
                <BigNum key={j} value={item.v} label={item.l} accent={accent} delay={j * 120} />
              ))}
            </div>
          </section>
        )

        if (block.type === 'trio') return (
          <section key={i} style={{ paddingTop: 80, paddingBottom: 80, paddingLeft: PAD, paddingRight: PAD, borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--paper)' : 'var(--paper-2)' }}>
            <Chapter>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', color: 'var(--inkfaint)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>What's included</span>
              </div>
            </Chapter>
            <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
              {block.items.map((item, j) => (
                <Chapter key={j} delay={j * 100}>
                  <div style={{ padding: '24px 28px', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, position: 'relative', overflow: 'hidden', transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=`${accent}40`; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 12px 32px rgba(20,20,28,0.09)` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--line)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: accent, transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform .3s var(--ease-out)' }}
                      ref={el => { if (el) { const p = el.parentElement; p.addEventListener('mouseenter', () => el.style.transform='scaleX(1)'); p.addEventListener('mouseleave', () => el.style.transform='scaleX(0)') } }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent, marginBottom: 16, boxShadow: `0 0 10px ${accent}60` }} />
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.125rem', fontWeight: 700, color: 'var(--inkd)', letterSpacing: '-0.01em' }}>{item}</div>
                  </div>
                </Chapter>
              ))}
            </div>
          </section>
        )

        return null
      })}

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: '96px max(32px,calc((100vw - 1060px)/2 + 32px))', background: 'var(--inkd)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        {/* blobs */}
        <div style={{ position: 'absolute', top: '-30%', left: '10%', width: 400, height: 400, background: `radial-gradient(circle,${accent}35 0%,transparent 65%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40%', right: '8%', width: 360, height: 360, background: 'radial-gradient(circle,rgba(200,255,61,0.14) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
          <Chapter>
            <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>THE END — and the beginning</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4.5vw,4rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1, color: 'var(--paper)', fontStyle: 'italic', marginBottom: 20 }}>
              Ready to experience it?
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', marginBottom: 40, lineHeight: 1.7 }}>
              Free forever. No credit card. Your first link in 30 seconds.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '15px 36px', background: accent, color: '#fff', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', fontWeight: 700, textDecoration: 'none', boxShadow: `0 8px 28px ${accent}60`, transition: 'all .25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 14px 40px ${accent}80` }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=`0 8px 28px ${accent}60` }}>
                Create free account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link to="/#features" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '15px 28px', background: 'rgba(255,255,255,0.08)', color: 'var(--paper)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', fontWeight: 600, textDecoration: 'none', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)' }}>
                All features
              </Link>
            </div>
          </Chapter>
        </div>
      </section>

      <Footer />
    </div>
  )
}




