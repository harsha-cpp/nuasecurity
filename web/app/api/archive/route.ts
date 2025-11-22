import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const monthParam = searchParams.get('month')
  const yearParam = searchParams.get('year')
  
  // Only apply date filtering if both month and year are provided and valid
  const month = monthParam ? Number(monthParam) : null
  const year = yearParam ? Number(yearParam) : null

  const where: any = { isPublished: true }
  if (month && year && Number.isFinite(month) && Number.isFinite(year)) {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)
    where.createdAt = { gte: start, lt: end }
  }

  const posts = await prisma.post.findMany({ where, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}


