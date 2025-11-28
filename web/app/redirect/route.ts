import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const to = searchParams.get('to') || '/'
  // INTENTIONAL VULNERABILITY (CTF): Open Redirect #1
  return NextResponse.redirect(to)
}


