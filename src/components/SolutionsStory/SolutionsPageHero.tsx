"use client";
import type { CSSProperties } from "react";
import { TrendingUp, Users } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import RevealOnScroll from "../RevealOnScroll/RevealOnScroll";

const dotGrid: CSSProperties = {
  backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
  backgroundSize: "14px 14px",
};

// Page-level framing (eyebrow + title + short intro) matching the reference
// layout's ambient hero: soft side circles, a dot-grid accent on each side,
// and two floating icon badges. The ambient decoration itself is fixed, but
// the title/intro text is Dashboard-editable via this page's existing
// "main" page_sections row (same override pattern as Home's Hero/CTA).
// The fixed backdrop here also supplies the soft page-wide tint the
// Solution cards below sit on (same "ambient full-viewport background"
// technique used on the FAQ page).
export default function SolutionsPageHero({
  override,
}: {
  override?: { titleAr: string | null; titleEn: string | null; bodyAr: string | null; bodyEn: string | null } | null;
} = {}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-50/70 via-neutral-50 to-white dark:from-blue-500/5 dark:via-neutral-950 dark:to-neutral-950" aria-hidden="true" />
      <section dir={isArabic ? "rtl" : "ltr"} className="relative overflow-hidden px-6 pb-10 pt-20 text-center md:pt-28" lang={locale} data-language-managed>
        {/* Ambient background: soft side circles + dot-grid accents + floating icon badges */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/2 -left-40 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-500/5" />
          <div className="absolute top-1/2 -right-40 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-500/5" />
          <div className="absolute left-[8%] top-1/3 h-24 w-24 text-neutral-300/70 dark:text-neutral-700/50" style={dotGrid} />
          <div className="absolute right-[8%] top-1/3 h-24 w-24 text-neutral-300/70 dark:text-neutral-700/50" style={dotGrid} />
        </div>

        <div className="motion-float pointer-events-none absolute left-[16%] top-[38%] hidden h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg sm:flex dark:bg-neutral-900" aria-hidden="true">
          <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
        </div>
        <div className="motion-float pointer-events-none absolute right-[16%] top-[34%] hidden h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg sm:flex dark:bg-neutral-900" style={{ animationDelay: "1.4s" }} aria-hidden="true">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
        </div>

        <RevealOnScroll variant="fade">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {isArabic ? "لكل نوع نشاط" : "For every kind of business"}
          </span>
          <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-bold text-neutral-900 dark:text-white sm:text-5xl">
            {(isArabic ? override?.bodyAr : override?.bodyEn)
              ? (isArabic ? override?.titleAr : override?.titleEn) || (isArabic ? "الحلول" : "Solutions")
              : isArabic ? "الحلول" : "Solutions"}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-neutral-500 dark:text-neutral-400">
            {(isArabic ? override?.bodyAr : override?.bodyEn) ||
              (isArabic
                ? "اكتشف الحلول المصممة خصيصًا لتناسب احتياجات عملك وتساعدك على النمو والتوسع بثقة."
                : "Discover solutions designed specifically to fit your business needs and help you grow and expand with confidence.")}
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-blue-600" />
        </RevealOnScroll>
      </section>
    </>
  );
}
