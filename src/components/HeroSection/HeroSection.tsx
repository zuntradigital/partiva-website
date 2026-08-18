"use client";

import Image from "next/image";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

const trustBadgesAr = [
  "تجربة مجانية 14 يوم",
  "لا تحتاج بطاقة ائتمانية",
  "إلغاء في أي وقت",
];

const trustBadgesEn = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
];

export default function HeroSection() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const trustBadges = isArabic ? trustBadgesAr : trustBadgesEn;

  const copy = isArabic
    ? {
        titleLine1: "منصة متكاملة",
        titleLine2: "لإدارة أعمال قطع الغيار",
        description:
          "Partiva تساعدك على إدارة عملائك، مخزونك، مشترياتك، مبيعاتك وتقاريرك بسهولة من منصة واحدة متكاملة وآمنة.",
        ctaPrimary: "ابدأ تجربتك المجانية",
        ctaSecondary: "استعرض المميزات",
        imageAlt: "واجهة منصة Partiva لإدارة الأعمال",
      }
    : {
        titleLine1: "One complete platform",
        titleLine2: "for managing auto-parts businesses",
        description:
          "Partiva helps you manage customers, inventory, purchasing, sales, and reports from one secure, integrated platform.",
        ctaPrimary: "Start your free trial",
        ctaSecondary: "Explore features",
        imageAlt: "Partiva business management platform interface",
      };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#0a1229]"
      lang={locale}
      data-language-managed
    >
      {/* ambient glow */}
      <div className="motion-glow pointer-events-none absolute left-1/3 top-0 h-150 w-150 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="motion-glow pointer-events-none absolute -left-20 bottom-0 h-100 w-100 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
        {/* Text column */}
        <div className="text-center lg:text-right">
          <h1 className="motion-text text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {copy.titleLine1}
            <br />
            {copy.titleLine2}
          </h1>

          <p className="motion-text motion-delay-1 mx-auto mt-6 max-w-lg text-base leading-relaxed text-gray-400 lg:mx-0">
            {copy.description}
          </p>

          <div className="motion-text motion-delay-2 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              {copy.ctaPrimary}
            </Link>

            <Link
              href="/features"
              className="rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-white/5"
            >
              {copy.ctaSecondary}
            </Link>
          </div>

          <div className="motion-text motion-delay-3 mt-8 flex flex-col items-center gap-3 text-xs text-gray-400 sm:flex-row sm:justify-center sm:gap-6 lg:justify-start">
            {trustBadges.map((badge) => (
              <div key={badge} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image column */}
        <div className="motion-enter motion-delay-2 relative mx-auto w-full max-w-xl">
          <div className="motion-float relative">
            <Image
              src="/images/home.jpeg"
              alt={copy.imageAlt}
              width={900}
              height={650}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
