
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import { resolveMainAndExtras, type PageSection as ManagedSection } from "@/src/app/lib/pagesApi";

const API = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

type PolicySection = {
  id: string;
  heading: string;
  body: string;
};

type TermsContent = {
  badge: string;
  title: string;
  intro: string;
  sections: PolicySection[];
  contactTitle: string;
  contactBody: string;
  contactLinkLabel: string;
};


const arabicContent: TermsContent = {
  badge: "الشروط والأحكام",
  title: "الشروط والأحكام",
  intro: "توضح هذه الصفحة شروط استخدام موقع وخدمة Partiva.",
  sections: [
    {
      id: "eligibility",
      heading: "الأهلية والتسجيل",
      body: "التسجيل في Partiva متاح لأصحاب الأنشطة التجارية، بما في ذلك تجار التجزئة، وموزعي الجملة، والمستوردين، والورش. لكل نشاط تجاري رقم سجل تجاري واحد فقط يمكن تسجيله؛ إذا كان الرقم مسجلًا بالفعل، لا يمكن إنشاء طلب تسجيل جديد بنفس الرقم.",
    },
    {
      id: "review",
      heading: "مراجعة طلب التسجيل",
      body: "يخضع كل طلب تسجيل لمراجعة قبل التفعيل، ولا يمنح التسجيل دخولًا فوريًا. سيصلك قرار الطلب — بالقبول أو الرفض — عبر البريد الإلكتروني الذي أدخلته عند التسجيل.",
    },
    {
      id: "consent",
      heading: "الموافقة على الشروط",
      body: "عند التسجيل في Partiva، يُطلب منك الموافقة الصريحة على هذه الشروط والأحكام وعلى سياسة الخصوصية قبل إتمام طلبك.",
    },
    {
      id: "plans",
      heading: "خطط الاشتراك والأسعار",
      body: "تعرض Partiva عدة خطط اشتراك — التجربة المجانية، الأساسية، الاحترافية، والمؤسسية — بأسعار معروضة بالريال السعودي على صفحة الأسعار. تتوفر أيضًا خطط مخصصة للأنشطة ذات الاحتياجات الخاصة عبر التواصل معنا.",
    },
    {
      id: "changes",
      heading: "تغيير الخطة وحدودها",
      body: "يمكنك تغيير خطة اشتراكك في أي وقت. عند تغيير الخطة، تُطبَّق حدود الخطة الجديدة فورًا.",
    },
    {
      id: "trial",
      heading: "التجربة المجانية",
      body: "تتيح Partiva تجربة مجانية دون الحاجة لبطاقة ائتمانية، مع إمكانية الإلغاء في أي وقت. راجع صفحة الأسعار للاطلاع على تفاصيل التجربة الحالية.",
    },
    {
      id: "refund",
      heading: "ضمان الاسترجاع",
      body: "توفر Partiva ضمان استرجاع كامل خلال 14 يوم من الدفع.",
    },
    {
      id: "network",
      heading: "الشبكة التجارية الاختيارية",
      body: "الانضمام إلى الشبكة التجارية اختياري تمامًا. يمكنك استخدام Partiva لإدارة نشاطك فقط دون الانضمام لأي شبكة. الشبكة مخصصة لمن يرغب في البحث والبيع والشراء مع تجار آخرين.",
    },
    {
      id: "privacy",
      heading: "الخصوصية",
      body: "يوضح استخدامنا لبياناتك في سياسة الخصوصية الخاصة بنا.",
    },
  ],
  contactTitle: "تواصل معنا",
  contactBody: "لو عندك أي سؤال عن هذه الشروط، تقدر تتواصل معنا.",
  contactLinkLabel: "تواصل معنا",
};

const englishContent: TermsContent = {
  badge: "Terms & Conditions",
  title: "Terms & Conditions",
  intro: "This page explains the terms of using the Partiva website and service.",
  sections: [
    {
      id: "eligibility",
      heading: "Eligibility & Registration",
      body: "Registration with Partiva is available to business owners, including retailers, wholesale distributors, importers, and workshops. Each business may register only one commercial registration number; if that number is already registered, a new registration request cannot be created with the same number.",
    },
    {
      id: "review",
      heading: "Review of Your Registration Request",
      body: "Every registration request is reviewed before activation, and registration does not grant immediate access. You will receive the decision — approval or rejection — by email, at the address you entered during registration.",
    },
    {
      id: "consent",
      heading: "Agreeing to These Terms",
      body: "When you register with Partiva, you are asked to explicitly agree to these Terms & Conditions and to our Privacy Policy before your request is submitted.",
    },
    {
      id: "plans",
      heading: "Subscription Plans & Pricing",
      body: "Partiva offers several subscription plans — Free Trial, Basic, Professional, and Enterprise — priced in Saudi Riyals on the Pricing page. Custom plans are also available for businesses with special requirements by contacting us.",
    },
    {
      id: "changes",
      heading: "Changing Your Plan and Its Limits",
      body: "You can change your subscription plan at any time. When you change plans, the new plan's limits are applied immediately.",
    },
    {
      id: "trial",
      heading: "Free Trial",
      body: "Partiva offers a free trial with no credit card required, and you can cancel at any time. See the Pricing page for the current trial details.",
    },
    {
      id: "refund",
      heading: "Refund Guarantee",
      body: "Partiva offers a full refund guarantee within 14 days of payment.",
    },
    {
      id: "network",
      heading: "Optional Trade Network",
      body: "Joining the trade network is completely optional. You can use Partiva to manage your business without joining any network. The network is for businesses that want to search, sell, and buy with other traders.",
    },
    {
      id: "privacy",
      heading: "Privacy",
      body: "Our use of your data is explained in our Privacy Policy.",
    },
  ],
  contactTitle: "Contact Us",
  contactBody: "If you have any question about these terms, you can reach out to us.",
  contactLinkLabel: "Contact us",
};

function legalSectionFromRow(row: ManagedSection | undefined, isArabic: boolean, fallback: PolicySection): PolicySection {
  const body = isArabic ? row?.bodyAr : row?.bodyEn;
  if (!body) return fallback;
  const heading = (isArabic ? row?.titleAr : row?.titleEn) || fallback.heading;
  return { id: fallback.id, heading, body };
}

export default function TermsContent() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const content = isArabic ? arabicContent : englishContent;

  const [sections, setSections] = useState<{ mainVisible: boolean; main: ManagedSection | null; extras: ManagedSection[] }>({ mainVisible: true, main: null, extras: [] });
  const [rawSections, setRawSections] = useState<ManagedSection[]>([]);
  useEffect(() => {
    fetch(`${API}/api/pages`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => {
        if (!r?.success) return;
        setSections(resolveMainAndExtras(r.data, "terms"));
        setRawSections(r.data.find((p: { slug: string }) => p.slug === "terms")?.sections ?? []);
      })
      .catch(() => {});
  }, []);
  const mainBody = isArabic ? sections.main?.bodyAr : sections.main?.bodyEn;
  const heroTitle = mainBody ? (isArabic ? sections.main?.titleAr : sections.main?.titleEn) || content.title : content.title;
  const heroIntro = mainBody || content.intro;
  const legalSections = content.sections.map((fallback) => legalSectionFromRow(rawSections.find((s) => s.key === fallback.id), isArabic, fallback));

  return (
    <>
    {sections.mainVisible && (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="bg-white px-5 py-10 sm:px-8 sm:py-14 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <RevealOnScroll>
        <section className="text-center">
          <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            {content.badge}
          </span>
          <h1 className="mx-auto mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl dark:text-white">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            {heroIntro}
          </p>
        </section>
        </RevealOnScroll>

        {/* Sections -- each reveals as the reader scrolls to it, not all at
            once, so the long policy text stays comfortable to read. */}
        <article className="article-prose mt-12 text-slate-700 dark:text-slate-300">
          {legalSections.map((section) => (
            <RevealOnScroll key={section.id} amount={0.15} margin="0px 0px -8%">
            <section aria-labelledby={`terms-${section.id}`}>
              <h2 id={`terms-${section.id}`}>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
            </RevealOnScroll>
          ))}
        </article>

        {/* Contact */}
        <RevealOnScroll>
        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center dark:border-slate-800 dark:bg-slate-900/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{content.contactTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">{content.contactBody}</p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
          >
            {content.contactLinkLabel}
          </Link>
        </section>
        </RevealOnScroll>
      </div>
    </main>
    )}
    {sections.extras.map((s) => (
      <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
    ))}
    </>
  );
}
