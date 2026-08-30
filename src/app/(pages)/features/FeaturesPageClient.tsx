"use client";

// PAGE-FEATURES — "Features"
// Hero + the Dashboard-managed "Key Features" grid + plan-availability
// teaser + closing CTA, as one page flow. The old per-audience feature
// breakdown (merchants/workshops/distributors) was removed from here: it
// duplicated both the new file-sourced feature grid and the /solutions
// page's own audience breakdown, so it isn't repeated a third time here.

import Link from "next/link";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import FeatureHighlights from "@/src/components/FeatureHighlights/FeatureHighlights";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import type { PageSection } from "@/src/app/lib/pagesApi";

export default function FeaturesPageClient({
  highlights,
  override,
}: {
  highlights: PageSection[];
  override?: { titleAr: string | null; titleEn: string | null; bodyAr: string | null; bodyEn: string | null } | null;
}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        badge: "المزايا",
        // A placeholder title with no body means the section's never been
        // intentionally edited (only visibility was toggled) -- ignore it
        // and keep the real default copy rather than showing a stray title.
        heroTitle: override?.bodyAr ? override.titleAr || "كل اللي محتاجه لإدارة نشاطك، وربطه بالسوق لما تحتاج" : "كل اللي محتاجه لإدارة نشاطك، وربطه بالسوق لما تحتاج",
        heroDescription: override?.bodyAr || "أدوات ومميزات تساعدك على تنظيم نشاطك ومتابعة أعمالك بطريقة أبسط وأكثر وضوحًا.",
        teaserTitle: "مش كل القدرات متاحة في كل خطة",
        teaserDescription: "شوف الفروقات بين الخطط واختار الأنسب لاحتياجات نشاطك.",
        comparePlans: "قارن الخطط",
        closingTitle: "اكتشف المزايا المناسبة لنشاطك",
        closingDescription: "ابدأ مع Partiva واكتشف كيف يمكن للمنصة مساعدتك في تنظيم وإدارة نشاطك.",
        registerCompany: "سجّل شركتك",
        viewPricing: "شاهد الأسعار",
      }
    : {
        badge: "Benefits",
        heroTitle: override?.bodyEn ? override.titleEn || "Everything you need to manage your business and connect it to the market when needed." : "Everything you need to manage your business and connect it to the market when needed.",
        heroDescription: override?.bodyEn || "Tools and features that help you organize your business and track your operations more simply and clearly.",
        teaserTitle: "Not every capability is available in every plan.",
        teaserDescription: "See the differences between the plans and choose what fits your business.",
        comparePlans: "Compare plans",
        closingTitle: "Discover the features that fit your business",
        closingDescription: "Get started with Partiva and discover how the platform can help you organize and manage your business.",
        registerCompany: "Register your business",
        viewPricing: "View pricing",
      };

  return (
    <main dir={isArabic ? "rtl" : "ltr"} lang={locale} data-language-managed className="mx-auto max-w-5xl px-6 py-16">
      <RevealOnScroll>
      <section className="motion-text text-center" id="features">
        <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">{copy.badge}</span>
        <h1 className="mx-auto mt-3 max-w-xl text-2xl font-medium text-neutral-900 dark:text-white">{copy.heroTitle}</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-neutral-600 dark:text-neutral-400">{copy.heroDescription}</p>
      </section>
      </RevealOnScroll>

      <div className="mt-12">
        <FeatureHighlights sections={highlights} />
      </div>

      <RevealOnScroll className="mt-10">
      <section className="motion-enter flex flex-col gap-4 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">{copy.teaserTitle}</p>
          <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">{copy.teaserDescription}</p>
        </div>
        <Link href="/pricing" className="w-fit whitespace-nowrap rounded-md border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-900 dark:text-white transition hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-800">
          {copy.comparePlans}
        </Link>
      </section>
      </RevealOnScroll>

      <RevealOnScroll className="mt-14">
      <section className="motion-enter rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 py-8 text-center">
        <p className="text-base font-medium text-neutral-900 dark:text-white">{copy.closingTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-neutral-600 dark:text-neutral-400">{copy.closingDescription}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800">{copy.registerCompany}</Link>
          <Link href="/pricing" className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-900 dark:text-white transition hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-800">{copy.viewPricing}</Link>
        </div>
      </section>
      </RevealOnScroll>
    </main>
  );
}
