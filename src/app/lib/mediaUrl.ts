// Single source of truth for turning a backend-relative media path into a
// browser-loadable URL. Any asset uploaded through the Dashboard's Media
// Library (Navbar/Footer logos, Hero/CTA images, article covers, or any
// future placement) is stored and returned by the backend as a
// backend-relative path under "/uploads/..." -- it must be resolved against
// the backend's own origin before the browser requests it, or it resolves
// against this Website's own origin instead and 404s. A plain "/..." path
// that is NOT under "/uploads/" is left untouched, since that shape is also
// valid for a legacy Website-relative asset (e.g. the seeded "/images/..."
// defaults) and must keep resolving against the Website's own origin.
//
// Mirrors partiva-dashboard's src/lib/media.ts `resolveMediaUrl` so both
// apps resolve the exact same stored value the exact same way.
const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export function resolveMediaSrc(src: string): string {
  return src.startsWith("/uploads/") ? `${BACKEND_URL}${src}` : src;
}
