/* ============================================================
   TinyHop — signature logo
   A modern link icon with the TinyHop wordmark
   Props:
     size : 'sm' | 'md' | 'lg' | 'xl'
     tone : 'light' (dark text) | 'dark' (white text)
     showName : boolean
     animate  : boolean (idle motion)
     tagline  : optional string under the wordmark
   ============================================================ */

const SIZES = {
  sm: { mark: 28, icon: 16, font: '1.2rem',  radius: 8,  gap: 9,  dot: 4 },
  md: { mark: 46, icon: 26, font: '1.85rem', radius: 14, gap: 13, dot: 7 },
  lg: { mark: 60, icon: 34, font: '2.5rem',  radius: 18, gap: 16, dot: 9 },
  xl: { mark: 84, icon: 48, font: '3.5rem',  radius: 24, gap: 20, dot: 12 },
}

export default function Logo({ size = 'md', tone = 'dark', showName = true, animate = false, tagline }) {
  const s = SIZES[size] || SIZES.md
  const textColor = tone === 'light' ? '#15141c' : '#f4f3ff'
  const subColor  = tone === 'light' ? '#56545f' : 'rgba(244,243,255,0.5)'

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: s.gap }}>

      {/* ── Mark ── */}
      <span
        style={{
          width: s.mark, height: s.mark,
          borderRadius: s.radius,
          background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #6d28d9 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', flexShrink: 0,
          boxShadow: '0 8px 24px rgba(124,58,237,0.45), inset 0 1.5px 0 rgba(255,255,255,0.35)',
          animation: animate ? 'logoFloat 5s ease-in-out infinite' : 'none',
        }}
      >
        {/* glossy sheen */}
        <span style={{
          position: 'absolute', top: '-60%', left: '-30%',
          width: '70%', height: '220%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
          transform: 'rotate(20deg)',
          animation: animate ? 'logoSheen 4.5s ease-in-out infinite' : 'none',
        }} />

        {/* corner accent dot */}
        <span style={{
          position: 'absolute', top: s.mark * 0.13, right: s.mark * 0.13,
          width: s.mark * 0.12, height: s.mark * 0.12, borderRadius: '50%',
          background: '#c8ff3d', boxShadow: '0 0 8px rgba(200,255,61,0.8)',
        }} />

        {/* Link chain icon */}
        <svg
          width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"
          style={{
            position: 'relative', zIndex: 1,
            animation: animate ? 'linkBounce 3s ease-in-out infinite' : 'none',
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
          }}
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </span>

      {/* ── Wordmark ── */}
      {showName && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: tagline ? 4 : 0 }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: s.font, fontWeight: 900,
            letterSpacing: '-0.035em', color: textColor,
            lineHeight: 0.95, display: 'inline-flex', alignItems: 'baseline',
            position: 'relative',
          }}>
            TinyHop
          </span>
          {tagline && (
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: size === 'xl' ? '0.75rem' : size === 'sm' ? '0.55rem' : '0.625rem',
              fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: subColor,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ 
                display: 'inline-block', 
                width: size === 'sm' ? 8 : size === 'xl' ? 16 : 12, 
                height: 1, 
                background: 'currentColor',
                opacity: 0.3 
              }} />
              {tagline}
              <span style={{ 
                display: 'inline-block', 
                width: size === 'sm' ? 8 : size === 'xl' ? 16 : 12, 
                height: 1, 
                background: 'currentColor',
                opacity: 0.3 
              }} />
            </span>
          )}
        </span>
      )}
    </span>
  )
}




