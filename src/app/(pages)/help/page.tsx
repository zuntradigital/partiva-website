

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
import type { FaqItem, FaqCategory } from "@/src/app/types/faq";

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
  categoryLabels: Record<FaqCategory, string>;
  faqItems: FaqItem[];

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
  categoryLabels: {
    network: "الشبكة التجارية",
    privacy: "الخصوصية والبيانات",
    review: "التسجيل والمراجعة",
    pricing: "الأسعار والخطط",
  },
  faqItems: [
    {
      id: "network-optional",
      category: "network",
      question: "هل لازم أنضم للشبكة التجارية؟",
      answer:
        "لا، الانضمام للشبكة اختياري تمامًا. تقدر تستخدم Partiva لإدارة نشاطك فقط بدون الانضمام لأي شبكة.",
    },
    {
      id: "data-isolation",
      category: "privacy",
      question: "بيانات نشاطي هتبقى منفصلة عن التجار التانيين؟",
      answer:
        "أيوه، كل نشاط تجاري ليه بياناته الخاصة، ومفيش أي نشاط تاني يقدر يشوفها إلا لو انت فعّلت مشاركتها عبر الشبكة الاختيارية.",
    },
    {
      id: "review-process",
      category: "review",
      question: "بيحصل إيه بعد ما أسجل؟",
      answer:
        "طلبك بيدخل في مراجعة قبل التفعيل، وهتوصلك رسالة على الإيميل بقرار الطلب — القبول أو الرفض.",
    },
    {
      id: "review-instant",
      category: "review",
      question: "هل التفعيل بيكون فوري؟",
      answer: "لا، التسجيل يخضع للمراجعة أولًا ولا يمنح دخولًا فوريًا.",
    },
    {
      id: "plan-change",
      category: "pricing",
      question: "أقدر أغيّر خطتي بعد التسجيل؟",
      answer: "أيوه، تقدر تغيّر خطتك في أي وقت.",
    },
    {
      id: "plan-limits",
      category: "pricing",
      question: "بيحصل إيه لو تعديت حدود خطتي؟",
      answer: "الحدود بتتطبّق فورًا مع أي تغيير في الخطة.",
    },
  ],

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
  categoryLabels: {
    network: "Trade network",
    privacy: "Privacy & data",
    review: "Registration & review",
    pricing: "Pricing & plans",
  },
  faqItems: [
    {
      id: "network-optional",
      category: "network",
      question: "Do I have to join the trade network?",
      answer:
        "No. Joining the network is completely optional. You can use Partiva to manage your business without joining any network.",
    },
    {
      id: "data-isolation",
      category: "privacy",
      question: "Will my business data be separate from other traders?",
      answer:
        "Yes. Every business has its own data, and no other business can see it unless you enable sharing through the optional network.",
    },
    {
      id: "review-process",
      category: "review",
      question: "What happens after I register?",
      answer:
        "Your request is reviewed before activation, and you will receive an email with the decision — approval or rejection.",
    },
    {
      id: "review-instant",
      category: "review",
      question: "Is activation immediate?",
      answer:
        "No. Registration is reviewed first and does not grant immediate access.",
    },
    {
      id: "plan-change",
      category: "pricing",
      question: "Can I change my plan after registration?",
      answer: "Yes, you can change your plan at any time.",
    },
    {
      id: "plan-limits",
      category: "pricing",
      question: "What happens if I exceed my plan limits?",
      answer: "Limits are applied immediately whenever the plan changes.",
    },
  ],

  closingTitle: "Still have a question?",
  closingDescription:
    "Our technical support team is ready to help, or you can reach us directly.",
  supportLabel: "Technical support",
  contactLabel: "Contact us",
};

export default function HelpPage() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const content = isArabic ? arabicContent : englishContent;
  const BackArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="mx-auto max-w-6xl px-6 py-16"
    >
      {/* Hero */}
      <section className="text-center">
        <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          {content.badge}
        </span>
        <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">
          {content.description}
        </p>
      </section>

      {/* Categories */}
      <section className="mt-14" aria-labelledby="help-categories-heading">
        <h2
          id="help-categories-heading"
          className="mb-6 text-center text-sm font-semibold text-neutral-500 dark:text-neutral-400"
        >
          {content.categoriesHeading}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.categories.map(
            ({ id, icon: Icon, title, description, href }) => (
              <Link
                key={id}
                href={href}
                className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-800"
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
            ),
          )}
        </div>
      </section>

      {/* FAQ */}
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
          items={content.faqItems}
          categoryLabels={content.categoryLabels}
        />
      </section>

      {/* Still need help — Technical support + Contact us */}
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
    </main>
  );
}
