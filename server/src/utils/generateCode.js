import { customAlphabet } from 'nanoid'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  6
)

export async function generateUniqueCode() {
  let code
  let exists = true
  while (exists) {
    code = nanoid()
    const found = await prisma.url.findUnique({ where: { shortCode: code } })
    exists = !!found
  }
  return code
}
