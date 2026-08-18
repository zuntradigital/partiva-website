"use client";

import { TrendingUp, Building2, Package, LineChart } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

type Step = {
  icon: React.ElementType;
  number: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

// Ordered right-to-left, matching reading order in the RTL layout
const steps: Step[] = [
  {
    icon: LineChart,
    number: 1,
    titleAr: "أنشئ حسابك",
    titleEn: "Create your account",
    descriptionAr: "سجل حسابك في دقائق بدون أي تعقيد.",
    descriptionEn: "Register in minutes with no complexity.",
  },
  {
    icon: Package,
    number: 2,
    titleAr: "أضف منتجاتك",
    titleEn: "Add your products",
    descriptionAr: "استورد أو أضف منتجاتك ومخزونك بسهولة.",
    descriptionEn: "Import or add your products and inventory with ease.",
  },
  {
    icon: Building2,
    number: 3,
    titleAr: "أضف بيانات شركتك",
    titleEn: "Add your company details",
    descriptionAr: "أدخل بيانات شركتك والإعدادات الأساسية.",
    descriptionEn: "Enter your company details and basic settings.",
  },
  {
    icon: TrendingUp,
    number: 4,
    titleAr: "ابدأ العمل",
    titleEn: "Start working",
    descriptionAr: "ابدأ إدارة مبيعاتك ومشترياتك وتقاريرك فور جهوزك.",
    descriptionEn:
      "Start managing sales, purchases, and reports when you are ready.",
  },
];

// Whether a dashed connector appears between this step and the next one
const connectors = [true, false, true];

const stats = [
  {
    value: "+2,500",
    labelAr: "شركة ومنجر",
    labelEn: "Businesses and stores",
    sublabelAr: "يثقون بمنصتنا",
    sublabelEn: "trust our platform",
  },
  {
    value: "+1M",
    labelAr: "منتج قدار",
    labelEn: "Products managed",
    sublabelAr: "عبر المنصة",
    sublabelEn: "through the platform",
  },
  {
    value: "+10M",
    labelAr: "عملية مكتملة",
    labelEn: "Completed transactions",
    sublabelAr: "بنجاح",
    sublabelEn: "successfully",
  },
  {
    value: "99.9%",
    labelAr: "وقت تشغيل",
    labelEn: "Uptime",
    sublabelAr: "منصة مستقرة وآمنة",
    sublabelEn: "A stable and secure platform",
  },
];

export default function HowItWorksSection() {
  const { locale } = useLanguage();

  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        badge: "كيف تعمل",
        title: "ابدأ خلال دقائق فقط",
      }
    : {
        badge: "How it works",
        title: "Get started in minutes",
      };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-gray-50 py-20 dark:bg-slate-900"
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

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-blue-600" />
        </div>

        {/* Steps */}
        <div className="mb-14 grid grid-cols-2 gap-y-12 sm:grid-cols-4 sm:gap-y-0">
          {steps.map((step, i) => (
            <div
              key={step.titleEn}
              className={`motion-card motion-enter motion-delay-${
                i + 1
              } relative flex flex-col items-center text-center`}
            >
              {/* Connector */}
              {connectors[i] && (
                <div
                  className={`absolute top-9 hidden w-full border-t-2 border-dashed border-blue-200 sm:block dark:border-blue-900 ${
                    isArabic ? "right-full" : "left-full"
                  }`}
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
                {isArabic ? step.titleAr : step.titleEn}
              </h3>

              <p className="max-w-45 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                {isArabic ? step.descriptionAr : step.descriptionEn}
              </p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="motion-enter motion-delay-5 rounded-2xl bg-[#0a1229] px-8 py-12">
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.labelEn}
                className={`motion-text motion-delay-${
                  index + 1
                } text-center`}
              >
                <div className="mb-2 text-3xl font-extrabold text-blue-500 sm:text-4xl">
                  {stat.value}
                </div>

                <div className="text-sm font-medium text-gray-200">
                  {isArabic ? stat.labelAr : stat.labelEn}
                </div>

                <div className="text-sm text-gray-400">
                  {isArabic ? stat.sublabelAr : stat.sublabelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}