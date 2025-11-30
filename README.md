Nua Security — Intentionally Vulnerable Training App (Easy)
===========================================================

IMPORTANT: Intentionally Vulnerable — DO NOT expose publicly.

What this is
-------------
- A small, intentionally vulnerable app for training and demos.
- Difficulty: Easy. Ten categories, two examples each (20 total) designed for quick exercises.
- Next.js App Router frontend; Prisma + SQLite; two internal sidecars.

How to run
----------
```bash
docker compose up --build
```
- Web (Docker): `http://localhost:8081/`
- Local dev (no Docker): `cd web && npm i && npm run dev` → `http://localhost:3000/`
- Smoke test:
```bash
./scripts/smoke.sh               # defaults to http://localhost:3000
BASE_URL=http://localhost:8081 ./scripts/smoke.sh  # for Docker
```

Database reset (Prisma)
-----------------------
```bash
docker compose exec web sh -lc "npx prisma migrate reset --force && node prisma/seed.js"
```

Flags and rotation
------------------
- Edit `.env.flags` with your flag values (one per category). Example keys: `SQLI_FLAG, XSS_REFLECTED_FLAG, XSS_STORED_FLAG, SSTI_FLAG, VC_FLAG, IDOR_FLAG, TRAVERSAL_FLAG, DATAEXPOSE_FLAG, SSRF_FLAG, OPENREDIR_FLAG, XXE_FLAG, NEXT_PUBLIC_XSS_FLAG`.
- Files:
  - `flags/webroot-flag.txt` → mounted at `/var/www/flag.txt` (Path Traversal)
  - `flags/etc-flag.txt` → mounted at `/etc/flag.txt` in xxe service (XXE)
- Apply changes:
```bash
docker compose up --build -d
docker compose exec web node prisma/seed.js
```

Route map (high-level)
----------------------
- Pages: `/`, `/about`, `/archive`, `/category/[slug]`, `/post/[id]`, `/contact`, `/search`, `/admin/messages`, `/system`, `/redirect`, `/go`, `/redirect-success`
- APIs: `/api/posts/[id]`, `/api/search`, `/api/contact`, `/api/admin/messages`, `/api/admin/comments/[id]`, `/api/files/view`, `/api/themes/render`, `/api/preview`, `/api/webhook/validate`, `/api/debug`, `/feed.xml`
- Internal-only: `int-flag-service:8080/flag`, `xxe:5000`

Vuln → Endpoint matrix (no PoCs)
--------------------------------
- SQLi: `/api/posts/[id]`, `/api/search`
- XSS (Reflected): `/search` + `/api/search`
- XSS (Stored): `/api/contact` + `/admin/messages`
- SSTI: `/api/contact` (subjectTpl/bodyTpl)
- Vulnerable Components: `/api/components-status` (jQuery 1.8.3, left-pad 1.1.3)
- IDOR: `/api/posts/[id]` (unpublished), `/api/admin/comments/[id]` (hidden)
- XXE: `xxe:/parse`, `xxe:/xml-contact` or `/import`
- Path Traversal: `/api/files/view?path=...`, `/api/themes/render?name=...`
- Sensitive Exposure: `/.config.bak`, `/api/debug`
- SSRF: `/api/preview?url=...`, `/api/webhook/validate?callback=...`
- Open Redirect: `/redirect?to=...`, `/go?site=...` → success page `/redirect-success` reveals flag when reached via redirect.

Do not expose publicly
----------------------
- The UI includes a banner: “Intentionally vulnerable training app — DO NOT EXPOSE PUBLICLY”.
- Run only in isolated training environments.

Further Documentation
---------------------
- See `USER_MANUAL.md` for a full manual, endpoint list, system diagram, and quick tests.



