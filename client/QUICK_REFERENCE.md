# ⚡ LinkForge Quick Reference Card

## 🎬 Getting Started (30 seconds)

```bash
# You're already here! Dependencies installed ✅
npm run dev
```

Visit: http://localhost:5173

---

## 🔥 Activate Premium Features NOW

### Option 1: Enhanced Dashboard (Recommended)

**File**: `client/src/App.jsx`

```jsx
// Change line ~7
import Dashboard from './pages/DashboardEnhanced'  // ← Change this
```

**Features unlocked**:
- ✨ Animated stats with counters
- 🎭 Interactive URL cards
- 🎊 Success confetti
- 🎨 Smooth modal transitions
- 🔄 Hover-reveal actions

### Option 2: Landing Page Effects

**File**: `client/src/pages/Landing.jsx`

Add at top:
```jsx
import ParticleBackground from '../components/effects/ParticleBackground'
import FloatingDemo from '../components/animations/FloatingDemo'
```

Find line ~49 and replace `<FloatingDemo />` function with the imported component.

Add particles: Insert `<ParticleBackground />` at line ~186 (inside landing-hero section).

**Features unlocked**:
- ✨ Floating particle network
- 🎨 Animated demo card
- 🌊 3D-like effects

---

## 🎨 Component Cheat Sheet

### Animated Stats
```jsx
import AnimatedStats from './components/animations/AnimatedStats'

<AnimatedStats
  icon="🔗"
  label="Total Links"
  value={42}
  change={12}
  color="#0052ff"
  delay={0}
/>
```

### Animated URL Card
```jsx
import AnimatedURLCard from './components/animations/AnimatedURLCard'

<AnimatedURLCard
  url={urlObject}
  index={0}
  onDelete={(id) => handleDelete(id)}
  onCopy={(url) => handleCopy(url)}
  onEdit={(url) => setEditUrl(url)}
  onQR={(url) => setQrUrl(url)}
  onAnalytics={() => navigate('/analytics')}
/>
```

### Success Confetti
```jsx
import SuccessConfetti from './components/effects/SuccessConfetti'

const [showConfetti, setShowConfetti] = useState(false)

<SuccessConfetti
  active={showConfetti}
  onComplete={() => setShowConfetti(false)}
/>

// Trigger it:
setShowConfetti(true)
```

### Particle Background
```jsx
import ParticleBackground from './components/effects/ParticleBackground'

<ParticleBackground />
```

### Floating Demo
```jsx
import FloatingDemo from './components/animations/FloatingDemo'

<FloatingDemo />
```

---

## 🎭 Animation Patterns

### Basic Framer Motion
```jsx
import { motion } from 'framer-motion'

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</motion.div>

// Slide up
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Hover effects
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### Staggered Children
```jsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Exit Animations
```jsx
import { AnimatePresence } from 'framer-motion'

<AnimatePresence mode="popLayout">
  {showModal && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🪝 Custom Hooks

### Magnetic Button
```jsx
import useMagneticButton from './hooks/useMagneticButton'

function MyButton() {
  const { magneticProps } = useMagneticButton(0.3)
  
  return (
    <button {...magneticProps} className="btn btn-primary">
      Hover me!
    </button>
  )
}
```

### Scroll Reveal
```jsx
import useScrollReveal from './hooks/useScrollReveal'

function MySection() {
  const { ref, isVisible } = useScrollReveal()
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
    >
      Content appears on scroll
    </motion.div>
  )
}
```

---

## 🎨 CSS Animation Classes

```jsx
// Fade effects
<div className="animate-fade-in">Content</div>
<div className="animate-fade-up delay-200">Content</div>
<div className="animate-fade-down delay-400">Content</div>

// Scale effects
<div className="animate-scale-in">Content</div>
<div className="animate-scale-spring delay-300">Content</div>

// Float effects
<div className="animate-float">Floating</div>
<div className="animate-float-slow">Slow float</div>

// Others
<div className="animate-shimmer">Loading</div>
<div className="animate-glow">Glowing</div>
<div className="animate-spin-slow">Spinning</div>

// Text
<span className="text-gradient">Gradient text</span>
<span className="text-gradient-animated">Animated gradient</span>
```

---

## 🎨 Styling Classes

### Buttons
```jsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-gradient">Gradient</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-danger">Danger</button>
<button className="btn btn-icon">Icon</button>

// Sizes
<button className="btn btn-sm">Small</button>
<button className="btn btn-lg">Large</button>
<button className="btn btn-xl">Extra Large</button>

// States
<button className="btn btn-primary btn-loading">Loading</button>
```

### Cards
```jsx
<div className="card">Basic card</div>
<div className="card card-interactive">Clickable card</div>
<div className="card card-glass">Glass card</div>
<div className="stat-card">Stat card</div>
<div className="feature-card">Feature card</div>
```

### Badges
```jsx
<span className="badge badge-brand">Brand</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-danger">Danger</span>
<span className="badge badge-neutral">Neutral</span>
```

### Layout
```jsx
<div className="container">Max-width container</div>
<div className="container-narrow">Narrow container</div>
<div className="grid-3">3-column grid</div>
<div className="grid-4">4-column grid</div>
```

---

## 🎨 Color Variables

```css
/* Use in your components */
background: var(--brand);
color: var(--text-primary);
border: 1px solid var(--border);

/* Available colors */
--brand, --brand-light, --brand-dark
--bg-base, --bg-card, --bg-elevated
--text-primary, --text-secondary, --text-tertiary
--success, --warning, --danger, --info
--border, --border-hover, --border-gold
```

---

## 🔧 Common Tasks

### Add Loading State
```jsx
const [loading, setLoading] = useState(false)

<button className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}>
  {!loading && 'Click me'}
</button>
```

### Toast Notification
```jsx
import toast from 'react-hot-toast'

toast.success('Success message!')
toast.error('Error message')
toast.loading('Loading...')
```

### Modal Animation
```jsx
import { motion, AnimatePresence } from 'framer-motion'

<AnimatePresence>
  {showModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="modal"
      >
        Modal content
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

---

## 📦 Import Cheat Sheet

```jsx
// Framer Motion
import { motion, AnimatePresence } from 'framer-motion'

// Icons
import { 
  Copy, QrCode, BarChart3, Edit, Trash2,
  ExternalLink, TrendingUp, TrendingDown,
  Search, Plus, X, Check
} from 'lucide-react'

// Components
import AnimatedStats from './components/animations/AnimatedStats'
import AnimatedURLCard from './components/animations/AnimatedURLCard'
import FloatingDemo from './components/animations/FloatingDemo'
import ParticleBackground from './components/effects/ParticleBackground'
import SuccessConfetti from './components/effects/SuccessConfetti'

// Hooks
import useMagneticButton from './hooks/useMagneticButton'
import useScrollReveal from './hooks/useScrollReveal'

// Toast
import toast from 'react-hot-toast'
```

---

## 🐛 Quick Fixes

### Animations not working?
```jsx
// Make sure you're using motion components
<motion.div>  ✅
<div>          ❌

// Check you imported from framer-motion
import { motion } from 'framer-motion'  ✅
```

### Icons not showing?
```jsx
// Import specific icons
import { Copy } from 'lucide-react'  ✅

<Copy size={16} />  ✅
```

### Confetti not stopping?
```jsx
// Make sure you have onComplete
<SuccessConfetti
  active={showConfetti}
  onComplete={() => setShowConfetti(false)}  ✅
/>
```

---

## 📚 Full Documentation

- **PREMIUM_REDESIGN_GUIDE.md** - Complete guide with examples
- **INSTALLATION_GUIDE.md** - Setup and troubleshooting
- **REDESIGN_SUMMARY.md** - Full feature overview

---

## 🎯 3-Minute Setup

1. **Activate Dashboard** (1 min)
   - Edit `App.jsx`
   - Change import to `DashboardEnhanced`
   - Save

2. **Add Particles** (1 min)
   - Edit `Landing.jsx`
   - Import `ParticleBackground`
   - Add `<ParticleBackground />` in hero

3. **Test** (1 min)
   - Run `npm run dev`
   - Create a link
   - Enjoy confetti! 🎊

---

## ✨ You're Ready!

Everything is installed and ready to use. Just import and enjoy! 🚀

**Pro tip**: Start with `DashboardEnhanced` - it showcases all the premium features in one place.

Happy coding! 🎨
