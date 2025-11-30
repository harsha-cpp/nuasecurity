## Nua Security — Detailed CTF Write‑Up (Version 2)

Base URL: http://localhost:3000 (use http://localhost:8081 for Docker)

Note: Use only safe probes; these steps demonstrate discovery and confirmation, not exploitation.

### 1) SQL Injection (SQLi)

Instance A: id-based raw SQL
1. Discover endpoint (list posts):
   - URL: `GET /api/posts`
   - Expected: JSON list of posts.
2. Probe single post endpoint:
   - URL: `GET /api/posts/1` (try 2/3 if needed)
   - Expected: JSON for post id=1 returned with no auth.
3. Confirm raw SQL surface (conceptual):
   - Same `GET /api/posts/1` works regardless of published state, indicating missing auth/filters.
4. Validate repeated access:
   - URL: `GET /api/posts/2`, `GET /api/posts/3`
   - Expected: JSON returned (404 only if the id truly doesn’t exist).
5. Evidence capture:
   - Save response JSON and note that the endpoint returns data directly by id with no checks.

Instance B: LIKE concatenation on search
1. Discover search UI:
   - URL: `GET /search`
   - Expected: Search page with server HTML panel.
2. Send a simple query:
   - URL: `GET /search?q=hello`
   - Expected: “Server Results” shows “Results for: hello”.
3. Inspect underlying API call:
   - URL: `GET /api/search?q=hello`
   - Expected: JSON with `html` property containing the server-generated snippet.
4. Confirm dynamic behavior:
   - Change query to `test`, confirm reflected change in HTML.
5. Evidence capture:
   - Save `/api/search` JSON and a screenshot of the server-rendered panel.

---

### 2) Cross‑Site Scripting (XSS)

Instance A: Reflected
1. Open search with a benign query:
   - URL: `GET /search?q=test`
   - Expected: “Server Results” shows “Results for: test”.
2. Check response source:
   - URL: `GET /api/search?q=test`
   - Expected: JSON `html` reflects the query value.
3. Confirm UI rendering path:
   - Page `/search` renders the `html` via `dangerouslySetInnerHTML`.
4. Evidence:
   - Save the JSON and a page screenshot.
5. Note:
   - HTML includes a `data-flag` attribute (training artifact).

Instance B: Stored
1. Submit message:
   - URL: `POST /api/contact`
   - Body: `{ name, email, message: "<b>hi</b>" }`
   - Or via page: `/contact` form.
2. View admin list:
   - URL: `GET /admin/messages`
   - Expected: Your message renders; `<b>hi</b>` shows bold.
3. Confirm public flag usage:
   - On `/admin/messages`, see `NEXT_PUBLIC_XSS_FLAG` badge.
4. Evidence:
   - Screenshot of the bold text; copy of the message JSON (optional via `/api/admin/messages`).
5. Rationale:
   - Stored content rendered without sanitization.

---

### 3) Server‑Side Template Injection (SSTI)

Instance A: Contact template fields
1. Open contact:
   - URL: `GET /contact`
2. Expand Advanced Options and set Subject Template:
   - Value: `{{7*7}}`
3. Submit the form (any Name/Email/Message).
4. Inspect response:
   - Network → `POST /api/contact`
   - Expected: `rendered.subject` equals `49`.
5. Evidence:
   - Save the response JSON showing `rendered.subject: 49`.

Instance B: Feed title
1. Request feed with title template:
   - URL: `GET /feed.xml?titleTpl={{7*7}}`
2. Inspect XML:
   - Expected: `<title>49</title>`
3. Evidence:
   - Save the XML response body.

---

### 4) Vulnerable Components

Instance A: jQuery 1.8.3 in use
1. Open search page:
   - URL: `GET /search`
2. DevTools → Sources (or Network):
   - Expected: `public/jquery-1.8.3.min.js` loaded.
3. Evidence:
   - Screenshot of the file in Sources/Network.

Instance B: Server templating component
1. Open components status:
   - URL: `GET /system`
2. Check API:
   - URL: `GET /api/components-status`
   - Expected: `{ jquery: "1.8.3", nunjucks: "3.2.4", flag: "..." }`
3. Evidence:
   - Save API JSON and a screenshot of `/system` card.

---

### 5) Insecure Direct Object Reference (IDOR)

Instance A: Post by id (no auth)
1. Probe post by id:
   - URL: `GET /api/posts/1` (also try 2, 3)
2. Expected:
   - JSON returns without authentication.
3. Evidence:
   - Save JSON responses.

Instance B: Admin comment by id (no auth)
1. Probe admin comment:
   - URL: `GET /api/admin/comments/1` (also try 2, 3)
2. Expected:
   - JSON with `{ comment: {...}, flag: "..." }`.
3. Evidence:
   - Save JSON responses.

---

### 6) XML External Entity (XXE) — internal only

Instance A: `/parse`
1. Verify service (Docker): `docker compose ps` shows `xxe` running.
2. From within Docker network, POST XML:
   - Target: `http://xxe:5000/parse`
   - Body: `<root>hello</root>`
3. Expected:
   - JSON with `root_tag` and `text`.

Instance B: `/xml-contact` (or `/import`)
1. POST XML to `http://xxe:5000/xml-contact`
2. Expected:
   - JSON parse result similar to `/parse`.
3. Evidence:
   - Save JSON responses.

---

### 7) Path Traversal

Instance A: Arbitrary read
1. Request a benign file:
   - URL: `GET /api/files/view?path=README.md`
2. Expected:
   - 200 text for existing file; 404 JSON if missing.
3. Evidence:
   - Save the text or JSON response.

Instance B: Template/resource concat
1. Request a resource name:
   - URL: `GET /api/themes/render?name=README.md`
2. Expected:
   - 200 file content or 404 JSON.
3. Evidence:
   - Save the response.

---

### 8) Sensitive Data Exposure

Instance A: Public backup
1. Request config backup file:
   - URL: `GET /.config.bak`
2. Expected:
   - JSON with sample secrets.
3. Evidence:
   - Save the JSON.

Instance B: Debug env dump
1. Request debug info:
   - URL: `GET /api/debug`
2. Expected:
   - JSON with selected env vars.
3. Evidence:
   - Save the JSON.

---

### 9) Server‑Side Request Forgery (SSRF)

Instance A: Preview (GET)
1. Request preview of a public URL:
   - URL: `GET /api/preview?url=http://example.com`
2. Expected:
   - JSON `{ ok: true, length: <number> }`.
3. Evidence:
   - Save the JSON.

Instance B: Webhook callback (GET/POST)
1. Browser-testable GET:
   - URL: `GET /api/webhook/validate?callback=https://httpbin.org/get`
2. Or POST variant:
   - URL: `POST /api/webhook/validate?callback=https://httpbin.org/post`
3. Expected:
   - JSON `{ ok: true, length: <number> }`.
4. Evidence:
   - Save the JSON.

---

### 10) Open Redirect

Instance A: Redirect endpoint
1. Navigate to:
   - URL: `GET /redirect?to=/redirect-success?message=OK`
2. Expected:
   - Browser lands on `/redirect-success` and displays the message.
3. Evidence:
   - Screenshot of the success page.

Instance B: Go endpoint
1. Navigate to:
   - URL: `GET /go?site=https://example.com`
2. Expected:
   - Browser navigates to `example.com`.
3. Evidence:
   - Screenshot or note the final URL.

---

### General Troubleshooting

- Use the correct base URL: 3000 (local) or 8081 (Docker).
- If lists look empty, reseed at repo root: `npm run prisma:seed`.
- If port 3000 is busy, run dev on another port: `cd web && npm run dev -p 3001`.
- Archive: shows all posts when no filters are selected; filtering applies only if both month and year are chosen.



