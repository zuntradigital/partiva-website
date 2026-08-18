"use client";

import { FaqItem } from "@/src/app/types/faq";
import { useState } from "react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";


type FaqAccordionProps = {
  items: FaqItem[];
  categoryLabels: Record<FaqItem["category"], string>;
};

export default function FaqAccordion({
  items,
  categoryLabels,
}: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { locale } = useLanguage();
  const textAlignment = locale === "ar" ? "text-right" : "text-left";

  const toggleItem = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="space-y-8">
      {(Object.keys(categoryLabels) as FaqItem["category"][]).map(
        (category) => {
          const categoryItems = items.filter(
            (item) => item.category === category
          );

          if (categoryItems.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
                {categoryLabels[category]}
              </h2>

              <div className="space-y-3">
                {categoryItems.map((item) => {
                  const isOpen = openId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        aria-expanded={isOpen}
                        className={`flex w-full items-center justify-between gap-4 p-5 transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:hover:bg-neutral-800/60 ${textAlignment}`}
                      >
                        <span className="font-medium text-neutral-900 dark:text-white">
                          {item.question}
                        </span>

                        <span
                          className="shrink-0 text-xl text-neutral-500 dark:text-neutral-400"
                          aria-hidden="true"
                        >
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="border-t border-neutral-100 px-5 pb-5 pt-4 dark:border-neutral-800">
                          <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }
      )}
    </div>
  );
}
