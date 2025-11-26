import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const callback = searchParams.get('callback') || ''
  if (!callback) return NextResponse.json({ error: 'missing callback' }, { status: 400 })
  try {
    // INTENTIONAL VULNERABILITY (CTF): SSRF #2
    const resp = await fetch(callback, { method: 'POST', body: JSON.stringify({ ok: true }), headers: { 'Content-Type': 'application/json' } })
    const text = await resp.text()
    return NextResponse.json({ ok: true, length: text.length })
  } catch {
    return NextResponse.json({ error: 'bad callback' }, { status: 400 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const callback = searchParams.get('callback') || ''
  if (!callback) return NextResponse.json({ error: 'missing callback' }, { status: 400 })
  try {
    // Browser-testable variant (GET)
    const resp = await fetch(callback, { method: 'GET' })
    const text = await resp.text()
    return NextResponse.json({ ok: true, length: text.length })
  } catch {
    return NextResponse.json({ error: 'bad callback' }, { status: 400 })
  }
}


