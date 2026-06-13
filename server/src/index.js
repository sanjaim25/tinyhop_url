import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'
import urlRoutes from './routes/urls.js'
import analyticsRoutes from './routes/analytics.js'

dotenv.config()
const app = express()
const prisma = new PrismaClient()

// 1. Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

// Enable trust proxy so rate limiting works behind Render's load balancers
app.set('trust proxy', 1)

// 2. Strict CORS Configuration
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, '')) 
  : ['http://localhost:5173', 'https://tinyhop-url.vercel.app']
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Origin not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 3. Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
})

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many authentication attempts, please try again later' }
})

app.use('/api/', apiLimiter)
app.use('/api/auth', authLimiter)

// 4. Render Health Check Endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', uptime: process.uptime() }))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/urls', urlRoutes)
app.use('/api/analytics', analyticsRoutes)

// 5. Core Redirect Feature
const handleRedirect = async (req, res, next) => {
  const { code } = req.params
  try {
    const url = await prisma.url.findFirst({
      where: { OR: [{ shortCode: code }, { customAlias: code }] }
    })

    if (!url) return res.status(404).json({ error: 'Short URL not found' })

    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Expired | TinyHop</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            body{background:#eceae4;color:#15141c;font-family:'Space Grotesk',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;position:relative}
            body::before{content:"";position:absolute;inset:0;opacity:0.04;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")}
            .card-wrapper{position:relative;z-index:1;width:100%;max-width:420px;padding:0 20px;box-sizing:border-box}
            .card{background:#fff;border:1px solid rgba(20,20,28,0.1);border-radius:24px;padding:48px 40px;text-align:center;box-shadow:0 12px 48px rgba(20,20,28,0.08);position:relative;overflow:hidden}
            .card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#ef4444,#b91c1c)}
            .icon-wrapper{width:56px;height:56px;background:rgba(239,68,68,0.1);color:#ef4444;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px}
            h1{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;margin:0 0 12px;color:#15141c;letter-spacing:-0.02em}
            p.subtitle{font-size:0.95rem;color:#8d8b94;margin:0;line-height:1.5}
          </style>
        </head>
        <body>
          <div class="card-wrapper">
            <div class="card">
              <div class="icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h1>Link Expired</h1>
              <p class="subtitle">This link is no longer accessible.<br/>The creator has set it to expire.</p>
            </div>
          </div>
        </body>
        </html>
      `)
    }

    if (url.password) {
      const pwd = req.body.pwd || req.query.pwd
      if (pwd !== url.password) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        return res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Protected Link | TinyHop</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
              body{background:#eceae4;color:#15141c;font-family:'Space Grotesk',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;position:relative}
              body::before{content:"";position:absolute;inset:0;opacity:0.04;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")}
              .card-wrapper{position:relative;z-index:1;width:100%;max-width:420px;padding:0 20px;box-sizing:border-box}
              .card{background:#fff;border:1px solid rgba(20,20,28,0.1);border-radius:24px;padding:48px 40px;text-align:center;box-shadow:0 12px 48px rgba(20,20,28,0.08);position:relative;overflow:hidden}
              .card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#7c3aed,#6d28d9)}
              .icon-wrapper{width:56px;height:56px;background:rgba(124,58,237,0.1);color:#7c3aed;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px}
              h1{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;margin:0 0 12px;color:#15141c;letter-spacing:-0.02em}
              p.subtitle{font-size:0.95rem;color:#8d8b94;margin:0 0 32px;line-height:1.5}
              input{width:100%;padding:16px;border-radius:12px;border:1px solid rgba(20,20,28,0.15);background:#fff;color:#15141c;font-family:'Space Grotesk',sans-serif;font-size:1rem;box-sizing:border-box;transition:all 0.2s;margin-bottom:20px}
              input:focus{outline:none;border-color:#7c3aed;box-shadow:0 0 0 4px rgba(124,58,237,0.1)}
              button{width:100%;padding:16px;cursor:pointer;background:#15141c;color:#eceae4;border:none;border-radius:12px;font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:700;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px}
              button:hover{background:#7c3aed;transform:translateY(-2px);box-shadow:0 8px 24px rgba(124,58,237,0.25)}
              .error{color:#ef4444;font-size:0.875rem;margin-top:-12px;margin-bottom:20px;font-weight:600;text-align:left}
            </style>
          </head>
          <body>
            <div class="card-wrapper">
              <div class="card">
                <div class="icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h1>Protected Link</h1>
                <p class="subtitle">This URL is password protected.<br/>Please enter the password to continue.</p>
                <form method="POST" action="">
                  <input type="password" name="pwd" placeholder="Enter password" autofocus required />
                  ${pwd !== undefined ? '<div class="error">Incorrect password</div>' : ''}
                  <button type="submit">
                    Unlock Link
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </body>
          </html>
        `)
      }
    }

    let targetUrl = url.originalUrl
    const userAgent = req.headers['user-agent'] || ''
    let device = 'Desktop'
    if (/Mobi|Android|iPhone|iPad/i.test(userAgent)) device = 'Mobile'
    else if (/Tablet|iPad/i.test(userAgent)) device = 'Tablet'

    if (url.deviceRouting && typeof url.deviceRouting === 'object' && url.deviceRouting[device]) {
      targetUrl = url.deviceRouting[device]
    }

    let country = req.headers['cf-ipcountry'] || 'US'
    if (url.geoRouting && typeof url.geoRouting === 'object' && url.geoRouting[country]) {
      targetUrl = url.geoRouting[country]
    }

    let browser = 'Unknown'
    if (/Chrome/i.test(userAgent)) browser = 'Chrome'
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari'
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox'
    else if (/Edge/i.test(userAgent)) browser = 'Edge'

    const refererHeader = req.headers['referer'] || 'Direct'
    let referer = 'Direct'
    if (refererHeader !== 'Direct') {
      try { referer = new URL(refererHeader).hostname } catch (e) { referer = refererHeader }
    }

    // 6. Fire and Forget Analytics
    prisma.$transaction([
      prisma.visit.create({ data: { urlId: url.id, country, device, browser, referer } }),
      prisma.url.update({ where: { id: url.id }, data: { clickCount: { increment: 1 } } })
    ]).catch(err => console.error('Analytics Write Error:', err))

    return res.redirect(301, targetUrl)
  } catch (err) {
    next(err)
  }
}

app.get('/:code', handleRedirect)
app.post('/:code', handleRedirect)

// 7. Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack)
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Production Server running on port ${PORT}`))
