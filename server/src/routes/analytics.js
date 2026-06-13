import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

/* ── GET /api/analytics/overview — aggregate stats for the whole user account ── */
router.get('/overview', authenticate, async (req, res) => {
  try {
    const urls = await prisma.url.findMany({
      where: { userId: req.userId },
      include: { visits: { orderBy: { visitedAt: 'desc' } } }
    })

    const totalLinks   = urls.length
    const totalClicks  = urls.reduce((s, u) => s + (u.clickCount || 0), 0)
    const activeLinks  = urls.filter(u => !u.expiresAt || new Date(u.expiresAt) > new Date()).length
    const expiredLinks = totalLinks - activeLinks

    const topLinks = [...urls]
      .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
      .slice(0, 5)
      .map(u => ({ shortCode: u.shortCode, originalUrl: u.originalUrl, clicks: u.clickCount || 0, id: u.id }))

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
    const urlIds = urls.map(u => u.id)

    const recentVisits = urlIds.length > 0
      ? await prisma.visit.findMany({
          where: { urlId: { in: urlIds }, visitedAt: { gte: thirtyDaysAgo } },
          orderBy: { visitedAt: 'asc' }
        })
      : []

    const dailyMap = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      dailyMap[d.toISOString().split('T')[0]] = 0
    }
    recentVisits.forEach(v => {
      const key = v.visitedAt.toISOString().split('T')[0]
      if (dailyMap[key] !== undefined) dailyMap[key]++
    })
    const dailyData = Object.entries(dailyMap).map(([date, clicks]) => ({ date, clicks }))

    const linksPerDay = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      linksPerDay[d.toISOString().split('T')[0]] = 0
    }
    urls.forEach(u => {
      const key = new Date(u.createdAt).toISOString().split('T')[0]
      if (linksPerDay[key] !== undefined) linksPerDay[key]++
    })
    const linksData = Object.entries(linksPerDay).map(([date, count]) => ({ date, count }))

    const allVisits = urlIds.length > 0
      ? await prisma.visit.findMany({ where: { urlId: { in: urlIds } } })
      : []

    const countries = {}, devices = {}, browsers = {}, referers = {}
    allVisits.forEach(v => {
      countries[v.country] = (countries[v.country] || 0) + 1
      devices[v.device]    = (devices[v.device]    || 0) + 1
      browsers[v.browser]  = (browsers[v.browser]  || 0) + 1
      referers[v.referer]  = (referers[v.referer]  || 0) + 1
    })

    const byCountry = Object.entries(countries).map(([k,v])=>({country:k,count:v})).sort((a,b)=>b.count-a.count)
    const byDevice  = Object.entries(devices).map(([k,v])=>({device:k,count:v})).sort((a,b)=>b.count-a.count)
    const byBrowser = Object.entries(browsers).map(([k,v])=>({browser:k,count:v})).sort((a,b)=>b.count-a.count)
    const byReferer = Object.entries(referers).map(([k,v])=>({referer:k,count:v})).sort((a,b)=>b.count-a.count)

    const recentActivity = urlIds.length > 0
      ? (await prisma.visit.findMany({
          where: { urlId: { in: urlIds } },
          orderBy: { visitedAt: 'desc' },
          take: 10,
          include: { url: { select: { shortCode: true } } }
        })).map(v => ({
          shortCode: v.url?.shortCode,
          country: v.country,
          device: v.device,
          browser: v.browser,
          referer: v.referer,
          visitedAt: v.visitedAt
        }))
      : []

    res.json({
      totalLinks, totalClicks, activeLinks, expiredLinks,
      topLinks, dailyData, linksData,
      byCountry, byDevice, byBrowser, byReferer,
      recentActivity,
      avgClicksPerLink: totalLinks ? Math.round(totalClicks / totalLinks) : 0
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

/* ── GET /api/analytics/:id — per-link stats ── */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const url = await prisma.url.findUnique({
      where: { id: req.params.id },
      include: { visits: { orderBy: { visitedAt: 'desc' }, take: 20 } }
    })
    if (!url) return res.status(404).json({ error: 'Not found' })
    if (url.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' })

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDayVisits = await prisma.visit.findMany({
      where: { urlId: url.id, visitedAt: { gte: sevenDaysAgo } }
    })

    const dailyMap = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      dailyMap[d.toISOString().split('T')[0]] = 0
    }
    sevenDayVisits.forEach(v => {
      const key = v.visitedAt.toISOString().split('T')[0]
      if (dailyMap[key] !== undefined) dailyMap[key]++
    })
    const dailyData = Object.entries(dailyMap).map(([date, clicks]) => ({ date, clicks }))

    const allVisits = await prisma.visit.findMany({ where: { urlId: url.id } })
    const countries = {}, devices = {}
    allVisits.forEach(v => {
      countries[v.country] = (countries[v.country] || 0) + 1
      devices[v.device]    = (devices[v.device]    || 0) + 1
    })

    res.json({
      url,
      totalClicks: url.clickCount,
      lastVisited: url.visits[0]?.visitedAt || null,
      recentVisits: url.visits.map(v => ({ ...v, createdAt: v.visitedAt })),
      dailyData,
      byCountry: Object.entries(countries).map(([country, count]) => ({ country, count })),
      byDevice:  Object.entries(devices).map(([device, count]) => ({ device, count }))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
