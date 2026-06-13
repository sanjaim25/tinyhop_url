import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

const V    = '#7c3aed', VD = '#6d28d9'
const INK  = '#15141c'
const LINE = 'rgba(20,20,28,0.1)'
const P2   = '#f5f3ef', P3 = '#e3e0d8'
const GRN  = '#16a34a', AMB = '#d97706', BLU = '#2563eb'
const COLS = ['#7c3aed','#16a34a','#2563eb','#d97706','#ef4444','#9f67f5','#0891b2','#f97316']

const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const fmtDT   = d => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

/* ── Skeleton ── */
function Skel({ h = 100, r = 14 }) {
  return <div style={{ height: h, borderRadius: r, background: `linear-gradient(90deg,${P3} 0%,#d8d4cc 50%,${P3} 100%)`, backgroundSize: '400px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
}

/* ── Tooltip ── */
function Tip({ active, payload, label, suffix = 'clicks' }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 10, padding: '8px 13px', boxShadow: '0 8px 24px rgba(20,20,28,0.12)', fontFamily: "'Space Grotesk',sans-serif" }}>
      <div style={{ fontSize: '0.7rem', color: '#8d8b94', marginBottom: 3 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: '0.9375rem', fontWeight: 700, color: p.color || INK }}>
          {p.value?.toLocaleString()} <span style={{ fontWeight: 400, color: '#8d8b94', fontSize: '0.7rem' }}>{p.name||suffix}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Big stat card ── */
function BigStat({ icon, label, value, sub, color, delay = 0 }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', border: `1px solid ${hov ? color + '45' : LINE}`, borderRadius: 16, padding: '20px 20px 14px', position: 'relative', overflow: 'hidden', transform: hov ? 'translateY(-3px)' : 'translateY(0)', boxShadow: hov ? `0 10px 28px rgba(20,20,28,0.09)` : '0 1px 4px rgba(20,20,28,0.05)', transition: 'all .25s cubic-bezier(0.16,1,0.3,1)', cursor: 'default', opacity: 0, animation: `fadeUp .5s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards` }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.62rem', fontWeight: 700, color: '#8d8b94', letterSpacing: '0.09em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, letterSpacing: '-0.03em', color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', color: '#8d8b94' }}>{sub}</div>}
    </div>
  )
}

/* ── Chart card ── */
function ChartCard({ title, sub, icon, children, delay = 0, right }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, padding: '20px', boxShadow: '0 4px 16px rgba(20,20,28,0.06)', opacity: 0, animation: `fadeUp .5s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.9375rem', color: INK }}>{title}</div>
            {sub && <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', color: '#8d8b94', marginTop: 2 }}>{sub}</div>}
          </div>
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

/* ── Prog bar ── */
function Prog({ pct, color }) {
  return (
    <div style={{ height: 5, background: P3, borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', background: color, borderRadius: 99, width: `${pct}%`, transition: 'width 1.1s cubic-bezier(0.16,1,0.3,1)' }} />
    </div>
  )
}

/* ════════════════════ PAGE ════════════════════ */
export default function Analytics() {
  const navigate   = useNavigate()
  const [data, setData]       = useState(null)
  const [urls, setUrls]       = useState([])
  const [loading, setLoading] = useState(true)
  const [chartRange, setChartRange] = useState('30d') // '7d' | '30d'

  useEffect(() => {
    Promise.all([
      api.get('/api/analytics/overview'),
      api.get('/api/urls')
    ]).then(([ov, ul]) => {
      setData(ov.data)
      setUrls(ul.data)
    }).catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  const total = data?.totalClicks || 0
  const chartData = chartRange === '7d'
    ? (data?.dailyData || []).slice(-7)
    : (data?.dailyData || [])

  const combinedData = chartData.map((d, i) => ({
    ...d,
    links: data?.linksData?.[data.dailyData.length - chartData.length + i]?.count || 0
  }))

  return (
    <div style={{ minHeight: '100vh', background: '#eceae4', paddingTop: 64, fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      {/* ── Sticky header ── */}
      <div style={{ position: 'sticky', top: 64, zIndex: 100, background: 'rgba(236,234,228,0.92)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '14px max(32px, calc((100vw - 1300px)/2 + 32px))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.025em', color: INK, lineHeight: 1 }}>
              Account <span style={{ color: V }}>Analytics</span>
            </h1>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.78rem', color: '#8d8b94', marginTop: 3 }}>
              {loading ? '…' : `Overall usage across all ${urls.length} links`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 18px', background: P2, color: INK, border: `1px solid ${LINE}`, borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'all .2s' }} onMouseEnter={e => { e.currentTarget.style.background = INK; e.currentTarget.style.color = '#eceae4' }} onMouseLeave={e => { e.currentTarget.style.background = P2; e.currentTarget.style.color = INK }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px max(32px, calc((100vw - 1300px)/2 + 32px)) 80px', position: 'relative', zIndex: 1 }}>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>{[0,1,2,3,4].map(i=><Skel key={i} h={110} />)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}><Skel h={280} /><Skel h={280} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}><Skel h={220} /><Skel h={220} /><Skel h={220} /></div>
          </div>
        ) : data && (
          <>
            {/* ── BIG STATS ROW ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, marginBottom: 22 }}>
              <BigStat icon="🔗" label="Total Links"      value={data.totalLinks}            color={V}    delay={0}   sub="in workspace" />
              <BigStat icon="👆" label="Total Clicks"     value={total.toLocaleString()}     color={GRN}  delay={60}  sub="all time" />
              <BigStat icon="📈" label="Avg Clicks/Link"  value={data.avgClicksPerLink}      color={AMB}  delay={120} sub="per link" />
              <BigStat icon="✅" label="Active Links"     value={data.activeLinks}           color={BLU}  delay={180} sub={`of ${data.totalLinks}`} />
              <BigStat icon="⏰" label="Expired Links"    value={data.expiredLinks}          color="#9f67f5" delay={240} sub="past deadline" />
            </div>

            {/* ── MAIN CHART + TOP LINKS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 20 }}>
              {/* Clicks + Links created over time */}
              <ChartCard title="Clicks & links created" sub="Daily trend over selected period" icon="📊" delay={80}
                right={
                  <div style={{ display: 'flex', gap: 5 }}>
                    {[{k:'7d',l:'7 days'},{k:'30d',l:'30 days'}].map(({k,l}) => (
                      <button key={k} onClick={() => setChartRange(k)} style={{ padding: '4px 11px', background: chartRange===k ? INK : P2, color: chartRange===k ? '#eceae4' : '#8d8b94', border: `1px solid ${chartRange===k ? INK : LINE}`, borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>{l}</button>
                    ))}
                  </div>
                }>
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={combinedData} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={V} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={V} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={LINE} vertical={false}/>
                    <XAxis dataKey="date" tick={{ fill: '#8d8b94', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmtDate}/>
                    <YAxis tick={{ fill: '#8d8b94', fontSize: 10 }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<Tip/>}/>
                    <Legend wrapperStyle={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', paddingTop: 8 }}/>
                    <Area type="monotone" dataKey="clicks" name="Clicks" stroke={V} strokeWidth={2.5} fill="url(#cg1)" dot={false} activeDot={{ r: 5, fill: V, stroke: '#fff', strokeWidth: 2 }}/>
                    <Bar dataKey="links" name="New links" fill={GRN} opacity={0.6} radius={[3,3,0,0]} maxBarSize={20}/>
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Top 5 links */}
              <ChartCard title="Top links" sub="Highest click count" icon="🏆" delay={100}>
                {data.topLinks?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {data.topLinks.map((l, i) => (
                      <div key={l.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/statistics/${l.id}`)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                            <span style={{ width: 20, height: 20, borderRadius: 5, background: `${COLS[i%COLS.length]}15`, border: `1px solid ${COLS[i%COLS.length]}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6rem', fontWeight: 700, color: COLS[i%COLS.length], flexShrink: 0 }}>{i+1}</span>
                            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.78rem', fontWeight: 600, color: V, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>/{l.shortCode}</span>
                          </div>
                          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8rem', fontWeight: 700, color: COLS[i%COLS.length], flexShrink: 0, marginLeft: 6 }}>{l.clicks.toLocaleString()}</span>
                        </div>
                        <Prog pct={data.topLinks[0].clicks > 0 ? (l.clicks/data.topLinks[0].clicks)*100 : 0} color={COLS[i%COLS.length]}/>
                      </div>
                    ))}
                  </div>
                ) : <div style={{ color: '#8d8b94', fontSize: '0.875rem', padding: '12px 0' }}>No clicks yet</div>}
              </ChartCard>
            </div>

            {/* ── COUNTRIES + DEVICES + BROWSERS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>

              {/* Countries */}
              <ChartCard title="Top countries" sub="All-time geo breakdown" icon="🌍" delay={160}>
                {data.byCountry?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {data.byCountry.slice(0,6).map(({country,count},i) => {
                      const pct = total ? Math.round((count/total)*100) : 0
                      return (
                        <div key={country||i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', fontWeight: 600, color: INK }}>{country||'Unknown'}</span>
                            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.7rem', color: '#8d8b94', fontWeight: 600 }}>{count.toLocaleString()} · {pct}%</span>
                          </div>
                          <Prog pct={(count/(data.byCountry[0]?.count||1))*100} color={COLS[i%COLS.length]}/>
                        </div>
                      )
                    })}
                  </div>
                ) : <div style={{ color: '#8d8b94', fontSize: '0.875rem' }}>No location data</div>}
              </ChartCard>

              {/* Device donut */}
              <ChartCard title="Device types" sub="Desktop vs mobile vs tablet" icon="📱" delay={200}>
                {data.byDevice?.length > 0 ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                      <ResponsiveContainer width={160} height={160}>
                        <PieChart>
                          <Pie data={data.byDevice.map(d=>({name:d.device,value:d.count}))} dataKey="value" cx="50%" cy="50%" innerRadius={46} outerRadius={72} paddingAngle={3} stroke="none">
                            {data.byDevice.map((_,i)=><Cell key={i} fill={COLS[(i+3)%COLS.length]}/>)}
                          </Pie>
                          <Tooltip formatter={v=>[v.toLocaleString(),'']} contentStyle={{ background:'#fff', border:`1px solid ${LINE}`, borderRadius:8, fontFamily:"'Space Grotesk',sans-serif" }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {data.byDevice.map(({device,count},i) => {
                        const pct = total ? Math.round((count/total)*100) : 0
                        const icons = { desktop:'🖥️', mobile:'📱', tablet:'📟' }
                        return (
                          <div key={device||i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <div style={{ width: 9, height: 9, borderRadius: '50%', background: COLS[(i+3)%COLS.length] }}/>
                              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.825rem', color: INK }}>{icons[device?.toLowerCase()]||'💻'} {device?device[0].toUpperCase()+device.slice(1):'Unknown'}</span>
                            </div>
                            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8rem', fontWeight: 700, color: COLS[(i+3)%COLS.length] }}>{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : <div style={{ color: '#8d8b94', fontSize: '0.875rem' }}>No device data</div>}
              </ChartCard>

              {/* Browser + Referrers */}
              <ChartCard title="Traffic sources" sub="Browsers & referrers" icon="🔗" delay={240}>
                {(data.byBrowser?.length > 0 || data.byReferer?.length > 0) ? (
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#8d8b94', marginBottom: 8 }}>Browsers</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
                      {(data.byBrowser||[]).slice(0,4).map(({browser,count},i) => {
                        const pct = total ? Math.round((count/total)*100) : 0
                        return (
                          <div key={browser||i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', fontWeight: 600, color: INK }}>{browser||'Unknown'}</span>
                              <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.7rem', color: '#8d8b94' }}>{pct}%</span>
                            </div>
                            <Prog pct={(count/(data.byBrowser[0]?.count||1))*100} color={COLS[i%COLS.length]}/>
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#8d8b94', marginBottom: 8 }}>Top Referrers</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(data.byReferer||[]).slice(0,4).map(({referer,count},i) => (
                        <div key={referer||i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{referer||'Direct'}</span>
                          <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.75rem', fontWeight: 700, color: COLS[(i+2)%COLS.length] }}>{count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <div style={{ color: '#8d8b94', fontSize: '0.875rem' }}>No source data</div>}
              </ChartCard>
            </div>

            {/* ── LINKS PERFORMANCE TABLE + RECENT ACTIVITY ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>

              {/* All links table */}
              <ChartCard title="All links performance" sub="Click breakdown across your workspace" icon="📋" delay={280}>
                {urls.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ background: P2 }}>
                          {['Link','Destination','Clicks','Created','Status'].map(h => (
                            <th key={h} style={{ padding: '9px 13px', textAlign: 'left', fontWeight: 700, color: '#8d8b94', letterSpacing: '0.07em', textTransform: 'uppercase', fontSize: '0.6rem', borderBottom: `1px solid ${LINE}`, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[...urls].sort((a,b)=>(b.clickCount||0)-(a.clickCount||0)).map((u, i) => {
                          const exp = u.expiresAt && new Date(u.expiresAt) < new Date()
                          return (
                            <tr key={u.id} style={{ borderBottom: `1px solid ${LINE}`, cursor: 'pointer', transition: 'background .15s' }}
                              onClick={() => navigate(`/statistics/${u.id}`)}
                              onMouseEnter={e => e.currentTarget.style.background = P2}
                              onMouseLeave={e => e.currentTarget.style.background = ''}>
                              <td style={{ padding: '10px 13px', whiteSpace: 'nowrap' }}>
                                <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.8rem', fontWeight: 600, color: V }}>tinyhop-url.onrender.com/{u.shortCode}</span>
                              </td>
                              <td style={{ padding: '10px 13px', maxWidth: 200 }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', color: '#8d8b94', fontSize: '0.775rem' }} title={u.originalUrl}>{u.originalUrl}</span>
                              </td>
                              <td style={{ padding: '10px 13px', whiteSpace: 'nowrap' }}>
                                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: V, fontSize: '0.9375rem' }}>{(u.clickCount||0).toLocaleString()}</span>
                              </td>
                              <td style={{ padding: '10px 13px', color: '#8d8b94', whiteSpace: 'nowrap', fontSize: '0.775rem' }}>
                                {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td style={{ padding: '10px 13px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', background: exp ? 'rgba(239,68,68,0.08)' : `${GRN}10`, color: exp ? '#ef4444' : GRN, border: `1px solid ${exp ? 'rgba(239,68,68,0.15)' : GRN+'25'}` }}>
                                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }}/>
                                  {exp ? 'Expired' : 'Active'}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : <div style={{ color: '#8d8b94', fontSize: '0.875rem', padding: '20px 0', textAlign: 'center' }}>No links yet. <Link to="/shorten" style={{ color: V, textDecoration: 'none', fontWeight: 600 }}>Create one →</Link></div>}
              </ChartCard>

              {/* Recent activity feed */}
              <ChartCard title="Recent activity" sub="Latest clicks across all links" icon="⚡" delay={300}>
                {data.recentActivity?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {data.recentActivity.map((v, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < data.recentActivity.length-1 ? `1px solid ${LINE}` : 'none' }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${COLS[i%COLS.length]}12`, border: `1px solid ${COLS[i%COLS.length]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>
                          {v.device==='mobile'?'📱':v.device==='tablet'?'📟':'🖥️'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                            <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.73rem', fontWeight: 600, color: V }}>/{v.shortCode}</span>
                            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.725rem', color: INK, fontWeight: 500 }}>{v.country||'Unknown'}</span>
                          </div>
                          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', color: '#8d8b94' }}>{v.referer||'Direct'} · {v.browser||'Unknown'}</div>
                        </div>
                        <span style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.68rem', color: '#b0adb8', flexShrink: 0 }}>{fmtDT(v.visitedAt)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{ fontSize: '1.75rem', marginBottom: 8 }}>📭</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.9rem', fontWeight: 600, color: INK }}>No activity yet</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8rem', color: '#8d8b94', marginTop: 4 }}>Share your links to start collecting data</div>
                  </div>
                )}
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  )
}




