import { Clock, Smartphone, TrendingUp, Zap, BarChart2, Globe, Monitor, Tablet, Inbox, Paperclip, Package, Link as LinkIcon, Search, Calendar, CheckCircle } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import QRModal from '../components/QRModal'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts'

const V = '#7c3aed', VD = '#6d28d9', INK = '#15141c'
const LINE = 'rgba(20,20,28,0.1)', P2 = '#f5f3ef', P3 = '#e3e0d8'
const GRN = '#16a34a', AMB = '#d97706', BLU = '#2563eb'
const COLS = ['#7c3aed','#16a34a','#2563eb','#d97706','#ef4444','#9f67f5','#0891b2','#f97316']
const base  = () => import.meta.env.VITE_API_URL || 'http://localhost:5000'
const domain = u => { try { return new URL(u).hostname } catch { return u } }
const fmtD  = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const fmtDT = d => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

function Skel({ w = '100%', h = 13, r = 6 }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: `linear-gradient(90deg,${P3} 0%,#d8d4cc 50%,${P3} 100%)`, backgroundSize: '400px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
}

function Spark({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sg${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={() => null} />
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#sg${color.replace('#', '')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function StatCard({ label, value, sub, color, spark, delay = 0, icon }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: '#fff', border: `1px solid ${hov ? color + '45' : LINE}`, borderRadius: 16,
      padding: '20px 20px 12px', position: 'relative', overflow: 'hidden',
      transform: hov ? 'translateY(-3px)' : 'translateY(0)',
      boxShadow: hov ? `0 10px 28px rgba(20,20,28,0.09)` : '0 1px 4px rgba(20,20,28,0.05)',
      transition: 'all .25s cubic-bezier(0.16,1,0.3,1)', cursor: 'default',
      opacity: 0, animation: `fadeUp .5s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards`,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.65rem', fontWeight: 700, color: '#8d8b94', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 900, letterSpacing: '-0.04em', color, lineHeight: 1, marginBottom: 3 }}>{value}</div>
      {sub && <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', color: '#8d8b94', marginBottom: 6 }}>{sub}</div>}
      {spark && <Spark data={spark} color={color} />}
    </div>
  )
}

function CopyBtn({ text, sm }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); toast.success('Copied!'); setCopied(true); setTimeout(() => setCopied(false), 2200) }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: sm ? '5px 11px' : '7px 16px', background: copied ? GRN : V, color: '#fff', border: 'none', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: sm ? '0.7rem' : '0.8125rem', fontWeight: 700, cursor: 'pointer', transition: 'all .2s', flexShrink: 0, boxShadow: copied ? `0 3px 10px ${GRN}45` : `0 3px 10px ${V}35` }}>
      {copied
        ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

/* ══════════════════════════════════
   STATISTICS MODAL (pops like QR)
══════════════════════════════════ */
function StatsPanel({ url, onClose }) {
  const [data, setData]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]     = useState('overview')
  const [chartType, setChartType] = useState('area')
  const short = `${base()}/${url.shortCode}`
  const expired = url.expiresAt && new Date(url.expiresAt) < new Date()

  useEffect(() => {
    setLoading(true); setData(null); setTab('overview')
    api.get(`/api/analytics/${url.id}`)
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load statistics'))
      .finally(() => setLoading(false))
  }, [url.id])

  const total  = data?.totalClicks || 0
  const last7  = data?.dailyData?.reduce((s,d)=>s+d.clicks,0)||0
  const peak   = data?.dailyData ? Math.max(...data.dailyData.map(d=>d.clicks),0) : 0

  const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background:'#fff', border:`1px solid ${LINE}`, borderRadius:10, padding:'8px 12px', boxShadow:'0 8px 24px rgba(20,20,28,0.12)', fontFamily:"'Space Grotesk',sans-serif" }}>
        <div style={{ fontSize:'0.7rem', color:'#8d8b94', marginBottom:3 }}>{label}</div>
        <div style={{ fontSize:'0.9375rem', fontWeight:700, color:INK, fontFamily:"'Playfair Display',serif" }}>
          {payload[0].value.toLocaleString()} <span style={{ fontWeight:400, color:'#8d8b94', fontSize:'0.7rem' }}>clicks</span>
        </div>
      </div>
    )
  }

  const Prog = ({ pct, color }) => (
    <div style={{ height:4, background:P3, borderRadius:99, overflow:'hidden' }}>
      <div style={{ height:'100%', background:color, borderRadius:99, width:`${pct}%`, transition:'width 1s cubic-bezier(0.16,1,0.3,1)' }}/>
    </div>
  )

  const TABS = [
    { key:'overview', label:'Overview',  icon:<BarChart2 size={16} color="#15141c" strokeWidth={2.5} /> },
    { key:'visits',   label:'Visits',    icon:<Clock size={16} color="#15141c" strokeWidth={2.5} /> },
    { key:'geo',      label:'Geography', icon:<Globe size={16} color="#15141c" strokeWidth={2.5} /> },
    { key:'devices',  label:'Devices',   icon:<Smartphone size={16} color="#15141c" strokeWidth={2.5} /> },
  ]

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(20,20,28,0.52)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', animation:'fadeIn .2s ease both' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'#eceae4', border:`1px solid ${LINE}`, borderRadius:22, width:'100%', maxWidth:680, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(20,20,28,0.22)', animation:'scaleSpring .3s cubic-bezier(0.34,1.56,0.64,1) both', position:'relative' }}>
      {/* Panel header */}
      <div style={{ background:`linear-gradient(135deg,${V}08,${GRN}06)`, borderBottom:`1px solid ${V}15`, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, position:'sticky', top:0, zIndex:10, borderRadius:'22px 22px 0 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`${V}15`, border:`1px solid ${V}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={V} strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:900, letterSpacing:'-0.02em', color:INK }}>
              <em style={{ fontStyle:'italic', color:V }}>Statistics</em>
              <span style={{ fontFamily:"'Fragment Mono',monospace", fontSize:'0.8rem', color:'#8d8b94', marginLeft:8 }}>tinyhop-url/{url.shortCode}</span>
            </div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.72rem', color:'#8d8b94', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:320 }}>{url.originalUrl}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <a href={short} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 14px', background:P2, color:INK, border:`1px solid ${LINE}`, borderRadius:99, fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8rem', fontWeight:600, textDecoration:'none', transition:'all .15s' }} onMouseEnter={e=>{e.currentTarget.style.background=INK;e.currentTarget.style.color='#eceae4'}} onMouseLeave={e=>{e.currentTarget.style.background=P2;e.currentTarget.style.color=INK}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Open
          </a>
          <CopyBtn text={short} sm />
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${LINE}`, background:P2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#8d8b94', transition:'all .15s' }} onMouseEnter={e=>{e.currentTarget.style.background=INK;e.currentTarget.style.color='#eceae4'}} onMouseLeave={e=>{e.currentTarget.style.background=P2;e.currentTarget.style.color='#8d8b94'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:0, borderBottom:`1px solid ${LINE}`, background:P2 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'10px 16px', border:'none', borderBottom:`2px solid ${tab===t.key?V:'transparent'}`, background:'transparent', fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8rem', fontWeight:tab===t.key?700:500, color:tab===t.key?V:'#8d8b94', cursor:'pointer', transition:'all .15s', whiteSpace:'nowrap' }} onMouseEnter={e=>{if(tab!==t.key){e.currentTarget.style.color=INK;e.currentTarget.style.background='rgba(20,20,28,0.04)'}}} onMouseLeave={e=>{if(tab!==t.key){e.currentTarget.style.color='#8d8b94';e.currentTarget.style.background='transparent'}}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Panel body */}
      <div style={{ padding:'20px' }}>
        {loading && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', gap:12 }}>{[0,1,2,3,4].map(i=><div key={i} style={{ flex:1, height:80, borderRadius:12, background:`linear-gradient(90deg,${P3} 0%,#d8d4cc 50%,${P3} 100%)`, backgroundSize:'400px 100%', animation:'shimmer 1.4s ease-in-out infinite' }}/>)}</div>
            <div style={{ height:180, borderRadius:14, background:`linear-gradient(90deg,${P3} 0%,#d8d4cc 50%,${P3} 100%)`, backgroundSize:'400px 100%', animation:'shimmer 1.4s ease-in-out infinite' }}/>
          </div>
        )}

        {data && !loading && (
          <>
            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {/* Meta row */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
                  {[
                    { label:'Status',      value: expired? <span style={{display:"flex", alignItems:"center", gap:4}}><Clock size={14} color="#15141c" strokeWidth={2.5} /> Expired</span> : <span style={{display:"flex", alignItems:"center", gap:4}}><CheckCircle size={14} color="#15141c" strokeWidth={2.5} /> Active</span>, color: expired?'#ef4444':GRN },
                    { label:'Total Clicks',value: total.toLocaleString(),           color: V },
                    { label:'Last 7 Days', value: last7.toLocaleString(),           color: GRN },
                    { label:'Peak Day',    value: peak.toLocaleString(),            color: '#9f67f5' },
                    { label:'Countries',   value: String(data.byCountry?.length||0), color: AMB },
                    { label:'Last Visit',  value: data.lastVisited ? fmtDT(data.lastVisited) : 'No visits', color: INK },
                  ].map((m,i) => (
                    <div key={m.label} style={{ background:P2, border:`1px solid ${LINE}`, borderRadius:12, padding:'12px 14px', position:'relative', overflow:'hidden', opacity:0, animation:`fadeUp .4s cubic-bezier(0.16,1,0.3,1) ${i*40}ms forwards` }}>
                      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:m.color }} />
                      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.09em', textTransform:'uppercase', color:'#8d8b94', marginBottom:5 }}>{m.label}</div>
                      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1rem', fontWeight:700, letterSpacing:'-0.01em', color:m.color, lineHeight:1 }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div style={{ background:P2, border:`1px solid ${LINE}`, borderRadius:14, padding:'16px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                    <div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:'0.9375rem', color:INK }}>Clicks over time</div>
                      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.7rem', color:'#8d8b94', marginTop:2 }}>Last 7 days</div>
                    </div>
                    <div style={{ display:'flex', gap:5 }}>
                      {[{k:'area',l:'Area'},{k:'bar',l:'Bar'}].map(({k,l}) => (
                        <button key={k} onClick={()=>setChartType(k)} style={{ padding:'4px 10px', background:chartType===k?INK:P3, color:chartType===k?'#eceae4':'#8d8b94', border:`1px solid ${chartType===k?INK:LINE}`, borderRadius:7, fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.7rem', fontWeight:600, cursor:'pointer', transition:'all .15s' }}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    {chartType==='area' ? (
                      <AreaChart data={data.dailyData||[]} margin={{top:4,right:6,bottom:0,left:-24}}>
                        <defs><linearGradient id="spg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={V} stopOpacity={0.25}/><stop offset="95%" stopColor={V} stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={LINE} vertical={false}/>
                        <XAxis dataKey="date" tick={{fill:'#8d8b94',fontSize:10}} axisLine={false} tickLine={false}/>
                        <YAxis allowDecimals={false} tick={{fill:'#8d8b94',fontSize:10}} axisLine={false} tickLine={false}/>
                        <Tooltip content={<Tip/>}/>
                        <Area type="monotone" dataKey="clicks" stroke={V} strokeWidth={2.5} fill="url(#spg)" dot={{fill:V,r:3,strokeWidth:0}} activeDot={{r:5,fill:V,stroke:'#fff',strokeWidth:2}}/>
                      </AreaChart>
                    ) : (
                      <BarChart data={data.dailyData||[]} margin={{top:4,right:6,bottom:0,left:-24}}>
                        <CartesianGrid strokeDasharray="3 3" stroke={LINE} vertical={false}/>
                        <XAxis dataKey="date" tick={{fill:'#8d8b94',fontSize:10}} axisLine={false} tickLine={false}/>
                        <YAxis allowDecimals={false} tick={{fill:'#8d8b94',fontSize:10}} axisLine={false} tickLine={false}/>
                        <Tooltip content={<Tip/>}/>
                        <Bar dataKey="clicks" radius={[4,4,0,0]} maxBarSize={36}>
                          {(data.dailyData||[]).map((_,i)=><Cell key={i} fill={i%2===0?V:'#9f67f5'}/>)}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Countries + Devices 2-col */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div style={{ background:P2, border:`1px solid ${LINE}`, borderRadius:14, padding:'14px' }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:'0.9375rem', color:INK, marginBottom:12 }}>Top countries</div>
                    {data.byCountry?.length > 0 ? (
                      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        {data.byCountry.slice(0,5).map(({country,count},i) => {
                          const max = data.byCountry[0]?.count||1
                          const pct = total ? Math.round((count/total)*100) : 0
                          return (
                            <div key={country||i}>
                              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                                <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8125rem', fontWeight:600, color:INK }}>{country||'Unknown'}</span>
                                <span style={{ fontFamily:"'Fragment Mono',monospace", fontSize:'0.7rem', color:'#8d8b94', fontWeight:600 }}>{count} · {pct}%</span>
                              </div>
                              <Prog pct={(count/max)*100} color={COLS[i%COLS.length]}/>
                            </div>
                          )
                        })}
                      </div>
                    ) : <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8rem', color:'#8d8b94' }}>No data yet</div>}
                  </div>
                  <div style={{ background:P2, border:`1px solid ${LINE}`, borderRadius:14, padding:'14px' }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:'0.9375rem', color:INK, marginBottom:12 }}>Devices</div>
                    {data.byDevice?.length > 0 ? (
                      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        {data.byDevice.map(({device,count},i) => {
                          const pct = total ? Math.round((count/total)*100) : 0
                          const icons = {desktop:<Monitor size={16} color="#15141c" strokeWidth={2.5} />,mobile:<Smartphone size={16} color="#15141c" strokeWidth={2.5} />,tablet:<Tablet size={16} color="#15141c" strokeWidth={2.5} />}
                          return (
                            <div key={device||i}>
                              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                                <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8125rem', fontWeight:600, color:INK, display:'flex', alignItems:'center', gap:5 }}>
                                  {icons[device?.toLowerCase()]||<Monitor size={16} color="#15141c" strokeWidth={2.5} />} {device?device[0].toUpperCase()+device.slice(1):'Unknown'}
                                </span>
                                <span style={{ fontFamily:"'Fragment Mono',monospace", fontSize:'0.7rem', color:'#8d8b94', fontWeight:600 }}>{count} · {pct}%</span>
                              </div>
                              <Prog pct={pct} color={COLS[(i+3)%COLS.length]}/>
                            </div>
                          )
                        })}
                      </div>
                    ) : <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8rem', color:'#8d8b94' }}>No data yet</div>}
                  </div>
                </div>
              </div>
            )}

            {/* ── VISITS ── */}
            {tab === 'visits' && (
              <div style={{ overflowX:'auto' }}>
                {data.recentVisits?.length > 0 ? (
                  <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8rem' }}>
                    <thead>
                      <tr style={{ background:P2 }}>
                        {['#','Time','Country','Device','Browser','Referrer'].map(h => (
                          <th key={h} style={{ padding:'9px 13px', textAlign:'left', fontWeight:700, color:'#8d8b94', letterSpacing:'0.07em', textTransform:'uppercase', fontSize:'0.6rem', borderBottom:`1px solid ${LINE}`, whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentVisits.map((v,i) => (
                        <tr key={v.id||i} style={{ borderBottom:`1px solid ${LINE}`, transition:'background .15s' }} onMouseEnter={e=>e.currentTarget.style.background=P2} onMouseLeave={e=>e.currentTarget.style.background=''}>
                          <td style={{ padding:'9px 13px', color:'#8d8b94', fontFamily:"'Fragment Mono',monospace", fontSize:'0.7rem' }}>#{i+1}</td>
                          <td style={{ padding:'9px 13px', whiteSpace:'nowrap', fontFamily:"'Fragment Mono',monospace", fontSize:'0.72rem', color:INK }}>{fmtDT(v.createdAt||v.visitedAt)}</td>
                          <td style={{ padding:'9px 13px', whiteSpace:'nowrap' }}>
                            <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 7px', borderRadius:99, background:`${COLS[i%COLS.length]}10`, border:`1px solid ${COLS[i%COLS.length]}22`, fontSize:'0.72rem', fontWeight:600, color:COLS[i%COLS.length] }}>{v.country||'Unknown'}</span>
                          </td>
                          <td style={{ padding:'9px 13px', color:INK, fontWeight:500 }}>
                            <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                              {v.device==="mobile"?<Smartphone size={14} color="#15141c" strokeWidth={2.5} />:v.device==="tablet"?<Tablet size={14} color="#15141c" strokeWidth={2.5} />:<Monitor size={14} color="#15141c" strokeWidth={2.5} />}
                              {v.device?v.device[0].toUpperCase()+v.device.slice(1):'Unknown'}
                            </span>
                          </td>
                          <td style={{ padding:'9px 13px', color:'#8d8b94' }}>{v.browser||'Unknown'}</td>
                          <td style={{ padding:'9px 13px' }}>
                            <span style={{ padding:'2px 7px', background:P2, borderRadius:6, fontSize:'0.7rem', fontFamily:"'Fragment Mono',monospace", color:V, fontWeight:600 }}>{v.referer||'Direct'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign:'center', padding:'32px', color:'#8d8b94', fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.9rem' }}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><Inbox size={24} color="#15141c" strokeWidth={2.5} />No visits recorded yet</div>
                  </div>
                )}
              </div>
            )}

            {/* ── GEO ── */}
            {tab === 'geo' && (
              data.byCountry?.length > 0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {data.byCountry.map(({country,count},i) => {
                    const max = data.byCountry[0]?.count||1
                    const pct = total ? Math.round((count/total)*100) : 0
                    return (
                      <div key={country||i} style={{ opacity:0, animation:`fadeUp .4s cubic-bezier(0.16,1,0.3,1) ${i*35}ms forwards` }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:24, height:24, borderRadius:6, background:`${COLS[i%COLS.length]}15`, border:`1px solid ${COLS[i%COLS.length]}22`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.6rem', fontWeight:700, color:COLS[i%COLS.length] }}>{i+1}</div>
                            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.9rem', fontWeight:600, color:INK }}>{country||'Unknown'}</span>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.125rem', fontWeight:900, color:COLS[i%COLS.length], letterSpacing:'-0.03em' }}>{count.toLocaleString()}</span>
                            <span style={{ padding:'2px 7px', background:`${COLS[i%COLS.length]}10`, border:`1px solid ${COLS[i%COLS.length]}22`, borderRadius:99, fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.68rem', fontWeight:700, color:COLS[i%COLS.length] }}>{pct}%</span>
                          </div>
                        </div>
                        <div style={{ height:5, background:P3, borderRadius:99, overflow:'hidden' }}>
                          <div style={{ height:'100%', background:COLS[i%COLS.length], borderRadius:99, width:`${(count/max)*100}%`, transition:'width 1s cubic-bezier(0.16,1,0.3,1)' }}/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : <div style={{ textAlign:'center', padding:'32px', color:'#8d8b94', fontFamily:"'Space Grotesk',sans-serif" }}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><Globe size={24} color="#15141c" strokeWidth={2.5} />No location data yet</div></div>
            )}

            {/* ── DEVICES ── */}
            {tab === 'devices' && (
              data.byDevice?.length > 0 ? (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, alignItems:'center' }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={data.byDevice.map(d=>({name:d.device,value:d.count}))} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                        {data.byDevice.map((_,i)=><Cell key={i} fill={COLS[(i+3)%COLS.length]}/>)}
                      </Pie>
                      <Tooltip formatter={v=>[v.toLocaleString(),'']} contentStyle={{ background:'#fff', border:`1px solid ${LINE}`, borderRadius:8, fontFamily:"'Space Grotesk',sans-serif" }}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {data.byDevice.map(({device,count},i) => {
                      const pct = total ? Math.round((count/total)*100) : 0
                      const icons = {desktop:<Monitor size={16} color="#15141c" strokeWidth={2.5} />,mobile:<Smartphone size={16} color="#15141c" strokeWidth={2.5} />,tablet:<Tablet size={16} color="#15141c" strokeWidth={2.5} />}
                      return (
                        <div key={device||i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ width:10, height:10, borderRadius:'50%', background:COLS[(i+3)%COLS.length] }}/>
                            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.875rem', fontWeight:500, color:INK }}>
                              {icons[device?.toLowerCase()]||<Monitor size={16} color="#15141c" strokeWidth={2.5} />} {device?device[0].toUpperCase()+device.slice(1):'Unknown'}
                            </span>
                          </div>
                          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:900, color:COLS[(i+3)%COLS.length] }}>{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : <div style={{ textAlign:'center', padding:'32px', color:'#8d8b94', fontFamily:"'Space Grotesk',sans-serif" }}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><Smartphone size={24} color="#15141c" strokeWidth={2.5} />No device data yet</div></div>
            )}

            {/* zero state */}
            {data.totalClicks === 0 && tab==='overview' && (
              <div style={{ textAlign:'center', padding:'32px', fontFamily:"'Space Grotesk',sans-serif" }}>
                <div style={{display:"flex", justifyContent:"center", marginBottom:10}}><Inbox size={32} color="#15141c" strokeWidth={2.5} /></div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:700, color:INK, marginBottom:6 }}>No clicks yet</div>
                <div style={{ fontSize:'0.875rem', color:'#8d8b94' }}>Share your link to start collecting data.</div>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  )
}

function UrlRow({ url, index, onDelete, onCopy, onEdit, onQR, onAnalytics }) {
  const [hov, setHov] = useState(false)
  const [copied, setCopied] = useState(false)
  const [statHov, setStatHov] = useState(false)
  const [tipBtn, setTipBtn] = useState(null) // 'copy'|'qr'|'stats'|'delete'
  const short = `${base()}/${url.shortCode}`
  const expired = url.expiresAt && new Date(url.expiresAt) < new Date()
  const clicks = url.clickCount || 0
  const handleCopy = () => { onCopy(url); setCopied(true); setTimeout(() => setCopied(false), 2200) }

  const Btn = ({ id, onClick, title, danger, onMouseEnter: onME, onMouseLeave: onML, children }) => (
    <button id={id} onClick={onClick} title={title}
      style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${danger ? 'transparent' : LINE}`, background: 'transparent', color: '#8d8b94', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .15s', flexShrink: 0 }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.09)' : P2; e.currentTarget.style.color = danger ? '#ef4444' : INK; e.currentTarget.style.borderColor = danger ? 'rgba(239,68,68,0.2)' : LINE; onME && onME() }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8d8b94'; e.currentTarget.style.borderColor = danger ? 'transparent' : LINE; onML && onML() }}>
      {children}
    </button>
  )

  return (
    <div id={`url-card-${url.id}`} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? '#fff' : P2, border: `1px solid ${hov ? V + '30' : LINE}`, borderLeft: `3px solid ${hov ? V : 'transparent'}`, borderRadius: 13, padding: '13px 16px', transition: 'all .2s cubic-bezier(0.16,1,0.3,1)', transform: hov ? 'translateY(-1px)' : 'translateY(0)', boxShadow: hov ? '0 5px 18px rgba(20,20,28,0.07)' : 'none', opacity: 0, animation: `fadeUp .4s cubic-bezier(0.16,1,0.3,1) ${index * 40}ms forwards` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 9 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, overflow: 'hidden', background: P3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${LINE}` }}>
              <img src={`https://www.google.com/s2/favicons?domain=${domain(url.originalUrl)}&sz=32`} alt="" width={11} height={11} onError={e => { e.target.style.display = 'none' }} />
            </div>
            <a href={short} target="_blank" rel="noopener noreferrer" id={`url-short-link-${url.id}`}
              style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.875rem', fontWeight: 600, color: V, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = VD} onMouseLeave={e => e.currentTarget.style.color = V}>
              tinyhop-url/{url.shortCode}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </a>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 99, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', background: expired ? 'rgba(239,68,68,0.08)' : `${GRN}10`, color: expired ? '#ef4444' : GRN, border: `1px solid ${expired ? 'rgba(239,68,68,0.15)' : GRN + '25'}` }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
              {expired ? 'Expired' : 'Active'}
            </span>
          </div>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.775rem', color: '#8d8b94', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 420 }}>{url.originalUrl}</p>
        </div>
        <div style={{ display: 'flex', gap: 3, flexShrink: 0, opacity: hov ? 1 : 0.35, transition: 'opacity .2s' }}>
          {/* Reusable tooltip wrapper */}
          {[
            {
              id: `url-copy-${url.id}`, key: 'copy', label: copied ? 'Copied!' : 'Copy',
              onClick: handleCopy,
              icon: copied
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GRN} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>,
              danger: false,
            },
            {
              id: `url-qr-${url.id}`, key: 'qr', label: 'QR Code',
              onClick: () => onQR(url),
              icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" /><rect x="18" y="18" width="3" height="3" /></svg>,
              danger: false,
            },
            {
              id: `url-delete-${url.id}`, key: 'delete', label: 'Delete',
              onClick: () => onDelete(url.id),
              icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>,
              danger: true,
            },
          ].map(({ id, key, label, onClick, icon, danger }) => (
            <div key={key} style={{ position: 'relative' }}>
              <button
                id={id}
                onClick={onClick}
                onMouseEnter={e => {
                  setTipBtn(key)
                  e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.09)' : P2
                  e.currentTarget.style.color = danger ? '#ef4444' : V
                  e.currentTarget.style.borderColor = danger ? 'rgba(239,68,68,0.2)' : `${V}40`
                }}
                onMouseLeave={e => {
                  setTipBtn(null)
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#6d28d9'
                  e.currentTarget.style.borderColor = danger ? 'transparent' : LINE
                }}
                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${danger ? 'transparent' : LINE}`, background: 'transparent', color: '#6d28d9', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .15s', flexShrink: 0 }}
              >
                {icon}
              </button>
              {/* Floating tooltip */}
              {tipBtn === key && (
                <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: INK, color: '#eceae4', padding: '5px 10px', borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 20, boxShadow: '0 4px 14px rgba(20,20,28,0.22)', animation: 'fadeIn .12s ease both', letterSpacing: '0.01em' }}>
                  {label}
                  <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${INK}` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 8, borderTop: `1px solid ${LINE}`, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={V} strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          <strong style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.9375rem', fontWeight: 900, color: V }}>{clicks.toLocaleString()}</strong>
          <span style={{ color: '#8d8b94' }}>click{clicks !== 1 ? 's' : ''}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: '#8d8b94' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          {fmtD(url.createdAt)}
        </span>
        {url.expiresAt ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.75rem', color: expired ? '#ef4444' : AMB }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            {expired ? 'Expired' : 'Expires'} {fmtD(url.expiresAt)}
          </span>
        ) : (
          <button
            onClick={() => onEdit && onEdit(url)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: `${AMB}08`, border: `1px solid ${AMB}20`, borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.7rem', fontWeight: 600, color: AMB, cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${AMB}15`; e.currentTarget.style.borderColor = `${AMB}35` }}
            onMouseLeave={e => { e.currentTarget.style.background = `${AMB}08`; e.currentTarget.style.borderColor = `${AMB}20` }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            Set Expiry
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontFamily: "'Fragment Mono',monospace", fontSize: '0.68rem', color: '#b0adb8' }}>{domain(url.originalUrl)}</span>
        <button
          id={`url-analytics-${url.id}`}
          onClick={onAnalytics}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', background: `${V}10`, border: `1px solid ${V}28`, borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.72rem', fontWeight: 700, color: V, cursor: 'pointer', transition: 'all .2s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = V; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = V; e.currentTarget.style.boxShadow = `0 3px 10px ${V}40` }}
          onMouseLeave={e => { e.currentTarget.style.background = `${V}10`; e.currentTarget.style.color = V; e.currentTarget.style.borderColor = `${V}28`; e.currentTarget.style.boxShadow = '' }}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          View Statistics
        </button>
      </div>
    </div>
  )
}

function CreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ originalUrl: '', customCode: '', expiresAt: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  useEffect(() => { inputRef.current?.focus() }, [])
  const IS = { width: '100%', padding: '11px 13px', background: P2, border: `1.5px solid ${LINE}`, borderBottom: `2px solid ${INK}`, borderRadius: 0, color: INK, fontSize: '0.9375rem', fontFamily: "'Space Grotesk',sans-serif", outline: 'none', transition: 'border-bottom-color .2s', boxSizing: 'border-box' }
  const submit = async (e) => {
    e.preventDefault()
    if (!form.originalUrl.trim()) { setError('Please enter a URL'); return }
    if (form.customCode.trim() && form.customCode.trim().length < 3) {
      setError('Alias must be at least 3 characters')
      toast.error('Alias must be at least 3 characters')
      return
    }
    setError(''); setLoading(true)
    try {
      const payload = { originalUrl: form.originalUrl }
      if (form.customCode.trim()) payload.customCode = form.customCode.trim()
      if (form.expiresAt) payload.expiresAt = new Date(form.expiresAt).toISOString()
      if (form.password.trim()) payload.password = form.password.trim()
      const res = await api.post('/api/urls', payload)
      toast.success('Link created!'); onCreated(res.data); onClose()
    } catch (err) { setError(err.response?.data?.error || 'Failed to create link') }
    finally { setLoading(false) }
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,28,0.52)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn .2s ease both' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#eceae4', border: `1px solid ${LINE}`, borderRadius: 22, width: '100%', maxWidth: 520, boxShadow: '0 32px 80px rgba(20,20,28,0.2)', position: 'relative', overflow: 'hidden', animation: 'scaleSpring .3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${V},${VD})` }} />
        <div style={{ padding: '26px 26px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.625rem', fontWeight: 900, letterSpacing: '-0.03em', color: INK }}>New <em style={{ fontStyle: 'italic', color: V }}>link</em></h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', color: '#8d8b94', marginTop: 4 }}>Shorten a URL and start tracking instantly</p>
          </div>
          <button onClick={onClose} id="create-modal-close" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, background: P2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8d8b94', transition: 'all .15s' }} onMouseEnter={e => { e.currentTarget.style.background = INK; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.background = P2; e.currentTarget.style.color = '#8d8b94' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <form onSubmit={submit} id="create-url-form">
          <div style={{ padding: '0 26px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8d8b94', marginBottom: 7 }}>Destination URL <span style={{ color: '#ef4444' }}>*</span></label>
              <input ref={inputRef} id="modal-original-url" type="url" style={{ ...IS, borderBottomColor: error ? '#ef4444' : INK }} placeholder="https://your-very-long-url.com/…" value={form.originalUrl} onChange={e => { setForm({ ...form, originalUrl: e.target.value }); setError('') }} onFocus={e => e.target.style.borderBottomColor = V} onBlur={e => e.target.style.borderBottomColor = error ? '#ef4444' : INK} />
              {error && <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: '#ef4444', marginTop: 6, fontFamily: "'Space Grotesk',sans-serif" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>{error}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8d8b94', marginBottom: 7 }}>Alias <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#b0adb8' }}>(opt)</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Fragment Mono',monospace", fontSize: '0.7rem', color: '#b0adb8', pointerEvents: 'none', zIndex: 1, userSelect: 'none' }}>tinyhop-url/</span>
                  {!form.customCode && <span style={{ position: 'absolute', left: 155, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Fragment Mono',monospace", fontSize: '0.875rem', color: '#b0adb8', pointerEvents: 'none', fontWeight: 400 }}>my-brand</span>}
                  <input id="modal-custom-code" type="text" style={{ ...IS, paddingLeft: 155 }} placeholder="" value={form.customCode} onChange={e => setForm({ ...form, customCode: e.target.value })} onFocus={e => e.target.style.borderBottomColor = V} onBlur={e => e.target.style.borderBottomColor = INK} autoComplete="off" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8d8b94', marginBottom: 7 }}>Expires <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#b0adb8' }}>(opt)</span></label>
                <input id="modal-expires-at" type="datetime-local" style={{ ...IS, colorScheme: 'light' }} value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} min={new Date().toISOString().slice(0, 16)} onFocus={e => e.target.style.borderBottomColor = V} onBlur={e => e.target.style.borderBottomColor = INK} autoComplete="off" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8d8b94', marginBottom: 7 }}>Password <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#b0adb8' }}>(opt)</span></label>
              <input id="modal-password" type="password" style={IS} placeholder="Protect with password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onFocus={e => e.target.style.borderBottomColor = V} onBlur={e => e.target.style.borderBottomColor = INK} autoComplete="new-password" />
            </div>
          </div>
          <div style={{ padding: '14px 26px 24px', display: 'flex', justifyContent: 'flex-end', gap: 9, borderTop: `1px solid ${LINE}` }}>
            <button type="button" onClick={onClose} style={{ padding: '9px 20px', background: 'transparent', border: `1px solid ${LINE}`, borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 500, color: '#8d8b94', cursor: 'pointer', transition: 'all .15s' }} onMouseEnter={e => { e.currentTarget.style.background = P2; e.currentTarget.style.color = INK }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8d8b94' }}>Cancel</button>
            <button type="submit" id="create-url-submit" style={{ padding: '9px 22px', background: loading ? '#9f67f5' : V, color: '#fff', border: 'none', borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 7, boxShadow: `0 4px 14px ${V}35` }} disabled={loading} onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = VD; e.currentTarget.style.transform = 'translateY(-1px)' } }} onMouseLeave={e => { e.currentTarget.style.background = V; e.currentTarget.style.transform = '' }}>
              {loading ? <svg style={{ animation: 'spin .7s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.2-8.5" /></svg> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg> Create link</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditModal({ url, onClose, onUpdated }) {
  const [originalUrl, setOriginalUrl] = useState(url.originalUrl)
  const [loading, setLoading] = useState(false)
  const IS = { width: '100%', padding: '11px 13px', background: P2, border: `1.5px solid ${LINE}`, borderBottom: `2px solid ${INK}`, borderRadius: 0, color: INK, fontSize: '0.9375rem', fontFamily: "'Space Grotesk',sans-serif", outline: 'none', boxSizing: 'border-box' }
  const submit = async (e) => {
    e.preventDefault(); if (!originalUrl.trim()) return; setLoading(true)
    try { const res = await api.put(`/api/urls/${url.id}`, { originalUrl }); toast.success('Link updated!'); onUpdated(res.data); onClose() }
    catch (err) { toast.error(err.response?.data?.error || 'Update failed') }
    finally { setLoading(false) }
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,28,0.52)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn .2s ease both' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#eceae4', border: `1px solid ${LINE}`, borderRadius: 22, width: '100%', maxWidth: 480, boxShadow: '0 32px 80px rgba(20,20,28,0.2)', position: 'relative', overflow: 'hidden', animation: 'scaleSpring .3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${V},${VD})` }} />
        <div style={{ padding: '26px 26px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.025em', color: INK }}>Edit <em style={{ fontStyle: 'italic', color: V }}>link</em></h2>
            <p style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.8rem', color: '#8d8b94', marginTop: 4 }}>/{url.shortCode}</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, background: P2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8d8b94', transition: 'all .15s' }} onMouseEnter={e => { e.currentTarget.style.background = INK; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.background = P2; e.currentTarget.style.color = '#8d8b94' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <form onSubmit={submit} id="edit-url-form">
          <div style={{ padding: '0 26px 16px' }}>
            <label style={{ display: 'block', fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8d8b94', marginBottom: 7 }}>Destination URL</label>
            <input id="edit-url-input" type="url" autoFocus style={IS} value={originalUrl} onChange={e => setOriginalUrl(e.target.value)} onFocus={e => e.target.style.borderBottomColor = V} onBlur={e => e.target.style.borderBottomColor = INK} />
          </div>
          <div style={{ padding: '14px 26px 24px', display: 'flex', justifyContent: 'flex-end', gap: 9, borderTop: `1px solid ${LINE}` }}>
            <button type="button" onClick={onClose} style={{ padding: '9px 20px', background: 'transparent', border: `1px solid ${LINE}`, borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 500, color: '#8d8b94', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" id="edit-url-submit" style={{ padding: '9px 22px', background: V, color: '#fff', border: 'none', borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${V}35` }} disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmModal({ title, message, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false)
  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,28,0.52)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn .2s ease both' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#eceae4', border: `1px solid ${LINE}`, borderRadius: 22, width: '100%', maxWidth: 400, boxShadow: '0 32px 80px rgba(20,20,28,0.2)', position: 'relative', overflow: 'hidden', animation: 'scaleSpring .3s cubic-bezier(0.34,1.56,0.64,1) both', padding: '26px' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: INK, marginBottom: 8 }}>{title}</h2>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.9rem', color: '#8d8b94', marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
          <button onClick={onClose} style={{ padding: '9px 20px', background: 'transparent', border: `1px solid ${LINE}`, borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 500, color: '#8d8b94', cursor: 'pointer', transition: 'all .15s' }}>Cancel</button>
          <button onClick={handleConfirm} style={{ padding: '9px 22px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .2s' }} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [urls, setUrls] = useState([])
  const [batches, setBatches] = useState([])
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [batchUrls, setBatchUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showCreate, setShowCreate] = useState(false)
  const [editUrl, setEditUrl] = useState(null)
  const [qrUrl, setQrUrl] = useState(null)
  const [openStats, setOpenStats] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [viewMode, setViewMode] = useState('links') // 'links' or 'batches'
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const fetchUrls = useCallback(async () => {
    setLoading(true)
    try { 
      const [urlsRes, batchesRes] = await Promise.all([
        api.get('/api/urls'),
        api.get('/api/urls/batches')
      ])
      setUrls(urlsRes.data)
      setBatches(batchesRes.data)
    }
    catch { toast.error('Failed to load links') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { fetchUrls() }, [fetchUrls])

  const fetchBatchDetails = async (batchId) => {
    try {
      const res = await api.get(`/api/urls/batches/${batchId}`)
      setSelectedBatch(res.data)
      setBatchUrls(res.data.urls)
    } catch {
      toast.error('Failed to load batch details')
    }
  }

  const handleDeleteBatch = async (id) => {
    setDeleteConfirm({ id, type: 'batch' })
  }

  const filtered = viewMode === 'links' 
    ? urls
        .filter(u => u.originalUrl.toLowerCase().includes(search.toLowerCase()) || u.shortCode.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
          if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
          if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
          if (sortBy === 'most-clicks') return (b.clickCount || 0) - (a.clickCount || 0)
          return 0
        })
    : batches
        .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
          if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
          if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
          return 0
        })

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const totalClicks = urls.reduce((s, u) => s + (u.clickCount || 0), 0)
  const activeLinks = urls.filter(u => !u.expiresAt || new Date(u.expiresAt) > new Date()).length
  const spark = (b) => Array.from({ length: 7 }, (_, i) => ({ v: Math.max(0, b + Math.floor(Math.sin(i) * b * 0.3 + Math.random() * b * 0.2)) }))
  const clicksBar = urls.slice(0, 8).map(u => ({ name: u.shortCode, clicks: u.clickCount || 0 })).sort((a, b) => b.clicks - a.clicks)

  const handleDelete = async (id) => {
    setDeleteConfirm({ id, type: 'url' })
  }

  const confirmDeleteAction = async () => {
    if (!deleteConfirm) return
    const { id, type } = deleteConfirm
    if (type === 'batch') {
      try { 
        await api.delete(`/api/urls/batches/${id}`)
        setBatches(p => p.filter(b => b.id !== id))
        toast.success('Batch deleted') 
      }
      catch { toast.error('Failed to delete batch') }
    } else {
      try { await api.delete(`/api/urls/${id}`); setUrls(p => p.filter(u => u.id !== id)); toast.success('Deleted') }
      catch { toast.error('Failed to delete') }
    }
    setDeleteConfirm(null)
  }
  const handleCopy = (u) => { navigator.clipboard.writeText(`${base()}/${u.shortCode}`); toast.success('Copied!') }
  const handleCreated = (n) => setUrls(p => [n, ...p])
  const handleUpdated = (up) => setUrls(p => p.map(u => u.id === up.id ? up : u))

  return (
    <div style={{ minHeight: '100vh', background: '#eceae4', paddingTop: 64, fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleSpring{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 64, zIndex: 100, background: 'rgba(236,234,228,0.92)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '12px max(32px, calc((100vw - 1300px)/2 + 32px))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: INK, lineHeight: 1 }}>My <em style={{ fontStyle: 'italic', color: V }}>Links</em></h1>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.78rem', color: '#8d8b94', marginTop: 2 }}>{loading ? '…' : `${urls.length} link${urls.length !== 1 ? 's' : ''} · ${totalClicks.toLocaleString()} total clicks`}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 99, padding: 2 }}>
              <button
                onClick={() => { setViewMode('links'); setPage(1); setSelectedBatch(null) }}
                style={{
                  padding: '6px 14px',
                  background: viewMode === 'links' ? V : 'transparent',
                  color: viewMode === 'links' ? '#fff' : '#8d8b94',
                  border: 'none',
                  borderRadius: 99,
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{display:"flex",alignItems:"center",gap:8, whiteSpace:"nowrap"}}><Paperclip size={18} color="currentColor" strokeWidth={2.5} /> Links</span>
              </button>
              <button
                onClick={() => { setViewMode('batches'); setPage(1); setSelectedBatch(null) }}
                style={{
                  padding: '6px 14px',
                  background: viewMode === 'batches' ? V : 'transparent',
                  color: viewMode === 'batches' ? '#fff' : '#8d8b94',
                  border: 'none',
                  borderRadius: 99,
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{display:"flex",alignItems:"center",gap:8, whiteSpace:"nowrap"}}><Package size={18} color="currentColor" strokeWidth={2.5} /> Batches ({batches.length})</span>
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#b0adb8', pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input id="dashboard-search" type="text" placeholder="Search…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ padding: '8px 12px 8px 30px', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', color: INK, outline: 'none', width: 180, transition: 'all .2s' }} onFocus={e => { e.target.style.borderColor = V; e.target.style.boxShadow = `0 0 0 3px ${V}15` }} onBlur={e => { e.target.style.borderColor = LINE; e.target.style.boxShadow = '' }} />
            </div>
            <select id="dashboard-sort" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 12px', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', color: INK, cursor: 'pointer', outline: 'none', colorScheme: 'light' }}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="most-clicks">Most clicks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px max(32px, calc((100vw - 1300px)/2 + 32px)) 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 22, alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
              <StatCard label="Links"  value={loading ? '—' : urls.length}                                                  icon={<LinkIcon size={20} color="#15141c" strokeWidth={2.5} />} color={V}   spark={spark(urls.length / 7)}                        delay={0}   sub="total" />
              <StatCard label="Clicks" value={loading ? '—' : totalClicks.toLocaleString()}                                 icon={<TrendingUp size={20} color="#15141c" strokeWidth={2.5} />} color={GRN} spark={spark(totalClicks / 7)}                        delay={60}  sub="all time" />
              <StatCard label="Avg"    value={loading ? '—' : urls.length ? ((totalClicks / urls.length) || 0).toFixed(1) : '—'} icon={<TrendingUp size={20} color="#15141c" strokeWidth={2.5} />} color={AMB} spark={spark((totalClicks / Math.max(urls.length, 1)) / 7)} delay={120} sub="per link" />
              <StatCard label="Active" value={loading ? '—' : activeLinks}                                                  icon={<Zap size={20} color="#15141c" strokeWidth={2.5} />} color={BLU} spark={spark(activeLinks / 7)}                        delay={180} sub={`of ${urls.length}`} />
            </div>

            {/* URL list */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{ background: P2, border: `1px solid ${LINE}`, borderRadius: 13, padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                      <Skel w={18} h={18} r={4} />
                      <div style={{ flex: 1 }}><Skel w="34%" h={12} /><div style={{ marginTop: 7 }}><Skel w="58%" h={10} /></div></div>
                      <div style={{ display: 'flex', gap: 5 }}>{[0, 1, 2].map(j => <Skel key={j} w={28} h={28} r={7} />)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 14, paddingTop: 8, borderTop: `1px solid ${LINE}` }}>{[60, 80, 100].map((w, j) => <Skel key={j} w={w} h={10} />)}</div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: P2, border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>{search ? <Search size={28} color="#15141c" strokeWidth={2.5} /> : <LinkIcon size={28} color="#15141c" strokeWidth={2.5} />}</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 700, color: INK, letterSpacing: '-0.02em' }}>{search ? 'No links found' : 'No links yet'}</h2>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.9rem', color: '#8d8b94', maxWidth: 320 }}>{search ? `Nothing matches "${search}"` : 'Create your first short link and start tracking.'}</p>
                {!search && (
                  <button id="empty-create-btn" onClick={() => setShowCreate(true)} style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 22px', background: INK, color: '#eceae4', border: 'none', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', transition: 'all .2s', boxShadow: '0 4px 14px rgba(20,20,28,0.18)' }} onMouseEnter={e => { e.currentTarget.style.background = V; e.currentTarget.style.boxShadow = `0 6px 20px ${V}45` }} onMouseLeave={e => { e.currentTarget.style.background = INK; e.currentTarget.style.boxShadow = '0 4px 14px rgba(20,20,28,0.18)' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
                    Create your first link
                  </button>
                )}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {viewMode === 'links' ? (
                    paginated.map((url, i) => (
                      <div key={url.id}>
                        <UrlRow url={url} index={i} onDelete={handleDelete} onCopy={handleCopy}
                          onQR={() => setQrUrl(url)}
                          onAnalytics={() => setOpenStats(url)}
                        />
                      </div>
                    ))
                  ) : selectedBatch ? (
                    // Batch detail view
                    <>
                      <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: '16px 20px', marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <button
                              onClick={() => { setSelectedBatch(null); setBatchUrls([]) }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 12px',
                                background: P2,
                                border: `1px solid ${LINE}`,
                                borderRadius: 8,
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: "'Space Grotesk',sans-serif",
                                color: INK,
                                marginBottom: 8,
                              }}
                            >
                              ← Back to Batches
                            </button>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: INK, fontFamily: "'Playfair Display',serif" }}>
                              {selectedBatch.name}
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: '#8d8b94', marginTop: 4 }}>
                              {selectedBatch.successful} successful · {selectedBatch.failed} failed · {fmtD(selectedBatch.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteBatch(selectedBatch.id)}
                            style={{
                              padding: '8px 16px',
                              background: 'transparent',
                              border: `1px solid ${LINE}`,
                              borderRadius: 8,
                              color: '#ef4444',
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: "'Space Grotesk',sans-serif",
                            }}
                          >
                            Delete Batch
                          </button>
                        </div>
                      </div>
                      {batchUrls.map((url, i) => (
                        <div key={url.id}>
                          <UrlRow url={url} index={i} onDelete={handleDelete} onCopy={handleCopy}
                            onQR={() => setQrUrl(url)}
                            onAnalytics={() => setOpenStats(url)}
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    // Batch list view
                    paginated.map((batch, i) => (
                      <div
                        key={batch.id}
                        onClick={() => fetchBatchDetails(batch.id)}
                        style={{
                          background: '#fff',
                          border: `1px solid ${LINE}`,
                          borderRadius: 16,
                          padding: '16px 20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${V}45`
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = `0 8px 20px rgba(20,20,28,0.08)`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = LINE
                          e.currentTarget.style.transform = ''
                          e.currentTarget.style.boxShadow = ''
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                              <Package size={24} color="#15141c" strokeWidth={2.5} />
                              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: INK, fontFamily: "'Playfair Display',serif", margin: 0 }}>
                                {batch.name}
                              </h3>
                            </div>
                            <div style={{ display: 'flex', gap: 16, fontSize: '0.8125rem', color: '#8d8b94', fontFamily: "'Space Grotesk',sans-serif" }}>
                              <span style={{display:"flex", alignItems:"center", gap:4}}><BarChart2 size={14} color="#15141c" strokeWidth={2.5} /> {batch.totalUrls} URLs</span>
                              <span style={{ color: GRN }}>✓ {batch.successful} success</span>
                              {batch.failed > 0 && <span style={{ color: '#ef4444' }}>✗ {batch.failed} failed</span>}
                              <span style={{display:"flex", alignItems:"center", gap:4}}><Calendar size={14} color="#15141c" strokeWidth={2.5} /> {fmtD(batch.createdAt)}</span>
                            </div>
                          </div>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={V} strokeWidth="2.5">
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 18, borderTop: `1px solid ${LINE}` }}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', color: '#8d8b94' }}>{((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {[
                        { label: '←', onClick: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 },
                        ...Array.from({ length: Math.min(totalPages, 7) }, (_, i) => ({ label: String(i + 1), onClick: () => setPage(i + 1), active: page === i + 1 })),
                        { label: '→', onClick: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page === totalPages },
                      ].map((b, i) => (
                        <button key={i} onClick={b.onClick} disabled={b.disabled} style={{ padding: '6px 11px', background: b.active ? INK : '#fff', border: `1px solid ${b.active ? INK : LINE}`, borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', fontWeight: b.active ? 700 : 400, color: b.active ? '#eceae4' : INK, cursor: b.disabled ? 'not-allowed' : 'pointer', opacity: b.disabled ? 0.35 : 1, transition: 'all .15s' }} onMouseEnter={e => { if (!b.disabled && !b.active) e.currentTarget.style.background = P2 }} onMouseLeave={e => { if (!b.disabled && !b.active) e.currentTarget.style.background = '#fff' }}>{b.label}</button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Shorten CTA */}
            <Link to="/shorten" style={{ display: 'block', background: INK, border: `1px solid ${LINE}`, borderRadius: 18, padding: '22px 20px', textDecoration: 'none', transition: 'all .25s', boxShadow: '0 4px 16px rgba(20,20,28,0.12)', animation: 'fadeUp .5s cubic-bezier(0.16,1,0.3,1) .1s both', overflow: 'hidden', position: 'relative' }} onMouseEnter={e => { e.currentTarget.style.background = VD; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 32px ${V}50` }} onMouseLeave={e => { e.currentTarget.style.background = INK; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(20,20,28,0.12)' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: `${V}25`, filter: 'blur(30px)', pointerEvents: 'none' }} />
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>Quick action</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.375rem', fontWeight: 900, letterSpacing: '-0.025em', color: '#fff', marginBottom: 6 }}>Shorten a <em style={{ fontStyle: 'italic', color: '#c4b5fd' }}>new link</em></div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginBottom: 18 }}>Custom alias · expiry · password</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', background: V, color: '#fff', borderRadius: 99, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', fontWeight: 700, boxShadow: `0 4px 14px ${V}50` }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>New link
              </div>
            </Link>

            {/* Top links chart */}
            {!loading && clicksBar.length > 0 && (
              <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, padding: '18px', boxShadow: '0 4px 16px rgba(20,20,28,0.06)', animation: 'fadeUp .5s cubic-bezier(0.16,1,0.3,1) .2s both' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, color: INK, letterSpacing: '-0.01em', marginBottom: 3 }}>Top links <em style={{ fontStyle: 'italic', color: V }}>by clicks</em></div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.72rem', color: '#8d8b94', marginBottom: 14 }}>Best performing short links</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={clicksBar} margin={{ top: 2, right: 4, bottom: 0, left: -22 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,28,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#8d8b94', fontSize: 10, fontFamily: "'Fragment Mono',monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8d8b94', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem' }} formatter={v => [v.toLocaleString(), 'Clicks']} />
                    <Bar dataKey="clicks" fill={V} radius={[5, 5, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent links */}
            {!loading && urls.length > 0 && (
              <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 16px rgba(20,20,28,0.06)', animation: 'fadeUp .5s cubic-bezier(0.16,1,0.3,1) .4s both' }}>
                <div style={{ padding: '16px 18px', borderBottom: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: GRN, boxShadow: `0 0 8px ${GRN}60` }} />
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, color: INK, letterSpacing: '-0.01em' }}>Recent <em style={{ fontStyle: 'italic', color: V }}>links</em></span>
                </div>
                {urls.slice(0, 5).map((u, i) => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', borderTop: i === 0 ? 'none' : `1px solid ${LINE}`, transition: 'background .15s' }} onMouseEnter={e => e.currentTarget.style.background = P2} onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, overflow: 'hidden', background: P3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={`https://www.google.com/s2/favicons?domain=${domain(u.originalUrl)}&sz=32`} alt="" width={11} height={11} onError={e => { e.target.style.display = 'none' }} />
                    </div>
                    <a href={`${base()}/${u.shortCode}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Fragment Mono',monospace", fontSize: '0.8rem', fontWeight: 600, color: V, textDecoration: 'none', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>tinyhop-url/{u.shortCode}</a>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.9rem', fontWeight: 900, color: V, flexShrink: 0 }}>{u.clickCount || 0}</span>
                    <CopyBtn text={`${base()}/${u.shortCode}`} sm />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
      {editUrl && <EditModal url={editUrl} onClose={() => setEditUrl(null)} onUpdated={handleUpdated} />}
      {qrUrl && <QRModal url={qrUrl} onClose={() => setQrUrl(null)} />}
      {openStats && <StatsPanel url={openStats} onClose={() => setOpenStats(null)} />}
      {deleteConfirm && (
        <ConfirmModal 
          title="Delete link" 
          message={deleteConfirm.type === 'batch' ? "Delete this batch and all its links permanently?" : "Delete this link permanently?"}
          onConfirm={confirmDeleteAction} 
          onClose={() => setDeleteConfirm(null)} 
        />
      )}
    </div>
  )
}




