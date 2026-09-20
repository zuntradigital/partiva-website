// Fetches articles from the admin backend's public API. Always called from
// Server Components (never the browser), so this is not subject to CORS and
// the backend URL is never exposed to client-side code.
import type { Article } from "@/src/app/types/article";
import { resolveMediaSrc } from "@/src/app/lib/mediaUrl";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

function resolveArticleCover(article: Article): Article {
  if (!article.cover?.src) return article;
  return { ...article, cover: { ...article.cover, src: resolveMediaSrc(article.cover.src) } };
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}
interface ApiFailure {
  success: false;
  error_code: string;
  message: string;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}${path}`, { cache: "no-store" });
  } catch {
    return null;
  }

  const json = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;
  if (!response.ok || !json || json.success === false) return null;
  return json.data;
}

export async function fetchAllArticles(): Promise<Article[]> {
  const data = await fetchJson<Article[]>("/api/articles");
  return (data ?? []).map(resolveArticleCover);
}

// Deliberately does not reuse fetchJson: that helper collapses every
// failure (including a transient 429/5xx/network hiccup) into `null`, which
// the page below treats as notFound() -- permanently 404ing a real article
// just because the API was briefly rate-limited or unreachable. Only a
// genuine 404 from the backend should mean "this article doesn't exist";
// anything else throws so Next's error handling (retry-able) takes over
// instead of a misleading "not found".
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  // Next.js dynamic route params are sometimes handed through already
  // percent-encoded (e.g. Arabic slugs) -- decode defensively first so a
  // plain slug never gets encoded twice into an unmatchable path segment.
  let normalized = slug;
  try {
    normalized = decodeURIComponent(slug);
  } catch {
    // slug wasn't encoded (or was malformed) -- use it as-is.
  }

  const response = await fetch(`${BACKEND_URL}/api/articles/${encodeURIComponent(normalized)}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Articles API returned ${response.status}`);

  const json = (await response.json().catch(() => null)) as ApiSuccess<Article> | ApiFailure | null;
  if (!json || json.success === false) throw new Error("Articles API returned an invalid response");
  return resolveArticleCover(json.data);
}
