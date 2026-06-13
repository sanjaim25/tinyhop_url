import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const V = '#7c3aed'
const VD = '#6d28d9'
const INK = '#15141c'
const LINE = 'rgba(20,20,28,0.1)'
const P2 = '#f5f3ef'
const P3 = '#e3e0d8'
const GRN = '#16a34a'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.name) setName(user.name)
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name cannot be empty')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await api.put('/api/auth/profile', { name: name.trim() })
      updateUser(res.data.user)
      toast.success('Profile updated successfully!')
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update profile'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#eceae4', paddingTop: 64, fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:0,opacity:0.04,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:600, margin:'0 auto', padding:'40px 24px 80px' }}>
        
        <div style={{ textAlign:'center', marginBottom:40, animation:'fadeUp .6s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'4px 14px', background:`${V}12`, border:`1px solid ${V}28`, borderRadius:99, marginBottom:16 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={V} strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span style={{ fontFamily:"'Fragment Mono',monospace", fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:V }}>Profile Settings</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,5vw,3rem)', fontWeight:900, letterSpacing:'-0.04em', lineHeight:0.93, color:INK, marginBottom:14 }}>
            Edit <em style={{ fontStyle:'italic', color:V }}>Profile</em>
          </h1>
          <p style={{ fontSize:'0.9375rem', color:'#8d8b94', maxWidth:400, margin:'0 auto', lineHeight:1.65 }}>
            Update your personal information
          </p>
        </div>

        <div style={{ background:'#fff', border:`1px solid ${LINE}`, borderRadius:22, overflow:'hidden', boxShadow:'0 6px 32px rgba(20,20,28,0.09)', animation:'fadeUp .5s cubic-bezier(0.16,1,0.3,1) .1s both' }}>
          <div style={{ height:3, background:`linear-gradient(90deg,${V},${VD})` }} />

          <form onSubmit={handleSubmit} style={{ padding:'32px' }}>
            {/* Avatar Display */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:32 }}>
              <div style={{
                width:80, height:80, borderRadius:'50%',
                background:'linear-gradient(135deg,#a78bfa,#7c3aed)',
                border:`3px solid ${V}30`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'Playfair Display',serif",
                fontSize:'2rem', fontWeight:700, color:'#fff',
                marginBottom:12,
                boxShadow:`0 8px 24px ${V}30`,
              }}>
                {(name?.[0] || user?.email?.[0])?.toUpperCase()}
              </div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8125rem', color:'#8d8b94' }}>
                {user?.email}
              </div>
            </div>

            {/* Name Field */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.6875rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#8d8b94', marginBottom:8 }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                placeholder="Enter your name"
                style={{
                  width:'100%', padding:'12px 16px',
                  background:P2, border:`1.5px solid ${error ? '#ef4444' : LINE}`,
                  borderRadius:10, color:INK,
                  fontSize:'0.9375rem', fontFamily:"'Space Grotesk',sans-serif",
                  outline:'none', transition:'all .2s', boxSizing:'border-box',
                }}
                onFocus={e => { e.target.style.borderColor=V; e.target.style.boxShadow=`0 0 0 3px ${V}15`; e.target.style.background='#fff' }}
                onBlur={e => { e.target.style.borderColor=error?'#ef4444':LINE; e.target.style.boxShadow=''; e.target.style.background=P2 }}
              />
              {error && (
                <p style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.75rem', color:'#ef4444', marginTop:6 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </p>
              )}
            </div>

            {/* Email Field (Read-only) */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.6875rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#8d8b94', marginBottom:8 }}>
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                disabled
                style={{
                  width:'100%', padding:'12px 16px',
                  background:P3, border:`1.5px solid ${LINE}`,
                  borderRadius:10, color:'#8d8b94',
                  fontSize:'0.9375rem', fontFamily:"'Space Grotesk',sans-serif",
                  outline:'none', boxSizing:'border-box',
                  cursor:'not-allowed',
                }}
              />
              <p style={{ fontSize:'0.75rem', color:'#b0adb8', marginTop:6, fontFamily:"'Space Grotesk',sans-serif" }}>
                Email cannot be changed
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width:'100%', padding:'14px',
                background:loading?'#9f67f5':INK, color:'#eceae4',
                border:'none', borderRadius:12,
                fontFamily:"'Playfair Display',serif", fontStyle:'italic',
                fontSize:'1.125rem', fontWeight:700, letterSpacing:'-0.01em',
                cursor:loading?'not-allowed':'pointer', transition:'all .25s',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                boxShadow:'0 4px 16px rgba(20,20,28,0.16)',
              }}
              onMouseEnter={e => { if(!loading) { e.currentTarget.style.background=V; e.currentTarget.style.boxShadow=`0 8px 28px ${V}50` } }}
              onMouseLeave={e => { e.currentTarget.style.background=loading?'#9f67f5':INK; e.currentTarget.style.boxShadow='0 4px 16px rgba(20,20,28,0.16)' }}
            >
              {loading ? (
                <>
                  <svg style={{ animation:'spin .7s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-6.2-8.5"/>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}




