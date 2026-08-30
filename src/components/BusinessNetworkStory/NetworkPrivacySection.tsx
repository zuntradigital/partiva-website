"use client";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import RevealOnScroll from "../RevealOnScroll/RevealOnScroll";

// Dashboard-managed (page_sections, slug="business-network", key="privacy").
// Rendered as an offset trust-panel (not a centered block) so it reads as a
// distinct reassurance callout rather than a second identical hero.
export default function NetworkPrivacySection({ titleAr, titleEn, bodyAr, bodyEn }: { titleAr: string | null; titleEn: string | null; bodyAr: string | null; bodyEn: string | null }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const title = (isArabic ? titleAr : titleEn) || titleAr;
  const body = (isArabic ? bodyAr : bodyEn) || bodyAr;
  if (!title) return null;

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="px-6 py-16" lang={locale} data-language-managed>
      <div className="mx-auto max-w-4xl">
        <RevealOnScroll variant="up" amount={0.4} margin="0px 0px -10%">
          <div className={`motion-card mx-auto flex max-w-2xl flex-col gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-7 sm:flex-row sm:items-start dark:border-neutral-800 dark:bg-neutral-900/60 ${isArabic ? "sm:mr-0" : "sm:ml-0"}`}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div className={isArabic ? "text-right" : "text-left"}>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h2>
              {body && <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{body}</p>}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
