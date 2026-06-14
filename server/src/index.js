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
        <head><title>Link Expired</title><meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>body{background:#09090b;color:#fafafa;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}.card{background:#18181b;border:1px solid #27272a;border-radius:20px;padding:40px;text-align:center}h1{color:#ef4444}</style></head>
        <body><div class="card"><h1>Link Expired</h1><p>This link is no longer accessible.</p></div></body></html>
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
            <title>Password Protected</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body { background:#eceae4; color:#15141c; font-family:'Space Grotesk',sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:20px; box-sizing:border-box; }
              .card { background:#fff; border:1px solid rgba(20,20,28,0.08); border-radius:24px; padding:48px 40px; text-align:center; box-shadow:0 32px 80px rgba(20,20,28,0.08); width:100%; max-width:400px; box-sizing:border-box; }
              h1 { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; margin-top:0; margin-bottom:8px; color:#15141c; letter-spacing:-0.03em; }
              p.desc { font-size:0.9rem; color:#8d8b94; margin-bottom:28px; }
              input { width:100%; box-sizing:border-box; padding:14px 16px; border-radius:12px; border:1.5px solid rgba(20,20,28,0.1); margin-bottom:16px; background:#f9f9f8; color:#15141c; font-size:1rem; font-family:'Space Grotesk',sans-serif; outline:none; transition:all .2s; }
              input:focus { border-color:#7c3aed; background:#fff; box-shadow:0 0 0 4px rgba(124,58,237,0.1); }
              button { width:100%; padding:14px; cursor:pointer; background:#7c3aed; color:#fff; border:none; border-radius:12px; font-size:1rem; font-weight:700; font-family:'Space Grotesk',sans-serif; transition:all .2s; box-shadow:0 4px 14px rgba(124,58,237,0.35); }
              button:hover { background:#6d28d9; transform:translateY(-1px); box-shadow:0 6px 20px rgba(124,58,237,0.45); }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Link Protected</h1>
              <p class="desc">This link requires a password to access.</p>
              <form method="POST" action="">
                <input type="password" name="pwd" placeholder="Enter password" autofocus />
                ${pwd !== undefined ? '<p style="color:#ef4444;font-size:14px;margin-top:-8px;margin-bottom:16px;font-weight:500;">Incorrect password</p>' : ''}
                <button type="submit">Unlock</button>
              </form>
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

    // 7. Sanitize and validate the target URL before redirecting
    try {
      targetUrl = targetUrl.trim()
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl
      }
      // Validate it parses correctly
      const parsed = new URL(targetUrl)
      targetUrl = parsed.href // Use the normalized href
    } catch (e) {
      console.error('Invalid target URL:', targetUrl, e.message)
      return res.status(400).send('Invalid destination URL stored for this short link.')
    }

    // Use writeHead for reliable redirect (avoids Express redirect() throwing on some URLs)
    const statusCode = req.method === 'POST' ? 303 : 301
    res.writeHead(statusCode, { 'Location': targetUrl })
    return res.end()
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
