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

import Link from "next/link";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";

// Fixed step sequence — DO NOT reorder, rename semantics, add, or remove
// steps without re-verifying against [Master: UC-0001]. Only `description`
// (Content Required) is free to be rewritten by the Content Team.
type OnboardingStep = {
  id: "submit" | "review" | "decision" | "golive";
  step: number;
  titleAr: string; // must reflect UC-0001's actual stage name
  titleEn: string;
  descriptionAr: string; // CONTENT REQUIRED
  descriptionEn: string;
  icon: string; // Tabler icon name
};

const onboardingSteps: OnboardingStep[] = [
  {
    id: "submit",
    step: 1,
    titleAr: "التسجيل",
    titleEn: "Registration",
    descriptionAr: "تملى بيانات نشاطك التجاري وتختار الخطة المناسبة لك.",
    descriptionEn: "Fill in your business details and choose the plan that fits you.",
    icon: "file-text",
  },
  {
    id: "review",
    step: 2,
    titleAr: "المراجعة",
    titleEn: "Review",
    // Duration MUST NOT be fabricated — no SLA/timeframe exists in the
    // Master SRS for review turnaround. Leave qualitative until Product
    // supplies a real figure (Content Required / Decision Required).
    descriptionAr: "فريقنا بيراجع الطلب قبل أي تفعيل — الطلب بيكون بحالة قيد المراجعة.",
    descriptionEn: "Our team reviews your request before activation — the request remains under review.",
    icon: "clock-check",
  },
  {
    id: "decision",
    step: 3,
    titleAr: "الاعتماد",
    titleEn: "Approval",
    // WEB-FR-011: applicant is notified of approval/rejection by email.
    descriptionAr: "بتوصلك رسالة على الإيميل بقرار الطلب — قبول أو رفض.",
    descriptionEn: "You receive an email with the request decision — approved or rejected.",
    icon: "mail",
  },
  {
    id: "golive",
    step: 4,
    titleAr: "البدء الفعلي",
    titleEn: "Getting started",
    descriptionAr: "لما يتم قبول طلبك، تقدر تدخل بحسابك وتبدأ تستخدم المنصة.",
    descriptionEn: "Once your request is approved, you can sign in and start using the platform.",
    icon: "rocket",
  },
];

export default function HowItWorksContent() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const copy = isArabic
    ? {
        badge: "كيف تبدأ",
        heroTitle: "من التسجيل لحد ما تبدأ تستخدم Partiva",
        heroDescription: "الطلب بيمر بمراجعة قبل التفعيل — مش دخول فوري.",
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
        heroTitle: "From registration to using Partiva",
        heroDescription: "Your request goes through a review before activation — access is not immediate.",
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
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="mx-auto max-w-5xl px-6 py-16"
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

      {/* Step-by-step journey — sequence fixed against UC-0001 */}
      <section className="mt-12" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="sr-only">
          {copy.stepsHeading}
        </h2>
        <ol className="relative border-e border-neutral-200 pe-6 dark:border-neutral-800">
          {onboardingSteps.map((item) => (
            <li key={item.id} className="mb-8 last:mb-0">
              <span className="absolute -inset-e-2.25 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-medium text-white">
                {item.step}
              </span>
              <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {isArabic ? item.titleAr : item.titleEn}
                </p>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  {isArabic ? item.descriptionAr : item.descriptionEn}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-center text-xs text-neutral-500">
          {/* WEB-FR-012 / BR-0003 — no instant-activation claim allowed */}
          {copy.stepsNote}
        </p>
      </section>

      {/* Objection-handling link — undecided prospects, per WEB-UJ-001 /
          FAQ purpose ("network opt-in, data isolation, review process") */}
      <section className="mt-10 flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 p-4">
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {copy.objectionTitle}
          </p>
          <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
            {copy.objectionDescription}
          </p>
        </div>
        <Link
          href="/faq"
          className="whitespace-nowrap rounded-md border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-900 dark:border-neutral-700 dark:text-white"
        >
          {copy.faqLink}
        </Link>
      </section>

      {/* Closing CTA — primary: Register, secondary: Pricing (Section 5.6) */}
      <section className="mt-14 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 py-8 text-center">
        <p className="text-base font-medium text-neutral-900 dark:text-white">
          {copy.readyTitle}
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white"
          >
            {copy.registerCompany}
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-900 dark:border-neutral-700 dark:text-white"
          >
            {copy.viewPricing}
          </Link>
        </div>
      </section>
    </main>
  );
}
