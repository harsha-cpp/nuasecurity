import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const posts = await prisma.post.findMany({ 
    where: { isPublished: true }, 
    orderBy: { createdAt: 'desc' } 
  })
  
  // Add excerpts to posts
  const postsWithExcerpts = posts.map(post => ({
    ...post,
    excerpt: post.body.substring(0, 200) + (post.body.length > 200 ? '...' : '')
  }))
  
  return NextResponse.json(postsWithExcerpts)
}


