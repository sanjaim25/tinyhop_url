import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a test user
  const email = 'test@example.com'
  const password = 'password123'

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    console.log(`✅ Test user already exists: ${email}`)
  } else {
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })
    console.log(`✅ Created test user: ${email}`)
    console.log(`   Password: ${password}`)
  }

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
