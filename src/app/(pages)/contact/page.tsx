// app/contact/page.tsx
// PAGE-CONTACT — "Contact" (linked from the footer's "اتصل بنا" and the FAQ
// closing CTA). Frontend UI + client-side validation only — no API route
// exists yet, so submission mirrors the same fetch-based contract already
// used by the register / forgot-password forms (POST /api/contact) so it
// can be wired up once that endpoint ships.
//
// Contact details below are the ones already published in the footer
// (WhatsApp number, website, city) — nothing here is invented.

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, Loader2, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import { EMAIL_PATTERN, PHONE_PATTERN, inputClass } from "@/src/app/lib/formValidation";

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
        return isArabic ? "أدخل رقم جوال صحيح" : "Enter a valid mobile number";
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

export default function ContactPage() {
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
        website: "الموقع الإلكتروني",
        location: "الموقع",
        locationValue: "الرياض، المملكة العربية السعودية",
        formHeading: "أرسل لنا رسالة",
        fullNameLabel: "الاسم الكامل",
        emailLabel: "البريد الإلكتروني",
        phoneLabel: "رقم الجوال",
        optionalHint: "(اختياري)",
        inquiryTypeLabel: "نوع الاستفسار",
        inquiryTypePlaceholder: "اختر نوع الاستفسار",
        messageLabel: "الرسالة",
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
        locationValue: "Riyadh, Saudi Arabia",
        formHeading: "Send us a message",
        fullNameLabel: "Full name",
        emailLabel: "Email address",
        phoneLabel: "Mobile number",
        optionalHint: "(optional)",
        inquiryTypeLabel: "Inquiry type",
        inquiryTypePlaceholder: "Choose inquiry type",
        messageLabel: "Message",
        sending: "Sending...",
        send: "Send message",
      };

  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

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

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || copy.submitFailure);
      }

      setStatus("success");
    } catch (err) {
      setStatus("failure");
      setServerError(err instanceof Error ? err.message : copy.submitFailureRetry);
    }
  }

  function handleSendAnother() {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setServerError("");
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <section
        dir={isArabic ? "rtl" : "ltr"}
        lang={locale}
        data-language-managed
        className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-6 py-16 dark:bg-slate-950"
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
            <CheckCircle2 className="h-7 w-7 text-blue-600" aria-hidden="true" />
          </div>

          <h1 ref={successHeadingRef} tabIndex={-1} className="mb-3 text-xl font-bold text-gray-900 dark:text-white outline-none">
            {copy.successTitle}
          </h1>

          <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            {copy.successDescription}
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleSendAnother}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-300 transition-colors hover:border-blue-300 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 dark:border-slate-700 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              {copy.sendAnother}
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              {copy.backHome}
              <BackArrow className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="bg-gray-50 px-6 py-16 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <section className="text-center">
          <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
            {copy.badge}
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 dark:text-slate-400 sm:text-base">
            {copy.heroDescription}
          </p>
        </section>

        {/* Content */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          {/* Contact info */}
          <aside aria-labelledby="contact-info-heading" className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-7 dark:bg-slate-900 dark:ring-slate-800">
            <h2 id="contact-info-heading" className="mb-5 text-base font-bold text-gray-900 dark:text-white">
              {copy.contactInfoHeading}
            </h2>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
                  <FaWhatsapp className="h-5 w-5 text-green-600" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{copy.whatsapp}</p>
                  <a
                    href="https://wa.me/966590843000"
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="mt-0.5 block text-gray-500 dark:text-slate-400 transition-colors hover:text-blue-600 focus:outline-none focus-visible:underline"
                  >
                    +966 59 084 3000
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
                  <Globe className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{copy.website}</p>
                  <a
                    href="https://partiva.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="mt-0.5 block text-gray-500 dark:text-slate-400 transition-colors hover:text-blue-600 focus:outline-none focus-visible:underline"
                  >
                    partiva.tech
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
                  <MapPin className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{copy.location}</p>
                  <p className="mt-0.5 text-gray-500 dark:text-slate-400">{copy.locationValue}</p>
                </div>
              </li>
            </ul>
          </aside>

          {/* Form */}
          <section aria-labelledby="contact-form-heading" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8 dark:bg-slate-900 dark:ring-slate-800">
            <h2 id="contact-form-heading" className="mb-6 text-base font-bold text-gray-900 dark:text-white">
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
                    maxLength={20}
                    placeholder="05XXXXXXXX"
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

              {status === "failure" && serverError && (
                <p role="alert" aria-live="assertive" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={!isFormValid || status === "submitting"}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-slate-700"
              >
                {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {status === "submitting" ? copy.sending : copy.send}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
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
