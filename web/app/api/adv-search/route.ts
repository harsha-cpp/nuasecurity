import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = (searchParams.get('category') || '').trim()
  const q = (searchParams.get('q') || '').trim()
  const idMax = (searchParams.get('idMax') || '').trim()

  // INTENTIONAL: UNSAFE CONCATENATION over Post
  // schema: Post(id INT, title TEXT, body TEXT, createdAt DATETIME, isPublished BOOLEAN, category TEXT)
  let where = '1=1'
  if (category) {
    // quotes kept to allow normal usage; still injectable via `' OR 1=1--`
    where += ` AND category = '${category}'`
  }
  if (idMax) {
    where += ` AND id <= ${idMax}`
  }
  if (q) {
    // also used in boolean expressions intentionally
    where += ` AND (title LIKE '%${q}%' OR body LIKE '%${q}%' OR category = ${q} OR id <= ${q})`
  }

  const sql = `SELECT id, title, createdAt, body FROM Post WHERE ${where} ORDER BY createdAt DESC LIMIT 50`
  const rows: any[] = await prisma.$queryRawUnsafe(sql)

  return NextResponse.json({ items: rows, sql })
}


