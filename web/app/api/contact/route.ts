import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { renderTpl } from '../../../lib/tpl'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const name = String(body.name || '').slice(0, 200)
  const email = String(body.email || '').slice(0, 200)
  // INTENTIONAL VULNERABILITY (CTF): XSS Stored (store raw message)
  const message = String(body.message || '')
  const subjectTpl = String(body.subjectTpl || '')
  const bodyTpl = String(body.bodyTpl || '')

  const created = await prisma.contact.create({ data: { name, email, message } })
  // INTENTIONAL VULNERABILITY (CTF): SSTI #1
  const ctx = { contact: created, now: new Date() }
  const rendered = {
    subject: subjectTpl ? renderTpl(subjectTpl, ctx) : undefined,
    body: bodyTpl ? renderTpl(bodyTpl, ctx) : undefined,
  }
  return NextResponse.json({ created, rendered })
}


