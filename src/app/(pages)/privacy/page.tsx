// app/privacy/page.tsx
// PAGE-PRIVACY — "Privacy Policy" (linked from the footer's "سياسة
// الخصوصية"; the footer link already points at /privacy, so no other
// file needed to change to wire this page in).
//
// HARD CONSTRAINT: every statement below must trace back to something
// that already exists in this project — a real form field, a real
// cookie set in LanguageProvider.tsx, or a fact already stated on
// another page (data isolation / optional network / review-before-
// activation / consent checkbox). No retention period, third-party
// processor, analytics/ad cookie, or legal right is claimed here,
// because none is defined anywhere in the project. Do not add a
// section unless you can point at the exact file it comes from.

"use client";

import Link from "next/link";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";

type PolicySection = {
  id: string;
  heading: string;
  body: string;
  subsections?: { heading: string; body: string }[];
};

type PrivacyContent = {
  badge: string;
  title: string;
  intro: string;
  sections: PolicySection[];
  contactTitle: string;
  contactBody: string;
  contactLinkLabel: string;
};

// Source for every line: register/page.tsx (registration fields, consent
// checkbox), login/page.tsx (email + password), contact/page.tsx (name,
// email, phone, inquiry type, message), forgot-password/page.tsx (email),
// LanguageProvider.tsx (the partiva-locale cookie), how-it-works/page.tsx
// and faq/page.tsx (review-before-activation, data isolation, optional
// network).
const arabicContent: PrivacyContent = {
  badge: "سياسة الخصوصية",
  title: "سياسة الخصوصية",
  intro: "توضح هذه الصفحة المعلومات التي تجمعها Partiva من خلال هذا الموقع، وكيفية استخدامها.",
  sections: [
    {
      id: "collect",
      heading: "المعلومات التي نجمعها",
      body: "نجمع المعلومات التالية عند استخدامك للموقع:",
      subsections: [
        {
          heading: "بيانات تسجيل النشاط التجاري",
          body: "عند تسجيل نشاطك التجاري، نجمع اسم النشاط التجاري، رقم السجل التجاري، نوع النشاط التجاري، اسم جهة الاتصال، البريد الإلكتروني، رقم الجوال، المدينة/الفرع، وخطة الاشتراك التي تختارها.",
        },
        {
          heading: "بيانات تسجيل الدخول",
          body: "لتسجيل الدخول إلى حسابك، نستخدم بريدك الإلكتروني وكلمة المرور.",
        },
        {
          heading: "طلبات التواصل والدعم",
          body: "عند إرسال رسالة عبر نموذج التواصل، نجمع اسمك الكامل، بريدك الإلكتروني، رقم جوالك (اختياري)، نوع الاستفسار، ونص رسالتك.",
        },
        {
          heading: "طلب استعادة كلمة المرور",
          body: "عند طلب رابط لإعادة تعيين كلمة المرور، نستخدم بريدك الإلكتروني لإرسال الرابط.",
        },
        {
          heading: "تفضيل اللغة",
          body: "يحفظ الموقع تفضيلك للغة (عربي أو إنجليزي) عبر ملف تعريف ارتباط باسم partiva-locale، لمدة تصل إلى سنة واحدة، لعرض الموقع بلغتك المفضلة في زياراتك القادمة.",
        },
      ],
    },
    {
      id: "use",
      heading: "كيف نستخدم بياناتك",
      body: "تُستخدم بيانات تسجيل النشاط التجاري لمراجعة طلبك قبل تفعيل الحساب. تُستخدم بيانات نموذج التواصل لطلبات الدعم للرد على استفسارك. يُستخدم ملف تعريف الارتباط الخاص باللغة فقط لعرض الموقع بلغتك المفضلة.",
    },
    {
      id: "review",
      heading: "مراجعة طلبات التسجيل",
      body: "يخضع كل طلب تسجيل نشاط تجاري لمراجعة قبل التفعيل، ولا يمنح دخولًا فوريًا. سيصلك قرار الطلب — بالقبول أو الرفض — عبر البريد الإلكتروني الذي أدخلته عند التسجيل.",
    },
    {
      id: "isolation",
      heading: "عزل بيانات الأنشطة التجارية",
      body: "لكل نشاط تجاري بياناته الخاصة به، ولا يستطيع أي نشاط تجاري آخر الاطلاع عليها إلا إذا فعّلت مشاركتها بنفسك عبر الشبكة التجارية الاختيارية.",
    },
    {
      id: "network",
      heading: "الشبكة التجارية الاختيارية",
      body: "الانضمام إلى الشبكة التجارية اختياري تمامًا. يمكنك استخدام Partiva لإدارة نشاطك فقط دون الانضمام لأي شبكة. الشبكة مخصصة لمن يرغب في البحث والبيع والشراء مع تجار آخرين.",
    },
    {
      id: "consent",
      heading: "موافقتك",
      body: "عند التسجيل في Partiva، يُطلب منك الموافقة الصريحة على سياسة الخصوصية هذه وعلى الشروط والأحكام قبل إتمام الطلب.",
    },
  ],
  contactTitle: "تواصل معنا",
  contactBody: "لو عندك أي سؤال عن هذه الصفحة، تقدر تتواصل معنا.",
  contactLinkLabel: "تواصل معنا",
};

const englishContent: PrivacyContent = {
  badge: "Privacy Policy",
  title: "Privacy Policy",
  intro: "This page explains what information Partiva collects through this website, and how it is used.",
  sections: [
    {
      id: "collect",
      heading: "Information We Collect",
      body: "We collect the following information when you use this website:",
      subsections: [
        {
          heading: "Business Registration Information",
          body: "When you register your business, we collect the business name, commercial registration number, business activity, contact name, email address, mobile number, city/branch, and the subscription plan you choose.",
        },
        {
          heading: "Login Information",
          body: "To sign in to your account, we use your email address and password.",
        },
        {
          heading: "Contact & Support Requests",
          body: "When you send a message through the contact form, we collect your full name, email address, mobile number (optional), inquiry type, and message.",
        },
        {
          heading: "Password Reset Requests",
          body: "When you request a password reset link, we use your email address to send it.",
        },
        {
          heading: "Language Preference",
          body: "The website remembers your language preference (Arabic or English) using a cookie named partiva-locale, for up to one year, so the site displays in your preferred language on future visits.",
        },
      ],
    },
    {
      id: "use",
      heading: "How We Use Your Information",
      body: "Business registration information is used to review your request before your account is activated. Contact form and support request information is used to respond to your inquiry. The language cookie is used only to display the site in your preferred language.",
    },
    {
      id: "review",
      heading: "Review of Registration Requests",
      body: "Every business registration request is reviewed before activation and does not grant immediate access. You will receive the decision — approval or rejection — by email, at the address you entered during registration.",
    },
    {
      id: "isolation",
      heading: "Data Isolation Between Businesses",
      body: "Every business has its own data, and no other business can see it unless you enable sharing yourself through the optional trade network.",
    },
    {
      id: "network",
      heading: "Optional Trade Network",
      body: "Joining the trade network is completely optional. You can use Partiva to manage your business without joining any network. The network is for businesses that want to search, sell, and buy with other traders.",
    },
    {
      id: "consent",
      heading: "Your Consent",
      body: "When you register with Partiva, you are asked to explicitly agree to this Privacy Policy and to the Terms & Conditions before your request is submitted.",
    },
  ],
  contactTitle: "Contact Us",
  contactBody: "If you have any question about this page, you can reach out to us.",
  contactLinkLabel: "Contact us",
};

export default function PrivacyPage() {
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
            <section key={section.id} aria-labelledby={`privacy-${section.id}`}>
              <h2 id={`privacy-${section.id}`}>{section.heading}</h2>
              <p>{section.body}</p>
              {section.subsections?.map((sub) => (
                <div key={sub.heading}>
                  <h3>
                    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                    {sub.heading}
                  </h3>
                  <p>{sub.body}</p>
                </div>
              ))}
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
