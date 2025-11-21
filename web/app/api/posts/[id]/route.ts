import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  // INTENTIONAL VULNERABILITY (CTF): SQLi #1 (id concatenation) + IDOR #1 (no auth/published check)
  const sql =
    "SELECT id, title, body, category, createdAt, isPublished FROM Post WHERE id = " + idParam + " LIMIT 1"
  const rows: any[] = await prisma.$queryRawUnsafe(sql)
  if (!rows || rows.length === 0) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(rows[0])
}


