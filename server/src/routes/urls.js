import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
import { generateUniqueCode } from '../utils/generateCode.js'

const router = Router()
const prisma = new PrismaClient()

// POST /api/urls — Shorten a URL
router.post(
  '/',
  authenticate,
  body('originalUrl').isURL({ require_protocol: true }),
  body('customCode').optional().isLength({ min: 3, max: 20 }),
  body('customAlias').optional().isLength({ min: 3, max: 20 }),
  body('expiresAt').optional().isISO8601(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const {
      originalUrl,
      customCode,
      customAlias,
      expiresAt,
      title,
      description,
      password,
      tags,
      geoRouting,
      deviceRouting,
      qrConfig
    } = req.body
    try {
      // Use customCode or customAlias (backward compatibility)
      const alias = customCode || customAlias
      
      if (alias) {
        // Check if custom alias is already taken
        const existingByAlias = await prisma.url.findUnique({ where: { customAlias: alias } })
        if (existingByAlias) return res.status(409).json({ error: 'Custom alias already taken' })
        
        // Check if shortCode with same value exists
        const existingByCode = await prisma.url.findUnique({ where: { shortCode: alias } })
        if (existingByCode) return res.status(409).json({ error: 'Custom alias already taken' })
      }

      // If custom alias provided, use it as shortCode, otherwise generate one
      const shortCode = alias || await generateUniqueCode()
      
      const url = await prisma.url.create({
        data: {
          shortCode,
          originalUrl,
          customAlias: alias || null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          userId: req.userId,
          title: title || null,
          description: description || null,
          password: password || null,
          tags: Array.isArray(tags) ? tags : [],
          geoRouting: geoRouting || null,
          deviceRouting: deviceRouting || null,
          qrConfig: qrConfig || null
        }
      })
      res.status(201).json(url)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// GET /api/urls — Get all URLs for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const urls = await prisma.url.findMany({
      where: { 
        userId: req.userId,
        batchId: null // Only get individual URLs, not batch URLs
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(urls)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/urls/batches — Get all batches for current user
router.get('/batches', authenticate, async (req, res) => {
  try {
    const batches = await prisma.batch.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { urls: true }
        }
      }
    })
    res.json(batches)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/urls/batches/:id — Get batch details with all URLs
router.get('/batches/:id', authenticate, async (req, res) => {
  try {
    const batch = await prisma.batch.findUnique({
      where: { id: req.params.id },
      include: {
        urls: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!batch) return res.status(404).json({ error: 'Batch not found' })
    if (batch.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' })
    
    res.json(batch)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/urls/batches/:id — Delete a batch and all its URLs
router.delete('/batches/:id', authenticate, async (req, res) => {
  try {
    const batch = await prisma.batch.findUnique({ where: { id: req.params.id } })
    if (!batch) return res.status(404).json({ error: 'Batch not found' })
    if (batch.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' })
    
    // Delete all URLs in the batch first
    await prisma.url.deleteMany({ where: { batchId: req.params.id } })
    
    // Then delete the batch
    await prisma.batch.delete({ where: { id: req.params.id } })
    
    res.json({ message: 'Batch deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/urls/bulk — Bulk shorten URLs
router.post('/bulk', authenticate, async (req, res) => {
  const { urls, batchName } = req.body
  
  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'URLs array is required' })
  }

  if (urls.length > 1000) {
    return res.status(400).json({ error: 'Maximum 1000 URLs per batch' })
  }

  try {
    // Create the batch first
    const batch = await prisma.batch.create({
      data: {
        name: batchName || `Batch ${new Date().toLocaleString()}`,
        totalUrls: urls.length,
        userId: req.userId,
        successful: 0,
        failed: 0,
      }
    })

    const results = []
    let successCount = 0
    let failCount = 0
    
    for (const urlData of urls) {
      try {
        const { originalUrl, customAlias } = urlData
        
        if (!originalUrl || typeof originalUrl !== 'string') {
          results.push({
            originalUrl: originalUrl || 'N/A',
            status: 'failed',
            error: 'Invalid URL'
          })
          failCount++
          continue
        }

        // Basic URL validation
        try {
          new URL(originalUrl)
        } catch {
          results.push({
            originalUrl,
            status: 'failed',
            error: 'Invalid URL format'
          })
          failCount++
          continue
        }

        let shortCode
        
        // Check if custom alias is provided
        if (customAlias && customAlias.trim()) {
          const alias = customAlias.trim()
          
          // Validate alias
          if (alias.length < 3) {
            results.push({
              originalUrl,
              status: 'failed',
              error: 'Alias must be at least 3 characters'
            })
            failCount++
            continue
          }
          
          // Check if alias is already taken
          const existingByAlias = await prisma.url.findUnique({ where: { customAlias: alias } })
          const existingByCode = await prisma.url.findUnique({ where: { shortCode: alias } })
          
          if (existingByAlias || existingByCode) {
            results.push({
              originalUrl,
              status: 'failed',
              error: 'Alias already taken'
            })
            failCount++
            continue
          }
          
          shortCode = alias
        } else {
          shortCode = await generateUniqueCode()
        }

        const url = await prisma.url.create({
          data: {
            shortCode,
            originalUrl,
            customAlias: customAlias?.trim() || null,
            userId: req.userId,
            batchId: batch.id,
            tags: [],
          }
        })

        results.push({
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
          status: 'success',
          createdAt: url.createdAt
        })
        successCount++
      } catch (err) {
        console.error('Error processing URL:', err)
        results.push({
          originalUrl: urlData.originalUrl || 'N/A',
          status: 'failed',
          error: err.message || 'Processing error'
        })
        failCount++
      }
    }

    // Update batch with final counts
    await prisma.batch.update({
      where: { id: batch.id },
      data: {
        successful: successCount,
        failed: failCount,
      }
    })

    res.json({ 
      batchId: batch.id,
      batchName: batch.name,
      total: urls.length,
      successful: successCount,
      failed: failCount,
      results 
    })
  } catch (err) {
    console.error('Bulk operation error:', err)
    res.status(500).json({ error: 'Server error during bulk processing' })
  }
})

// PATCH /api/urls/:id — Update a URL (expiry, password, originalUrl, etc.)
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const url = await prisma.url.findUnique({ where: { id: req.params.id } })
    if (!url) return res.status(404).json({ error: 'Not found' })
    if (url.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' })
    const { originalUrl, expiresAt, password, tags } = req.body
    const data = {}
    if (originalUrl !== undefined) data.originalUrl = originalUrl
    if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null
    if (password !== undefined) data.password = password || null
    if (tags !== undefined) data.tags = Array.isArray(tags) ? tags : []
    const updated = await prisma.url.update({ where: { id: req.params.id }, data })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/urls/:id — Delete a URL
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const url = await prisma.url.findUnique({ where: { id: req.params.id } })
    if (!url) return res.status(404).json({ error: 'Not found' })
    if (url.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' })
    await prisma.url.delete({ where: { id: req.params.id } })
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
