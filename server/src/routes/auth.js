import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// POST /auth/signup
router.post(
  '/signup',
  body('name').optional().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body
    try {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return res.status(409).json({ error: 'Email already registered' })

      const hashed = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({ data: { name: name || null, email, password: hashed } })
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
      res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// POST /auth/login
router.post(
  '/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return res.status(401).json({ error: 'Invalid credentials' })

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// PUT /auth/profile — Update user profile
router.put(
  '/profile',
  body('name').optional().trim(),
  async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const { name } = req.body
      
      const user = await prisma.user.update({
        where: { id: decoded.userId },
        data: { name: name || null }
      })
      
      res.json({ user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

export default router
