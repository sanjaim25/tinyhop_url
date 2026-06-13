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

// 2. Strict CORS Configuration
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, '')) 
  : ['http://localhost:5173']
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
app.get('/:code', async (req, res, next) => {
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
      const pwd = req.query.pwd
      if (pwd !== url.password) {
        return res.send(`
          <!DOCTYPE html>
          <html>
          <head><title>Password Protected</title><meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>body{background:#09090b;color:#fafafa;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}.card{background:#18181b;border:1px solid #27272a;border-radius:20px;padding:40px;text-align:center}input{padding:10px;border-radius:5px;border:1px solid #555;margin-bottom:15px;background:#000;color:#fff}button{padding:10px 20px;cursor:pointer;background:#0052ff;color:#fff;border:none;border-radius:5px}</style></head>
          <body><div class="card"><h1>Link Protected</h1><form method="GET" action=""><input type="password" name="pwd" placeholder="Enter password" autofocus /><br/><button type="submit">Unlock</button></form></div></body></html>
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
})

// 7. Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack)
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Production Server running on port ${PORT}`))
