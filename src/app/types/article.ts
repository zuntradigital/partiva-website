// Content blocks — one shape per kind of thing the article body can contain.
// Keeping this as typed JSON (instead of raw markdown/HTML) means the
// renderer controls every pixel and there is no dangerouslySetInnerHTML.

export type HeadingBlock = {
  type: "heading";
  text: string;
  /** Links are matched by label within heading text and safely rendered by ArticleContent. */
  links?: { label: string; href: string }[];
};

export type ParagraphBlock = {
  type: "paragraph";
  text: string;
  /** Links are matched by label within text and safely rendered by ArticleContent. */
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

export type ArticleBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | TableBlock
  | FlowBlock
  | FaqBlock;

export type ArticleImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
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
};
