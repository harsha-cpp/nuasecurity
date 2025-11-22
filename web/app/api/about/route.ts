import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    title: 'Welcome to Our Blog',
    content: `We are passionate writers and thinkers dedicated to sharing valuable insights across a wide range of topics that matter in today's world.

Our blog serves as a platform for exploring the intersection of technology and human experience, examining how digital innovation shapes our daily lives while maintaining focus on what makes us fundamentally human.

From practical lifestyle advice to deep dives into emerging technologies, from business strategies to travel adventures, we curate content that informs, inspires, and challenges conventional thinking.

We believe in the power of thoughtful discourse and the importance of multiple perspectives. Our community of readers brings diverse backgrounds and experiences, creating rich discussions that extend far beyond the articles themselves.

Whether you're here to learn something new, find inspiration for your next project, or simply enjoy well-crafted writing on topics you care about, we're glad you've joined us on this journey of discovery and growth.

Thank you for being part of our community. We look forward to continuing this conversation with you.`
  })
}


