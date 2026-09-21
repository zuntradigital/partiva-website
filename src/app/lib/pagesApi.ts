// Fetches pages/sections from the admin backend's public API. Called from
// Server Components, so this is not subject to CORS and the backend URL is
// never exposed to client-side code.
import { BACKEND_URL } from "@/src/app/lib/backendUrl";

export interface PageSection {
  id: number;
  key: string;
  titleAr: string | null;
  titleEn: string | null;
  bodyAr: string | null;
  bodyEn: string | null;
  badgeAr: string | null;
  badgeEn: string | null;
  ctaLabelAr: string | null;
  ctaLabelEn: string | null;
  ctaHref: string | null;
  cta2LabelAr: string | null;
  cta2LabelEn: string | null;
  cta2Href: string | null;
  visible: boolean;
  displayOrder: number;
}

export interface PageWithSections {
  slug: string;
  titleAr: string;
  titleEn: string | null;
  visible: boolean;
  showInNav: boolean;
  displayOrder: number;
  sections: PageSection[];
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

export async function fetchPages(): Promise<PageWithSections[]> {
  try {
    // Short revalidation window instead of no-store: this same fetch is
    // made by middleware.ts on every managed route AND by the root layout
    // AND by individual page.tsx files on every request -- a 30s cache lets
    // Next's Data Cache collapse those into far fewer real backend calls
    // while still picking up Dashboard edits within half a minute.
    const response = await fetch(`${BACKEND_URL}/api/pages`, { next: { revalidate: 30 } });
    const json = (await response.json().catch(() => null)) as ApiSuccess<PageWithSections[]> | null;
    if (!response.ok || !json?.success) return [];
    return json.data;
  } catch {
    return [];
  }
}

// Every non-home managed route has a single "main" section representing its
// existing hand-built content -- toggling it hides that whole page, while
// any further sections an admin adds render generically (see
// GenericSection) at their own position. Shared by every route's page.tsx
// so each only needs this one call instead of repeating the resolution
// logic. Fails open (main visible, no extras) if the API is unreachable.
//
// `main`'s own titleAr/titleEn/bodyAr/bodyEn are also returned (previously
// only its visibility was used) so a page's hardcoded hero/intro copy can
// be overridden the same way Home's Hero/CTA already are -- editing that
// row's title/body from the Dashboard's Pages editor, no new section type
// or key needed.
// Section keys that hold structured data consumed directly by a specific
// component (a card grid, a step list, an individual legal topic) rather
// than being rendered as a generic title+body block. Shared here so every
// page's "extras" list -- which otherwise falls back to GenericSection for
// any key it doesn't recognize -- excludes these instead of rendering them
// a second time as a plain duplicate block.
export const DATA_SECTION_KEYS = new Set([
  "trusted-by-list", "features-grid", "how-it-works-steps", "how-it-works-stats",
  "steps", "dual-model", "segments", "about-steps", "benefits", "highlights",
  "collect", "use", "review", "isolation", "network", "consent",
  "eligibility", "plans", "changes", "trial", "refund", "privacy",
]);

export function resolveMainAndExtras(pages: PageWithSections[], slug: string): { mainVisible: boolean; main: PageSection | null; extras: PageSection[] } {
  const page = pages.find((p) => p.slug === slug);
  const sections = page?.sections ?? [];
  const apiReachable = pages.length > 0;
  const main = sections.find((s) => s.key === "main") ?? null;
  const mainVisible = !apiReachable || main !== null;
  const extras = sections.filter((s) => s.key !== "main" && !DATA_SECTION_KEYS.has(s.key)).sort((a, b) => a.displayOrder - b.displayOrder);
  return { mainVisible, main, extras };
}

// Parses a section's body as a newline-delimited list of items -- the
// convention already used in production by Home's CoreValuePillarsSection
// ("01 — Label: sentence." per line) and SolutionsSection ("Segment —
// Headline: body." per line). Each line may be "label — heading: body",
// "heading: body", or a bare label with no heading/body -- callers use
// whichever parts are relevant (e.g. a plain brand-name list only needs
// `label`).
function splitOnce(text: string, separator: string): [string, string | undefined] {
  const i = text.indexOf(separator);
  if (i === -1) return [text.trim(), undefined];
  return [text.slice(0, i).trim(), text.slice(i + separator.length).trim()];
}

export interface ParsedListItem { label: string; heading: string; body: string }
export function parseListBody(body: string | null | undefined): ParsedListItem[] {
  if (!body) return [];
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [first, rest] = splitOnce(line, "—");
      const hasDash = rest !== undefined;
      const [headingPart, bodyPart] = splitOnce(hasDash ? rest : first, ":");
      return {
        label: hasDash ? first : "",
        heading: headingPart,
        body: bodyPart ?? "",
      };
    });
}
