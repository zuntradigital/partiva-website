"use client";

import { LayoutGrid, Package, Building2, ShieldCheck, UserCheck, Truck, BarChart3, Bell, Plug, Sparkles } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import RevealOnScroll from "../RevealOnScroll/RevealOnScroll";
import type { PageSection } from "@/src/app/lib/pagesApi";

// One icon per known feature-detail key, matching the icon-in-badge pattern
// already used by FeaturesSection's cards elsewhere on the site. Falls back
// to a generic icon for any future Dashboard-added section key.
const ICONS: Record<string, typeof Sparkles> = {
  "business-management": LayoutGrid,
  "products-inventory": Package,
  "branch-management": Building2,
  "employee-access": ShieldCheck,
  "customer-management": UserCheck,
  "supplier-management": Truck,
  "reports-insights": BarChart3,
  notifications: Bell,
  integrations: Plug,
};

// Dashboard-managed "Key Features" grid, embedded as one contained block
// within the Features page's own flow (hero -> this -> plan teaser -> CTA)
// instead of a separate full-bleed section, so the page reads as one piece.
// Content (title/body per card) comes from the same page_sections rows
// every other GenericSection reads, just laid out as a card grid. Surface,
// border, and text tokens are the exact same neutral/blue pairs already
// used by the teaser/closing-CTA boxes further down this same page --
// theme-aware, no new colors.
export default function FeatureHighlights({ sections }: { sections: PageSection[] }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? { badge: "المزايا", title: "أبرز المزايا", subtitle: "أدوات ومميزات تساعدك على تنظيم نشاطك ومتابعة أعمالك." }
    : { badge: "Features", title: "Key features", subtitle: "Tools and features that help you organize your business and track your operations." };

  if (sections.length === 0) return null;

  return (
    // The container gets its own reveal-on-scroll (fades/slides in as a
    // whole), and each of the 9 cards nested inside also has its own
    // independent RevealOnScroll instance for the per-card stagger -- both
    // trigger off their own viewport entry, not each other's.
    <RevealOnScroll amount={0.2} margin="0px 0px -8%">
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-14 dark:border-neutral-800 dark:bg-neutral-900/60 sm:px-10"
      lang={locale}
      data-language-managed
    >
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{copy.badge}</span>
        <h2 className="mt-3 text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">{copy.title}</h2>
        <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-blue-600" />
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">{copy.subtitle}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s, index) => {
          const Icon = ICONS[s.key] ?? Sparkles;
          return (
            <RevealOnScroll key={s.id} className="h-full" amount={0.4} margin="0px 0px -10%" delay={(index % 9) * 0.08}>
              <div className="motion-card group flex h-full flex-col rounded-xl bg-white p-6 ring-1 ring-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-neutral-800 dark:ring-neutral-700">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-100 dark:bg-blue-500/10 dark:group-hover:bg-blue-500/20">
                  <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-bold leading-snug text-neutral-900 dark:text-white">
                  {(isArabic ? s.titleAr : s.titleEn) || s.titleAr}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                  {(isArabic ? s.bodyAr : s.bodyEn) || s.bodyAr}
                </p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
    </RevealOnScroll>
  );
}
