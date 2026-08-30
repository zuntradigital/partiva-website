"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";

export default function NotFound() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  const copy = isArabic
    ? {
        title: "الصفحة غير موجودة",
        description: "عذرًا، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها إلى مكان آخر.",
        backHome: "العودة للرئيسية",
        exploreFeatures: "استعرض المميزات",
      }
    : {
        title: "Page not found",
        description: "Sorry, the page you're looking for doesn't exist or may have been moved.",
        backHome: "Back to home",
        exploreFeatures: "Explore features",
      };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-6 py-20 dark:bg-slate-950"
    >
      <div className="w-full max-w-lg text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
          <SearchX className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Error Code */}
        <p className="text-7xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
          404
        </p>

        {/* Title */}
        <h1 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
          {copy.title}
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500 dark:text-slate-400">
          {copy.description}
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <BackArrow className="h-4 w-4" />
            {copy.backHome}
          </Link>

          <Link
            href="/features"
            className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {copy.exploreFeatures}
          </Link>

        </div>
      </div>
    </main>
  );
}
