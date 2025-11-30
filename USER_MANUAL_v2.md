## Nua Security — Intentionally Vulnerable Training App (Easy)

Version: 2 (reflects two instances per vulnerability and latest endpoints)

This manual documents the app behavior for training. It is intentionally vulnerable. Do not expose publicly.

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
- Prisma uses SQLite at `prisma/dev.db`. Seed script: `prisma/seed.js`.
- Sidecars (e.g., XXE) are only available when running via Docker Compose.

### Configuration & Flags

- Env files scanned: `.env.flags` (Docker), optional `.env.local` (web).
- Example `.env.local`:
  ```env
  NEXT_PUBLIC_API_BASE=/
  NEXT_PUBLIC_XSS_FLAG=FLAG{captured_via_xss}
  ```
- Example `.env.flags`: keys referenced in code/docs include `NEXT_PUBLIC_XSS_FLAG`, `XSS_REFLECTED_FLAG`, `SSTI_FLAG`, `VC_FLAG`, `IDOR_FLAG`, `SSRF_FLAG`.
- Rotate flags:
  - Edit `.env.flags`
  - Rebuild and reseed:
    - `docker compose up --build -d`
    - `docker compose exec web node prisma/seed.js`

### UI Tour (key pages)

- Home: `/` — latest posts
- Post: `/post/[id]` — single post view (e.g., `/post/1`)
- Search: `/search` — server-rendered HTML results (loads jQuery 1.8.3)
- About: `/about` — static content from `/api/about`
- Contact: `/contact` — contact form; Advanced template fields
- Archive: `/archive` — filter by month/year
- Category: `/category/[slug]` — posts by category (e.g., `/category/technology`)
- RSS: `/feed.xml` — XML feed generated from posts
- Admin Messages: `/admin/messages` — lists stored contact messages
- System: `/system` — component status and API listing
- Redirect: `/redirect`, `/go` — redirect tester and endpoint
- Redirect Success: `/redirect-success`
- QA: `/qa` — QA helpers

What you should see
- Home: hero + grid of posts (after seeding). If empty, a "No posts" card.
- Search: query field; server-rendered HTML results panel.
- Contact: form with Name/Email/Message and an expandable “Advanced Options”.
- Admin Messages: list of messages; badge shows `NEXT_PUBLIC_XSS_FLAG`; message HTML (e.g., `<b>hi</b>`) renders bold.

### Vulnerability Exercise Guide (two instances each)

Important: Only perform safe probes. Do not use harmful payloads.

- SQL Injection (SQLi)
  - Instance 1 (id-based):
    - Open `/api/posts/1` (try 2, 3 if needed)
    - Expect: JSON for the post returns without auth
  - Instance 2 (LIKE search):
    - Open `/search?q=hello` or use the search box on `/search`
    - Expect: “Server Results” panel shows “Results for: hello”

- Cross-Site Scripting (XSS)
  - Instance 1 (reflected):
    - Open `/search?q=test`
    - Expect: Server returns HTML that reflects `test`, shown in the Server Results panel
  - Instance 2 (stored):
    - Go to `/contact` → submit Name/Email; Message: `<b>hi</b>`
    - Then open `/admin/messages`
    - Expect: Your message appears and the `<b>hi</b>` text is visibly bold

- Server-Side Template Injection (SSTI)
  - Instance 1 (contact templates):
    - Go to `/contact` → expand “Advanced Options”
    - Subject Template: `{{7*7}}` → submit
    - Check DevTools → Network → POST `/api/contact` → Response: `rendered.subject` = `49`
  - Instance 2 (feed title):
    - Open `/feed.xml?titleTpl={{7*7}}`
    - Expect: RSS `<title>49</title>`

- Vulnerable Components
  - Instance 1 (client library in use):
    - Open `/search`
    - DevTools → Sources (or Network): verify `jquery-1.8.3.min.js` is loaded
  - Instance 2 (server templating component):
    - Open `/system` → “Nunjucks (server-side templating)” is listed as vulnerable
    - `/api/components-status` returns `{ jquery: "1.8.3", nunjucks: "3.2.4" }`

- Insecure Direct Object Reference (IDOR)
  - Instance 1 (unpublished draft post by id):
    - Open `/api/posts/1` (or 2/3, etc.)
    - Expect: JSON returns without any login or role check
  - Instance 2 (admin comment by id):
    - Open `/api/admin/comments/1` (or 2/3)
    - Expect: JSON `{ comment: {...}, flag: "..." }` without auth

- XML External Entity (XXE) — internal-only
  - Instances (sidecar service): `/parse`, `/xml-contact`, `/import`
  - When running Docker: `docker compose ps` → ensure `xxe` is up
  - Probe by calling the service from within the Docker network (no public UI)

- Path Traversal
  - Instance 1 (arbitrary file read): `/api/files/view?path=README.md`
    - Expect: file content (200) or a readable 404 JSON if not found
  - Instance 2 (template concat): `/api/themes/render?name=README.md`
    - Expect: file content (200) or readable 404 JSON

- Sensitive Data Exposure
  - Instance 1 (public backup file): `/.config.bak`
    - Expect: JSON with sample “secrets”
  - Instance 2 (debug env dump): `/api/debug`
    - Expect: JSON with selected `process.env` values

- Server-Side Request Forgery (SSRF)
  - Instance 1 (URL preview): `/api/preview?url=http://example.com`
    - Expect: `{ ok: true, length: <number> }`
  - Instance 2 (webhook callback):
    - Browser-friendly: `GET /api/webhook/validate?callback=https://httpbin.org/get`
    - Or `POST /api/webhook/validate?callback=https://httpbin.org/post`
    - Expect: `{ ok: true, length: <number> }`

- Open Redirect
  - Instance 1: `/redirect?to=/redirect-success?message=OK` → lands on success page with message
  - Instance 2: `/go?site=https://example.com` → browser navigates to example.com

### Admin View

- `/admin/messages` shows stored contact messages.
- The page renders message HTML (`<b>…</b>` appears bold) and displays `NEXT_PUBLIC_XSS_FLAG` in a badge.

### System & Components

- `/system` shows components and links.
- `GET /api/components-status` returns versions and `VC_FLAG` (from env) in JSON.
- RSS: `/feed.xml` is generated from DB posts.

### Troubleshooting

- After code changes, restart the app.
- Docker vs non-Docker: use `http://localhost:8081` for Docker; `http://localhost:3000` for local dev.
- Reseed database (root of repo): `npm run prisma:seed`
- Prisma reset (Docker): `docker compose exec web sh -lc "npx prisma migrate reset --force && node prisma/seed.js"`
- If `/api/admin/comments/1` 404s: reseed to restore predictable IDs (1..3).

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
| GET | /api/posts/[id] | Get a post (SQLi/IDOR surface) |
| GET | /api/search?q= | Search (SQLi/XSS surface) |
| POST | /api/contact | Create contact (Stored XSS, SSTI) |
| GET | /api/admin/messages | List messages |
| GET | /api/admin/comments/[id] | IDOR surface |
| GET | /api/files/view?path= | Path traversal surface |
| GET | /api/themes/render?name= | Path traversal surface |
| GET | /api/preview?url= | SSRF surface |
| POST | /api/webhook/validate?callback= | SSRF surface |
| GET | /api/webhook/validate?callback= | SSRF surface (browser) |
| GET | /api/debug | Sensitive exposure |
| GET | /api/about | About content |
| GET | /feed.xml | RSS feed |
| GET | /go?site= | Open redirect |
| GET | /redirect?to= | Open redirect |
| GET | /.config.bak | Public backup file (sensitive exposure) |

### Appendix B: Postman Collection

Import `NuaSecurity_TrainingApp.postman_collection.json` from the repo root.

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
- Override: `BASE_URL=http://localhost:8081 ./scripts/smoke.sh` (for Docker)





