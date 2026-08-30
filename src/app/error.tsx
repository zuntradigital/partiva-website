"use client";

import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";

// Root error boundary — without this, any thrown Server Component error
// (e.g. a transient backend hiccup) falls through to Next's generic crash
// screen with no retry, and can leave a route's loading.tsx spinner stuck
// instead of ever surfacing the error.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 dark:bg-slate-950"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-2xl bg-red-50 p-4 dark:bg-red-500/10">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
          {isArabic ? "حدث خطأ غير متوقع. حاول مرة أخرى." : "Something went wrong. Please try again."}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {isArabic ? "إعادة المحاولة" : "Try again"}
        </button>
      </div>
    </main>
  );
}
