"use client";
import type { CSSProperties } from "react";
import { Share2, Users, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import RevealOnScroll from "../RevealOnScroll/RevealOnScroll";
import { parseListBody, type PageSection } from "@/src/app/lib/pagesApi";

const dotGrid: CSSProperties = {
  backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
  backgroundSize: "14px 14px",
};

const HIGHLIGHT_ICONS = [Users, ShieldCheck, TrendingUp];

// The same 3 value cards shown in the reference design, under the
// DB-driven intro copy. Dashboard-managed via the "business-network" page's
// "highlights" section.
const defaultHighlightsAr = [
  { heading: "تواصل فعال", body: "تواصل مع أنشطة موثوقة بسهولة" },
  { heading: "بيئة آمنة", body: "تعاون وحماية بياناتك بأعلى معايير" },
  { heading: "نمو مستدام", body: "وسع نطاق أعمالك مع شبكة موثوقة" },
];
const defaultHighlightsEn = [
  { heading: "Effective communication", body: "Easily connect with verified businesses" },
  { heading: "Secure environment", body: "Collaborate with your data protected to the highest standards" },
  { heading: "Sustainable growth", body: "Expand your business reach with a trusted network" },
];

// Dashboard-managed (page_sections, slug="business-network", key="intro").
// Rendered as a single contained "island" card -- soft tinted background,
// a dot-grid accent, a centered icon badge + eyebrow + heading + copy, and
// a row of 3 network-value highlight cards underneath.
export default function NetworkIntroSection({
  titleAr,
  titleEn,
  bodyAr,
  bodyEn,
  highlights: highlightsSection,
}: {
  titleAr: string | null;
  titleEn: string | null;
  bodyAr: string | null;
  bodyEn: string | null;
  highlights?: PageSection | null;
}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const title = (isArabic ? titleAr : titleEn) || titleAr;
  const body = (isArabic ? bodyAr : bodyEn) || bodyAr;
  if (!title) return null;

  const highlightsBody = isArabic ? highlightsSection?.bodyAr : highlightsSection?.bodyEn;
  const highlights = (highlightsBody ? parseListBody(highlightsBody) : isArabic ? defaultHighlightsAr : defaultHighlightsEn).map((h, i) => ({ ...h, icon: HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length] }));

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="px-4 pt-6 sm:px-6 lg:px-10" lang={locale} data-language-managed>
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/70 to-white px-6 py-16 ring-1 ring-neutral-100 sm:py-20 md:px-10 dark:from-blue-500/5 dark:to-neutral-900 dark:ring-neutral-800">
        <div className="pointer-events-none absolute left-6 top-8 h-24 w-24 text-neutral-300/70 dark:text-neutral-700/50" style={dotGrid} aria-hidden="true" />

        <RevealOnScroll variant="scale">
          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-neutral-900">
              <Share2 className="h-7 w-7 text-blue-600 dark:text-blue-400" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <span className="mt-4 block text-sm font-semibold text-blue-600 dark:text-blue-400">
              {isArabic ? "الشبكة التجارية" : "Business Network"}
            </span>
            <h1 className="mt-3 text-3xl font-bold leading-snug text-neutral-900 dark:text-white sm:text-4xl">{title}</h1>
            {body && <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-neutral-500 dark:text-neutral-400">{body}</p>}
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="up" delay={0.1} amount={0.4} margin="0px 0px -10%">
          <div className="relative mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {highlights.map((h, i) => (
              <div key={`${h.heading}-${i}`} className="motion-card flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-900">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
                  <h.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className={isArabic ? "text-right" : "text-left"}>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">{h.heading}</p>
                  <p className="mt-0.5 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
