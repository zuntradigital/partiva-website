"use client";

import Link from "next/link";
import { Building2, Network, Store, Wrench, Truck, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import { parseListBody, type PageSection } from "@/src/app/lib/pagesApi";

// Fixed segment order/ids (drives the /register?segment= link + icon) --
// only the label/description text is DB-editable, via the "segments" section.
const SEGMENT_ORDER = ["merchant", "workshop", "distributor"] as const;
const SEGMENT_ICONS: Record<string, LucideIcon> = {
  merchant: Store,
  workshop: Wrench,
  distributor: Truck,
};

const defaultSegmentsAr = [
  { heading: "تاجر تجزئة", body: "إدارة سريعة وسهلة لفرع واحد" },
  { heading: "ورش الصيانة", body: "مقارنة الأسعار والتوفر بين الموردين" },
  { heading: "موزّعون ومستوردون", body: "إدارة متعددة الفروع بصلاحيات مخصصة" },
];
const defaultSegmentsEn = [
  { heading: "Retailer", body: "Fast and easy management for a single branch" },
  { heading: "Maintenance workshops", body: "Compare prices and availability across suppliers" },
  { heading: "Distributors and importers", body: "Multi-branch management with custom permissions" },
];

const defaultDualModelAr = [
  { heading: "إدارة عملك بشكل مستقل", body: "نظام كامل لإدارة نشاطك التجاري وحده، بدون أي التزام بالشبكة." },
  { heading: "شبكة تجارية اختيارية", body: "انضم اختياريًا للبحث والبيع والشراء مع تجار آخرين على الشبكة." },
];
const defaultDualModelEn = [
  { heading: "Manage your business independently", body: "A complete system to manage your business on its own, with no commitment to the network." },
  { heading: "An optional trade network", body: "Join optionally to search, sell, and buy with other traders on the network." },
];

const defaultStepsAr = ["التسجيل", "المراجعة", "الاعتماد", "البدء الفعلي"];
const defaultStepsEn = ["Registration", "Review", "Approval", "Getting started"];

// The override props let the Dashboard's Pages -> Sections editor replace
// this page's heading/intro per-locale (mirrors CTASection/HeroSection),
// and the dual-model/segments/about-steps sections let it edit the card and
// step-strip copy, without touching layout, icons, or segment routing.
export default function AboutContent({
  override,
  dualModel,
  segments: segmentsSection,
  steps: stepsSection,
}: {
  override?: { titleAr?: string | null; titleEn?: string | null; bodyAr?: string | null; bodyEn?: string | null };
  dualModel?: PageSection | null;
  segments?: PageSection | null;
  steps?: PageSection | null;
}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const dualModelBody = isArabic ? dualModel?.bodyAr : dualModel?.bodyEn;
  const dualModelItems = dualModelBody ? parseListBody(dualModelBody) : isArabic ? defaultDualModelAr : defaultDualModelEn;
  const [independentItem, networkItem] = dualModelItems;

  const segmentsBody = isArabic ? segmentsSection?.bodyAr : segmentsSection?.bodyEn;
  const segmentItems = segmentsBody ? parseListBody(segmentsBody) : isArabic ? defaultSegmentsAr : defaultSegmentsEn;
  const segments = SEGMENT_ORDER.map((id, i) => ({ id, title: segmentItems[i]?.heading ?? "", description: segmentItems[i]?.body ?? "" }));

  const stepsBody = isArabic ? stepsSection?.bodyAr : stepsSection?.bodyEn;
  const onboardingSteps = stepsBody ? parseListBody(stepsBody).map((i) => i.heading) : isArabic ? defaultStepsAr : defaultStepsEn;

  const copy = isArabic
    ? {
        badge: "عن المنصة",
        heroTitle: override?.titleAr || "نظام لإدارة أعمالك، وشبكة اختيارية توصلك بباقي السوق",
        heroDescription: override?.bodyAr || "نص يشرح الفكرة المزدوجة بشكل مبسط، بدون مصطلحات تقنية داخلية.",
        dualModel: "الموديل المزدوج",
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
        heroTitle:
          override?.titleEn ||
          "A system to manage your business, plus an optional network that connects you with the market",
        heroDescription:
          override?.bodyEn || "A simple explanation of the dual idea, without internal technical terms.",
        dualModel: "The dual model",
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
      <section className="relative overflow-hidden pt-4 text-center">
        <div className="motion-glow pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-500/10" aria-hidden="true" />
        <RevealOnScroll variant="fade">
          <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
            {copy.badge}
          </span>
          <h1 className="mx-auto mt-3 max-w-xl text-2xl font-medium text-neutral-900 dark:text-white">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-600 dark:text-neutral-400">
            {copy.heroDescription}
          </p>
        </RevealOnScroll>
      </section>

      {/* Dual model — business-management vs. optional network */}
      <section className="mt-16" aria-labelledby="dual-model-heading">
        <h2 id="dual-model-heading" className="mb-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          {copy.dualModel}
        </h2>
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
          <RevealOnScroll variant="left" amount={0.4} margin="0px 0px -10%">
            <article className="motion-card flex h-full flex-col rounded-xl bg-teal-50 p-6 dark:bg-teal-500/10">
              <Building2 className="h-7 w-7 text-teal-700 dark:text-teal-300" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-3 text-sm font-medium text-teal-800 dark:text-teal-300">
                {independentItem?.heading}
              </h3>
              <p className="mt-2 text-xs leading-6 text-teal-700 dark:text-teal-400">
                {independentItem?.body}
              </p>
            </article>
          </RevealOnScroll>
          <div className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500">
            +
          </div>
          <RevealOnScroll variant="right" delay={0.08} amount={0.4} margin="0px 0px -10%">
            <article className="motion-card flex h-full flex-col rounded-xl bg-purple-50 p-6 dark:bg-purple-500/10">
              <Network className="h-7 w-7 text-purple-700 dark:text-purple-300" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-3 text-sm font-medium text-purple-800 dark:text-purple-300">
                {networkItem?.heading}
              </h3>
              <p className="mt-2 text-xs leading-6 text-purple-700 dark:text-purple-400">
                {networkItem?.body}
              </p>
            </article>
          </RevealOnScroll>
        </div>
      </section>

      {/* Solutions by audience — mirrors persona table, Section 4 */}
      <section className="mt-12" aria-labelledby="segments-heading">
        <h2 id="segments-heading" className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          {copy.segmentsHeading}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {segments.map((segment, i) => {
            const title = segment.title;
            const Icon = SEGMENT_ICONS[segment.id];

            return (
              <RevealOnScroll key={segment.id} className="h-full" amount={0.35} margin="0px 0px -10%" delay={(i % 3) * 0.08}>
                <div className="motion-card flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-neutral-900 dark:text-white">
                    {title}
                  </p>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    {segment.description}
                  </p>
                  {/* WEB-FR-013 — pre-fills the Activity field on arrival */}
                  <Link
                    href={`/register?segment=${segment.id}`}
                    className="mt-3 inline-block text-xs font-medium text-blue-700 dark:text-blue-400"
                  >
                    {isArabic ? `${copy.registerAsPrefix}${title} ←` : `${copy.registerAsPrefix}${title} →`}
                  </Link>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* How it works summary — steps must match Master UC-0001 exactly */}
      <section className="mt-12" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          {copy.stepsHeading}
        </h2>
        <ol className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
          <div className="pointer-events-none absolute top-4 hidden h-px w-full bg-neutral-200 sm:block dark:bg-neutral-800" aria-hidden="true" />
          {onboardingSteps.map((step, index) => (
            <RevealOnScroll key={`${step}-${index}`} amount={0.5} margin="0px 0px -10%" delay={index * 0.08}>
              <li className="motion-card relative flex flex-col items-center gap-2 rounded-md border border-neutral-200 bg-white py-3 text-center text-xs font-medium text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white sm:border-0 sm:bg-transparent sm:dark:bg-transparent">
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            </RevealOnScroll>
          ))}
        </ol>
        <p className="mt-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {/* WEB-FR-012 / BR-0003 — no instant-activation claim allowed */}
          {copy.stepsNote}
        </p>
      </section>

      {/* Closing CTA — primary: Register, secondary: Pricing (Section 5.6) */}
      <RevealOnScroll variant="scale">
        <section className="mt-14 rounded-xl border border-neutral-200 bg-neutral-50 py-8 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
          <p className="text-base font-medium text-neutral-900 dark:text-white">{copy.readyTitle}</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/register"
              className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900"
            >
              {copy.registerCompany}
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-900 transition-transform hover:-translate-y-0.5 dark:border-neutral-700 dark:text-white"
            >
              {copy.viewPricing}
            </Link>
          </div>
        </section>
      </RevealOnScroll>
    </main>
  );
}
