
"use client";

import Link from "next/link";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";

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

export default function TermsPage() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const content = isArabic ? arabicContent : englishContent;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="bg-white px-5 py-10 sm:px-8 sm:py-14 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <section className="text-center">
          <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            {content.badge}
          </span>
          <h1 className="mx-auto mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl dark:text-white">
            {content.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            {content.intro}
          </p>
        </section>

        {/* Sections */}
        <article className="article-prose mt-12 text-slate-700 dark:text-slate-300">
          {content.sections.map((section) => (
            <section key={section.id} aria-labelledby={`terms-${section.id}`}>
              <h2 id={`terms-${section.id}`}>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </article>

        {/* Contact */}
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
      </div>
    </main>
  );
}
