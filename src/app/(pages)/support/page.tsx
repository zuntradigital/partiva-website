// app/support/page.tsx
// PAGE-SUPPORT — "Technical Support" (linked from the footer's "الدعم
// الفني" and from the Help Center's closing CTA).
//
// This page only points visitors to the support channels that already
// exist elsewhere in the project — the WhatsApp number published in the
// footer, the working contact form (with its existing "Support" inquiry
// type), and the Help Center. No phone number, email address, working
// hours, or support policy is stated anywhere in the project, so none is
// invented here. Frontend only, no backend/API.

"use client";

import Link from "next/link";
import { BookOpen, LifeBuoy, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";

type SupportOption = {
  id: "whatsapp" | "request" | "help";
  icon: React.ElementType;
  iconWrapClassName: string;
  iconClassName: string;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  external?: boolean;
};

type SupportContent = {
  badge: string;
  title: string;
  description: string;
  optionsHeading: string;
  options: SupportOption[];
};

// Every option below routes to a channel that already exists in the
// project (footer WhatsApp link, the /contact form's "Support" inquiry
// type, and the /help Help Center) — nothing here is a new claim.
const arabicContent: SupportContent = {
  badge: "الدعم الفني",
  title: "محتاج مساعدة فنية؟",
  description:
    "اختر الطريقة الأنسب للتواصل مع فريق الدعم، أو تصفح مركز المساعدة للإجابات السريعة.",
  optionsHeading: "طرق الحصول على الدعم",
  options: [
    {
      id: "whatsapp",
      icon: FaWhatsapp,
      iconWrapClassName: "bg-green-50 dark:bg-green-500/10",
      iconClassName: "text-green-600 dark:text-green-400",
      title: "تواصل عبر واتساب",
      description: "راسلنا مباشرة على رقم الواتساب للدعم السريع.",
      linkLabel: "+966 59 084 3000",
      href: "https://wa.me/966590843000",
      external: true,
    },
    {
      id: "request",
      icon: LifeBuoy,
      iconWrapClassName: "bg-blue-50 dark:bg-blue-500/10",
      iconClassName: "text-blue-600 dark:text-blue-400",
      title: "أرسل طلب دعم",
      description: "استخدم نموذج التواصل واختر \"الدعم\" كنوع الاستفسار وسيرد عليك فريقنا.",
      linkLabel: "افتح نموذج التواصل",
      href: "/contact",
    },
    {
      id: "help",
      icon: BookOpen,
      iconWrapClassName: "bg-blue-50 dark:bg-blue-500/10",
      iconClassName: "text-blue-600 dark:text-blue-400",
      title: "مركز المساعدة",
      description: "دليلك السريع لأهم إجابات وأدوات Partiva قبل ما تتواصل معنا.",
      linkLabel: "تصفح مركز المساعدة",
      href: "/help",
    },
  ],
};

const englishContent: SupportContent = {
  badge: "Technical support",
  title: "Need technical help?",
  description:
    "Choose the best way to reach our support team, or browse the Help Center for quick answers.",
  optionsHeading: "Ways to get support",
  options: [
    {
      id: "whatsapp",
      icon: FaWhatsapp,
      iconWrapClassName: "bg-green-50 dark:bg-green-500/10",
      iconClassName: "text-green-600 dark:text-green-400",
      title: "Chat on WhatsApp",
      description: "Message us directly on WhatsApp for fast support.",
      linkLabel: "+966 59 084 3000",
      href: "https://wa.me/966590843000",
      external: true,
    },
    {
      id: "request",
      icon: LifeBuoy,
      iconWrapClassName: "bg-blue-50 dark:bg-blue-500/10",
      iconClassName: "text-blue-600 dark:text-blue-400",
      title: "Submit a support request",
      description: "Use the contact form and choose “Support” as the inquiry type — our team will get back to you.",
      linkLabel: "Open the contact form",
      href: "/contact",
    },
    {
      id: "help",
      icon: BookOpen,
      iconWrapClassName: "bg-blue-50 dark:bg-blue-500/10",
      iconClassName: "text-blue-600 dark:text-blue-400",
      title: "Help center",
      description: "Your quick guide to Partiva's key answers and tools before you reach out.",
      linkLabel: "Browse the Help Center",
      href: "/help",
    },
  ],
};

export default function SupportPage() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const content = isArabic ? arabicContent : englishContent;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="mx-auto max-w-5xl px-6 py-16"
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

      {/* Support options */}
      <section className="mt-14" aria-labelledby="support-options-heading">
        <h2 id="support-options-heading" className="mb-6 text-center text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          {content.optionsHeading}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.options.map((option) => {
            const Icon = option.icon;
            return (
              <article
                key={option.id}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${option.iconWrapClassName}`}>
                  <Icon className={`h-5 w-5 ${option.iconClassName}`} aria-hidden="true" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">{option.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{option.description}</p>
                <Link
                  href={option.href}
                  target={option.external ? "_blank" : undefined}
                  rel={option.external ? "noopener noreferrer" : undefined}
                  dir={option.id === "whatsapp" ? "ltr" : undefined}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
                >
                  {option.linkLabel}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Contact us — general (non-technical) enquiries */}
      <section className="mt-14 flex flex-col items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center sm:flex-row sm:text-start dark:border-neutral-800 dark:bg-neutral-900/60">
        <div>
          <p className="text-base font-semibold text-neutral-900 dark:text-white">
            {isArabic ? "سؤال عام مش متعلق بالدعم الفني؟" : "A general question that isn't technical?"}
          </p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {isArabic ? "تواصل معنا من صفحة اتصل بنا." : "Reach us from the Contact us page."}
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {isArabic ? "تواصل معنا" : "Contact us"}
        </Link>
      </section>
    </main>
  );
}
