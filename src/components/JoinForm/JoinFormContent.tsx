// components/JoinForm/JoinFormContent.tsx
// Shared by /join-us/workshop and /join-us/client (the footer's "Join Us as a
// Workshop / Client" links). Submits to POST /join-requests on the Partiva
// PLATFORM's own backend (NEXT_PUBLIC_PLATFORM_API_URL) -- a different
// service from partiva-admin-backend that Contact/Register post to -- so the
// submission shows up in the Platform Admin's "Join Requests" review queue,
// where an admin approves it and sends an invitation email (same flow as
// "Invite platform employee").

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Handshake, Loader2, Wrench } from "lucide-react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import { EMAIL_PATTERN, PHONE_PATTERN, inputClass, phoneErrorMessage } from "@/src/app/lib/formValidation";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";

const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "http://localhost:4000";

export type JoinKind = "WORKSHOP" | "CLIENT";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  city: string;
  message: string;
};

type FieldName = keyof FormState;
type SubmitStatus = "idle" | "submitting" | "success" | "failure";

const initialState: FormState = { fullName: "", email: "", phone: "", companyName: "", city: "", message: "" };

const requiredFields: FieldName[] = ["fullName", "email", "phone"];
const optionalValidatedFields: FieldName[] = [];

function validateField(name: FieldName, values: FormState, isArabic: boolean): string {
  switch (name) {
    case "fullName":
      if (!values.fullName.trim() || values.fullName.trim().length < 2) return isArabic ? "أدخل اسمك الكامل" : "Enter your full name";
      return "";
    case "email":
      if (!EMAIL_PATTERN.test(values.email.trim())) return isArabic ? "أدخل بريد إلكتروني صحيح" : "Enter a valid email address";
      return "";
    case "phone":
      if (!PHONE_PATTERN.test(values.phone.trim())) return phoneErrorMessage(isArabic);
      return "";
    default:
      return "";
  }
}

export default function JoinFormContent({ kind }: { kind: JoinKind }) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;
  const Icon = kind === "WORKSHOP" ? Wrench : Handshake;

  const copy = isArabic
    ? {
        badge: kind === "WORKSHOP" ? "انضم كصاحب ورشة" : "انضم كعميل",
        heroTitle: kind === "WORKSHOP" ? "انضم إلى بارتيفا كصاحب ورشة" : "انضم إلى بارتيفا كعميل",
        heroDescription:
          kind === "WORKSHOP"
            ? "سجّل بيانات ورشتك وسيقوم فريقنا بمراجعة طلبك والتواصل معك لإكمال انضمامك إلى شبكة بارتيفا."
            : "سجّل بياناتك وسيقوم فريقنا بمراجعة طلبك والتواصل معك لإكمال انضمامك إلى شبكة بارتيفا.",
        formHeading: "بيانات الطلب",
        fullNameLabel: "الاسم الكامل",
        emailLabel: "البريد الإلكتروني",
        phoneLabel: "رقم الجوال",
        companyLabel: kind === "WORKSHOP" ? "اسم الورشة" : "اسم الشركة",
        optionalHint: "(اختياري)",
        cityLabel: "المدينة",
        messageLabel: "رسالة إضافية",
        submitFailure: "تعذر إرسال الطلب",
        submitFailureRetry: "تعذر إرسال الطلب، حاول مرة أخرى",
        successTitle: "تم استلام طلبك",
        successDescription: "شكرًا لاهتمامك بالانضمام إلى بارتيفا! سيقوم فريقنا بمراجعة طلبك والتواصل معك قريبًا.",
        sendAnother: "إرسال طلب آخر",
        backHome: "العودة للرئيسية",
        sending: "جارِ الإرسال...",
        send: "إرسال الطلب",
      }
    : {
        badge: kind === "WORKSHOP" ? "Join as a Workshop Owner" : "Join as a Client",
        heroTitle: kind === "WORKSHOP" ? "Join Partiva as a Workshop Owner" : "Join Partiva as a Client",
        heroDescription:
          kind === "WORKSHOP"
            ? "Tell us about your workshop and our team will review your application and reach out to complete your onboarding to the Partiva network."
            : "Tell us about yourself and our team will review your application and reach out to complete your onboarding to the Partiva network.",
        formHeading: "Application details",
        fullNameLabel: "Full name",
        emailLabel: "Email address",
        phoneLabel: "Mobile number",
        companyLabel: kind === "WORKSHOP" ? "Workshop name" : "Company name",
        optionalHint: "(optional)",
        cityLabel: "City",
        messageLabel: "Additional message",
        submitFailure: "Unable to submit the request",
        submitFailureRetry: "Unable to submit the request. Please try again.",
        successTitle: "Your application has been received",
        successDescription: "Thank you for your interest in joining Partiva! Our team will review your application and reach out soon.",
        sendAnother: "Send another application",
        backHome: "Back to home",
        sending: "Sending...",
        send: "Send application",
      };

  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
  }, [status]);

  const allFields: FieldName[] = [...requiredFields, ...optionalValidatedFields];
  const isFieldValid = (name: FieldName) => validateField(name, values, isArabic) === "";
  const isFormValid = requiredFields.every(isFieldValid);

  function handleChange<K extends FieldName>(name: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setServerError("");
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
      const res = await fetch(`${PLATFORM_API}/api/v1/join-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          companyName: values.companyName.trim() || undefined,
          city: values.city.trim() || undefined,
          message: values.message.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || copy.submitFailure);
      }

      setStatus("success");
    } catch (err) {
      setStatus("failure");
      setServerError(err instanceof Error && !(err instanceof TypeError) ? err.message : copy.submitFailureRetry);
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
      <>
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-50/70 via-neutral-50 to-white dark:from-blue-500/5 dark:via-neutral-950 dark:to-neutral-950" aria-hidden="true" />
        <section dir={isArabic ? "rtl" : "ltr"} lang={locale} data-language-managed className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
          <RevealOnScroll variant="scale">
            <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
                <CheckCircle2 className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <h1 ref={successHeadingRef} tabIndex={-1} className="mb-3 text-xl font-bold text-neutral-900 dark:text-white outline-none">
                {copy.successTitle}
              </h1>
              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{copy.successDescription}</p>
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
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-50/70 via-neutral-50 to-white dark:from-blue-500/5 dark:via-neutral-950 dark:to-neutral-950" aria-hidden="true" />
      <main dir={isArabic ? "rtl" : "ltr"} lang={locale} data-language-managed className="px-4 pb-16 pt-6 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/70 to-white px-6 py-14 text-center ring-1 ring-neutral-100 sm:py-16 dark:from-blue-500/5 dark:to-neutral-900 dark:ring-neutral-800">
            <div
              className="pointer-events-none absolute right-6 top-8 h-24 w-24 text-neutral-300/70 dark:text-neutral-700/50"
              style={{ backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)", backgroundSize: "14px 14px" }}
              aria-hidden="true"
            />
            <RevealOnScroll variant="fade">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-neutral-900">
                <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <span className="mt-4 block text-sm font-semibold text-blue-600 dark:text-blue-400">{copy.badge}</span>
              <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">{copy.heroTitle}</h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-500 dark:text-neutral-400">{copy.heroDescription}</p>
            </RevealOnScroll>
          </section>

          <RevealOnScroll variant="right" delay={0.08} amount={0.4} margin="0px 0px -10%">
            <section aria-labelledby="join-form-heading" className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100 sm:p-8 dark:bg-neutral-900 dark:ring-neutral-800">
              <h2 id="join-form-heading" className="mb-6 text-base font-bold text-neutral-900 dark:text-white">
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
                  <Field id="phone" label={copy.phoneLabel} error={touched.phone ? errors.phone : ""}>
                    <input
                      id="phone"
                      type="tel"
                      dir="ltr"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={20}
                      placeholder="XXXXXXXXXX"
                      value={values.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      aria-invalid={touched.phone && !!errors.phone}
                      aria-describedby={touched.phone && errors.phone ? "phone-error" : undefined}
                      className={inputClass(!!(touched.phone && errors.phone)) + (isArabic ? " text-right" : " text-left")}
                    />
                  </Field>

                  <Field id="companyName" label={copy.companyLabel} hint={copy.optionalHint}>
                    <input
                      id="companyName"
                      type="text"
                      maxLength={200}
                      value={values.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      className={inputClass(false)}
                    />
                  </Field>
                </div>

                <Field id="city" label={copy.cityLabel} hint={copy.optionalHint}>
                  <input id="city" type="text" maxLength={120} value={values.city} onChange={(e) => handleChange("city", e.target.value)} className={inputClass(false)} />
                </Field>

                <Field id="message" label={copy.messageLabel} hint={copy.optionalHint}>
                  <textarea
                    id="message"
                    rows={4}
                    maxLength={2000}
                    value={values.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className={inputClass(false) + " resize-y"}
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
                  className="btn-motion flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:disabled:bg-neutral-700 dark:focus-visible:ring-offset-neutral-900"
                >
                  {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {status === "submitting" ? copy.sending : copy.send}
                </button>
              </form>
            </section>
          </RevealOnScroll>
        </div>
      </main>
    </>
  );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
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
