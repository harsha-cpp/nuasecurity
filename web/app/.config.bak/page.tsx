import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Intentionally exposed backup configuration for training purposes
const configBackup = {
  env: {
    DATABASE_URL: 'file:./prisma/dev.db',
    API_KEY: 'sk_live_demo_do_not_use',
    SMTP_PASSWORD: 'supersecret',
    NEXT_PUBLIC_XSS_FLAG: process.env.NEXT_PUBLIC_XSS_FLAG || 'FLAG{xss_demo}',
    DATAEXPOSE_FLAG: process.env.DATAEXPOSE_FLAG || 'FLAG{config_backup_demo}',
  },
  notes: 'Intentionally exposed backup file for training',
}

export async function GET() {
  return NextResponse.json(configBackup, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
