// app/contact/page.tsx
// PAGE-CONTACT — "Contact" (linked from the footer's "اتصل بنا" and the FAQ
// closing CTA). Submits to POST /api/contact-messages (partiva-admin-backend),
// which stores each message and surfaces it in the Dashboard's "Contact
// Requests" section.
//
// Contact details below are the ones already published in the footer
// (WhatsApp number, website, city) — nothing here is invented.

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, Loader2, Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import { EMAIL_PATTERN, PHONE_PATTERN, inputClass } from "@/src/app/lib/formValidation";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import Recaptcha from "@/src/components/Recaptcha/Recaptcha";
import { resolveMainAndExtras, type PageSection } from "@/src/app/lib/pagesApi";

type ContactInfo = { whatsappNumber: string; whatsappLink: string; websiteUrl: string; locationAr: string; locationEn: string };
const API = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
// Defaults match what's published today -- used until the fetch resolves,
// and as a fallback if it fails, so the page never shows blank contact info.
const DEFAULT_CONTACT: ContactInfo = {
  whatsappNumber: "+966 59 084 3000",
  whatsappLink: "https://wa.me/966590843000",
  websiteUrl: "https://partiva.tech/",
  locationAr: "الرياض، المملكة العربية السعودية",
  locationEn: "Riyadh, Saudi Arabia",
};

type InquiryType = "" | "sales" | "support" | "partnership" | "press" | "other";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  message: string;
};

type FieldName = keyof FormState;
type SubmitStatus = "idle" | "submitting" | "success" | "failure";

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  inquiryType: "",
  message: "",
};

const MESSAGE_MIN_LENGTH = 10;

const inquiryTypes: { value: Exclude<InquiryType, "">; labelAr: string; labelEn: string }[] = [
  { value: "sales", labelAr: "المبيعات", labelEn: "Sales" },
  { value: "support", labelAr: "الدعم", labelEn: "Support" },
  { value: "partnership", labelAr: "الشراكات", labelEn: "Partnerships" },
  { value: "press", labelAr: "الإعلام", labelEn: "Press" },
  { value: "other", labelAr: "أخرى", labelEn: "Other" },
];

function validateField(name: FieldName, values: FormState, isArabic: boolean): string {
  switch (name) {
    case "fullName":
      if (!values.fullName.trim() || values.fullName.trim().length < 2)
        return isArabic ? "أدخل اسمك الكامل" : "Enter your full name";
      return "";
    case "email":
      if (!EMAIL_PATTERN.test(values.email.trim()))
        return isArabic ? "أدخل بريد إلكتروني صحيح" : "Enter a valid email address";
      return "";
    case "phone":
      // Optional — only validated when the visitor filled it in.
      if (values.phone.trim() && !PHONE_PATTERN.test(values.phone.trim()))
        return isArabic
          ? "رقم الجوال يجب أن يتكون من 11 رقمًا بالضبط"
          : "The phone number must be exactly 11 digits";
      return "";
    case "inquiryType":
      if (!values.inquiryType)
        return isArabic ? "اختر نوع الاستفسار" : "Choose an inquiry type";
      return "";
    case "message":
      if (values.message.trim().length < MESSAGE_MIN_LENGTH)
        return isArabic
          ? "من فضلك اكتب رسالة لا تقل عن 10 أحرف"
          : "Please write a message of at least 10 characters";
      return "";
    default:
      return "";
  }
}

const requiredFields: FieldName[] = ["fullName", "email", "inquiryType", "message"];
// Validated on blur/submit like the required fields, but an empty value is not an error.
const optionalValidatedFields: FieldName[] = ["phone"];

export default function ContactContent() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  const copy = isArabic
    ? {
        submitFailure: "تعذر إرسال الطلب",
        submitFailureRetry: "تعذر إرسال الطلب، حاول مرة أخرى",
        successTitle: "تم استلام رسالتك",
        successDescription: "شكرًا لتواصلك معنا! سيقوم فريقنا بالرد عليك في أقرب وقت ممكن.",
        sendAnother: "إرسال رسالة أخرى",
        backHome: "العودة للرئيسية",
        badge: "تواصل معنا",
        heroTitle: "تواصل مع فريق Partiva",
        heroDescription:
          "عندك سؤال عن المنصة أو الأسعار أو الشراكة معنا؟ املأ النموذج أو تواصل معنا مباشرة وسيرد عليك فريقنا في أقرب وقت.",
        contactInfoHeading: "طرق التواصل",
        whatsapp: "واتساب",
        website: "البريد الإلكتروني",
        location: "الموقع",
        formHeading: "أرسل لنا رسالة",
        fullNameLabel: "الاسم الكامل",
        emailLabel: "البريد الإلكتروني",
        phoneLabel: "رقم الجوال",
        optionalHint: "(اختياري)",
        inquiryTypeLabel: "نوع الاستفسار",
        inquiryTypePlaceholder: "اختر نوع الاستفسار",
        messageLabel: "الرسالة",
        verifyLabel: "التحقق الأمني",
        verifyRequired: "يرجى إكمال التحقق من أنك لست روبوتًا",
        sending: "جارِ الإرسال...",
        send: "إرسال الرسالة",
      }
    : {
        submitFailure: "Unable to submit the request",
        submitFailureRetry: "Unable to submit the request. Please try again.",
        successTitle: "Your message has been received",
        successDescription: "Thank you for contacting us! Our team will get back to you as soon as possible.",
        sendAnother: "Send another message",
        backHome: "Back to home",
        badge: "Contact us",
        heroTitle: "Get in touch with the Partiva team",
        heroDescription:
          "Have a question about the platform, pricing, or partnering with us? Fill out the form or reach us directly and our team will respond as soon as possible.",
        contactInfoHeading: "Ways to reach us",
        whatsapp: "WhatsApp",
        website: "Website",
        location: "Location",
        formHeading: "Send us a message",
        fullNameLabel: "Full name",
        emailLabel: "Email address",
        phoneLabel: "Mobile number",
        optionalHint: "(optional)",
        inquiryTypeLabel: "Inquiry type",
        inquiryTypePlaceholder: "Choose inquiry type",
        messageLabel: "Message",
        verifyLabel: "Security verification",
        verifyRequired: "Please complete the verification below",
        sending: "Sending...",
        send: "Send message",
      };

  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);
  useEffect(() => {
    fetch(`${API}/api/contact`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => {
        if (!r?.success) return;
        const d = r.data;
        setContact({
          whatsappNumber: d.whatsappNumber || DEFAULT_CONTACT.whatsappNumber,
          whatsappLink: d.whatsappLink || DEFAULT_CONTACT.whatsappLink,
          websiteUrl: d.websiteUrl || DEFAULT_CONTACT.websiteUrl,
          locationAr: d.locationAr || DEFAULT_CONTACT.locationAr,
          locationEn: d.locationEn || d.locationAr || DEFAULT_CONTACT.locationEn,
        });
      })
      .catch(() => {});
  }, []);

  const [sections, setSections] = useState<{ mainVisible: boolean; main: PageSection | null; extras: PageSection[] }>({ mainVisible: true, main: null, extras: [] });
  useEffect(() => {
    fetch(`${API}/api/pages`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => { if (r?.success) setSections(resolveMainAndExtras(r.data, "contact")); })
      .catch(() => {});
  }, []);
  const mainBody = isArabic ? sections.main?.bodyAr : sections.main?.bodyEn;
  const heroTitle = mainBody ? (isArabic ? sections.main?.titleAr : sections.main?.titleEn) || copy.heroTitle : copy.heroTitle;
  const heroDescription = mainBody || copy.heroDescription;

  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // "Are you a robot?" verification (Recaptcha.tsx) -- a real, server-checked
  // control (see contact-messages.routes.ts), not a decorative checkbox.
  // recaptchaResetKey is bumped after every failed attempt to force the
  // widget to remount with a fresh token, since a token can only be used once.
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState("");
  const [recaptchaResetKey, setRecaptchaResetKey] = useState(0);

  useEffect(() => {
    if (status === "success") {
      successHeadingRef.current?.focus();
    }
  }, [status]);

  const allFields: FieldName[] = [...requiredFields, ...optionalValidatedFields];
  const isFieldValid = (name: FieldName) => validateField(name, values, isArabic) === "";
  const isFormValid = requiredFields.every(isFieldValid) && optionalValidatedFields.every(isFieldValid);

  function handleChange<K extends FieldName>(name: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setServerError("");
    // Re-validate live only once the field has already been touched, so
    // errors don't appear while the visitor is still typing for the first time.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, { ...values, [name]: value }, isArabic) }));
    }
  }

  function handleBlur(name: FieldName) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, values, isArabic) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const nextErrors: Partial<Record<FieldName, string>> = {};
    allFields.forEach((f) => {
      nextErrors[f] = validateField(f, values, isArabic);
    });
    setErrors(nextErrors);
    setTouched(allFields.reduce((acc, f) => ({ ...acc, [f]: true }), {} as Record<FieldName, boolean>));

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;

    if (!recaptchaToken) {
      setRecaptchaError(copy.verifyRequired);
      return;
    }
    setRecaptchaError("");

    setStatus("submitting");
    try {
      // Backed by contact_messages (partiva-admin-backend) -- distinct from
      // GET /api/contact above, which reads the site-wide contact-info
      // settings singleton, not individual message submissions. Shown in
      // the Dashboard under "Contact Requests". recaptchaToken is verified
      // server-side against Google's siteverify API before anything is
      // written to the database -- this client-side check is UX only.
      const res = await fetch(`${API}/api/contact-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, recaptchaToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || copy.submitFailure);
      }

      setStatus("success");
    } catch (err) {
      setStatus("failure");
      setServerError(err instanceof Error ? err.message : copy.submitFailureRetry);
      // The consumed/failed token can't be reused -- force a fresh widget.
      setRecaptchaToken(null);
      setRecaptchaResetKey((k) => k + 1);
    }
  }

  function handleSendAnother() {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setServerError("");
    setStatus("idle");
    setRecaptchaToken(null);
    setRecaptchaError("");
    setRecaptchaResetKey((k) => k + 1);
  }

  if (status === "success") {
    return (
      <>
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-50/70 via-neutral-50 to-white dark:from-blue-500/5 dark:via-neutral-950 dark:to-neutral-950" aria-hidden="true" />
        <section
          dir={isArabic ? "rtl" : "ltr"}
          lang={locale}
          data-language-managed
          className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16"
        >
          <RevealOnScroll variant="scale">
            <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
                <CheckCircle2 className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>

              <h1 ref={successHeadingRef} tabIndex={-1} className="mb-3 text-xl font-bold text-neutral-900 dark:text-white outline-none">
                {copy.successTitle}
              </h1>

              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                {copy.successDescription}
              </p>

              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleSendAnother}
                  className="rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 transition-colors hover:border-blue-300 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:text-blue-400 dark:focus-visible:ring-offset-neutral-900"
                >
                  {copy.sendAnother}
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
                >
                  {copy.backHome}
                  <BackArrow className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      </>
    );
  }

  return (
    <>
    {sections.mainVisible && (
    <>
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-50/70 via-neutral-50 to-white dark:from-blue-500/5 dark:via-neutral-950 dark:to-neutral-950" aria-hidden="true" />
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="px-4 pb-16 pt-6 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        {/* Hero — island card, matching /solutions & /business-network */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/70 to-white px-6 py-14 text-center ring-1 ring-neutral-100 sm:py-16 dark:from-blue-500/5 dark:to-neutral-900 dark:ring-neutral-800">
          <div
            className="pointer-events-none absolute right-6 top-8 h-24 w-24 text-neutral-300/70 dark:text-neutral-700/50"
            style={{ backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)", backgroundSize: "14px 14px" }}
            aria-hidden="true"
          />
          <RevealOnScroll variant="fade">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-neutral-900">
              <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <span className="mt-4 block text-sm font-semibold text-blue-600 dark:text-blue-400">
              {copy.badge}
            </span>
            <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
              {heroTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-500 dark:text-neutral-400">
              {heroDescription}
            </p>
          </RevealOnScroll>
        </section>

        {/* Content */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          {/* Contact info */}
          <RevealOnScroll variant="left" amount={0.4} margin="0px 0px -10%">
          <aside aria-labelledby="contact-info-heading" className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100 sm:p-7 dark:bg-neutral-900 dark:ring-neutral-800">
            <h2 id="contact-info-heading" className="mb-5 text-base font-bold text-neutral-900 dark:text-white">
              {copy.contactInfoHeading}
            </h2>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
                  <FaWhatsapp className="h-5 w-5 text-green-600" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{copy.whatsapp}</p>
                  <a
                    href={contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="mt-0.5 block text-neutral-500 dark:text-neutral-400 transition-colors hover:text-blue-600 focus:outline-none focus-visible:underline"
                  >
                    {contact.whatsappNumber}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{copy.website}</p>
                  <a
                    href={contact.websiteUrl.includes("@") ? `mailto:${contact.websiteUrl}` : contact.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="mt-0.5 block text-neutral-500 dark:text-neutral-400 transition-colors hover:text-blue-600 focus:outline-none focus-visible:underline"
                  >
                    {contact.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{copy.location}</p>
                  <p className="mt-0.5 text-neutral-500 dark:text-neutral-400">{isArabic ? contact.locationAr : contact.locationEn}</p>
                </div>
              </li>
            </ul>
          </aside>
          </RevealOnScroll>

          {/* Form */}
          <RevealOnScroll variant="right" delay={0.08} amount={0.4} margin="0px 0px -10%">
          <section aria-labelledby="contact-form-heading" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100 sm:p-8 dark:bg-neutral-900 dark:ring-neutral-800">
            <h2 id="contact-form-heading" className="mb-6 text-base font-bold text-neutral-900 dark:text-white">
              {copy.formHeading}
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field id="fullName" label={copy.fullNameLabel} error={touched.fullName ? errors.fullName : ""}>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={values.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    aria-invalid={touched.fullName && !!errors.fullName}
                    aria-describedby={touched.fullName && errors.fullName ? "fullName-error" : undefined}
                    className={inputClass(!!(touched.fullName && errors.fullName))}
                  />
                </Field>

                <Field id="email" label={copy.emailLabel} error={touched.email ? errors.email : ""}>
                  <input
                    id="email"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    placeholder="example@email.com"
                    maxLength={254}
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    aria-invalid={touched.email && !!errors.email}
                    aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                    className={inputClass(!!(touched.email && errors.email)) + (isArabic ? " text-right" : " text-left")}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  id="phone"
                  label={copy.phoneLabel}
                  hint={copy.optionalHint}
                  error={touched.phone ? errors.phone : ""}
                >
                  <input
                    id="phone"
                    type="tel"
                    dir="ltr"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={20}
                    placeholder="XXXXXXXXXXX"
                    value={values.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    aria-invalid={touched.phone && !!errors.phone}
                    aria-describedby={touched.phone && errors.phone ? "phone-error" : undefined}
                    className={inputClass(!!(touched.phone && errors.phone)) + (isArabic ? " text-right" : " text-left")}
                  />
                </Field>

                <Field id="inquiryType" label={copy.inquiryTypeLabel} error={touched.inquiryType ? errors.inquiryType : ""}>
                  <select
                    id="inquiryType"
                    value={values.inquiryType}
                    onChange={(e) => handleChange("inquiryType", e.target.value as InquiryType)}
                    onBlur={() => handleBlur("inquiryType")}
                    aria-invalid={touched.inquiryType && !!errors.inquiryType}
                    aria-describedby={touched.inquiryType && errors.inquiryType ? "inquiryType-error" : undefined}
                    className={inputClass(!!(touched.inquiryType && errors.inquiryType))}
                  >
                    <option value="">{copy.inquiryTypePlaceholder}</option>
                    {inquiryTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {isArabic ? t.labelAr : t.labelEn}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field id="message" label={copy.messageLabel} error={touched.message ? errors.message : ""}>
                <textarea
                  id="message"
                  rows={5}
                  maxLength={2000}
                  value={values.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  aria-invalid={touched.message && !!errors.message}
                  aria-describedby={touched.message && errors.message ? "message-error" : undefined}
                  className={inputClass(!!(touched.message && errors.message)) + " resize-y"}
                />
              </Field>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{copy.verifyLabel}</span>
                <Recaptcha
                  key={`${locale}-${recaptchaResetKey}`}
                  locale={locale}
                  onVerify={(token) => {
                    setRecaptchaToken(token);
                    setRecaptchaError("");
                  }}
                  onExpire={() => setRecaptchaToken(null)}
                />
                {recaptchaError && (
                  <p role="alert" aria-live="assertive" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {recaptchaError}
                  </p>
                )}
              </div>

              {status === "failure" && serverError && (
                <p role="alert" aria-live="assertive" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={!isFormValid || status === "submitting" || !recaptchaToken}
                className="btn-motion flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:disabled:bg-neutral-700 dark:focus-visible:ring-offset-neutral-900"
              >
                {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {status === "submitting" ? copy.sending : copy.send}
              </button>
            </form>
          </section>
          </RevealOnScroll>
        </div>
      </div>
    </main>
    </>
    )}
    {sections.extras.map((s) => (
      <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
    ))}
    </>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
        {label}
        {hint && <span className="mr-1.5 font-normal text-gray-400 dark:text-slate-500">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
