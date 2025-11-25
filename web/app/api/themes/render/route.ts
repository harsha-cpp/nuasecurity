import { NextResponse } from 'next/server'
import * as fs from 'node:fs/promises'

const TEMPLATE_DIR = '/app/templates'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name') || ''
  if (!name) return NextResponse.json({ error: 'missing name' }, { status: 400 })
  // INTENTIONAL VULNERABILITY (CTF): Path Traversal #2
  const filePath = TEMPLATE_DIR + '/' + name
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return new Response(content, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
}


