"use client";

import { useLanguage } from "../LanguageProvider/LanguageProvider";

// Renders any Dashboard-added Page Section whose `key` isn't one of the
// site's bespoke marketing sections (Hero, Pricing, ...) -- a simple
// title+body block so a newly added section always has somewhere to render,
// instead of being silently ignored.
export default function GenericSection({
  titleAr,
  titleEn,
  bodyAr,
  bodyEn,
}: {
  titleAr: string | null;
  titleEn: string | null;
  bodyAr: string | null;
  bodyEn: string | null;
}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const title = (isArabic ? titleAr : titleEn || titleAr) || "";
  const body = (isArabic ? bodyAr : bodyEn || bodyAr) || "";

  // Nothing to show yet (e.g. a freshly added, not-yet-filled-in section) --
  // render nothing rather than an empty block taking up layout space.
  if (!title && !body) return null;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-white py-16 dark:bg-slate-950"
      lang={locale}
      data-language-managed
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            {title}
          </h2>
        )}
        {body && (
          <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-slate-300">
            {body}
          </p>
        )}
      </div>
    </section>
  );
}
