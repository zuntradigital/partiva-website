import { NextResponse, type NextRequest } from "next/server";

import { BACKEND_URL } from "@/src/app/lib/backendUrl";

// Mirrors the routes seeded into the `pages` table (see backend migration
// 019_create_pages.sql) -- only these managed routes are gated by the
// Dashboard's visible flag; unlisted paths (assets, API, unknown URLs) are
// left untouched and fall through to Next's normal 404 handling.
const MANAGED_SLUGS = new Set([
  "home", "features", "how-it-works", "pricing", "articles", "faq", "about",
  "contact", "help", "support", "privacy", "terms", "login", "register", "forgot-password",
  "solutions", "business-network", "for-merchants",
]);

function slugOf(pathname: string): string {
  if (pathname === "/") return "home";
  return pathname.replace(/^\//, "").split("/")[0]!;
}

export async function middleware(request: NextRequest) {
  const slug = slugOf(request.nextUrl.pathname);
  if (!MANAGED_SLUGS.has(slug)) return NextResponse.next();

  try {
    // The public endpoint already returns only visible pages, so absence
    // from this list means the page is disabled (or doesn't exist).
    // Same URL/options as pagesApi.ts's fetchPages() -- short revalidation
    // window lets this share Next's Data Cache with the root layout's fetch
    // instead of always hitting the backend a second time per request.
    const response = await fetch(`${BACKEND_URL}/api/pages`, { next: { revalidate: 30 } });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.success) return NextResponse.next(); // backend unreachable -- fail open

    const visibleSlugs = new Set((json.data as { slug: string }[]).map((p) => p.slug));
    if (!visibleSlugs.has(slug)) {
      return NextResponse.rewrite(new URL("/__route-disabled", request.url));
    }
  } catch {
    // fail open -- a transient backend hiccup shouldn't take the whole site down
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|images|favicon.ico).*)"],
};
