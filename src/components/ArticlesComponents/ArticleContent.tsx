

// Short bold labels with no punctuation (e.g. "A", "سريعة الحركة", "1. الطلب")

import { Fragment } from "react";
import { ArticleBlock, InlineRun } from "@/src/app/types/article";

// Articles are now editable via the admin dashboard's CRUD API, not just
// hand-authored source files, so link hrefs can no longer be assumed safe --
// only http(s) absolute URLs or same-site relative paths are ever linkified;
// everything else (javascript:, data:, protocol-relative //host, etc.) is
// rendered as plain text instead of a clickable anchor.
function isSafeHref(href: string): boolean {
  if (href.startsWith("//")) return false;
  if (href.startsWith("/")) return true;
  return /^https?:\/\//i.test(href);
}

// Inline images are now uploaded from the admin's device and stored as
// base64 data URLs, so image `src` also accepts those (raster formats only --
// svg+xml is excluded since it can carry embedded scripts). Link hrefs keep
// using isSafeHref above and still reject data: -- there's no legitimate case
// for a data: link, only for an image source.
const DATA_IMAGE_RE = /^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/]+=*$/;

function isSafeImageSrc(src: string): boolean {
  return isSafeHref(src) || DATA_IMAGE_RE.test(src);
}

function linkedText(text: string, links?: { label: string; href: string }[]) {
  if (!links?.length) return text;

  const labels = links.map(({ label }) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const segments = text.split(new RegExp(`(${labels})`, "g"));

  return segments.map((segment, index) => {
    const link = links.find(({ label }) => label === segment);
    if (!link || !isSafeHref(link.href)) return segment;
    const isExternal = /^https?:\/\//.test(link.href);
    return (
      <a
        key={`${link.href}-${index}`}
        href={link.href}
        {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
        className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 transition-colors hover:text-blue-900"
      >
        {link.label}
      </a>
    );
  });
}

// Renders inline bold/italic/link marks from the dashboard's rich-text toolbar.
// Flat run list -> nested React tags; never dangerouslySetInnerHTML.
function renderRuns(runs: InlineRun[]) {
  return runs.map((run, index) => {
    let node: React.ReactNode = run.text;
    if (run.href && isSafeHref(run.href)) {
      const isExternal = /^https?:\/\//.test(run.href);
      node = (
        <a
          href={run.href}
          {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
          className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 transition-colors hover:text-blue-900"
        >
          {node}
        </a>
      );
    }
    if (run.italic) node = <em>{node}</em>;
    if (run.bold) node = <strong>{node}</strong>;
    return <Fragment key={index}>{node}</Fragment>;
  });
}

// read as sub-headings inside a section, not new top-level sections.
function isSubHeading(text: string) {
  if (/^\d+\.\s/.test(text)) return true;
  if (text.length <= 22 && !text.includes("؟") && !text.includes(":")) return true;
  return false;
}

export default function ArticleContent({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="article-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading": {
            const content = block.runs ? renderRuns(block.runs) : linkedText(block.text, block.links);
            // Legacy content has no explicit level -- keep the existing heuristic
            // exactly as before so already-imported articles render unchanged.
            const level = block.level ?? (isSubHeading(block.text) ? 3 : 2);
            if (level === 3) {
              return (
                <h3 key={i}>
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  {content}
                </h3>
              );
            }
            const Tag = `h${level}` as "h1" | "h2" | "h4" | "h5" | "h6";
            return <Tag key={i}>{content}</Tag>;
          }

          case "paragraph": {
            const content = block.runs ? renderRuns(block.runs) : linkedText(block.text, block.links);
            if (block.callout) {
              return (
                <p
                  key={i}
                  className="my-4 rounded-lg border-e-4 border-signal bg-signal-100/60 px-4 py-3 font-display text-[1.05rem] font-semibold text-navy-900"
                >
                  {content}
                </p>
              );
            }
            return <p key={i}>{content}</p>;
          }

          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className={block.ordered ? "list-none" : "list-none"}>
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    {block.arrow ? (
                      <span className="mt-1 shrink-0 text-signal">←</span>
                    ) : block.ordered ? (
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-800 font-mono text-[11px] font-semibold text-paper">
                        {j + 1}
                      </span>
                    ) : (
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-steel-300" />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </Tag>
            );
          }

          case "table": {
            return (
              <div key={i} className="overflow-x-auto rounded-lg border border-steel-200">
                <table>
                  <thead>
                    <tr>
                      {block.headers.map((h, j) => (
                        <th key={j}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c} className={c === 0 ? "font-mono text-[0.85em] text-navy-800" : ""}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case "flow": {
            return (
              <ol key={i} className="my-5 list-none rounded-xl border border-steel-200 bg-steel-100/60 p-4">
                {block.steps.map((step, j) => (
                  <li key={j}>
                    <div className="flex items-center gap-3 py-1.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-900 font-mono text-xs font-semibold text-paper">
                        {j + 1}
                      </span>
                      <span className="font-medium text-navy-900">{step}</span>
                    </div>
                    {j < block.steps.length - 1 && (
                      <div className="me-3.5 h-4 w-px bg-steel-300" aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ol>
            );
          }

          case "faq": {
            return (
              <div key={i} className="grid gap-2.5">
                {block.items.map((item, j) => (
                  <details
                    key={j}
                    className="group rounded-lg border border-steel-200 bg-white/60 open:border-navy-700/40"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-display font-semibold text-navy-900 marker:content-none">
                      {item.q}
                      <span className="shrink-0 text-signal transition-transform duration-200 group-open:rotate-45">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className="px-4 pb-3.5 pt-0 leading-8 text-ink-soft">{item.a}</p>
                  </details>
                ))}
              </div>
            );
          }

          case "image": {
            if (!isSafeImageSrc(block.src)) return null;
            // eslint-disable-next-line @next/next/no-img-element -- admin-entered
            // URLs can be any domain, so next/image's remotePatterns allowlist
            // doesn't apply here the way it does for the fixed local covers.
            return <img key={i} src={block.src} alt={block.alt} loading="lazy" />;
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
