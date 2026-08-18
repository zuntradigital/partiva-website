"use client";

import { Loader2 } from "lucide-react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";

export default function Loading() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const loadingText = isArabic ? "جاري التحميل..." : "Loading...";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 dark:bg-slate-950"
    >
      <div className="flex flex-col items-center gap-4">

        <div className="motion-float rounded-2xl bg-blue-50 p-4 dark:bg-blue-500/10">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
        </div>

        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
          {loadingText}
        </p>

      </div>
    </main>
  );
}
