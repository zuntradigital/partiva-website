"use client";
import { Quote } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

// Dashboard-managed (page_sections, key="problem") -- single editorial
// statement, given an oversized-quote treatment instead of a plain text
// block so it reads as an intentional "problem" beat in the page's story.
export default function ProblemSection({ titleAr, titleEn, bodyAr, bodyEn }: { titleAr: string | null; titleEn: string | null; bodyAr: string | null; bodyEn: string | null }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const title = (isArabic ? titleAr : titleEn) || titleAr;
  const body = (isArabic ? bodyAr : bodyEn) || bodyAr;
  if (!title) return null;

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="px-6 py-16" lang={locale} data-language-managed data-story-marker>
      <div className="relative mx-auto max-w-3xl text-center">
        <Quote className="mx-auto h-9 w-9 text-blue-200 dark:text-blue-500/20" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-bold leading-snug text-neutral-900 dark:text-white sm:text-3xl">{title}</h2>
        {body && <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-neutral-500 dark:text-neutral-400">{body}</p>}
        <div className="mx-auto mt-7 h-1 w-14 rounded-full bg-blue-600" />
      </div>
    </section>
  );
}
