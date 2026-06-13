import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'

function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); obs.unobserve(el) }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, v }
}

function useCounter(target, started, duration = 1800) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!started) return
    const t0 = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - t0) / duration, 1)
      setN(Math.floor((1 - Math.pow(1 - p, 4)) * target))
      if (p < 1) requestAnimationFrame(tick); else setN(target)
    }
    requestAnimationFrame(tick)
  }, [started, target, duration])
  return n
}

function R({ children, delay = 0, from = 'up', style }) {
  const { ref, v } = useReveal()
  const tx = { up: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.88)' }
  return (
    <div ref={ref} style={{
      ...style,
      opacity: v ? 1 : 0,
      transform: v ? 'none' : tx[from],
      transition: `opacity .8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform .8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

function Counter({ target, suffix = '', prefix = '' }) {
  const { ref, v } = useReveal()
  const n = useCounter(target, v)
  return <span ref={ref}>{prefix}{n.toLocaleString()}{suffix}</span>
}

/* ── mock data ── */
const dailyClicks = [
  { day: 'Mon', clicks: 840 }, { day: 'Tue', clicks: 1260 },
  { day: 'Wed', clicks: 980 }, { day: 'Thu', clicks: 1640 },
  { day: 'Fri', clicks: 2100 }, { day: 'Sat', clicks: 1380 },
  { day: 'Sun', clicks: 760 },
]
const hourlyClicks = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2,'0')}:00`,
  clicks: Math.floor(40 + Math.sin(i / 3.8) * 35 + Math.random() * 20),
}))
const countries = [
  { name: 'United States', pct: 38, clicks: 4820 },
  { name: 'United Kingdom', pct: 18, clicks: 2280 },
  { name: 'Germany',        pct: 12, clicks: 1520 },
  { name: 'India',          pct: 10, clicks: 1268 },
  { name: 'Canada',         pct: 8,  clicks: 1014 },
  { name: 'Australia',      pct: 6,  clicks: 760  },
  { name: 'Other',          pct: 8,  clicks: 1015 },
]
const devices = [
  { name: 'Mobile',  value: 54, color: '#7c3aed' },
  { name: 'Desktop', value: 38, color: '#15141c' },
  { name: 'Tablet',  value: 8,  color: '#e3e0d8' },
]
const referrers = [
  { source: 'Twitter / X', pct: 31 }, { source: 'Direct',    pct: 24 },
  { source: 'Instagram',   pct: 18 }, { source: 'LinkedIn',  pct: 14 },
  { source: 'Email',       pct: 9  }, { source: 'Other',     pct: 4  },
]
const weeklyTrend = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  clicks: Math.floor(3000 + i * 480 + Math.sin(i) * 300),
  links:  Math.floor(8 + i * 1.4),
}))

const ACCENT = '#7c3aed'
const PAD    = 'max(32px, calc((100vw - 1160px)/2 + 32px))'
const SEC    = { paddingTop: 90, paddingBottom: 90, paddingLeft: PAD, paddingRight: PAD, borderBottom: '1px solid var(--line)' }

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(20,20,28,0.12)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(20,20,28,0.12)', fontFamily: "'Space Grotesk',sans-serif" }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--inkfaint)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--inkd)', fontFamily: "'Playfair Display',serif" }}>
        {payload[0].value.toLocaleString()}
        <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--inkfaint)', marginLeft: 4 }}>clicks</span>
      </div>
    </div>
  )
}

function ChapterLabel({ n, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.6rem', color: 'var(--inkfaint)', letterSpacing: '0.12em' }}>CHAPTER {n}</span>
      <div style={{ height: 1, width: 32, background: `${ACCENT}50` }} />
      <span className="lp-eyebrow" style={{ animation: 'none', color: ACCENT, background: `${ACCENT}10`, borderColor: `${ACCENT}30` }}>{text}</span>
    </div>
  )
}

/* ── Interactive: Link Comparison ── */
const LINKS_DATA = [
  { name: 'TinyHop.link/launch24', color: '#7c3aed', data: [120,340,580,820,1100,980,1240,1060,1380,1580,1420,1680] },
  { name: 'TinyHop.link/product',  color: '#16a34a', data: [80,160,280,320,400,380,440,520,480,560,600,640] },
  { name: 'TinyHop.link/sale',     color: '#d97706', data: [40,80,200,460,880,1020,760,480,300,200,140,100] },
  { name: 'TinyHop.link/grow',     color: '#2563eb', data: [20,40,60,80,120,160,200,240,300,360,420,500] },
]
const WEEKS = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12']

function LinkComparison() {
  const [active, setActive] = useState(0)
  const chartData = WEEKS.map((w, i) => ({ week: w, clicks: LINKS_DATA[active].data[i] }))
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {LINKS_DATA.map((l, i) => (
          <button key={l.name} onClick={() => setActive(i)} style={{
            padding: '12px 16px', borderRadius: 12,
            border: `1.5px solid ${i === active ? l.color : 'var(--line)'}`,
            background: i === active ? `${l.color}10` : '#fff',
            textAlign: 'left', cursor: 'pointer', transition: 'all .2s',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.8rem', fontWeight: 600, color: i === active ? l.color : 'var(--inkd)' }}>{l.name}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', color: 'var(--inkfaint)', marginTop: 2 }}>
                {l.data.reduce((a,b) => a+b, 0).toLocaleString()} total clicks
              </div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '24px 20px', boxShadow: '0 8px 32px rgba(20,20,28,0.07)' }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'var(--inkfaint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18 }}>
          12-week — <span style={{ color: LINKS_DATA[active].color }}>{LINKS_DATA[active].name}</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="linkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={LINKS_DATA[active].color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={LINKS_DATA[active].color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,28,0.06)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: 'var(--inkfaint)', fontSize: 11, fontFamily: "'Space Grotesk',sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(20,20,28,0.12)', borderRadius: 10, fontFamily: "'Space Grotesk',sans-serif" }} formatter={v => [v.toLocaleString(), 'Clicks']} />
            <Area type="monotone" dataKey="clicks" stroke={LINKS_DATA[active].color} strokeWidth={2.5} fill="url(#linkGrad)" dot={false} activeDot={{ r: 6, fill: LINKS_DATA[active].color, stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ── Interactive: Heatmap ── */
const DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const HOURS = ['00','02','04','06','08','10','12','14','16','18','20','22']
const heatData = DAYS.map(day => ({
  day,
  cells: HOURS.map(hour => ({
    hour,
    value: Math.floor(
      (day === 'Sat' || day === 'Sun' ? 20 : 50) +
      (parseInt(hour) >= 9 && parseInt(hour) <= 20 ? 80 : 10) +
      Math.random() * 60
    )
  }))
}))

function Heatmap() {
  const [hovered, setHovered] = useState(null)
  const max = Math.max(...heatData.flatMap(d => d.cells.map(c => c.value)))
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 640 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(12,1fr)', gap: 4, marginBottom: 8 }}>
          <div />
          {HOURS.map(h => (
            <div key={h} style={{ textAlign: 'center', fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', color: 'var(--inkfaint)' }}>{h}h</div>
          ))}
        </div>
        {heatData.map(row => (
          <div key={row.day} style={{ display: 'grid', gridTemplateColumns: '50px repeat(12,1fr)', gap: 4, marginBottom: 4 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 600, color: 'var(--inksoft)', display: 'flex', alignItems: 'center' }}>{row.day}</div>
            {row.cells.map(cell => {
              const intensity = cell.value / max
              const isHov = hovered?.day === row.day && hovered?.hour === cell.hour
              return (
                <div key={cell.hour}
                  onMouseEnter={() => setHovered({ day: row.day, hour: cell.hour, value: cell.value })}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    height: 32, borderRadius: 6, cursor: 'pointer',
                    background: `rgba(124,58,237,${0.06 + intensity * 0.88})`,
                    border: `1px solid ${isHov ? ACCENT : 'transparent'}`,
                    transform: isHov ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all .15s',
                  }}
                />
              )
            })}
          </div>
        ))}
        {hovered && (
          <div style={{ marginTop: 16, padding: '10px 16px', background: '#fff', border: `1px solid ${ACCENT}30`, borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 16px rgba(20,20,28,0.1)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: 'var(--inkd)' }}>{hovered.day} at {hovered.hour}:00</span>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', fontWeight: 900, color: ACCENT }}>{hovered.value}</span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)' }}>clicks</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)' }}>Low</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[0.08, 0.25, 0.45, 0.65, 0.85].map((o, i) => (
              <div key={i} style={{ width: 20, height: 14, borderRadius: 3, background: `rgba(124,58,237,${o})` }} />
            ))}
          </div>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)' }}>High</span>
        </div>
      </div>
    </div>
  )
}

/* ── Interactive: Metric Explorer ── */
const METRIC_SETS = {
  'Clicks':   LINKS_DATA[0].data.map((v,i) => ({ week: WEEKS[i], value: v })),
  'Unique':   LINKS_DATA[0].data.map((v,i) => ({ week: WEEKS[i], value: Math.floor(v * 0.72) })),
  'CTR %':    LINKS_DATA[0].data.map((_,i) => ({ week: WEEKS[i], value: +(7 + i * 0.4 + Math.sin(i) * 1.2).toFixed(1) })),
  'Bounce %': LINKS_DATA[0].data.map((_,i) => ({ week: WEEKS[i], value: +(42 - i * 1.2 + Math.cos(i) * 3).toFixed(1) })),
}
const stackedData = WEEKS.map((w, i) => ({
  week: w,
  twitter:   Math.floor(200 + i * 40 + Math.sin(i) * 30),
  direct:    Math.floor(150 + i * 25 + Math.cos(i) * 20),
  instagram: Math.floor(100 + i * 30 + Math.sin(i + 1) * 25),
  linkedin:  Math.floor(60  + i * 15 + Math.cos(i + 2) * 15),
}))

function MetricExplorer() {
  const [metric, setMetric] = useState('Clicks')
  const [chartType, setChartType] = useState('area')
  const data = METRIC_SETS[metric]
  const isPercent = metric.includes('%')
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '28px', boxShadow: '0 8px 32px rgba(20,20,28,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.keys(METRIC_SETS).map(m => (
            <button key={m} onClick={() => setMetric(m)} style={{
              padding: '7px 16px', borderRadius: 99,
              border: `1.5px solid ${m === metric ? ACCENT : 'var(--line)'}`,
              background: m === metric ? `${ACCENT}12` : 'transparent',
              fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', fontWeight: 600,
              color: m === metric ? ACCENT : 'var(--inksoft)', cursor: 'pointer', transition: 'all .18s',
            }}>{m}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['area', 'bar', 'line'].map(t => (
            <button key={t} onClick={() => setChartType(t)} style={{
              padding: '6px 12px', borderRadius: 8,
              border: `1px solid ${t === chartType ? ACCENT : 'var(--line)'}`,
              background: t === chartType ? `${ACCENT}10` : 'transparent',
              fontFamily: "'Fragment Mono',monospace", fontSize: '0.7rem',
              color: t === chartType ? ACCENT : 'var(--inkfaint)', cursor: 'pointer', transition: 'all .15s',
            }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: ACCENT }}>
          {isPercent ? `${data[data.length - 1].value}%` : data.reduce((a,b) => a + b.value, 0).toLocaleString()}
        </span>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', color: 'var(--inkfaint)', marginLeft: 10 }}>
          {isPercent ? 'current value' : '12-week total'}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        {chartType === 'area' ? (
          <AreaChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="mGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.25} />
                <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,28,0.06)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(20,20,28,0.12)', borderRadius: 10 }} formatter={v => [isPercent ? `${v}%` : v.toLocaleString(), metric]} />
            <Area type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2.5} fill="url(#mGrad)" dot={false} activeDot={{ r: 6, fill: ACCENT, stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        ) : chartType === 'bar' ? (
          <BarChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,28,0.06)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(20,20,28,0.12)', borderRadius: 10 }} formatter={v => [isPercent ? `${v}%` : v.toLocaleString(), metric]} />
            <Bar dataKey="value" fill={ACCENT} radius={[5,5,0,0]} maxBarSize={36} />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,28,0.06)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(20,20,28,0.12)', borderRadius: 10 }} formatter={v => [isPercent ? `${v}%` : v.toLocaleString(), metric]} />
            <Line type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2.5} dot={{ fill: ACCENT, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: ACCENT, stroke: '#fff', strokeWidth: 2 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

/* ════════════════════════════════════════ MAIN PAGE ════════════════════════════════════════ */
export default function AnalyticsShowcase() {
  return (
    <div className="lp" style={{ minHeight: '100vh' }}>
      <div className="lp-grain" />

      {/* ═══ HERO ═══ */}
      <section style={{ ...SEC, borderBottom: '1px solid var(--line)', paddingTop: 130, paddingBottom: 100, minHeight: '82vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${ACCENT}07 1px,transparent 1px),linear-gradient(90deg,${ACCENT}07 1px,transparent 1px)`, backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%,black,transparent)', WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%,black,transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '5%', right: '-4%', width: 500, height: 500, background: `radial-gradient(circle,${ACCENT}15 0%,transparent 65%)`, filter: 'blur(55px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, animation: 'fadeUp .6s var(--ease-out) .1s both' }}>
            <span className="lp-eyebrow" style={{ animation: 'none' }}>Analytics</span>
            <div style={{ height: 1, width: 40, background: ACCENT }} />
            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', color: 'var(--inkfaint)', letterSpacing: '0.1em' }}>LIVE DATA STORY</span>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 6 }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(3rem,7vw,6.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.93, color: 'var(--inkd)', animation: 'lineUp .9s var(--ease-out) .25s both' }}>
              Every click.<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>Fully visible.</em>
            </h1>
          </div>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1rem,1.8vw,1.2rem)', lineHeight: 1.7, color: 'var(--inksoft)', maxWidth: 560, marginTop: 28, marginBottom: 44, animation: 'fadeUp .7s var(--ease-out) .55s both' }}>
            From the moment someone taps your link — TinyHop captures who, where, when, and how. Real-time. No waiting.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, animation: 'fadeUp .7s var(--ease-out) .7s both', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 32px', background: 'var(--inkd)', color: 'var(--paper)', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.9375rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px rgba(20,20,28,0.18)', transition: 'all .25s' }}
              onMouseEnter={e => { e.currentTarget.style.background=ACCENT; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 14px 36px ${ACCENT}55` }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--inkd)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 24px rgba(20,20,28,0.18)' }}>
              Start tracking free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
            </Link>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[{ v: '2B+', l: 'Clicks tracked' }, { v: '150+', l: 'Countries' }, { v: 'Live', l: 'Updates' }].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: ACCENT, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', color: 'var(--inkfaint)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0, animation: 'fadeIn 1s ease 1.4s forwards' }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--inkfaint)' }}>Scroll to explore</span>
          <div style={{ width: 1, height: 32, background: 'var(--inkfaint)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', width: '100%', height: '50%', background: 'var(--inkd)', animation: 'scrollDot 1.8s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══ CH1 — OVERVIEW ═══ */}
      <section style={{ ...SEC, background: 'var(--paper-2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', marginBottom: 56 }}>
          <R>
            <ChapterLabel n="01" text="Overview" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)' }}>
              The numbers behind<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>every campaign</em>
            </h2>
          </R>
          <R delay={100} from="right">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['12,677 total clicks this month', '47 active links in workspace', '23 countries reached', '269 avg clicks per link'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#fff', border: '1px solid var(--line)', borderRadius: 10, opacity: 0, animation: `fadeUp .5s var(--ease-out) ${400 + i * 100}ms forwards` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, flexShrink: 0, boxShadow: `0 0 10px ${ACCENT}60`, animation: 'glowPulse 2s ease-in-out infinite' }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 500, color: 'var(--inkd)' }}>{t}</span>
                </div>
              ))}
            </div>
          </R>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
          {[
            { v: 12677, l: 'Total Clicks',     accent: ACCENT,    delay: 0   },
            { v: 47,    l: 'Active Links',      accent: '#15141c', delay: 100 },
            { v: 269,   l: 'Avg Clicks / Link', accent: '#16a34a', delay: 200 },
            { v: 23,    l: 'Countries Reached', accent: '#d97706', delay: 300 },
          ].map(s => (
            <R key={s.l} delay={s.delay} from="scale">
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=`${s.accent}40`; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(20,20,28,0.09)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--line)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accent }} />
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.25rem,4vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, color: s.accent }}>
                  <Counter target={s.v} />
                </div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', color: 'var(--inkfaint)', marginTop: 8, fontWeight: 500 }}>{s.l}</div>
              </div>
            </R>
          ))}
        </div>
      </section>

      {/* ═══ CH2 — DAILY ═══ */}
      <section style={{ ...SEC, background: 'var(--paper)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <R from="left">
            <ChapterLabel n="02" text="Daily Performance" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)', marginBottom: 16 }}>
              Watch your traffic<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>come alive.</em>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', lineHeight: 1.75, color: 'var(--inksoft)', marginBottom: 28 }}>
              See exactly which days drive the most engagement. Spot patterns, align campaigns, and never miss a traffic spike.
            </p>
            <div style={{ display: 'flex', gap: 24 }}>
              {[{ v: '2,100', l: 'Peak day (Fri)' }, { v: '+34%', l: 'Week over week' }].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: ACCENT, letterSpacing: '-0.03em' }}>{s.v}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)', marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </R>
          <R delay={120} from="right">
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 8px 32px rgba(20,20,28,0.07)' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'var(--inkfaint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>Clicks — Last 7 days</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={dailyClicks} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,28,0.06)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Area type="monotone" dataKey="clicks" stroke={ACCENT} strokeWidth={2.5} fill="url(#aGrad)" dot={{ fill: ACCENT, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: ACCENT, stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </R>
        </div>
      </section>

      {/* ═══ CH3 — HOURLY ═══ */}
      <section style={{ ...SEC, background: 'var(--paper-2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', marginBottom: 36 }}>
          <R>
            <ChapterLabel n="03" text="Hourly Patterns" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)', marginBottom: 12 }}>
              Know exactly <em style={{ fontStyle: 'italic', color: ACCENT }}>when</em> to post.
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', lineHeight: 1.7, color: 'var(--inksoft)' }}>
              Hour-by-hour breakdowns reveal your audience's rhythm. Schedule posts for peak hours. Stop publishing into the void.
            </p>
          </R>
          <R delay={100} from="right">
            <div style={{ background: '#fff', border: `1px solid ${ACCENT}20`, borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${ACCENT},transparent)` }} />
              <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', color: 'var(--inkfaint)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Best posting windows</div>
              {[{ time: '9:00 – 11:00 AM', label: 'Morning peak', pct: 88 }, { time: '12:00 – 2:00 PM', label: 'Lunch surge', pct: 74 }, { time: '7:00 – 9:00 PM', label: 'Evening high', pct: 91 }].map((w, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, color: 'var(--inkd)' }}>{w.time}</span>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: ACCENT, fontWeight: 700 }}>{w.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--paper-3)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: ACCENT, borderRadius: 99, width: `${w.pct}%` }} />
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', color: 'var(--inkfaint)', marginTop: 3 }}>{w.label}</div>
                </div>
              ))}
            </div>
          </R>
        </div>
        <R delay={100}>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 8px 32px rgba(20,20,28,0.07)' }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'var(--inkfaint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>Clicks by hour — 24h view</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyClicks} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,28,0.06)" vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: 'var(--inkfaint)', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="clicks" radius={[4,4,0,0]} maxBarSize={18}>
                  {hourlyClicks.map((_, i) => <Cell key={i} fill={`${ACCENT}${i >= 9 && i <= 21 ? 'dd' : '55'}`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </R>
      </section>

      {/* ═══ CH4 — GEOGRAPHY ═══ */}
      <section style={{ ...SEC, background: 'var(--paper)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>
          <R from="left">
            <ChapterLabel n="04" text="Geographic Reach" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)', marginBottom: 16 }}>
              Your links travel<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>the world.</em>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', lineHeight: 1.75, color: 'var(--inksoft)', marginBottom: 32 }}>
              Country-level breakdowns show where your audience lives. Tailor campaigns and reach every market precisely.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {countries.slice(0, 6).map((c, i) => (
                <R key={c.name} delay={i * 60}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: 'var(--inkd)' }}>{c.name}</span>
                      <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.75rem', color: 'var(--inkfaint)' }}>{c.clicks.toLocaleString()} · {c.pct}%</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--paper-3)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: i === 0 ? ACCENT : `${ACCENT}${['cc','99','77','66','55','44'][i]}`, borderRadius: 99, width: `${c.pct}%` }} />
                    </div>
                  </div>
                </R>
              ))}
            </div>
          </R>
          <R delay={120} from="right">
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 8px 32px rgba(20,20,28,0.07)' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'var(--inkfaint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>Click volume by country</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={countries} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,28,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'var(--inkfaint)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'var(--inkd)', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={v => [v.toLocaleString(), 'Clicks']} contentStyle={{ background: '#fff', border: '1px solid rgba(20,20,28,0.12)', borderRadius: 10 }} />
                  <Bar dataKey="clicks" radius={[0,6,6,0]} fill={ACCENT} opacity={0.85} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </R>
        </div>
      </section>

      {/* ═══ CH5 — AUDIENCE ═══ */}
      <section style={{ ...SEC, background: 'var(--paper-2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', marginBottom: 36 }}>
          <R>
            <ChapterLabel n="05" text="Audience Insights" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)', marginBottom: 12 }}>
              Who clicks.<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>And how they found you.</em>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', lineHeight: 1.7, color: 'var(--inksoft)' }}>
              Device types tell you how to design your landing pages. Traffic sources show you where to invest.
            </p>
          </R>
          <R delay={100} from="right">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: '📱', label: 'Mobile',    value: '54%', bg: `${ACCENT}12`, border: `${ACCENT}25` },
                { icon: '🖥️', label: 'Desktop',   value: '38%', bg: 'rgba(20,20,28,0.04)', border: 'rgba(20,20,28,0.1)' },
                { icon: '🌍', label: 'Countries', value: '23',  bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.2)' },
                { icon: '🔗', label: 'Links',     value: '47',  bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '18px 14px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: 'var(--inkd)', letterSpacing: '-0.03em' }}>{s.value}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', color: 'var(--inkfaint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </R>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <R from="left">
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 8px 32px rgba(20,20,28,0.07)' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'var(--inkfaint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>Device breakdown</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={devices} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} stroke="none">
                      {devices.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip formatter={v => [`${v}%`, '']} contentStyle={{ background: '#fff', border: '1px solid rgba(20,20,28,0.12)', borderRadius: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {devices.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 500, color: 'var(--inkd)' }}>{d.name}</span>
                      </div>
                      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.125rem', fontWeight: 700, color: d.color }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </R>
          <R delay={120} from="right">
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 8px 32px rgba(20,20,28,0.07)' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'var(--inkfaint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24 }}>Traffic sources</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {referrers.map((r, i) => (
                  <div key={r.source}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: 'var(--inkd)' }}>{r.source}</span>
                      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, color: ACCENT }}>{r.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--paper-3)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: `${ACCENT}${['ee','cc','aa','88','66','44'][i]}`, borderRadius: 99, width: `${r.pct * 3}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </R>
        </div>
      </section>

      {/* ═══ CH6 — GROWTH ═══ */}
      <section style={{ ...SEC, background: 'var(--paper)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <R delay={120} from="left">
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 8px 32px rgba(20,20,28,0.07)' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'var(--inkfaint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>12-week growth trajectory</div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={weeklyTrend} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,28,0.06)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Line type="monotone" dataKey="clicks" stroke={ACCENT} strokeWidth={2.5} dot={false} activeDot={{ r: 6, fill: ACCENT, stroke: '#fff', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="links" stroke="rgba(20,20,28,0.25)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 20, height: 2, background: ACCENT, borderRadius: 1 }} /><span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)' }}>Clicks</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 20, borderTop: '2px dashed rgba(20,20,28,0.35)' }} /><span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)' }}>Links created</span></div>
              </div>
            </div>
          </R>
          <R from="right">
            <ChapterLabel n="06" text="Growth Trends" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)', marginBottom: 16 }}>
              Track momentum.<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>Prove ROI.</em>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', lineHeight: 1.75, color: 'var(--inksoft)', marginBottom: 28 }}>
              12-week rolling trends show whether your strategy is working. Compare link creation pace against click velocity.
            </p>
            <div style={{ display: 'flex', gap: 24 }}>
              {[{ v: '+340%', l: '12-week growth' }, { v: '8.4×', l: 'Clicks per link' }].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', fontWeight: 900, color: ACCENT, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </R>
        </div>
      </section>

      {/* ═══ CH7 — LIVE FEED ═══ */}
      <section style={{ ...SEC, background: 'var(--paper-2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', marginBottom: 32 }}>
          <R>
            <ChapterLabel n="07" text="Live Activity" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)', marginBottom: 12 }}>
              Real clicks.<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>Right now.</em>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', lineHeight: 1.7, color: 'var(--inksoft)' }}>
              Every visitor appears in your live stream the moment they click. Country, device, and timestamp — all captured instantly.
            </p>
          </R>
          <R delay={100} from="right">
            <div style={{ background: 'var(--inkd)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ACCENT},#22d17a)` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d17a', boxShadow: '0 0 8px rgba(34,209,122,0.6)', animation: 'glowPulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live counter</span>
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(3rem,6vw,5rem)', fontWeight: 900, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1, marginBottom: 6 }}>12,677</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>total clicks tracked today</div>
              <div style={{ display: 'flex', gap: 16 }}>
                {[{ v: '+34', l: 'last min' }, { v: '+891', l: 'last hour' }, { v: '+2.1K', l: 'today' }].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', fontWeight: 900, color: '#22d17a', letterSpacing: '-0.03em' }}>{s.v}</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </R>
        </div>
        <R delay={80}>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(20,20,28,0.07)', maxWidth: 680 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 8px rgba(22,163,74,0.6)', animation: 'glowPulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'var(--inkd)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live click stream</span>
            </div>
            {[
              { flag: '🇺🇸', country: 'San Francisco, US', device: 'iPhone 15',  browser: 'Safari',  time: 'just now', link: 'TinyHop.link/launch24' },
              { flag: '🇬🇧', country: 'London, UK',        device: 'MacBook Pro', browser: 'Chrome',  time: '2s ago',   link: 'TinyHop.link/product' },
              { flag: '🇩🇪', country: 'Berlin, DE',        device: 'Android',    browser: 'Firefox', time: '5s ago',   link: 'TinyHop.link/sale' },
              { flag: '🇮🇳', country: 'Mumbai, IN',        device: 'iPad',        browser: 'Safari',  time: '8s ago',   link: 'TinyHop.link/launch24' },
              { flag: '🇨🇦', country: 'Toronto, CA',       device: 'Windows PC', browser: 'Edge',    time: '11s ago',  link: 'TinyHop.link/grow' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < 4 ? '1px solid rgba(20,20,28,0.05)' : 'none', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--paper-2)'}
                onMouseLeave={e => e.currentTarget.style.background=''}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{row.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: 'var(--inkd)' }}>{row.country}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)', marginTop: 1 }}>{row.device} · {row.browser}</div>
                </div>
                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.75rem', color: ACCENT, flexShrink: 0 }}>{row.link}</span>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: 'var(--inkfaint)', flexShrink: 0, minWidth: 54, textAlign: 'right' }}>{row.time}</span>
              </div>
            ))}
          </div>
        </R>
      </section>

      {/* ═══ DARK INTERLUDE ═══ */}
      <div style={{ paddingTop: 40, paddingBottom: 40, paddingLeft: PAD, paddingRight: PAD, background: 'var(--inkd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        {['Compare links →', 'Explore heatmaps →', 'Break down channels →', 'Switch any metric →'].map((t, i) => (
          <span key={i} style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(0.875rem,1.5vw,1.125rem)', fontStyle: 'italic', fontWeight: 400, color: i % 2 === 0 ? 'rgba(255,255,255,0.7)' : ACCENT, whiteSpace: 'nowrap', position: 'relative', zIndex: 1 }}>{t}</span>
        ))}
      </div>

      {/* ═══ CH8 — LINK COMPARISON ═══ */}
      <section style={{ ...SEC, background: 'var(--paper)' }}>
        <R>
          <ChapterLabel n="08" text="Link Comparison" />
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)', marginBottom: 12 }}>
            Compare links<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>side by side.</em>
          </h2>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', lineHeight: 1.7, color: 'var(--inksoft)', maxWidth: 520, marginBottom: 40 }}>
            Click any link below to see its performance isolated in the chart. Switch between them instantly.
          </p>
        </R>
        <LinkComparison />
      </section>

      {/* ═══ CH9 — HEATMAP ═══ */}
      <section style={{ ...SEC, background: 'var(--paper-2)' }}>
        <R>
          <ChapterLabel n="09" text="Activity Heatmap" />
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)', marginBottom: 12 }}>
            When does your<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>audience engage?</em>
          </h2>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', lineHeight: 1.7, color: 'var(--inksoft)', maxWidth: 520, marginBottom: 40 }}>
            A 7×12 heatmap shows click density by day and hour. Hover any cell to see the exact count.
          </p>
        </R>
        <Heatmap />
      </section>

      {/* ═══ CH10 — STACKED BAR ═══ */}
      <section style={{ ...SEC, background: 'var(--paper)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <R from="left">
            <ChapterLabel n="10" text="Channel Breakdown" />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)', marginBottom: 16 }}>
              All your channels.<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>One view.</em>
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', lineHeight: 1.75, color: 'var(--inksoft)', marginBottom: 24 }}>
              See how traffic splits across channels each week. Identify which sources are growing and which need attention.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {[{ c: ACCENT, l: 'Twitter' }, { c: '#15141c', l: 'Direct' }, { c: '#16a34a', l: 'Instagram' }, { c: '#d97706', l: 'LinkedIn' }].map(s => (
                <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: s.c }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', color: 'var(--inksoft)' }}>{s.l}</span>
                </div>
              ))}
            </div>
          </R>
          <R delay={120} from="right">
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 8px 32px rgba(20,20,28,0.07)' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'var(--inkfaint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>Weekly traffic by source</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stackedData} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,28,0.06)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--inkfaint)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(20,20,28,0.12)', borderRadius: 10 }} />
                  <Bar dataKey="twitter"   stackId="a" fill={ACCENT}    name="Twitter" />
                  <Bar dataKey="direct"    stackId="a" fill="#15141c"   name="Direct" />
                  <Bar dataKey="instagram" stackId="a" fill="#16a34a"   name="Instagram" />
                  <Bar dataKey="linkedin"  stackId="a" fill="#d97706"   name="LinkedIn" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </R>
        </div>
      </section>

      {/* ═══ CH11 — METRIC EXPLORER ═══ */}
      <section style={{ ...SEC, background: 'var(--paper-2)' }}>
        <R>
          <ChapterLabel n="11" text="Metric Explorer" />
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--inkd)', marginBottom: 12 }}>
            Explore any metric.<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>Your way.</em>
          </h2>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', lineHeight: 1.7, color: 'var(--inksoft)', maxWidth: 520, marginBottom: 40 }}>
            Toggle between metrics to understand your data at a deeper level. Switch between Area, Bar, and Line views.
          </p>
        </R>
        <MetricExplorer />
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: '100px max(32px,calc((100vw - 1160px)/2 + 32px))', background: 'var(--inkd)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-25%', left: '12%', width: 420, height: 420, background: `radial-gradient(circle,${ACCENT}35 0%,transparent 65%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-35%', right: '10%', width: 360, height: 360, background: 'radial-gradient(circle,rgba(200,255,61,0.15) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
          <R>
            <div style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>All analytics. Free to start.</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.25rem,5vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.97, color: 'var(--paper)', fontStyle: 'italic', marginBottom: 20 }}>
              Ready to see<br />your data?
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', marginBottom: 40, lineHeight: 1.7 }}>
              Create your first link in 30 seconds. Analytics start immediately.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '15px 36px', background: ACCENT, color: '#fff', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', fontWeight: 700, textDecoration: 'none', boxShadow: `0 8px 28px ${ACCENT}55`, transition: 'all .25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 14px 40px ${ACCENT}70` }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=`0 8px 28px ${ACCENT}55` }}>
                Start tracking free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link to="/#features" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '15px 28px', background: 'rgba(255,255,255,0.08)', color: 'var(--paper)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '1rem', fontWeight: 600, textDecoration: 'none', transition: 'background .2s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}>
                All features
              </Link>
            </div>
          </R>
        </div>
      </section>

      <Footer />
    </div>
  )
}




