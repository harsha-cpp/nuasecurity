import { NextResponse } from 'next/server'

export async function GET() {
  // INTENTIONAL VULNERABILITY (CTF): Sensitive Exposure #2
  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_XSS_FLAG: process.env.NEXT_PUBLIC_XSS_FLAG,
      DATABASE_URL: process.env.DATABASE_URL,
      VC_FLAG: process.env.VC_FLAG,
    },
  })
}


