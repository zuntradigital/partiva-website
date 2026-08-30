import type { FaqItem } from "@/src/app/types/faq";
import type { BackendFaqItem } from "@/src/app/lib/faqApi";

// Resolves the DB-backed items (fetched server-side in page.tsx) into the
// plain {question, answer} shape FaqAccordion / the FAQPage JSON-LD schema
// expect. Category is whichever bilingual label was set on the FAQ item in
// the Dashboard -- schema must match visible content (Section 11.3).
export function resolveFaqItems(items: BackendFaqItem[], locale: "ar" | "en"): FaqItem[] {
  return items.map((item) => ({
    id: String(item.id),
    category: locale === "ar" ? item.categoryAr : item.categoryEn || item.categoryAr,
    question: locale === "ar" ? item.questionAr : item.questionEn || item.questionAr,
    answer: locale === "ar" ? item.answerAr : item.answerEn || item.answerAr,
  }));
}

// FaqAccordion groups items by category and renders sections in the order
// these keys appear -- built from the fetched items (already ordered by
// display_order) so the grouping/order the Dashboard sets is preserved
// exactly, with no separate fixed category list to keep in sync.
export function resolveCategoryLabels(items: BackendFaqItem[], locale: "ar" | "en"): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const item of items) {
    const label = locale === "ar" ? item.categoryAr : item.categoryEn || item.categoryAr;
    labels[label] = label;
  }
  return labels;
}
