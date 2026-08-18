"use client";

// app/features/page.tsx
// PAGE-FEATURES — "Features"
// Marketing-level feature presentation for:
// Merchants, Workshops, and Distributors.
//
// WEB-FR-014:
// Do not expose internal technical terminology.
// Use benefit-oriented marketing language.
//
// WEB-FR-016:
// Feature claims must remain consistent with the official Feature Matrix.

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";

// ======================================================
// NOTE:
// Because this page uses useState, it must be a Client Component.
// Next.js does not allow exporting Metadata from a Client Component.
// If you need dynamic SEO metadata, move metadata to a separate
// layout/page wrapper.
// ======================================================

type AudienceId = "merchants" | "workshops" | "distributors";

type AudienceTab = {
  id: AudienceId;
  labelAr: string;
  labelEn: string;
};

type AudienceFeature = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

const audienceTabs: AudienceTab[] = [
  { id: "merchants", labelAr: "لأصحاب المحلات", labelEn: "For shop owners" },
  { id: "workshops", labelAr: "للورش", labelEn: "For workshops" },
  { id: "distributors", labelAr: "للموزعين", labelEn: "For distributors" },
];

// ======================================================
// Audience-specific features
// Keep these descriptions marketing-oriented.
// Do not expose internal terminology.
// ======================================================

const audienceFeatures: Record<AudienceId, AudienceFeature[]> = {
  merchants: [
    {
      titleAr: "إدارة المخزون والفروع",
      titleEn: "Inventory and branch management",
      descriptionAr: "تابع منتجاتك ومخزونك وسهّل إدارة احتياجات محلك وفروعك من مكان واحد.",
      descriptionEn: "Track your products and inventory, and manage your store's and branches' needs from one place.",
    },
    {
      titleAr: "تنظيم أعمالك اليومية",
      titleEn: "Organize your daily operations",
      descriptionAr: "خلّي متابعة عمليات نشاطك أكثر تنظيمًا وسهولة.",
      descriptionEn: "Make tracking your business operations more organized and easier.",
    },
    {
      titleAr: "التواصل مع السوق",
      titleEn: "Connect with the market",
      descriptionAr: "استفد من إمكانية التواصل والوصول إلى أطراف أخرى في السوق عند الحاجة.",
      descriptionEn: "Take advantage of the ability to reach other parties in the market when you need to.",
    },
    {
      titleAr: "التقارير والمتابعة",
      titleEn: "Reports and follow-up",
      descriptionAr: "تابع أداء نشاطك واحصل على رؤية أوضح تساعدك في اتخاذ قرارات أفضل.",
      descriptionEn: "Track your business performance and get clearer insight to help you make better decisions.",
    },
  ],

  workshops: [
    {
      titleAr: "إدارة احتياجات الورشة",
      titleEn: "Manage the workshop's needs",
      descriptionAr: "نظّم المنتجات والاحتياجات المرتبطة بالعمل اليومي للورشة.",
      descriptionEn: "Organize the products and needs related to the workshop's daily work.",
    },
    {
      titleAr: "متابعة المخزون",
      titleEn: "Inventory tracking",
      descriptionAr: "تابع الكميات المتوفرة واعرف احتياجاتك بشكل أسهل.",
      descriptionEn: "Track available quantities and know your needs more easily.",
    },
    {
      titleAr: "تنظيم عملياتك",
      titleEn: "Organize your operations",
      descriptionAr: "خلّي إدارة ومتابعة عمليات الورشة أكثر وضوحًا وتنظيمًا.",
      descriptionEn: "Make managing and tracking the workshop's operations clearer and more organized.",
    },
    {
      titleAr: "التقارير والمتابعة",
      titleEn: "Reports and follow-up",
      descriptionAr: "تابع أداء نشاطك من خلال المعلومات والتقارير المتاحة.",
      descriptionEn: "Track your business performance through the available information and reports.",
    },
  ],

  distributors: [
    {
      titleAr: "إدارة المنتجات والمخزون",
      titleEn: "Product and inventory management",
      descriptionAr: "تابع منتجاتك وكميات المخزون وسهّل إدارة عمليات التوزيع.",
      descriptionEn: "Track your products and stock quantities, and simplify managing distribution operations.",
    },
    {
      titleAr: "إدارة الفروع",
      titleEn: "Branch management",
      descriptionAr: "تابع نشاط الفروع المختلفة ونظّم عملياتها من مكان واحد.",
      descriptionEn: "Track the activity of different branches and organize their operations from one place.",
    },
    {
      titleAr: "التواصل مع السوق",
      titleEn: "Connect with the market",
      descriptionAr: "تواصل مع أطراف أخرى في السوق واستفد من فرص التعاون عند الحاجة.",
      descriptionEn: "Connect with other parties in the market and take advantage of collaboration opportunities when needed.",
    },
    {
      titleAr: "التقارير والمتابعة",
      titleEn: "Reports and follow-up",
      descriptionAr: "احصل على رؤية أوضح لأداء نشاطك وساعد في اتخاذ قرارات أفضل.",
      descriptionEn: "Get clearer insight into your business performance and support better decisions.",
    },
  ],
};

export default function FeaturesPage() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const [activeAudience, setActiveAudience] =
    useState<AudienceId>("merchants");

  const activeFeatures = audienceFeatures[activeAudience];

  const copy = isArabic
    ? {
        badge: "المزايا",
        heroTitle: "كل اللي محتاجه لإدارة نشاطك، وربطه بالسوق لما تحتاج",
        heroDescription: "أدوات ومميزات تساعدك على تنظيم نشاطك ومتابعة أعمالك بطريقة أبسط وأكثر وضوحًا.",
        tabsAriaLabel: "تصفية المزايا حسب الفئة",
        featuresFor: {
          merchants: "مميزات لأصحاب المحلات",
          workshops: "مميزات للورش",
          distributors: "مميزات للموزعين",
        },
        featuresForSub: "اكتشف المميزات المناسبة لطبيعة نشاطك.",
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
        heroTitle: "Everything you need to manage your business and connect it to the market when needed.",
        heroDescription: "Tools and features that help you organize your business and track your operations more simply and clearly.",
        tabsAriaLabel: "Filter benefits by category",
        featuresFor: {
          merchants: "Features for shop owners",
          workshops: "Features for workshops",
          distributors: "Features for distributors",
        },
        featuresForSub: "Discover the features that fit your business.",
        teaserTitle: "Not every capability is available in every plan.",
        teaserDescription: "See the differences between the plans and choose what fits your business.",
        comparePlans: "Compare plans",
        closingTitle: "Discover the features that fit your business",
        closingDescription: "Get started with Partiva and discover how the platform can help you organize and manage your business.",
        registerCompany: "Register your business",
        viewPricing: "View pricing",
      };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="mx-auto max-w-5xl px-6 py-16"
    >
      {/* ======================================================
          Hero
      ====================================================== */}

      <section
        className="text-center"
        id="features"
      >
        <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
          {copy.badge}
        </span>

        <h1 className="mx-auto mt-3 max-w-xl text-2xl font-medium text-neutral-900 dark:text-white">
          {copy.heroTitle}
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          {copy.heroDescription}
        </p>
      </section>

      {/* ======================================================
          Audience Tabs
      ====================================================== */}

      <nav
        aria-label={copy.tabsAriaLabel}
        className="mt-8 flex flex-wrap justify-center gap-2"
      >
        {audienceTabs.map((tab) => {
          const isActive = activeAudience === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveAudience(tab.id)}
              aria-pressed={isActive}
              className={
                isActive
                  ? "rounded-full border border-neutral-400 bg-white px-4 py-1.5 text-xs font-medium text-neutral-900 transition dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  : "rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-white"
              }
            >
              {isArabic ? tab.labelAr : tab.labelEn}
            </button>
          );
        })}
      </nav>

      {/* ======================================================
          Audience Features
      ====================================================== */}

      <section
        className="mt-10"
        aria-labelledby="audience-features-heading"
      >
        <div className="mb-4">
          <h2
            id="audience-features-heading"
            className="text-sm font-medium text-neutral-900 dark:text-white"
          >
            {copy.featuresFor[activeAudience]}
          </h2>

          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {copy.featuresForSub}
          </p>
        </div>

        <div
          key={activeAudience}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {activeFeatures.map((feature) => (
            <article
              key={feature.titleEn}
              className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
            >
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                {isArabic ? feature.titleAr : feature.titleEn}
              </h3>

              <p className="mt-2 text-xs leading-6 text-neutral-600 dark:text-neutral-400">
                {isArabic ? feature.descriptionAr : feature.descriptionEn}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ======================================================
          Pricing Teaser
      ====================================================== */}

      <section className="mt-10 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {copy.teaserTitle}
          </p>

          <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
            {copy.teaserDescription}
          </p>
        </div>

        <Link
          href="/pricing"
          className="w-fit whitespace-nowrap rounded-md border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-900 dark:text-white transition hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          {copy.comparePlans}
        </Link>
      </section>

      {/* ======================================================
          Closing CTA
      ====================================================== */}

      <section className="mt-14 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 py-8 text-center">
        <p className="text-base font-medium text-neutral-900 dark:text-white">
          {copy.closingTitle}
        </p>

        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-neutral-600 dark:text-neutral-400">
          {copy.closingDescription}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            {copy.registerCompany}
          </Link>

          <Link
            href="/pricing"
            className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-900 dark:text-white transition hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {copy.viewPricing}
          </Link>
        </div>
      </section>
    </main>
  );
}
