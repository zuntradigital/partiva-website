"use client";
import { Network, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

// Dashboard-managed (page_sections, key="business-network"). The body is
// stored as two sentences (description + a mandatory "optional, not
// required" clarification) -- split here purely for presentation so the
// clarification reads as a distinct callout instead of blending into the
// paragraph. A large watermark icon gives this section its own identity,
// distinct from the card-grid sections around it.
export default function BusinessNetworkSection({ titleAr, titleEn, bodyAr, bodyEn }: { titleAr: string | null; titleEn: string | null; bodyAr: string | null; bodyEn: string | null }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const title = (isArabic ? titleAr : titleEn) || titleAr;
  const body = (isArabic ? bodyAr : bodyEn) || bodyAr;
  if (!title) return null;
  const sentences = (body ?? "").split(". ").map((s) => s.trim()).filter(Boolean);
  const [lead, note] = sentences;

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="relative overflow-hidden px-6 py-16" lang={locale} data-language-managed data-story-marker>
      <Network className="pointer-events-none absolute -end-10 top-1/2 h-64 w-64 -translate-y-1/2 text-blue-50 dark:text-blue-500/5" strokeWidth={1} aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          {isArabic ? "الشبكة التجارية" : "Business Network"}
        </span>
        <h2 className="mt-3 text-2xl font-bold leading-snug text-neutral-900 dark:text-white sm:text-3xl">{title}</h2>
        {lead && <p className="mt-4 text-base leading-8 text-neutral-600 dark:text-neutral-400">{lead}.</p>}
        {note && (
          <div className="mx-auto mt-6 flex max-w-md items-start gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-start dark:border-neutral-800 dark:bg-neutral-900/60">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">{note}.</p>
          </div>
        )}
        <div className="mt-7">
          <Link href="/business-network" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            {isArabic ? "اعرف المزيد ←" : "Learn more →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
