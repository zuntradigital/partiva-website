

// Short bold labels with no punctuation (e.g. "A", "سريعة الحركة", "1. الطلب")

import { ArticleBlock } from "@/src/app/types/article";

function linkedText(text: string, links?: { label: string; href: string }[]) {
  if (!links?.length) return text;

  const labels = links.map(({ label }) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const segments = text.split(new RegExp(`(${labels})`, "g"));

  return segments.map((segment, index) => {
    const link = links.find(({ label }) => label === segment);
    if (!link) return segment;
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
            if (isSubHeading(block.text)) {
              return (
                <h3 key={i}>
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  {linkedText(block.text, block.links)}
                </h3>
              );
            }
            return <h2 key={i}>{block.text}</h2>;
          }

          case "paragraph": {
            if (block.callout) {
              return (
                <p
                  key={i}
                  className="my-4 rounded-lg border-e-4 border-signal bg-signal-100/60 px-4 py-3 font-display text-[1.05rem] font-semibold text-navy-900"
                >
                  {block.text}
                </p>
              );
            }
            return <p key={i}>{linkedText(block.text, block.links)}</p>;
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

          default:
            return null;
        }
      })}
    </div>
  );
}
