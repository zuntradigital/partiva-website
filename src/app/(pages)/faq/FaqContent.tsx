"use client";

import FaqAccordion from "@/src/components/FaqAccordion/FaqAccordion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import { resolveCategoryLabels, resolveFaqItems } from "./faqData";
import type { BackendFaqItem } from "@/src/app/lib/faqApi";

export default function FaqContent({
  items,
  override,
}: {
  items: BackendFaqItem[];
  override?: { titleAr: string | null; titleEn: string | null; bodyAr: string | null; bodyEn: string | null } | null;
}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const faqItems = resolveFaqItems(items, locale);
  const categoryLabels = resolveCategoryLabels(items, locale);
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const copy = isArabic
    ? {
        badge: "الأسئلة الشائعة",
        heroTitle: override?.bodyAr ? override.titleAr || "أسئلة بتتكرر كتير عن Partiva" : "أسئلة بتتكرر كتير عن Partiva",
        heroDescription: override?.bodyAr || "إجابات مباشرة عن الشبكة الاختيارية، الخصوصية، ومراحل المراجعة.",
        sectionHeading: "الأسئلة الشائعة",
        stillQuestion: "لسه عندك سؤال؟",
        registerCompany: "سجّل شركتك",
        contactUs: "تواصل معنا",
      }
    : {
        badge: "Frequently asked questions",
        heroTitle: override?.bodyEn ? override.titleEn || "Common questions about Partiva" : "Common questions about Partiva",
        heroDescription: override?.bodyEn || "Direct answers about the optional network, privacy, and the review stages.",
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
      className="relative mx-auto max-w-5xl px-6 py-20"
    >
      {/* Ambient background -- soft blue field + scattered dots, matching
          the reference's decorative treatment but restyled in Partiva's
          existing blue accent (no new colors introduced). `fixed` pins it to
          the viewport so it spans the whole screen (behind the Navbar/Footer
          too) instead of just this page's content box, and stays put while
          scrolling instead of scrolling away with the content. */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="motion-glow absolute -top-24 start-[-10%] h-96 w-96 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10" />
        <div className="motion-glow motion-delay-2 absolute top-20 end-[-8%] h-80 w-80 rounded-full bg-blue-300/10 blur-3xl dark:bg-blue-400/5" />
        <div className="motion-glow motion-delay-1 absolute bottom-0 start-[10%] h-96 w-96 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10" />
        <span className="absolute start-6 top-10 h-2 w-2 rounded-full bg-blue-400/40 dark:bg-blue-400/30" />
        <span className="absolute end-16 top-6 h-1.5 w-1.5 rounded-full bg-blue-400/30 dark:bg-blue-400/20" />
        <span className="absolute end-10 top-40 h-2.5 w-2.5 rounded-full bg-blue-500/20 dark:bg-blue-500/15" />
        <span className="absolute start-16 bottom-24 h-2 w-2 rounded-full bg-blue-400/30 dark:bg-blue-400/20" />
      </div>

      {/* Hero */}
      <RevealOnScroll>
        <section className="relative text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {copy.badge}
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-neutral-600 dark:text-neutral-400">
            {copy.heroDescription}
          </p>
        </section>
      </RevealOnScroll>

      {/* Accordion — client component fires faq_interaction analytics
          (Section 12) with question_id on expand, per the events table */}
      <RevealOnScroll className="mt-14">
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="sr-only">
            {copy.sectionHeading}
          </h2>
          <FaqAccordion items={faqItems} categoryLabels={categoryLabels} />
        </section>
      </RevealOnScroll>

      {/* Closing CTA — primary: Register, secondary: Pricing (Section 5.6) */}
      <RevealOnScroll className="mt-16">
        <section className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
          <p className="text-lg font-semibold text-neutral-900 dark:text-white">
            {copy.stillQuestion}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900"
            >
              {copy.registerCompany}
              <ArrowIcon
                className={`h-4 w-4 transition-transform ${isArabic ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`}
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
            >
              {copy.contactUs}
            </Link>
          </div>
        </section>
      </RevealOnScroll>
    </main>
  );
}
