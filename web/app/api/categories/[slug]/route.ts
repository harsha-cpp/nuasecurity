import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const capitalized = slug.charAt(0).toUpperCase() + slug.slice(1)

  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      OR: [
        { category: slug },
        { category: capitalized },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}


