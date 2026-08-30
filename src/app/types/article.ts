// Content blocks — one shape per kind of thing the article body can contain.
// Keeping this as typed JSON (instead of raw markdown/HTML) means the
// renderer controls every pixel and there is no dangerouslySetInnerHTML.

/** A single inline-formatted run of text (from the dashboard's rich-text
 * toolbar). Flat, non-nested -- any combination of bold/italic/link on a
 * span, rendered by wrapping in React tags, never dangerouslySetInnerHTML. */
export type InlineRun = { text: string; bold?: boolean; italic?: boolean; href?: string };

export type HeadingBlock = {
  type: "heading";
  text: string;
  /** Explicit H1-H6 from the toolbar. Older/imported headings omit this and
   * keep rendering via ArticleContent's existing sub-heading heuristic. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Inline bold/italic/link formatting. When present, supersedes `text`+`links`. */
  runs?: InlineRun[];
  /** Legacy: links matched by label within heading text. Used only when `runs` is absent. */
  links?: { label: string; href: string }[];
};

export type ParagraphBlock = {
  type: "paragraph";
  text: string;
  /** Inline bold/italic/link formatting. When present, supersedes `text`+`links`. */
  runs?: InlineRun[];
  /** Legacy: links matched by label within text. Used only when `runs` is absent. */
  links?: { label: string; href: string }[];
  /** Short standalone rhetorical question -> rendered as a highlighted callout line */
  callout?: boolean;
};

export type ListBlock = {
  type: "list";
  items: string[];
  ordered?: boolean;
  /** Render with a "→" marker instead of a bullet/number (used for taxonomy breakdowns) */
  arrow?: boolean;
};

export type TableBlock = {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type FlowBlock = {
  type: "flow";
  steps: string[];
};

export type FaqBlock = {
  type: "faq";
  items: { q: string; a: string }[];
};

/** An image placed inline at a specific position within the article body
 * (distinct from the article's single `cover` image). */
export type ImageBlock = {
  type: "image";
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type ArticleBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | TableBlock
  | FlowBlock
  | FaqBlock
  | ImageBlock;

export type ArticleImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ArticleSeo = {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  robots: "index, follow" | "noindex";
};

export type Article = {
  language: "ar" | "en";
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  publishedAt: string; // ISO date
  /** Cover image shown on the collapsed card + the logo badge stamped on it */
  cover: ArticleImage;
  /** Optional extra images shown inside the expanded article body */
  gallery?: ArticleImage[];
  content: ArticleBlock[];
  /** Admin-entered SEO metadata (Dashboard's SEO tab) -- falls back to
   * title/excerpt when a field was left blank. */
  seo: ArticleSeo;
};
