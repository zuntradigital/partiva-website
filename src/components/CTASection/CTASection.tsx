"use client";

import Link from "next/link";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

// The override props let the Dashboard's Pages -> Sections editor replace
// this section's heading/body per-locale, and the Media Library replace its
// image, without touching its design/layout.
export default function CTASection({
  override,
  image,
}: {
  override?: {
    titleAr?: string | null; titleEn?: string | null; bodyAr?: string | null; bodyEn?: string | null;
    ctaLabelAr?: string | null; ctaLabelEn?: string | null; ctaHref?: string | null;
  };
  image?: { src: string; altAr: string; altEn: string } | null;
}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        title: override?.titleAr || "جاهز للانطلاق؟",
        description:
          override?.bodyAr ||
          "انضم إلى Partiva مجانًا واكتشف كيف يمكنها تحويل إدارة عملك إلى تجربة أكثر ذكاءً وسهولة، بدون اشتراك شهري.",
        cta: override?.ctaLabelAr || "انضم إلى Partiva مجانًا",
        imageAlt: "واجهة منصة Partiva لإدارة الأعمال",
      }
    : {
        title: override?.titleEn || "Ready to get started?",
        description:
          override?.bodyEn ||
          "Join Partiva for free and see how it makes business management smarter and simpler — no monthly subscription.",
        cta: override?.ctaLabelEn || "Join Partiva Free",
        imageAlt: "Partiva business management platform interface",
      };
  const ctaHref = override?.ctaHref || "/register";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="px-6 py-12"
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
                href={ctaHref}
                className="btn-motion motion-enter motion-delay-2 mt-6 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                {copy.cta}
              </Link>
            </div>

            {/* Product Image */}
            <div className="motion-enter motion-delay-2 w-full md:w-1/2">
              <div className="relative mx-auto max-w-xl">
                <img
                  src={image?.src ?? "/images/banner.jpeg"}
                  alt={(isArabic ? image?.altAr : image?.altEn) || copy.imageAlt}
                  width={1536}
                  height={1024}
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