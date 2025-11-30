## Nua Security — Intentionally Vulnerable Training App (Easy)

This manual documents the exact behavior of the app as implemented in the repository. It is intentionally vulnerable. Do not expose publicly.

### Quick Start

- Docker (includes sidecars):
  - `docker compose up --build`
  - Web: `http://localhost:8081` (Docker maps 8081 -> app 3000)
  - Smoke test: `./scripts/smoke.sh` (defaults to `http://localhost:3000`; override via `BASE_URL`)

- Non-Docker (frontend + APIs only):
  - `cd web && npm install`
  - `npm run dev`
  - Open `http://localhost:3000`

Notes
- Prisma uses SQLite at `prisma/dev.db`. The seed script exists at `prisma/seed.js`.
- Sidecars are only available when running via Docker Compose.

### Configuration & Flags

- Env files scanned: `.env.flags` (used by Docker services), optional `.env.local` for the web app.
- Example `.env.local` (non-Docker):
  ```env
  NEXT_PUBLIC_API_BASE=/
  NEXT_PUBLIC_XSS_FLAG=FLAG{captured_via_xss}
  ```
- Example `.env.flags` (Docker): keys referenced in code and docs include `NEXT_PUBLIC_XSS_FLAG`, `XSS_REFLECTED_FLAG`, `SSTI_FLAG`, `VC_FLAG`, `IDOR_FLAG`, `SSRF_FLAG`.
- Rotate flags:
  - Edit `.env.flags`
  - Rebuild and reseed:
    - `docker compose up --build -d`
    - `docker compose exec web node prisma/seed.js`

### UI Tour (8 pages)

- Home: `/` — lists latest posts
- Post: `/post/[id]` — single post view (e.g., `/post/1`)
- Search: `/search` — search interface (server-rendered HTML results)
- About: `/about` — static content from `/api/about`
- Contact: `/contact` — contact form with optional template fields
- Archive: `/archive` — filter by month/year
- Category: `/category/[slug]` — posts by category (e.g., `/category/technology`)
- RSS: `/feed.xml` — RSS feed generated from posts

Other pages available:
- Admin Messages: `/admin/messages` — lists stored contact messages
- System: `/system` — component status and API listing
- Redirect: `/redirect` and `/go` — open redirect tester and endpoint
- Redirect Success: `/redirect-success` — landing page for redirects
- QA: `/qa` — QA dashboard (UI-only aid)

What you should see
- Home: a hero area and a grid of posts (after seeding). If empty, a "No posts available yet" card.
- Post: the selected post or a friendly "Post Not Found" UI.
- Search: a query field; results include a server-rendered HTML panel.
- Contact: form with name/email/message and an expandable “Advanced Options” section.
- Archive/Category: filters and post cards; empty-state if no matches.
- Admin Messages: list of messages; a badge showing `NEXT_PUBLIC_XSS_FLAG`.

### Core Features

- Blog viewing & navigation: `/`, `/post/[id]`, `/archive`, `/category/[slug]`
- Search: `/search` uses `/api/search` and returns server HTML and optional structured results
- Contact submission: `/contact` posts to `/api/contact`
- RSS: `/feed.xml` serves an XML feed

### Vulnerability Exercise Guide (UI-first)

Important: Only perform safe probes. Do not use harmful payloads.

- SQL Injection
  - UI start: `/search`
  - Endpoint: `GET /api/search?q=...`
  - Safe probe: `q=hello` (expect 200 JSON with `html`)
  - Success looks like: "Results for: hello" in returned HTML
  - Flag note: `XSS_REFLECTED_FLAG` is included as a `data-flag` attribute in the HTML

- Reflected XSS
  - UI start: `/search`
  - Endpoint: `GET /api/search?q=...`
  - Safe probe: `q=test` (observe that the query value is reflected in HTML)
  - Success looks like: server returns `html` reflecting the query
  - Flag note: `data-flag` in the search HTML

- Stored XSS
  - UI start: `/contact` → submit → view at `/admin/messages`
  - Endpoint(s): `POST /api/contact`, `GET /api/admin/messages`
  - Safe probe: a simple bold tag in message, e.g., `<b>hi</b>`
  - Success looks like: the message renders as HTML on `/admin/messages`
  - Flag note: admin page displays `NEXT_PUBLIC_XSS_FLAG`

- SSTI
  - UI start: `/contact` (Advanced Options)
  - Endpoint(s): `POST /api/contact` (`subjectTpl`, `bodyTpl` fields); `GET /feed.xml?titleTpl=...`
  - Safe probe: `{{7*7}}` as a template value
  - Success looks like: rendered outputs in API JSON or RSS `<title>`
  - Flag note: flags may be exposed as variables or via template globals

- Vulnerable Components
  - UI start: `/system`
  - Endpoint: `GET /api/components-status`
  - Safe probe: call `/api/components-status`
  - Success looks like: JSON contains `jquery: "1.8.3"` and `leftPad: "1.1.3"`
  - Note: jQuery 1.8.3 asset exists in `public/` but is not actively loaded by the Search UI.

- IDOR
  - UI start: Admin APIs (no auth)
  - Endpoint: `GET /api/admin/comments/[id]`
  - Safe probe: `GET /api/admin/comments/1`
  - Success looks like: JSON includes a `comment` object and an `flag` string

- XXE
  - UI start: N/A (internal-only)
  - Endpoint: internal sidecar `xxe:5000` (`/parse`, `/xml-contact`, `/import`) exposed only in Docker network
  - Safe probe: `POST /parse` with simple XML, when run inside Docker network
  - Note: No direct web proxy endpoint is present. See Proposed Fix below.

- Path Traversal
  - UI start: N/A (API only)
  - Endpoint(s):
    - `GET /api/files/view?path=...`
    - `GET /api/themes/render?name=...`
  - Safe probe: `path=README.md` and `name=default` (may return 404 if file/template missing)
  - Success looks like: 200 text for existing files; 404 JSON otherwise

- Sensitive Exposure
  - UI start: `/system`
  - Endpoint(s): `GET /api/debug` and optionally `/.config.bak` if present
  - Safe probe: call `/api/debug`
  - Success looks like: JSON includes selected `process.env` values

- SSRF
  - UI start: N/A (API only)
  - Endpoint(s):
    - `GET /api/preview?url=http://example.com`
    - `POST /api/webhook/validate?callback=http://example.com/ok`
  - Safe probe: use `example.com` for external target
  - Success looks like: JSON `{ ok: true, length: ... }` if remote fetch succeeds

- Open Redirect
  - UI start: `/redirect`
  - Endpoint(s): `GET /redirect?to=...`, `GET /go?site=...`
  - Safe probe: `to=/redirect-success?message=Success`
  - Success looks like: landing on `/redirect-success` with message shown

Proposed Fix (XXE proxy surface)
```ts
// app/api/xxe/proxy/route.ts (example)
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const xml = await req.text()
  const resp = await fetch('http://xxe:5000/parse', { method: 'POST', body: xml, headers: { 'Content-Type': 'application/xml' } })
  const text = await resp.text()
  return new Response(text, { status: resp.status, headers: { 'Content-Type': resp.headers.get('Content-Type') || 'application/json' } })
}
```

### Admin View

- `/admin/messages` shows stored contact messages.
- The page renders message HTML and displays `NEXT_PUBLIC_XSS_FLAG` in a badge.

### System & Components

- `/system` shows components and links.
- `GET /api/components-status` returns versions and `VC_FLAG` (from env) in JSON.
- RSS: `/feed.xml` generated from DB posts.

### Troubleshooting

- Port in use: change port via `npm run dev -p 3001` or stop the process occupying 3000.
- Prisma reset (Docker): `docker compose exec web sh -lc "npx prisma migrate reset --force && node prisma/seed.js"`
- Missing env: create `.env.local` for non-Docker, `.env.flags` for Docker.
- "No Results" on search: try regular strings; UI shows server-rendered HTML panel even when no structured results are present.

### Glossary

- SQLi: SQL Injection (unsanitized inputs in SQL)
- XSS: Cross-Site Scripting (reflected/stored)
- SSTI: Server-Side Template Injection
- IDOR: Insecure Direct Object Reference
- XXE: XML External Entity
- SSRF: Server-Side Request Forgery

### Appendix A: API Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /api/posts | List posts |
| GET | /api/posts/[id] | Get a post |
| GET | /api/search?q= | Search (SQLi/XSS surface) |
| POST | /api/contact | Create contact (Stored XSS, SSTI) |
| GET | /api/admin/messages | List messages |
| GET | /api/admin/comments/[id] | IDOR surface |
| GET | /api/files/view?path= | Path traversal surface |
| GET | /api/themes/render?name= | Path traversal surface |
| GET | /api/preview?url= | SSRF surface |
| POST | /api/webhook/validate?callback= | SSRF surface |
| GET | /api/debug | Sensitive exposure |
| GET | /api/about | About content |
| GET | /feed.xml | RSS feed |
| GET | /go?site= | Open redirect |
| GET | /redirect?to= | Open redirect |

### Appendix B: Postman Collection

Import `NuaSecurity_TrainingApp.postman_collection.json` (root of repo) into Postman or Bruno.

### Appendix C: System Diagram

```mermaid
graph LR
  A[Browser] --> B[Next.js Web (3000)]
  B --> C[(SQLite via Prisma)]
  B --> D[XXE Sidecar (5000)]
  B --> E[Int Flag Service (8080)]
```

### Appendix D: Smoke Test

- Run: `./scripts/smoke.sh` (defaults to `http://localhost:3000`)
- Override base URL: `BASE_URL=http://localhost:8081 ./scripts/smoke.sh` (for Docker)


