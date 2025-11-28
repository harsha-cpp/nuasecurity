import { prisma } from '../../lib/prisma'
import { renderTpl } from '../../lib/tpl'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const titleTpl = url.searchParams.get('titleTpl')
  const posts = await prisma.post.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' }, take: 10 })
  const items = posts.map(p => `\n    <item>\n      <title>${escapeXml(p.title)}</title>\n      <link>http://localhost:8081/post/${p.id}</link>\n      <pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>\n      <description>${escapeXml((p.body||'').slice(0, 200))}</description>\n    </item>`).join('')
  // INTENTIONAL VULNERABILITY (CTF): SSTI #2
  const title = titleTpl ? renderTpl(titleTpl, { now: new Date() }) : 'Nua Security Feed'
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${title}</title>\n    <link>http://localhost:8081/</link>\n    <description>Recent posts</description>${items}\n  </channel>\n</rss>`
  return new Response(xml, { status: 200, headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}


