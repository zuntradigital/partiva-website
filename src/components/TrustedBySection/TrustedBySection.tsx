"use client";

import { ShieldCheck } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

const brands = ["AUTO CARE", "TOP PARTS", "SAUDI SPARE", "MOTIVE PLUS", "GEAR HOUSE", "PARTS PRO"];

export default function TrustedBySection() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const heading = isArabic
    ? "يثق بنا الشركات والمتاجر في جميع أنحاء المملكة"
    : "Trusted by businesses and stores across the Kingdom";

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="bg-white py-14 dark:bg-slate-950" lang={locale} data-language-managed>
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="motion-text mb-10 text-base font-medium text-gray-500 dark:text-slate-400">
          {heading}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {brands.map((brand, index) => (
            <div key={brand} className={`motion-enter motion-delay-${Math.min(index + 1, 5)} flex items-center gap-2 text-gray-400 dark:text-slate-500`}>
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
              <span className="text-sm font-bold tracking-wide">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
