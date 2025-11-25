import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'missing url' }, { status: 400 })
  try {
    // INTENTIONAL VULNERABILITY (CTF): SSRF #1
    const resp = await fetch(url, { method: 'GET' })
    const text = await resp.text()
    return NextResponse.json({ ok: true, length: text.length })
  } catch {
    return NextResponse.json({ error: 'bad url' }, { status: 400 })
  }
}


