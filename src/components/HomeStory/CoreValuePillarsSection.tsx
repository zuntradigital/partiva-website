"use client";
import { LayoutGrid, Settings, ShieldCheck, BarChart3, Network } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import RevealOnScroll from "../RevealOnScroll/RevealOnScroll";

const ICONS = [LayoutGrid, Settings, ShieldCheck, BarChart3, Network];

// Dashboard-managed (page_sections, key="core-value-pillars"). The 5 pillars
// are stored as one newline-separated body ("01 — Label: sentence." per
// line) -- parsed here purely for presentation, not new content, so they
// render as 5 distinct numbered cards instead of one paragraph.
function parsePillars(body: string) {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [numPart, rest] = line.split("—").map((s) => s.trim());
      const [label, sentence] = (rest ?? "").split(":").map((s) => s.trim());
      return { num: numPart, label: label ?? rest ?? "", sentence: sentence ?? "" };
    });
}

export default function CoreValuePillarsSection({ titleAr, titleEn, bodyAr, bodyEn }: { titleAr: string | null; titleEn: string | null; bodyAr: string | null; bodyEn: string | null }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const title = (isArabic ? titleAr : titleEn) || titleAr;
  const body = (isArabic ? bodyAr : bodyEn) || bodyAr;
  if (!title || !body) return null;
  const pillars = parsePillars(body);

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="px-6 py-16" lang={locale} data-language-managed data-story-marker>
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">{title}</h2>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-blue-600" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((p, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <RevealOnScroll key={p.num} className="h-full" amount={0.4} margin="0px 0px -10%" delay={(i % 5) * 0.08}>
                <div className="motion-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 pt-8 shadow-sm dark:border-white/10 dark:bg-[#0d1733]">
                  <span className="pointer-events-none absolute end-4 top-3 text-5xl font-extrabold text-neutral-100 dark:text-white/5" aria-hidden="true">
                    {p.num}
                  </span>
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-100 dark:bg-blue-500/10 dark:group-hover:bg-blue-500/20">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="relative mt-4 text-sm font-bold text-neutral-900 dark:text-white">{p.label}</h3>
                  <p className="relative mt-1.5 text-xs leading-6 text-neutral-500 dark:text-neutral-400">{p.sentence}</p>
                  <div className="relative mt-4 h-0.5 w-8 rounded-full bg-blue-600 dark:bg-blue-500" />
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
