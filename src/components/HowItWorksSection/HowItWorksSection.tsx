"use client";

import { TrendingUp, Building2, Package, LineChart } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import { parseListBody, type PageSection } from "@/src/app/lib/pagesApi";
import AnimatedCounter from "@/src/components/AnimatedCounter/AnimatedCounter";

// Parses a stat's display string (e.g. "+2,500", "+1M", "99.9%") into the
// pieces AnimatedCounter needs to count up to instead of appearing instantly
// -- works for any Dashboard-edited value in this same shape, not just the
// 4 defaults, so an admin changing the number doesn't break the animation.
function parseStatValue(raw: string): { prefix: string; value: number; decimals: number; suffix: string; locale: boolean } {
  const match = raw.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!match) return { prefix: "", value: 0, decimals: 0, suffix: raw, locale: false };
  const [, prefix, numberPart, suffix] = match;
  const hasComma = numberPart.includes(",");
  const decimalMatch = numberPart.match(/\.(\d+)$/);
  return {
    prefix,
    value: Number(numberPart.replace(/,/g, "")),
    decimals: decimalMatch ? decimalMatch[1].length : 0,
    suffix,
    locale: hasComma,
  };
}

const ICONS = [LineChart, Package, Building2, TrendingUp];

// Ordered right-to-left, matching reading order in the RTL layout
const defaultStepsAr = [
  { number: "1", title: "أنشئ حسابك", description: "سجل حسابك في دقائق بدون أي تعقيد." },
  { number: "2", title: "أضف منتجاتك", description: "استورد أو أضف منتجاتك ومخزونك بسهولة." },
  { number: "3", title: "أضف بيانات شركتك", description: "أدخل بيانات شركتك والإعدادات الأساسية." },
  { number: "4", title: "ابدأ العمل", description: "ابدأ إدارة مبيعاتك ومشترياتك وتقاريرك فور جهوزك." },
];
const defaultStepsEn = [
  { number: "1", title: "Create your account", description: "Register in minutes with no complexity." },
  { number: "2", title: "Add your products", description: "Import or add your products and inventory with ease." },
  { number: "3", title: "Add your company details", description: "Enter your company details and basic settings." },
  { number: "4", title: "Start working", description: "Start managing sales, purchases, and reports when you are ready." },
];

// Whether a dashed connector appears between this step and the next one
const connectors = [true, false, true];

const defaultStatsAr = [
  { value: "+2,500", label: "شركة ومنجر", sublabel: "يثقون بمنصتنا" },
  { value: "+1M", label: "منتج قدار", sublabel: "عبر المنصة" },
  { value: "+10M", label: "عملية مكتملة", sublabel: "بنجاح" },
  { value: "99.9%", label: "وقت تشغيل", sublabel: "منصة مستقرة وآمنة" },
];
const defaultStatsEn = [
  { value: "+2,500", label: "Businesses and stores", sublabel: "trust our platform" },
  { value: "+1M", label: "Products managed", sublabel: "through the platform" },
  { value: "+10M", label: "Completed transactions", sublabel: "successfully" },
  { value: "99.9%", label: "Uptime", sublabel: "A stable and secure platform" },
];

export default function HowItWorksSection({
  titleAr,
  titleEn,
  bodyAr,
  bodyEn,
  steps: stepsSection,
  stats: statsSection,
}: {
  titleAr?: string | null;
  titleEn?: string | null;
  bodyAr?: string | null;
  bodyEn?: string | null;
  steps?: PageSection | null;
  stats?: PageSection | null;
} = {}) {
  const { locale } = useLanguage();

  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        badge: "كيف تعمل",
        title: titleAr || "ابدأ خلال دقائق فقط",
        body: bodyAr,
      }
    : {
        badge: "How it works",
        title: titleEn || "Get started in minutes",
        body: bodyEn,
      };

  const stepsBody = isArabic ? stepsSection?.bodyAr : stepsSection?.bodyEn;
  const steps = (stepsBody ? parseListBody(stepsBody).map((i) => ({ number: i.label, title: i.heading, description: i.body })) : isArabic ? defaultStepsAr : defaultStepsEn)
    .map((s, i) => ({ ...s, icon: ICONS[i % ICONS.length] }));

  const statsBody = isArabic ? statsSection?.bodyAr : statsSection?.bodyEn;
  const stats = statsBody ? parseListBody(statsBody).map((i) => ({ value: i.label, label: i.heading, sublabel: i.body })) : isArabic ? defaultStatsAr : defaultStatsEn;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="py-20"
      lang={locale}
      data-language-managed
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="motion-text mb-16 text-center">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {copy.badge}
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            {copy.title}
          </h2>

          {copy.body && <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 dark:text-slate-400">{copy.body}</p>}

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-blue-600" />
        </div>

        {/* Steps */}
        <div className="mb-14 grid grid-cols-2 gap-y-12 sm:grid-cols-4 sm:gap-y-0">
          {steps.map((step, i) => (
            <div
              key={`${step.title}-${i}`}
              className={`motion-card motion-enter motion-delay-${
                i + 1
              } relative flex flex-col items-center text-center`}
            >
              {/* Connector -- draws in once the step row is revealed */}
              {connectors[i] && (
                <div
                  className={`motion-line-x motion-delay-${i + 1} absolute top-9 hidden w-full border-t-2 border-dashed border-blue-200 sm:block dark:border-blue-900 ${
                    isArabic ? "right-full" : "left-full"
                  }`}
                  style={{ transformOrigin: isArabic ? "right" : "left" }}
                />
              )}

              <div className="relative z-10 mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700">
                <step.icon
                  className="h-7 w-7 text-blue-600 dark:text-blue-400"
                  strokeWidth={1.75}
                />

                <span className="absolute -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  {step.number}
                </span>
              </div>

              <h3 className="mb-1.5 font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>

              <p className="max-w-45 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="motion-enter motion-delay-5 rounded-2xl bg-[#0a1229] px-8 py-12">
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className={`motion-text motion-delay-${
                  index + 1
                } text-center`}
              >
                <div className="mb-2 text-3xl font-extrabold text-blue-500 sm:text-4xl">
                  {(() => {
                    const parsed = parseStatValue(stat.value);
                    return (
                      <AnimatedCounter
                        value={parsed.value}
                        prefix={parsed.prefix}
                        suffix={parsed.suffix}
                        decimals={parsed.decimals}
                        locale={parsed.locale}
                      />
                    );
                  })()}
                </div>

                <div className="text-sm font-medium text-gray-200">
                  {stat.label}
                </div>

                <div className="text-sm text-gray-400">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}