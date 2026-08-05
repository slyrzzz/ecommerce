# AI Agent Guidelines for Payload E-Commerce Storefront

This document provides essential context for AI agents. For detailed task-specific instructions, see the **Skills** below.

---

## Quick Reference

### Critical Commands

```bash
pnpm exec tsc --noEmit      # Type check
pnpm run build              # Full build
pnpm run dev                # Development server
pnpm test                   # Run tests (watch mode)
```

### Skills Architecture

Skills are organized in two locations:

| Location                          | Purpose                           | Contents                                                                 |
| --------------------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| `skills/payload-storefront/`      | Project-specific domain knowledge | Custom rules for the Payload CMS e-commerce storefront.                  |
| `.agents/skills/`                 | Installed community skills        | Vercel React best practices, composition patterns, web design guidelines |

**Community skills** (`.agents/skills/`) -- use for generic best practices:

| Task                           | Skill                         |
| ------------------------------ | ----------------------------- |
| Writing React components       | `vercel-react-best-practices` |
| Component composition patterns | `vercel-composition-patterns` |
| UI accessibility/UX review     | `web-design-guidelines`       |

---

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **CMS / Backend**: Payload CMS 3 (managing Users, Orders, Products, Categories, Pages)
- **Database**: MongoDB
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with CSS custom properties
- **UI Components**: shadcn/ui pattern (Radix UI primitives)
- **State**: React Context (cart), Zustand

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [channel]/          # Channel-scoped routes
│   │   └── (main)/         # Main layout (header/footer)
│   ├── api/                # API routes (og/, revalidate/)
│   └── (payload)/          # Payload CMS admin routes
├── lib/
│   ├── payload/            # Payload CMS Config (Collections, Globals, Hooks)
│   ├── seo/                # SEO helpers
│   └── search/             # Search abstraction
├── ui/components/          # UI components
│   ├── pdp/                # Product detail page
│   ├── plp/                # Product listing page
│   ├── cart/               # Cart drawer
│   ├── nav/                # Navigation
│   └── ui/                 # Base primitives (Button, Badge, etc.)
└── styles/brand.css        # Design tokens (CSS variables)
```

---

## Environment Variables

```env
# Required
MONGODB_URI=mongodb://127.0.0.1/storefront-payload
PAYLOAD_SECRET=your-secret-key

# Optional
NEXT_PUBLIC_STOREFRONT_URL=   # For canonical URLs and OG images
REVALIDATE_SECRET=            # Manual cache invalidation
RESEND_API_KEY=               # Resend API Key for transactional emails
RESEND_DEFAULT_FROM_ADDRESS=  # Default sender email
```

---

## Common Gotchas

### 1. Unified Architecture
This is a unified architecture. **Saleor is NO LONGER used.** Everything from products and categories to users and orders is managed natively inside Payload CMS collections (`src/lib/payload/collections/`).

### 2. Server vs Client Components
Default to Server Components. Only use `"use client"` when you need:
- `useState`, `useEffect`, event handlers
- Browser APIs

### 3. Payload Local API
When fetching data inside Server Components or Server Actions, use the Payload Local API (`getPayload()`) rather than making HTTP requests to the REST or GraphQL endpoints.

### 4. Native Hooks for Business Logic
Since Payload is the single source of truth, utilize Payload Hooks (e.g., `afterChange`) for business logic like sending order confirmation emails, syncing stock, or invalidating the Next.js cache.

---

## Payload CMS 3 & Cloudinary Best Practices

### 1. Server Action Wiring (`actions.ts` & `layout.tsx`)
- **Never leave `payloadServerFunction` as an empty stub.** Always implement it using `handleServerFunctions` from `@payloadcms/next/layouts`:
  ```typescript
  'use server';
  import { handleServerFunctions } from '@payloadcms/next/layouts';
  import configPromise from '@payload-config';
  import { importMap } from './importMap';

  export async function payloadServerFunction(args: any) {
    return handleServerFunctions({
      ...args,
      config: configPromise,
      importMap,
    });
  }
  ```
- **Why:** If `payloadServerFunction` returns `undefined`, client-side UI calls like `getDocumentSlots` (`render-document-slots`) return `undefined`, causing `TypeError: Cannot read properties of undefined (reading 'Upload')` and React Hydration Error #418 in admin media/file upload drawers.

### 2. Admin `importMap` Wiring
- In `src/app/(payload)/importMap.ts`, always re-export the generated import map:
  ```typescript
  export { importMap } from './admin/importMap.js';
  ```
- This ensures `layout.tsx`, `actions.ts`, and admin views receive the complete map of Lexical and Admin Server Components.

### 3. Cloudinary Automatic CDN Optimization (`f_auto, q_auto`)
- Always inject `/f_auto,q_auto/` into Cloudinary asset URLs (`/image/upload/f_auto,q_auto/`) within media collection hooks (`beforeChange`, `afterRead`) and `adminThumbnail`.
- **Why:** Delivers modern WebP/AVIF formats automatically and compresses file sizes by 40%-70% without perceptible loss of visual quality, improving LCP and Core Web Vitals.

### 4. Safe 302 Redirect Handlers in Media Collections
- When defining custom `handlers` in an upload collection (`upload.handlers`) to redirect `/api/media/file/<filename>`, always validate that `targetUrl` is an absolute HTTP/HTTPS URL (`/^https?:\/\//i.test(targetUrl)`).
- If the URL is relative or fallback, return `null` so Payload's default `getFileHandler` serves it from local disk or storage without causing an infinite 302 redirect loop.

