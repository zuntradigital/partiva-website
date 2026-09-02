"use client";
import { Store, Wrench, Truck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import RevealOnScroll from "../RevealOnScroll/RevealOnScroll";

const ICONS = [Store, Wrench, Truck];

// Dashboard-managed (page_sections, key="solutions"). The 3 segments are
// stored as one newline-separated body ("Segment — Headline: paragraph."
// per line) -- parsed here purely for presentation, not new content, so
// they render as 3 distinct cards instead of one paragraph. Mirrors the
// same card tokens used by /features' Key Features grid for consistency.
function parseSegments(body: string) {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [segment, rest] = line.split("—").map((s) => s.trim());
      const [headline, paragraph] = (rest ?? "").split(":").map((s) => s.trim());
      return { segment, headline: headline ?? rest ?? "", paragraph: paragraph ?? "" };
    });
}

export default function SolutionsSection({ titleAr, titleEn, bodyAr, bodyEn }: { titleAr: string | null; titleEn: string | null; bodyAr: string | null; bodyEn: string | null }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const title = (isArabic ? titleAr : titleEn) || titleAr;
  const body = (isArabic ? bodyAr : bodyEn) || bodyAr;
  if (!title || !body) return null;
  const segments = parseSegments(body);

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="px-6 py-16" lang={locale} data-language-managed data-story-marker>
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">{title}</h2>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-blue-600" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {segments.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <RevealOnScroll key={s.segment} className="h-full" amount={0.35} margin="0px 0px -10%" delay={(i % 3) * 0.1}>
                <div className="motion-card group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-[#0d1733]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-100 dark:bg-blue-500/10 dark:group-hover:bg-blue-500/20">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{s.segment}</span>
                  <h3 className="mt-1 text-base font-bold leading-snug text-neutral-900 dark:text-white">{s.headline}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{s.paragraph}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link href="/solutions" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            {isArabic ? "استعرض كل الحلول ←" : "Explore all solutions →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
