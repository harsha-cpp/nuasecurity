import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  if (!q) return NextResponse.json({ html: 'Enter a query.' })

  // INTENTIONAL VULNERABILITY (CTF): SQLi #2
  const sql =
    "SELECT id, title, createdAt, body FROM Post WHERE title LIKE '%" + q + "%' OR body LIKE '%" + q + "%' ORDER BY createdAt DESC LIMIT 5"
  const rows: any[] = await prisma.$queryRawUnsafe(sql)
  // INTENTIONAL VULNERABILITY (CTF): XSS Reflected
  const list = rows.map((p) => `<li>${p.title} — ${new Date(p.createdAt).toLocaleDateString()}</li>`).join('')
  const html = `<div><div class="muted">Results for: ${q}</div><ul>${list}</ul><div data-flag="${process.env.XSS_REFLECTED_FLAG || ''}"></div></div>`
  return NextResponse.json({ html })
}


