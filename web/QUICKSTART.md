# Quick Start Guide

## Installation

```bash
cd web
npm install
```

If you encounter issues with native dependencies:
```bash
npm install --legacy-peer-deps
```

Or update package.json manually and run:
```bash
npm install --force
```

## Running the App

```bash
npm run dev
```

Then open http://localhost:3000

## Available Pages

Visit these pages to explore the platform:

### Main Pages
- http://localhost:3000 - Home
- http://localhost:3000/about - About
- http://localhost:3000/search - Search (jQuery 1.8.3)
- http://localhost:3000/archive - Archive
- http://localhost:3000/contact - Contact Form
- http://localhost:3000/admin/messages - Admin Messages (XSS target)
- http://localhost:3000/system - System Status
- http://localhost:3000/qa - QA Console

### Training Surfaces

**Stored XSS:**
1. Go to http://localhost:3000/contact
2. Submit a message with HTML/script content
3. View at http://localhost:3000/admin/messages
4. Try to steal the XSS flag displayed on the page

**Reflected XSS:**
1. Go to http://localhost:3000/search
2. Search for: `<script>alert('XSS')</script>`
3. Observe the reflected content

**SSTI:**
1. Go to http://localhost:3000/contact
2. Expand "Advanced Options"
3. Try template injection in subjectTpl or bodyTpl
4. Example: `{{7*7}}`

**Vulnerable Components:**
1. Go to http://localhost:3000/search
2. Open DevTools console
3. jQuery 1.8.3 is loaded (check for CVEs)

**Open Redirect:**
1. Go to http://localhost:3000/redirect
2. Try: `//evil.com` or external URLs
3. Or use: http://localhost:3000/go?site=https://example.com

## QA Testing

The `/qa` page provides a testing dashboard for all vulnerabilities:
- Click "Open UI Flow" to navigate to the vulnerable page
- Click "Check" to verify the endpoint is accessible
- View stats on pass/warn counts

## Environment Variables

Create `.env.local`:

```env
# API calls will go to these endpoints
NEXT_PUBLIC_API_BASE=/

# Flag that appears in admin messages page (XSS target)
NEXT_PUBLIC_XSS_FLAG=FLAG{captured_via_xss}

# Show QA link in navbar (optional)
NEXT_PUBLIC_SHOW_QA=1
```

## Troubleshooting

### "Module not found" errors
Make sure all dependencies are installed:
```bash
npm install framer-motion axios
```

### TypeScript errors
```bash
npm run type-check
```

### Build errors
```bash
rm -rf .next
npm run dev
```

### Port already in use
Change port in package.json or use:
```bash
npx next dev -p 3001
```

## Key Files

- `app/layout.tsx` - Root layout with navbar/footer
- `components/` - Reusable UI components
- `lib/api.ts` - API client functions
- `lib/motion.ts` - Animation variants
- `app/globals.css` - Tailwind + custom styles
- `public/jquery-1.8.3.min.js` - Vulnerable jQuery

## Notes

- This is intentionally vulnerable - DO NOT deploy publicly
- All vulnerabilities are marked with comments
- XSS flag is set in cookies and displayed on admin page
- No authentication required (intentional for training)

