# Partiva Website

Public-facing marketing/product site for Partiva. Content (pages/sections, articles, pricing, FAQ, testimonials, contact info) is managed via the Partiva Dashboard and served by the Partiva Admin Backend.

## Features

- Arabic/English with RTL/LTR, persisted language preference
- Dark/light theme
- Pages driven by the Dashboard's Pages/Sections manager — visibility and placement are content-managed, not hardcoded
- Articles/blog, pricing, FAQ, testimonials, contact — all fetched live from the backend API
- Security headers (CSP, HSTS, etc.) and SEO metadata/structured data (JSON-LD) per page

## Tech Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS
- `motion` for animation, `lucide-react`/`react-icons` for icons

## Project Structure

```
src/
  app/            # routes, incl. (pages) route group for most public pages
  components/     # Navbar, Footer, section components, shared UI (FaqAccordion, RevealOnScroll, etc.)
  middleware.ts    # gates routes by the Dashboard's page-visibility setting
```

## Requirements

- Node.js 20+
- A running instance of the Partiva Admin Backend (see that project's README)

## Installation

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Purpose |
|---|---|
| `BACKEND_API_URL` | Backend API base URL, used server-side (Server Components, middleware) — never exposed to the browser |
| `NEXT_PUBLIC_BACKEND_API_URL` | Same backend URL, exposed to client components that fetch directly (pricing, testimonials, etc.) |

## Development

```bash
npm run dev     # Next.js dev server
npm run lint    # ESLint
```

## Build / Production

```bash
npm run build
npm start
```

## Architecture Notes

- `middleware.ts` checks each managed route against the backend's `/api/pages` visibility list on every request and fails open (shows the page) if the backend is temporarily unreachable, so a backend hiccup never takes the whole site down.
- Article/rich-text content is rendered from typed JSON blocks (never raw HTML/`dangerouslySetInnerHTML`); link and image sources are scheme-validated against an allowlist before rendering.
- A `next.config.ts`-defined Content-Security-Policy and other security headers apply to every route.

## Deployment Notes

- Requires `BACKEND_API_URL` / `NEXT_PUBLIC_BACKEND_API_URL` to point at the deployed backend.
- Standard Next.js production deployment (`next build` + `next start`, or a platform like Vercel).

### reCAPTCHA (production)
The Contact and Register forms use reCAPTCHA v2 (checkbox). Set `RECAPTCHA_SITE_KEY` (runtime) on the website host and the matching `RECAPTCHA_SECRET_KEY` on the backend; both must come from the same key pair, registered for the production domain(s). Google's public test key is refused on any non-local host (the form shows an "unavailable" notice instead of a test widget), and the backend refuses Google's test secret on a real deployment.
