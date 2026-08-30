

"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  LifeBuoy,
  Mail,
  Rocket,
  Tag,
  Users,
} from "lucide-react";
import FaqAccordion from "@/src/components/FaqAccordion/FaqAccordion";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import { resolveMainAndExtras, type PageSection } from "@/src/app/lib/pagesApi";
import { resolveFaqItems, resolveCategoryLabels } from "@/src/app/(pages)/faq/faqData";
import type { BackendFaqItem } from "@/src/app/lib/faqApi";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

type HelpCategory = {
  id: "start" | "features" | "pricing" | "about";
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
};

type HelpContent = {
  badge: string;
  title: string;
  description: string;

  categoriesHeading: string;
  categories: HelpCategory[];

  faqBadge: string;
  faqTitle: string;
  faqDescription: string;

  closingTitle: string;
  closingDescription: string;
  supportLabel: string;
  contactLabel: string;
};

// Reuses the exact copy already published on /how-it-works, /features,
// /pricing, and /about — see those pages for the source of each string.
const arabicContent: HelpContent = {
  badge: "مركز المساعدة",
  title: "إزاي نقدر نساعدك؟",
  description:
    "دليلك السريع لأهم إجابات وأدوات Partiva، ولو محتاج مساعدة إضافية فريق الدعم جاهز.",

  categoriesHeading: "تصفح حسب الموضوع",
  categories: [
    {
      id: "start",
      icon: Rocket,
      title: "كيف تبدأ",
      description: "الطلب بيمر بمراجعة قبل التفعيل — مش دخول فوري.",
      href: "/how-it-works",
    },
    {
      id: "features",
      icon: LayoutGrid,
      title: "المميزات",
      description: "كل ما تحتاجه لإدارة عملك بكفاءة",
      href: "/features",
    },
    {
      id: "pricing",
      icon: Tag,
      title: "الأسعار",
      description: "اختر الخطة المناسبة لك وابدأ رحلتك نحو إدارة أكثر احترافية",
      href: "/pricing",
    },
    {
      id: "about",
      icon: Users,
      title: "عن المنصة",
      description: "نظام لإدارة أعمالك، وشبكة اختيارية توصلك بباقي السوق",
      href: "/about",
    },
  ],

  faqBadge: "الأسئلة الشائعة",
  faqTitle: "أسئلة بتتكرر كتير عن Partiva",
  faqDescription:
    "إجابات مباشرة عن الشبكة الاختيارية، الخصوصية، ومراحل المراجعة.",

  closingTitle: "لسه عندك سؤال؟",
  closingDescription:
    "فريق الدعم الفني جاهز يساعدك، أو تقدر تتواصل معنا مباشرة.",
  supportLabel: "الدعم الفني",
  contactLabel: "تواصل معنا",
};

const englishContent: HelpContent = {
  badge: "Help center",
  title: "How can we help you?",
  description:
    "Your quick guide to Partiva's key answers and tools — and if you need more help, our support team is ready.",

  categoriesHeading: "Browse by topic",
  categories: [
    {
      id: "start",
      icon: Rocket,
      title: "How to start",
      description:
        "Your request goes through a review before activation — access is not immediate.",
      href: "/how-it-works",
    },
    {
      id: "features",
      icon: LayoutGrid,
      title: "Features",
      description: "Everything you need to run your business efficiently",
      href: "/features",
    },
    {
      id: "pricing",
      icon: Tag,
      title: "Pricing",
      description:
        "Choose the plan that fits you and start managing your business professionally",
      href: "/pricing",
    },
    {
      id: "about",
      icon: Users,
      title: "About the platform",
      description:
        "A system to manage your business, plus an optional network that connects you with the market",
      href: "/about",
    },
  ],

  faqBadge: "Frequently asked questions",
  faqTitle: "Common questions about Partiva",
  faqDescription:
    "Direct answers about the optional network, privacy, and the review stages.",

  closingTitle: "Still have a question?",
  closingDescription:
    "Our technical support team is ready to help, or you can reach us directly.",
  supportLabel: "Technical support",
  contactLabel: "Contact us",
};

export default function HelpContent() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const content = isArabic ? arabicContent : englishContent;
  const BackArrow = isArabic ? ArrowLeft : ArrowRight;

  const [sections, setSections] = useState<{ mainVisible: boolean; main: PageSection | null; extras: PageSection[] }>({ mainVisible: true, main: null, extras: [] });
  useEffect(() => {
    fetch(`${API}/api/pages`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => { if (r?.success) setSections(resolveMainAndExtras(r.data, "help")); })
      .catch(() => {});
  }, []);
  // Dashboard-editable override for the hero title/description below --
  // editing the page's existing "main" section's title/body does this,
  // no new section type needed. Falls back to the hardcoded copy otherwise.
  const mainBody = isArabic ? sections.main?.bodyAr : sections.main?.bodyEn;
  const heroTitle = mainBody ? (isArabic ? sections.main?.titleAr : sections.main?.titleEn) || content.title : content.title;
  const heroDescription = mainBody || content.description;

  // Same DB-backed FAQ entries the /faq page and Dashboard's FAQ manager use
  // -- fetched here instead of duplicating their copy as hardcoded strings.
  const [faqItems, setFaqItems] = useState<BackendFaqItem[]>([]);
  useEffect(() => {
    fetch(`${API}/api/faq`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => { if (r?.success) setFaqItems(r.data); })
      .catch(() => {});
  }, []);
  const faq = resolveFaqItems(faqItems, locale);
  const faqCategoryLabels = resolveCategoryLabels(faqItems, locale);

  return (
    <>
    {sections.mainVisible && (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="mx-auto max-w-6xl px-6 py-16"
    >
      {/* Hero */}
      <RevealOnScroll>
      <section className="text-center">
        <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          {content.badge}
        </span>
        <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          {heroTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">
          {heroDescription}
        </p>
      </section>
      </RevealOnScroll>

      {/* Categories */}
      <section className="mt-14" aria-labelledby="help-categories-heading">
        <RevealOnScroll>
        <h2
          id="help-categories-heading"
          className="mb-6 text-center text-sm font-semibold text-neutral-500 dark:text-neutral-400"
        >
          {content.categoriesHeading}
        </h2>
        </RevealOnScroll>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.categories.map(
            ({ id, icon: Icon, title, description, href }, i) => (
              <RevealOnScroll key={id} className="h-full" amount={0.35} margin="0px 0px -10%" delay={(i % 4) * 0.08}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-800"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100 dark:bg-blue-500/10 dark:group-hover:bg-blue-500/20">
                  <Icon
                    className="h-5 w-5 text-blue-600"
                    aria-hidden="true"
                    strokeWidth={1.75}
                  />
                </span>
                <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                  {description}
                </p>
                <span className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600">
                  {isArabic ? "اعرف المزيد" : "Learn more"}
                  <BackArrow
                    className={`h-4 w-4 transition-transform ${isArabic ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                    aria-hidden="true"
                  />
                </span>
              </Link>
              </RevealOnScroll>
            ),
          )}
        </div>
      </section>

      {/* FAQ */}
      <RevealOnScroll>
      <section className="mt-16" aria-labelledby="help-faq-heading">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold text-blue-600">
            {content.faqBadge}
          </span>
          <h2
            id="help-faq-heading"
            className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl"
          >
            {content.faqTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-500 dark:text-neutral-400">
            {content.faqDescription}
          </p>
        </div>

        <FaqAccordion
          items={faq}
          categoryLabels={faqCategoryLabels}
        />
      </section>
      </RevealOnScroll>

      {/* Still need help — Technical support + Contact us */}
      <RevealOnScroll>
      <section className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
        <p className="text-lg font-semibold text-neutral-900 dark:text-white">
          {content.closingTitle}
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
          {content.closingDescription}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
          >
            <LifeBuoy className="h-4 w-4" aria-hidden="true" />
            {content.supportLabel}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {content.contactLabel}
          </Link>
        </div>
      </section>
      </RevealOnScroll>
    </main>
    )}
    {sections.extras.map((s) => (
      <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
    ))}
    </>
  );
}
