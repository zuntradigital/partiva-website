"use client";
import { Store, Wrench, Truck, TrendingUp, Clock, LayoutGrid, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import RevealOnScroll from "../RevealOnScroll/RevealOnScroll";
import { parseListBody, type PageSection } from "@/src/app/lib/pagesApi";

const ICONS: Record<string, LucideIcon> = { merchant: Store, workshop: Wrench, distributor: Truck };
const BENEFIT_ICONS = [TrendingUp, Clock, LayoutGrid];

// The same 3 benefit chips shown under every solution card in the reference
// design -- generic, segment-agnostic value points, shared across all 3
// cards. Dashboard-managed via the "solutions" page's "benefits" section.
const defaultBenefitsAr = ["نمو أسرع", "توفير الوقت", "إدارة أسهل"];
const defaultBenefitsEn = ["Faster growth", "Time-saving", "Easier management"];

// Dashboard-managed (page_sections, slug="solutions", one row per segment:
// merchant/workshop/distributor). Each segment already has its own full
// title+body in the DB (unlike the Home teaser's single combined body), so
// it renders directly -- no text parsing, no invented copy. Cards alternate
// icon/text sides purely for visual rhythm.
export default function SolutionSpotlightSection({
  segmentKey,
  index,
  titleAr,
  titleEn,
  bodyAr,
  bodyEn,
  benefits: benefitsSection,
}: {
  segmentKey: string;
  index: number;
  titleAr: string | null;
  titleEn: string | null;
  bodyAr: string | null;
  bodyEn: string | null;
  benefits?: PageSection | null;
}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const title = (isArabic ? titleAr : titleEn) || titleAr;
  const body = (isArabic ? bodyAr : bodyEn) || bodyAr;
  if (!title) return null;

  const benefitsBody = isArabic ? benefitsSection?.bodyAr : benefitsSection?.bodyEn;
  const benefits = (benefitsBody ? parseListBody(benefitsBody).map((i) => i.heading) : isArabic ? defaultBenefitsAr : defaultBenefitsEn).map((label, i) => ({ label, icon: BENEFIT_ICONS[i % BENEFIT_ICONS.length] }));

  const Icon = ICONS[segmentKey] ?? Store;
  const num = String(index + 1).padStart(2, "0");
  const reversed = index % 2 === 1;

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="px-6 py-6 md:py-8" lang={locale} data-language-managed>
      <div className="mx-auto max-w-5xl">
        <RevealOnScroll variant={reversed ? "right" : "left"} amount={0.3} margin="0px 0px -10%">
          <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-neutral-100 sm:p-10 md:p-12 dark:bg-neutral-900 dark:ring-neutral-800">
            <div className={`flex flex-col gap-10 lg:items-center lg:gap-14 ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
              <div className="lg:flex-1">
                <div className="motion-float mx-auto flex h-48 w-48 items-center justify-center rounded-3xl bg-blue-50 sm:h-56 sm:w-56 dark:bg-blue-500/10">
                  <Icon className="h-16 w-16 text-blue-600 sm:h-20 sm:w-20 dark:text-blue-400" strokeWidth={1.25} aria-hidden="true" />
                </div>
              </div>

              <div className="lg:flex-1">
                <div className={isArabic ? "text-center lg:text-right" : "text-center lg:text-left"}>
                  <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    {isArabic ? `الحل ${num}` : `Solution ${num}`}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold leading-snug text-neutral-900 dark:text-white sm:text-3xl">{title}</h2>
                  {body && <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-neutral-600 dark:text-neutral-400 lg:mx-0">{body}</p>}
                  <Link
                    href={`/register?segment=${segmentKey}`}
                    className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {isArabic ? "استكشف كيف نساعدك ←" : "Explore how we can help ←"}
                  </Link>
                </div>

                <div className={`mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-neutral-100 pt-6 dark:border-neutral-800 ${isArabic ? "lg:justify-end" : "lg:justify-start"}`}>
                  {benefits.map((b, i) => (
                    <span key={`${b.label}-${i}`} className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      <b.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" strokeWidth={1.75} aria-hidden="true" />
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
