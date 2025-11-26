import { NextResponse } from 'next/server'

export async function GET() {
  // INTENTIONAL VULNERABILITY (CTF): Vulnerable Components status
  const status = {
    jquery: '1.8.3',
    nunjucks: '3.2.4',
  }
  return NextResponse.json({ status, flag: process.env.VC_FLAG || '' })
}


