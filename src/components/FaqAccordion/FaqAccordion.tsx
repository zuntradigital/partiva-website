"use client";

import { FaqItem } from "@/src/app/types/faq";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

type FaqAccordionProps = {
  items: FaqItem[];
  categoryLabels: Record<FaqItem["category"], string>;
  // Fires when a question is opened (not on close) -- optional, so every
  // existing caller that doesn't pass it behaves exactly as before.
  onOpen?: (item: FaqItem) => void;
};

// Matches the easing already used site-wide for scroll reveals (globals.css).
const EASE = [0.22, 1, 0.36, 1] as const;

// Same code-split feature bundle RevealOnScroll already loads -- reusing the
// module path means webpack dedupes it into one shared chunk instead of two.
const loadFeatures = () =>
  import("@/src/components/RevealOnScroll/motion-features").then((mod) => mod.default);

export default function FaqAccordion({ items, categoryLabels, onOpen }: FaqAccordionProps) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const textAlignment = isArabic ? "text-right" : "text-left";
  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  const categories = useMemo(
    () =>
      (Object.keys(categoryLabels) as FaqItem["category"][]).filter(
        (category) => items.some((item) => item.category === category),
      ),
    [categoryLabels, items],
  );

  const [activeCategory, setActiveCategory] = useState<FaqItem["category"] | null>(categories[0] ?? null);
  const categoryItems = useMemo(
    () => items.filter((item) => item.category === activeCategory),
    [items, activeCategory],
  );
  const [openId, setOpenId] = useState<string | null>(categoryItems[0]?.id ?? null);

  // Switching category always surfaces its first question open, mirroring
  // the reference design's "one answer already visible" affordance.
  function selectCategory(category: FaqItem["category"]) {
    setActiveCategory(category);
    const firstItem = items.find((item) => item.category === category);
    setOpenId(firstItem?.id ?? null);
  }

  // Guards against a stale open id if `items` changes under the same category.
  useEffect(() => {
    if (openId && !categoryItems.some((item) => item.id === openId)) {
      setOpenId(categoryItems[0]?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryItems]);

  if (!activeCategory) return null;

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[272px_1fr] lg:gap-6">
        {/* Category sidebar */}
        <nav aria-label={isArabic ? "تصنيفات الأسئلة" : "Question categories"} className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            const count = items.filter((item) => item.category === category).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => selectCategory(category)}
                aria-current={isActive}
                className={`group flex shrink-0 items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-sm transition-all duration-200 ${textAlignment} ${
                  isActive
                    ? "bg-white shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700"
                    : "text-neutral-500 hover:bg-white/60 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/40 dark:hover:text-white"
                }`}
              >
                <span className={`font-medium ${isActive ? "text-neutral-900 dark:text-white" : ""}`}>
                  {categoryLabels[category]}
                </span>
                <span className="flex items-center gap-2">
                  <span className="hidden text-xs text-neutral-400 dark:text-neutral-500 sm:inline">{count}</span>
                  <ChevronIcon
                    className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-neutral-300 dark:text-neutral-600"}`}
                    aria-hidden="true"
                  />
                </span>
              </button>
            );
          })}
        </nav>

        {/* Active category's questions -- min-w-0 stops this grid track from
            growing to fit an open answer's content (grid items default to
            min-width:auto), and w-full on each card locks it to the track's
            width so opening/closing never resizes or shifts the layout. */}
        <div className="min-w-0 space-y-3">
          {categoryItems.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={`relative w-full overflow-hidden rounded-2xl border transition-colors duration-300 ${
                  isOpen
                    ? "border-blue-200 bg-white shadow-md dark:border-blue-900/60 dark:bg-neutral-800"
                    : "border-neutral-200/80 bg-white/60 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
                }`}
              >
                {isOpen && (
                  <div
                    className="motion-glow pointer-events-none absolute -top-10 inset-x-0 -z-10 mx-auto h-28 w-28 rounded-full bg-blue-500/20 blur-2xl dark:bg-blue-400/15"
                    aria-hidden="true"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (!isOpen) onOpen?.(item);
                    setOpenId(isOpen ? null : item.id);
                  }}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className={`flex w-full items-center justify-between gap-4 p-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 ${textAlignment}`}
                >
                  <span className={`min-w-0 flex-1 font-medium transition-colors ${isOpen ? "text-blue-700 dark:text-blue-300" : "text-neutral-900 dark:text-white"}`}>
                    {item.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isOpen
                        ? "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                        : "border-neutral-200 text-neutral-400 dark:border-neutral-700 dark:text-neutral-500"
                    }`}
                  >
                    <Plus
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
                      aria-hidden="true"
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      id={panelId}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className={`border-t border-neutral-100 px-5 pb-5 pt-4 text-sm leading-7 text-neutral-600 dark:border-neutral-800 dark:text-neutral-400 ${textAlignment}`}>
                        {item.answer}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </LazyMotion>
  );
}
