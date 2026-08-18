"use client";

import Link from "next/link";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";

type Segment = {
  id: "merchant" | "workshop" | "distributor";
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
};

const segments: Segment[] = [
  {
    id: "merchant",
    titleAr: "تاجر تجزئة",
    titleEn: "Retailer",
    descriptionAr: "إدارة سريعة وسهلة لفرع واحد",
    descriptionEn: "Fast and easy management for a single branch",
    icon: "building-store",
  },
  {
    id: "workshop",
    titleAr: "ورش الصيانة",
    titleEn: "Maintenance workshops",
    descriptionAr: "مقارنة الأسعار والتوفر بين الموردين",
    descriptionEn: "Compare prices and availability across suppliers",
    icon: "tools",
  },
  {
    id: "distributor",
    titleAr: "موزّعون ومستوردون",
    titleEn: "Distributors and importers",
    descriptionAr: "إدارة متعددة الفروع بصلاحيات مخصصة",
    descriptionEn: "Multi-branch management with custom permissions",
    icon: "building-warehouse",
  },
];

const onboardingSteps = [
  { ar: "التسجيل", en: "Registration" },
  { ar: "المراجعة", en: "Review" },
  { ar: "الاعتماد", en: "Approval" },
  { ar: "البدء الفعلي", en: "Getting started" },
] as const;

export default function AboutContent() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        badge: "عن المنصة",
        heroTitle: "نظام لإدارة أعمالك، وشبكة اختيارية توصلك بباقي السوق",
        heroDescription: "نص يشرح الفكرة المزدوجة بشكل مبسط، بدون مصطلحات تقنية داخلية.",
        dualModel: "الموديل المزدوج",
        independentTitle: "إدارة عملك بشكل مستقل",
        independentDescription: "نظام كامل لإدارة نشاطك التجاري وحده، بدون أي التزام بالشبكة.",
        networkTitle: "شبكة تجارية اختيارية",
        networkDescription: "انضم اختياريًا للبحث والبيع والشراء مع تجار آخرين على الشبكة.",
        segmentsHeading: "حلول لكل فئة",
        registerAsPrefix: "سجّل كـ",
        stepsHeading: "كيف تبدأ",
        stepsNote: "التسجيل يخضع للمراجعة قبل التفعيل، ولا يمنح دخولًا فوريًا.",
        readyTitle: "جاهز تبدأ؟",
        registerCompany: "سجّل شركتك",
        viewPricing: "شاهد الأسعار",
      }
    : {
        badge: "About the platform",
        heroTitle: "A system to manage your business, plus an optional network that connects you with the market",
        heroDescription: "A simple explanation of the dual idea, without internal technical terms.",
        dualModel: "The dual model",
        independentTitle: "Manage your business independently",
        independentDescription: "A complete system to manage your business on its own, with no commitment to the network.",
        networkTitle: "An optional trade network",
        networkDescription: "Join optionally to search, sell, and buy with other traders on the network.",
        segmentsHeading: "Solutions for every segment",
        registerAsPrefix: "Register as ",
        stepsHeading: "How to start",
        stepsNote: "Registration is reviewed before activation and does not grant immediate access.",
        readyTitle: "Ready to begin?",
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
      {/* Hero — single headline + sub-headline stating the dual model [Master: §2] */}
      <section className="text-center">
        <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
          {copy.badge}
        </span>
        <h1 className="mx-auto mt-3 max-w-xl text-2xl font-medium text-neutral-900 dark:text-white">
          {copy.heroTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-600 dark:text-neutral-400">
          {copy.heroDescription}
        </p>
      </section>

      {/* Dual model — business-management vs. optional network */}
      <section className="mt-12" aria-labelledby="dual-model-heading">
        <h2 id="dual-model-heading" className="mb-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          {copy.dualModel}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article className="rounded-xl bg-teal-50 p-5 dark:bg-teal-500/10">
            <h3 className="text-sm font-medium text-teal-800 dark:text-teal-300">
              {copy.independentTitle}
            </h3>
            <p className="mt-2 text-xs text-teal-700 dark:text-teal-400">
              {copy.independentDescription}
            </p>
          </article>
          <article className="rounded-xl bg-purple-50 p-5 dark:bg-purple-500/10">
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">
              {copy.networkTitle}
            </h3>
            <p className="mt-2 text-xs text-purple-700 dark:text-purple-400">
              {copy.networkDescription}
            </p>
          </article>
        </div>
      </section>

      {/* Solutions by audience — mirrors persona table, Section 4 */}
      <section className="mt-12" aria-labelledby="segments-heading">
        <h2 id="segments-heading" className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          {copy.segmentsHeading}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {segments.map((segment) => {
            const title = isArabic ? segment.titleAr : segment.titleEn;

            return (
              <div
                key={segment.id}
                className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-4"
              >
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {title}
                </p>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  {isArabic ? segment.descriptionAr : segment.descriptionEn}
                </p>
                {/* WEB-FR-013 — pre-fills the Activity field on arrival */}
                <Link
                  href={`/register?segment=${segment.id}`}
                  className="mt-3 inline-block text-xs font-medium text-blue-700"
                >
                  {isArabic ? `${copy.registerAsPrefix}${title} ←` : `${copy.registerAsPrefix}${title} →`}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works summary — steps must match Master UC-0001 exactly */}
      <section className="mt-12" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          {copy.stepsHeading}
        </h2>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {onboardingSteps.map((step, index) => (
            <li
              key={step.en}
              className="rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 py-3 text-center text-xs font-medium text-neutral-900 dark:text-white"
            >
              {index + 1}. {isArabic ? step.ar : step.en}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {/* WEB-FR-012 / BR-0003 — no instant-activation claim allowed */}
          {copy.stepsNote}
        </p>
      </section>

      {/* Closing CTA — primary: Register, secondary: Pricing (Section 5.6) */}
      <section className="mt-14 rounded-xl border border-neutral-200 bg-neutral-50 py-8 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
        <p className="text-base font-medium text-neutral-900 dark:text-white">{copy.readyTitle}</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white"
          >
            {copy.registerCompany}
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-900 dark:border-neutral-700 dark:text-white"
          >
            {copy.viewPricing}
          </Link>
        </div>
      </section>
    </main>
  );
}
