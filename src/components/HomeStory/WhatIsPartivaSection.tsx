"use client";
import { Layers } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

// Dashboard-managed (page_sections, key="what-is-partiva") -- asymmetric
// text + icon-accent layout so it reads differently from the centered
// Problem section right above it.
export default function WhatIsPartivaSection({ titleAr, titleEn, bodyAr, bodyEn }: { titleAr: string | null; titleEn: string | null; bodyAr: string | null; bodyEn: string | null }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const title = (isArabic ? titleAr : titleEn) || titleAr;
  const body = (isArabic ? bodyAr : bodyEn) || bodyAr;
  if (!title) return null;

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="px-6 py-16" lang={locale} data-language-managed data-story-marker>
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0d1733] sm:p-10">
        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className={isArabic ? "text-center lg:text-right" : "text-center lg:text-left"}>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              {isArabic ? "التعريف" : "Definition"}
            </span>
            <h2 className="mt-3 text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">{title}</h2>
            {body && <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400">{body}</p>}
          </div>
          <div className="relative mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-blue-50 shadow-[0_0_50px_-10px_rgba(59,130,246,0.35)] dark:bg-blue-500/10 dark:shadow-[0_0_60px_-8px_rgba(59,130,246,0.55)] sm:h-32 sm:w-32">
            <Layers className="h-12 w-12 text-blue-600 dark:text-blue-400" strokeWidth={1.5} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
