"use client";

// app/how-it-works/HowItWorksContent.tsx
// PAGE-HOWITWORKS — "How It Works" (Recommended) (SRS Section 6 & 7)
// Priority: P1 | Auth: None | SEO: Indexable | Primary CTA: Register
// Purpose: walk undecided prospects through the
// Registration → Review → Approval → Go-live journey.
//
// HARD CONSTRAINT (Section 7, "How It Works (summary)" row + WEB-FR-012 /
// BR-0003): the STEPS themselves must match [Master: UC-0001] exactly.
// No invented steps. Never imply instant activation or "log in now" on
// any step. Only the surrounding copy/wording is Content Required —
// the step sequence itself is fixed.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText, Clock, Mail, Rocket, ListChecks } from "lucide-react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import { parseListBody, type PageSection } from "@/src/app/lib/pagesApi";
import { usePrefersReducedMotion } from "@/src/app/lib/usePrefersReducedMotion";

// Default step sequence, matching [Master: UC-0001] -- used until an admin
// edits the page's "steps" section from the Dashboard's Pages editor
// (title/description per step, one "N — Title: Description" line each).
const STEP_ICONS = [FileText, Clock, Mail, Rocket];

const defaultStepsAr = [
  { number: "1", title: "التسجيل", description: "تملى بيانات نشاطك التجاري مجانًا بالكامل." },
  { number: "2", title: "المراجعة", description: "فريقنا بيراجع الطلب قبل أي تفعيل — الطلب بيكون بحالة قيد المراجعة." },
  { number: "3", title: "الاعتماد", description: "بتوصلك رسالة على الإيميل بقرار الطلب — قبول أو رفض." },
  { number: "4", title: "البدء الفعلي", description: "لما يتم قبول طلبك، تقدر تدخل بحسابك وتبدأ تستخدم المنصة." },
];
const defaultStepsEn = [
  { number: "1", title: "Registration", description: "Fill in your business details — registration is completely free." },
  { number: "2", title: "Review", description: "Our team reviews your request before activation — the request remains under review." },
  { number: "3", title: "Approval", description: "You receive an email with the request decision — approved or rejected." },
  { number: "4", title: "Getting started", description: "Once your request is approved, you can sign in and start using the platform." },
];

export default function HowItWorksContent({
  override,
  steps: stepsSection,
}: {
  override?: { titleAr: string | null; titleEn: string | null; bodyAr: string | null; bodyEn: string | null } | null;
  steps?: PageSection | null;
} = {}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const stepsBody = isArabic ? stepsSection?.bodyAr : stepsSection?.bodyEn;
  const onboardingSteps = (stepsBody ? parseListBody(stepsBody).map((i) => ({ number: i.label, title: i.heading, description: i.body })) : isArabic ? defaultStepsAr : defaultStepsEn)
    .map((s, i) => ({ ...s, id: i, icon: STEP_ICONS[i % STEP_ICONS.length] }));

  // SRS §16-18 "Animated Connection" / "Active Step": the vertical line
  // draws in sync with scroll progress through the list, and each step
  // picks up an active/reached highlight as the user scrolls past it --
  // purely a presentation state, the fixed step sequence itself (see the
  // HARD CONSTRAINT note above) is untouched. Same lightweight
  // rAF-scroll-listener technique as the home page's story rail, so no
  // extra animation library is pulled in for this.
  const listRef = useRef<HTMLOListElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const reduceMotion = usePrefersReducedMotion();
  const stepCount = onboardingSteps.length;

  useEffect(() => {
    if (reduceMotion) {
      setActiveIndex(stepCount - 1);
      return;
    }
    const list = listRef.current;
    if (!list) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = list.getBoundingClientRect();
      const total = Math.max(rect.height, 1);
      const progress = Math.min(Math.max((window.innerHeight / 2 - rect.top) / total, 0), 1);
      if (lineFillRef.current) lineFillRef.current.style.transform = `scaleY(${progress})`;
      setActiveIndex(Math.min(Math.floor(progress * stepCount), stepCount - 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion, stepCount]);

  const copy = isArabic
    ? {
        badge: "كيف تبدأ",
        heroTitle: override?.bodyAr ? override.titleAr || "من التسجيل لحد ما تبدأ تستخدم Partiva" : "من التسجيل لحد ما تبدأ تستخدم Partiva",
        heroDescription: override?.bodyAr || "الطلب بيمر بمراجعة قبل التفعيل — مش دخول فوري.",
        stepsHeading: "خطوات الانضمام",
        stepsNote: "التسجيل يخضع للمراجعة قبل التفعيل، ولا يمنح دخولًا فوريًا.",
        objectionTitle: "عندك أسئلة عن الخصوصية أو مدة المراجعة؟",
        objectionDescription: "جاوبنا على أكتر الأسئلة اللي بتتكرر.",
        faqLink: "الأسئلة الشائعة",
        readyTitle: "جاهز تبدأ رحلتك مع Partiva؟",
        registerCompany: "سجّل شركتك",
        viewPricing: "شاهد الأسعار",
      }
    : {
        badge: "How to start",
        heroTitle: override?.bodyEn ? override.titleEn || "From registration to using Partiva" : "From registration to using Partiva",
        heroDescription: override?.bodyEn || "Your request goes through a review before activation — access is not immediate.",
        stepsHeading: "Steps to join",
        stepsNote: "Registration is reviewed before activation and does not grant immediate access.",
        objectionTitle: "Have questions about privacy or review time?",
        objectionDescription: "We've answered the most common questions.",
        faqLink: "Frequently asked questions",
        readyTitle: "Ready to start your journey with Partiva?",
        registerCompany: "Register your business",
        viewPricing: "View pricing",
      };

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-50/70 via-neutral-50 to-white dark:from-blue-500/5 dark:via-neutral-950 dark:to-neutral-950" aria-hidden="true" />

      <main dir={isArabic ? "rtl" : "ltr"} lang={locale} data-language-managed className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6">
        {/* Hero — island card, matching /solutions & /business-network */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/70 to-white px-6 py-14 text-center ring-1 ring-neutral-100 sm:py-16 dark:from-blue-500/5 dark:to-neutral-900 dark:ring-neutral-800">
          <div
            className="pointer-events-none absolute left-6 top-8 h-24 w-24 text-neutral-300/70 dark:text-neutral-700/50"
            style={{ backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)", backgroundSize: "14px 14px" }}
            aria-hidden="true"
          />
          <RevealOnScroll variant="fade">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-neutral-900">
              <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <span className="mt-4 block text-sm font-semibold text-blue-600 dark:text-blue-400">{copy.badge}</span>
            <h1 className="mx-auto mt-3 max-w-xl text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
              {copy.heroTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-neutral-500 dark:text-neutral-400">
              {copy.heroDescription}
            </p>
          </RevealOnScroll>
        </section>

        {/* Step-by-step journey — sequence fixed against UC-0001 */}
        <section className="mt-14" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="sr-only">
            {copy.stepsHeading}
          </h2>
          <ol ref={listRef} className="relative">
            <div className="pointer-events-none absolute top-2 bottom-2 start-5 w-px bg-neutral-200 dark:bg-neutral-800" aria-hidden="true" />
            <div
              ref={lineFillRef}
              className="pointer-events-none absolute top-2 bottom-2 start-5 w-px origin-top bg-blue-600 transition-transform duration-150"
              style={{ transform: "scaleY(0)" }}
              aria-hidden="true"
            />
            {onboardingSteps.map((item, index) => {
              const Icon = item.icon ?? FileText;
              const reached = index <= activeIndex;
              return (
                <RevealOnScroll key={item.id} variant="up" amount={0.4} margin="0px 0px -10%" delay={index * 0.08}>
                  <li className="relative mb-5 flex items-start gap-4 last:mb-0 ps-0">
                    <span
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white transition-colors duration-300 ${
                        reached ? "bg-blue-600" : "bg-neutral-300 dark:bg-neutral-700"
                      }`}
                    >
                      {item.number}
                    </span>
                    <div
                      className={`motion-card flex flex-1 items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 dark:bg-neutral-900 transition-[opacity,box-shadow] duration-300 ${
                        reached ? "opacity-100 ring-blue-100 dark:ring-blue-900/40" : "opacity-70 ring-neutral-100 dark:ring-neutral-800"
                      }`}
                    >
                      <div className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:flex transition-colors duration-300 ${reached ? "bg-blue-50 dark:bg-blue-500/10" : "bg-neutral-50 dark:bg-neutral-800"}`}>
                        <Icon className={`h-5 w-5 transition-colors duration-300 ${reached ? "text-blue-600 dark:text-blue-400" : "text-neutral-400 dark:text-neutral-600"}`} strokeWidth={1.75} aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                </RevealOnScroll>
              );
            })}
          </ol>
          <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
            {/* WEB-FR-012 / BR-0003 — no instant-activation claim allowed */}
            {copy.stepsNote}
          </p>
        </section>

        {/* Objection-handling link — undecided prospects, per WEB-UJ-001 /
            FAQ purpose ("network opt-in, data isolation, review process") */}
        <RevealOnScroll variant="up" amount={0.4} margin="0px 0px -10%">
          <section className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-100 sm:flex-row dark:bg-neutral-900/60 dark:ring-neutral-800">
            <div className={isArabic ? "text-center sm:text-right" : "text-center sm:text-left"}>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">{copy.objectionTitle}</p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{copy.objectionDescription}</p>
            </div>
            <Link
              href="/faq"
              className="whitespace-nowrap rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-900"
            >
              {copy.faqLink}
            </Link>
          </section>
        </RevealOnScroll>

        {/* Closing CTA — primary: Register, secondary: Pricing (Section 5.6) */}
        <RevealOnScroll variant="scale">
          <section className="mt-8 rounded-3xl bg-neutral-50 py-10 text-center ring-1 ring-neutral-100 dark:bg-neutral-900/60 dark:ring-neutral-800">
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{copy.readyTitle}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
              >
                {copy.registerCompany}
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-900"
              >
                {copy.viewPricing}
              </Link>
            </div>
          </section>
        </RevealOnScroll>
      </main>
    </>
  );
}
