// Fetches Media Library assets from the admin backend's public API. Called
// from Server Components, so this is not subject to CORS and the backend
// URL is never exposed to client-side code. Mirrors pagesApi.ts.
const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export interface MediaUsage {
  route: string | null;
  section: string;
}

export interface MediaAsset {
  id: number;
  url: string;
  altAr: string;
  altEn: string;
  width: number | null;
  height: number | null;
  usedIn: MediaUsage[];
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

export async function fetchMedia(): Promise<MediaAsset[]> {
  try {
    // Short revalidation window instead of no-store (mirrors pagesApi.ts) --
    // this is fetched on every request from the root layout; caching it
    // briefly cuts redundant backend calls while still picking up Dashboard
    // media changes within half a minute.
    const response = await fetch(`${BACKEND_URL}/api/media`, { next: { revalidate: 30 } });
    const json = (await response.json().catch(() => null)) as ApiSuccess<MediaAsset[]> | null;
    if (!response.ok || !json?.success) return [];
    return json.data;
  } catch {
    return [];
  }
}

// Finds the media asset registered for a given usage location. `route` is a
// pages.slug, or null for site-wide chrome (Navbar/Footer). Returns null if
// unmanaged/unreachable so callers can fall back to their built-in default.
export function resolveMedia(media: MediaAsset[], route: string | null, section: string): MediaAsset | null {
  return media.find((m) => m.usedIn.some((u) => u.route === route && u.section === section)) ?? null;
}
