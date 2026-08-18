"use client";

import Link from "next/link";
import FaqAccordion from "@/src/components/FaqAccordion/FaqAccordion";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import type { FaqItem } from "@/src/app/types/faq";

type TierId = "free" | "basic" | "professional" | "enterprise";

type Tier = {
  id: TierId;
  name: string;
  audience: string;
  price: number | null;
  billingPeriod: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
};

type PricingContent = {
  badge: string;
  title: string;
  description: string;
  currencyNote: string;

  tiers: Tier[];

  popular: string;

  customTitle: string;
  customDescription: string;
  contactUs: string;

  faqBadge: string;
  faqTitle: string;

  closingTitle: string;
  closingDescription: string;
  freeTrial: string;
  faqButton: string;

  categoryLabels: Record<FaqItem["category"], string>;

  faqItems: FaqItem[];
};

const arabicContent: PricingContent = {
  badge: "الأسعار",

  title: "خطط تناسب جميع أحجام الأعمال",

  description: "اختر الخطة المناسبة لك وابدأ رحلتك نحو إدارة أكثر احترافية",

  currencyNote: "الأسعار بالريال السعودي",

  tiers: [
    {
      id: "free",
      name: "التجربة المجانية",
      audience: "جرب Partiva لمدة أسبوع",
      price: 0,
      billingPeriod: "لمدة 7 أيام",
      features: [
        "تجربة مجانية لمدة أسبوع",
        "إدارة المخزون",
        "إدارة المبيعات والمشتريات",
        "التقارير الأساسية",
      ],
      ctaLabel: "ابدأ تجربتك المجانية",
      ctaHref: "/register?tier=free",
    },

    {
      id: "basic",
      name: "الأساسية",
      audience: "للأنشطة الصغيرة",
      price: 99,
      billingPeriod: "شهريًا",
      features: [
        "مستخدم واحد",
        "إدارة المخزون",
        "تقارير أساسية",
        "دعم عبر البريد",
      ],
      ctaLabel: "ابدأ الآن",
      ctaHref: "/register?tier=basic",
    },

    {
      id: "professional",
      name: "الاحترافية",
      audience: "للأنشطة المتنامية",
      price: 199,
      billingPeriod: "شهريًا",
      features: [
        "حتى 5 مستخدمين",
        "إدارة الفروع والمخزون",
        "تقارير متقدمة",
        "صلاحيات الموظفين",
      ],
      ctaLabel: "ابدأ الآن",
      ctaHref: "/register?tier=professional",
      highlighted: true,
    },

    {
      id: "enterprise",
      name: "المؤسسية",
      audience: "للشركات الكبيرة",
      price: 399,
      billingPeriod: "شهريًا",
      features: [
        "حتى 15 مستخدم",
        "إدارة متقدمة للفروع",
        "تحليلات وتقارير",
        "دعم مخصص",
      ],
      ctaLabel: "ابدأ الآن",
      ctaHref: "/register?tier=enterprise",
    },
  ],

  popular: "الأكثر شعبية",

  customTitle: "محتاج خطة مخصصة؟",

  customDescription:
    "لو نشاطك التجاري له احتياجات خاصة أو محتاج حلول مخصصة، تواصل معنا ونصمم لك الخطة المناسبة.",

  contactUs: "تواصل معنا",

  faqBadge: "الأسئلة الشائعة",

  faqTitle: "أسئلة عن الأسعار",

  closingTitle: "مش متأكد من الخطة المناسبة؟",

  closingDescription: "ابدأ بالتجربة المجانية لمدة أسبوع واكتشف Partiva بنفسك.",

  freeTrial: "ابدأ تجربتك المجانية",

  faqButton: "الأسئلة الشائعة",

  categoryLabels: {
    network: "الشبكة التجارية",
    privacy: "الخصوصية والبيانات",
    review: "التسجيل والمراجعة",
    pricing: "الأسعار والخطط",
  },

  faqItems: [
    {
      id: "upgrade-downgrade",
      category: "pricing",
      question: "أقدر أغيّر خطتي بعد التسجيل؟",
      answer: "أيوه، تقدر تغيّر خطتك في أي وقت.",
    },

    {
      id: "limit-enforcement",
      category: "pricing",
      question: "لو قللت خطتي، هيحصل إيه للبيانات اللي فوق الحد الجديد؟",
      answer: "حدود الخطة الجديدة بتتطبّق فورًا مع أي تغيير في الخطة.",
    },
  ],
};

const englishContent: PricingContent = {
  badge: "Pricing",

  title: "Plans for every business size",

  description:
    "Choose the plan that fits your business and start managing it more professionally.",

  currencyNote: "Prices are in Saudi Riyals",

  tiers: [
    {
      id: "free",
      name: "Free Trial",
      audience: "Try Partiva for one week",
      price: 0,
      billingPeriod: "for 7 days",
      features: [
        "7-day free trial",
        "Inventory management",
        "Sales & purchasing management",
        "Basic reports",
      ],
      ctaLabel: "Start free trial",
      ctaHref: "/register?tier=free",
    },

    {
      id: "basic",
      name: "Basic",
      audience: "For small businesses",
      price: 99,
      billingPeriod: "monthly",
      features: [
        "One user",
        "Inventory management",
        "Basic reports",
        "Email support",
      ],
      ctaLabel: "Get started",
      ctaHref: "/register?tier=basic",
    },

    {
      id: "professional",
      name: "Professional",
      audience: "For growing businesses",
      price: 199,
      billingPeriod: "monthly",
      features: [
        "Up to 5 users",
        "Branch & inventory management",
        "Advanced reports",
        "Employee permissions",
      ],
      ctaLabel: "Get started",
      ctaHref: "/register?tier=professional",
      highlighted: true,
    },

    {
      id: "enterprise",
      name: "Enterprise",
      audience: "For large businesses",
      price: 399,
      billingPeriod: "monthly",
      features: [
        "Up to 15 users",
        "Advanced branch management",
        "Analytics & reports",
        "Dedicated support",
      ],
      ctaLabel: "Get started",
      ctaHref: "/register?tier=enterprise",
    },
  ],

  popular: "Most popular",

  customTitle: "Need a custom plan?",

  customDescription:
    "If your business has special requirements or needs customized solutions, contact us and we will design the right plan for you.",

  contactUs: "Contact us",

  faqBadge: "Frequently asked questions",

  faqTitle: "Pricing questions",

  closingTitle: "Not sure which plan is right for you?",

  closingDescription:
    "Start your free one-week trial and discover Partiva for yourself.",

  freeTrial: "Start free trial",

  faqButton: "FAQ",

  categoryLabels: {
    network: "Trade network",
    privacy: "Privacy & data",
    review: "Registration & review",
    pricing: "Pricing & plans",
  },

  faqItems: [
    {
      id: "upgrade-downgrade",
      category: "pricing",
      question: "Can I change my plan after registration?",
      answer: "Yes, you can change your plan at any time.",
    },

    {
      id: "limit-enforcement",
      category: "pricing",
      question:
        "What happens to data that exceeds the new limit if I downgrade?",
      answer:
        "The new plan limits are applied immediately when the plan changes.",
    },
  ],
};

function formatPrice(price: number | null, locale: "ar" | "en") {
  if (price === null) {
    return locale === "ar" ? "تواصل معنا" : "Contact us";
  }

  if (price === 0) {
    return locale === "ar" ? "مجاني" : "Free";
  }

  return locale === "ar" ? `${price} ر.س` : `${price} SAR`;
}

export default function PricingPage() {
  const { locale } = useLanguage();

  const isArabic = locale === "ar";
  const content = isArabic ? arabicContent : englishContent;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="mx-auto max-w-6xl px-6 py-16"
    >
      {/* Hero */}
      <section className="text-center">
        <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          {content.badge}
        </span>

        <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          {content.title}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-500  dark:text-neutral-400">
          {content.description}
        </p>

        <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
          {content.currencyNote}
        </p>
      </section>

      {/* Plans */}
      <section className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.tiers.map((tier) => (
          <article
            key={tier.id}
            className={`relative rounded-2xl bg-white p-6 dark:bg-neutral-900 ${
              tier.highlighted
                ? "border-2 border-blue-600 shadow-lg"
                : "border border-neutral-200 shadow-sm dark:border-neutral-800"
            }`}
          >
            {/* Popular */}
            {tier.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white whitespace-nowrap">
                {content.popular}
              </span>
            )}

            {/* Plan name */}
            <div className="text-center">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {tier.name}
              </h2>

              <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
                {tier.audience}
              </p>

              {/* Price */}
              <div className="mt-6">
                <span
                  className={`text-4xl font-extrabold ${
                    tier.highlighted
                      ? "text-blue-600"
                      : "text-neutral-900 dark:text-white"
                  }`}
                >
                  {formatPrice(tier.price, locale)}
                </span>

                {tier.price !== 0 && (
                  <span className="ms-2 text-xs text-neutral-400 dark:text-neutral-500">
                    / {tier.billingPeriod}
                  </span>
                )}

                {tier.price === 0 && (
                  <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                    {tier.billingPeriod}
                  </p>
                )}
              </div>

              {/* CTA */}
              <Link
                href={tier.ctaHref}
                className={`mt-6 block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors ${
                  tier.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                }`}
              >
                {tier.ctaLabel}
              </Link>
            </div>

            {/* Features */}
            <ul className="mt-8 space-y-3">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className={`flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  <span className="mt-1 shrink-0 text-blue-600">✓</span>

                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* Custom plan */}
      <section className="mt-10 rounded-2xl bg-[#0a1229] px-8 py-8 text-white">
        <div
          className={`flex flex-col items-center justify-between gap-6 text-center md:flex-row ${
            isArabic ? "md:text-right" : "md:text-left"
          }`}
        >
          <div>
            <h2 className="text-xl font-bold">{content.customTitle}</h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">
              {content.customDescription}
            </p>
          </div>

          <Link
            href="/contact"
            className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0a1229] transition-colors hover:bg-gray-100"
          >
            {content.contactUs}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <div className="mb-6 text-center">
          <span className="text-sm font-semibold text-blue-600">
            {content.faqBadge}
          </span>

          <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">
            {content.faqTitle}
          </h2>
        </div>

        <FaqAccordion
          items={content.faqItems}
          categoryLabels={content.categoryLabels}
        />
      </section>

      {/* Closing CTA */}
      <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
        <p className="text-lg font-semibold text-neutral-900 dark:text-white">
          {content.closingTitle}
        </p>

        <p className="mt-2 text-sm text-neutral-500  dark:text-neutral-500">
          {content.closingDescription}
        </p>

        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/register?tier=free"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {content.freeTrial}
          </Link>

          <Link
            href="/faq"
            className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-white dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {content.faqButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
