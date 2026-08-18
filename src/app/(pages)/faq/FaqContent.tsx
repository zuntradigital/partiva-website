"use client";

import FaqAccordion from "@/src/components/FaqAccordion/FaqAccordion";
import Link from "next/link";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import { categoryLabelsAr, categoryLabelsEn, resolveFaqItems } from "./faqData";

export default function FaqContent() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const faqItems = resolveFaqItems(locale);
  const categoryLabels = isArabic ? categoryLabelsAr : categoryLabelsEn;

  const copy = isArabic
    ? {
        badge: "الأسئلة الشائعة",
        heroTitle: "أسئلة بتتكرر كتير عن Partiva",
        heroDescription: "إجابات مباشرة عن الشبكة الاختيارية، الخصوصية، ومراحل المراجعة.",
        sectionHeading: "الأسئلة الشائعة",
        stillQuestion: "لسه عندك سؤال؟",
        registerCompany: "سجّل شركتك",
        contactUs: "تواصل معنا",
      }
    : {
        badge: "Frequently asked questions",
        heroTitle: "Common questions about Partiva",
        heroDescription: "Direct answers about the optional network, privacy, and the review stages.",
        sectionHeading: "Frequently asked questions",
        stillQuestion: "Still have a question?",
        registerCompany: "Register your business",
        contactUs: "Contact us",
      };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="mx-auto max-w-3xl px-6 py-16"
    >
      {/* Hero */}
      <section className="text-center">
        <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
          {copy.badge}
        </span>
        <h1 className="mx-auto mt-3 max-w-xl text-2xl font-medium text-neutral-900 dark:text-white">
          {copy.heroTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-600 dark:text-neutral-400">
          {copy.heroDescription}
        </p>
      </section>

      {/* Accordion — client component fires faq_interaction analytics
          (Section 12) with question_id on expand, per the events table */}
      <section className="mt-10" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="sr-only">
          {copy.sectionHeading}
        </h2>
        <FaqAccordion items={faqItems} categoryLabels={categoryLabels} />
      </section>

      {/* Closing CTA — primary: Register, secondary: Pricing (Section 5.6) */}
      <section className="mt-14 rounded-xl border border-neutral-200 bg-neutral-50 py-8 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
        <p className="text-base font-medium text-neutral-900 dark:text-white">
          {copy.stillQuestion}
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white"
          >
            {copy.registerCompany}
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-900 dark:border-neutral-700 dark:text-white"
          >
            {copy.contactUs}
          </Link>
        </div>
      </section>
    </main>
  );
}
