import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const idNum = Number(idParam)
  if (!Number.isFinite(idNum)) return NextResponse.json({ error: 'invalid id' }, { status: 400 })
  const comment = await prisma.adminComment.findUnique({ where: { id: idNum } })
  if (!comment) return NextResponse.json({ error: 'not found' }, { status: 404 })
  // INTENTIONAL VULNERABILITY (CTF): IDOR #2
  return NextResponse.json({ comment, flag: String(process.env.IDOR_FLAG || '') })
}


