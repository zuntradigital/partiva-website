"use client";

import { Check, RotateCcw, Settings } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

type Plan = {
  nameAr: string;
  nameEn: string;
  audienceAr: string;
  audienceEn: string;
  price: string;
  featured?: boolean;
  featuresAr: string[];
  featuresEn: string[];
};

const plans: Plan[] = [
  {
    nameAr: "الأساسية",
    nameEn: "Basic",
    audienceAr: "للأنشطة الصغيرة",
    audienceEn: "For small businesses",
    price: "99",
    featuresAr: ["مستخدم واحد", "إدارة المخزون", "تقارير أساسية", "دعم عبر البريد"],
    featuresEn: ["One user", "Inventory management", "Basic reports", "Email support"],
  },
  {
    nameAr: "الاحترافية",
    nameEn: "Professional",
    audienceAr: "للأنشطة المتنامية",
    audienceEn: "For growing businesses",
    price: "199",
    featured: true,
    featuresAr: ["حتى 5 مستخدمين", "إدارة الفروع والمخزون", "تقارير متقدمة", "صلاحيات الموظفين"],
    featuresEn: ["Up to 5 users", "Branch and inventory management", "Advanced reports", "Employee permissions"],
  },
  {
    nameAr: "المؤسسية",
    nameEn: "Enterprise",
    audienceAr: "للشركات الكبيرة",
    audienceEn: "For large businesses",
    price: "399",
    featuresAr: ["حتى 15 مستخدم", "إدارة متقدمة للفروع", "تحليلات وتقارير", "دعم مخصص"],
    featuresEn: ["Up to 15 users", "Advanced branch management", "Analytics and reports", "Dedicated support"],
  },
];

export default function PricingSection() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const copy = isArabic
    ? {
        badge: "الأسعار",
        title: "خطط تناسب جميع أحجام الأعمال",
        description: "اختر الخطة المناسبة لك وابدأ رحلتك نحو إدارة أكثر احترافية",
        popular: "الأكثر شعبية",
        perMonth: "الشهر/",
        cta: "ابدأ الآن",
        customTitle: "محتاج خطة مخصصة؟",
        customDescription: "لو نشاطك التجاري له احتياجات خاصة أو محتاج حلول مخصصة، تواصل معنا ونصمم لك الخطة المناسبة.",
        contactUs: "تواصل معنا",
        guarantee: "ضمان استرجاع كامل خلال 14 يوم من الدفع",
      }
    : {
        badge: "Pricing",
        title: "Plans for every business size",
        description: "Choose the plan that fits you and start managing your business professionally.",
        popular: "Most popular",
        perMonth: "/ month",
        cta: "Get started",
        customTitle: "Need a custom plan?",
        customDescription: "If your business has special requirements, contact us and we will design the right plan for you.",
        contactUs: "Contact us",
        guarantee: "Full refund guarantee within 14 days of payment",
      };

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="bg-gray-50 py-20 dark:bg-slate-900" lang={locale} data-language-managed>
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <div className="motion-text mb-14 text-center">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {copy.badge}
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            {copy.title}
          </h2>

          <p className="mt-4 text-gray-500 dark:text-slate-400">
            {copy.description}
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          {plans.map((plan, index) => (
            <div
              key={plan.nameEn}
              className={`motion-card motion-enter motion-delay-${index + 1} relative rounded-2xl bg-white p-8 pt-10 ring-1 dark:bg-slate-800 ${
                plan.featured
                  ? "ring-2 ring-blue-600 shadow-lg lg:-my-4 lg:py-12 dark:ring-blue-500"
                  : "ring-gray-100 shadow-sm dark:ring-slate-700"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  {copy.popular}
                </span>
              )}

              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isArabic ? plan.nameAr : plan.nameEn}
                </h3>

                <p className="mt-1 text-sm text-gray-400 dark:text-slate-400">
                  {isArabic ? plan.audienceAr : plan.audienceEn}
                </p>

                <div className="mt-6 flex items-end justify-center gap-2">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.featured
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {plan.price}
                  </span>

                  <div className="flex flex-col items-start pb-1 text-xs text-gray-400 dark:text-slate-400">
                    <span>SAR</span>
                    <span>{copy.perMonth}</span>
                  </div>
                </div>

                <Link
                  href="/register"
                  className={`mt-6 block w-full rounded-lg py-2.5 text-sm font-semibold text-center transition-colors ${
                    plan.featured
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                  }`}
                >
                  {copy.cta}
                </Link>
              </div>

              <ul className="mt-8 space-y-3.5">
                {(isArabic ? plan.featuresAr : plan.featuresEn).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-300"
                  >
                    <span>{feature}</span>

                    <Check
                      className="h-4 w-4 shrink-0 text-blue-600"
                      strokeWidth={2.5}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Custom Plan */}
        <div className="motion-enter motion-delay-4 mt-8 overflow-hidden rounded-2xl bg-[#0a1229] text-white shadow-lg">
          <div className="flex flex-col items-center gap-6 px-8 py-8 text-center md:flex-row md:justify-between md:text-right">

            {/* Content */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                <Settings className="h-6 w-6 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  {copy.customTitle}
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">
                  {copy.customDescription}
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0a1229] transition-colors hover:bg-gray-100"
            >
              {copy.contactUs}
            </Link>
          </div>
        </div>

        {/* Guarantee note */}
        <div className="motion-enter motion-delay-5 mt-10 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
          <RotateCcw className="h-4 w-4 text-blue-600 dark:text-blue-400" />

          <span>
            {copy.guarantee}
          </span>
        </div>

      </div>
    </section>
  );
}
