# Nua Security - Premium Frontend

A premium SaaS-quality Next.js frontend for the Nua Security intentionally vulnerable training platform.

## 🎨 Features

- **Premium SaaS Design**: Glassmorphism UI with Tailwind CSS
- **Smooth Animations**: Framer Motion for page transitions and interactions
- **Intentional Vulnerabilities**: Educational security training surfaces
- **TypeScript**: Fully typed codebase
- **Responsive**: Mobile-first design, works on all screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (or compatible version)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

If you encounter build errors with native dependencies, try:
```bash
npm install --legacy-peer-deps
```

2. Create environment file (optional):
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE=/
NEXT_PUBLIC_XSS_FLAG=FLAG{your_xss_flag}
NEXT_PUBLIC_SHOW_QA=1
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
web/
├── app/                      # Next.js 15 App Router pages
│   ├── page.tsx             # Home page
│   ├── about/               # About page
│   ├── archive/             # Archive with filters
│   ├── category/[slug]/     # Category pages
│   ├── post/[id]/           # Post detail
│   ├── contact/             # Contact form (SSTI surface)
│   ├── search/              # Search with jQuery 1.8.3
│   ├── admin/messages/      # Admin messages (XSS surface)
│   ├── system/              # System status
│   ├── redirect/            # Redirect tester
│   ├── redirect-success/    # Redirect success page
│   ├── qa/                  # QA testing console
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── Navbar.tsx           # Floating navbar
│   ├── Footer.tsx           # Footer with warning
│   ├── PostCard.tsx         # Post card component
│   ├── CategoryPills.tsx    # Category filter pills
│   ├── SearchBar.tsx        # jQuery autocomplete search
│   ├── CommentList.tsx      # Static comments
│   ├── Skeletons.tsx        # Loading states
│   └── Toast.tsx            # Toast notifications
├── lib/                     # Utilities
│   ├── api.ts               # Axios API client
│   └── motion.ts            # Framer Motion variants
├── public/
│   └── jquery-1.8.3.min.js  # Intentionally vulnerable jQuery
└── types/
    └── global.d.ts          # Global type definitions
```

## 🎯 Pages Overview

### Public Pages
- **/** - Home page with featured posts
- **/about** - About the platform
- **/archive** - Posts archive with date filters
- **/category/[slug]** - Posts by category
- **/post/[id]** - Individual post view
- **/contact** - Contact form with optional template fields
- **/search** - Search with jQuery 1.8.3 autocomplete

### Admin Pages (No Auth - Intentional)
- **/admin/messages** - View contact submissions with stored XSS

### System Pages
- **/system** - Component status and API endpoints
- **/redirect** - Open redirect tester
- **/redirect-success** - Redirect success page
- **/qa** - QA testing console for vulnerabilities

## 🔒 Intentional Vulnerabilities

This is a **training platform** with intentional security vulnerabilities:

### 1. Stored XSS
- **Location**: `/admin/messages`
- **Surface**: Contact form messages rendered with `dangerouslySetInnerHTML`
- **Target**: XSS flag displayed on admin page

### 2. Reflected XSS
- **Location**: `/search`
- **Surface**: Search results HTML rendered without sanitization

### 3. Vulnerable Components
- **Component**: jQuery 1.8.3
- **Location**: `/search` page
- **CVEs**: Multiple known vulnerabilities

### 4. SSTI (Server-Side Template Injection)
- **Location**: `/contact` form
- **Fields**: `subjectTpl` and `bodyTpl` (optional advanced fields)

### 5. Open Redirect
- **Location**: `/redirect` and `/go` endpoints
- **Parameter**: `to` or `site`

### 6. IDOR (Backend)
- **Location**: `/api/admin/comments/[id]`

### 7. Path Traversal (Backend)
- **Location**: `/api/files/view?path=`

### 8. XXE (Backend)
- **Location**: `/api/webhook/validate`

## 🎨 Styling

### Tailwind Custom Classes
- `.glass-card` - Glassmorphism card
- `.glass-navbar` - Translucent navbar
- `.btn-primary` - Primary gradient button
- `.btn-secondary` - Secondary glass button
- `.input-field` - Form input styling
- `.text-gradient` - Gradient text

### Theme Colors
```css
--bg-primary: #0a0e1a
--bg-secondary: #0f1420
--fg: #e8edf5
--fg-muted: #8a99b3
--accent: #4f7cff
```

## 🎬 Animations

All animations use Framer Motion:
- Page transitions
- Card stagger reveals
- Navbar active underline
- Dropdown menus
- Toast notifications
- Hover effects

## 🔧 API Integration

The frontend connects to backend APIs via `/lib/api.ts`:

```typescript
import { getPosts, getPost, searchPosts } from '@/lib/api';

// Fetch posts
const posts = await getPosts();

// Fetch single post
const post = await getPost('1');

// Search
const results = await searchPosts('query');
```

## ⚠️ Security Warning

**DO NOT DEPLOY THIS APPLICATION TO PRODUCTION**

This is an intentionally vulnerable training platform for educational purposes only. It contains multiple serious security vulnerabilities that can be exploited. Use only in isolated training environments.

## 📝 License

For educational purposes only.

## 🙏 Credits

Built with:
- [Next.js 15](https://nextjs.org/)
- [React 18](https://react.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [jQuery 1.8.3](https://jquery.com/) (intentionally vulnerable)

