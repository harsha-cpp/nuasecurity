import { NextResponse } from 'next/server'
import * as fs from 'node:fs/promises'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const filePath = searchParams.get('path') || ''
  if (!filePath) return NextResponse.json({ error: 'missing path' }, { status: 400 })
  try {
    // INTENTIONAL VULNERABILITY (CTF): Path Traversal #1
    const content = await fs.readFile(filePath, 'utf8')
    return new Response(content, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
}


