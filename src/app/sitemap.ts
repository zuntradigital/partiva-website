import type { MetadataRoute } from "next";
import { fetchAllArticles } from "@/src/app/lib/articlesApi";

// Matches layout.tsx's metadataBase -- no shared constant exists elsewhere
// in the codebase for this, so this repeats the same literal deliberately.
const SITE_URL = "https://partiva.tech";

// Mirrors middleware.ts's MANAGED_SLUGS (the site's own list of real
// top-level routes), "" standing in for "/" (home).
const STATIC_ROUTES = [
  "",
  "features",
  "how-it-works",
  "pricing",
  "articles",
  "faq",
  "about",
  "contact",
  "help",
  "support",
  "privacy",
  "terms",
  "login",
  "register",
  "forgot-password",
  "solutions",
  "business-network",
  "for-merchants",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}/${route}`,
  }));

  // Each published article translation (ar/en) has its own real slug/URL --
  // see fetchAllArticles(), which only ever returns status="published" rows.
  const articles = await fetchAllArticles();
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: article.publishedAt,
  }));

  return [...staticEntries, ...articleEntries];
}
