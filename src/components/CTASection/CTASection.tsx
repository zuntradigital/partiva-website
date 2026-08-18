"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

export default function CTASection() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        title: "جاهز للانطلاق؟",
        description:
          "ابدأ تجربتك المجانية الآن واكتشف كيف يمكن لـ Partiva تحويل إدارة عملك إلى تجربة أكثر ذكاءً وسهولة",
        cta: "ابدأ تجربتك المجانية",
        imageAlt: "واجهة منصة Partiva لإدارة الأعمال",
      }
    : {
        title: "Ready to get started?",
        description:
          "Start your free trial and see how Partiva makes business management smarter and simpler.",
        cta: "Start your free trial",
        imageAlt: "Partiva business management platform interface",
      };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-gray-50 px-6 py-12 dark:bg-slate-900"
      lang={locale}
      data-language-managed
    >
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl bg-blue-700">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            
            {/* Text */}
            <div
              className={`w-full px-8 py-12 sm:px-12 md:w-1/2 md:px-14 lg:py-16 ${
                isArabic ? "text-center md:text-right" : "text-center md:text-left"
              }`}
            >
              <h2 className="motion-enter text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                {copy.title}
              </h2>

              <p className="motion-enter motion-delay-1 mt-4 max-w-md text-sm leading-7 text-blue-100 sm:text-base">
                {copy.description}
              </p>

              <Link
                href="/register"
                className="motion-enter motion-delay-2 mt-6 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                {copy.cta}
              </Link>
            </div>

            {/* Product Image */}
            <div className="motion-enter motion-delay-2 w-full md:w-1/2">
              <div className="relative mx-auto max-w-xl">
                <Image
                  src="/images/banner.jpeg"
                  alt={copy.imageAlt}
                  width={1536}
                  height={1024}
                  priority
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}