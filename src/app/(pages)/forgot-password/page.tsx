"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import { EMAIL_PATTERN } from "@/src/app/lib/formValidation";

type SubmitStatus = "idle" | "submitting" | "success" | "failure";

export default function ForgotPasswordPage() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  const copy = isArabic
    ? {
        emptyEmail: "أدخل البريد الإلكتروني",
        invalidEmail: "أدخل بريد إلكتروني صحيح",
        sendFailure: "تعذر إرسال رابط استعادة كلمة المرور",
        submitFailureRetry: "تعذر إرسال الطلب، حاول مرة أخرى",
        successTitle: "تحقق من بريدك الإلكتروني",
        successDescription:
          "إذا كان البريد الإلكتروني مرتبطًا بحساب، فسيصلك رابط لإعادة تعيين كلمة المرور.",
        backToLogin: "العودة لتسجيل الدخول",
        heading: "نسيت كلمة المرور؟",
        subheading:
          "أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.",
        emailLabel: "البريد الإلكتروني",
        sending: "جارِ الإرسال...",
        sendLink: "إرسال رابط الاستعادة",
      }
    : {
        emptyEmail: "Enter your email address",
        invalidEmail: "Enter a valid email address",
        sendFailure: "Unable to send the password reset link",
        submitFailureRetry: "Unable to submit the request. Please try again.",
        successTitle: "Check your email",
        successDescription:
          "If this email is linked to an account, you will receive a link to reset your password.",
        backToLogin: "Back to log in",
        heading: "Forgot your password?",
        subheading:
          "Enter the email address linked to your account and we'll send you a link to reset your password.",
        emailLabel: "Email address",
        sending: "Sending...",
        sendLink: "Send reset link",
      };

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function handleBlur() {
    if (!email.trim()) {
      setError(copy.emptyEmail);
      return;
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(copy.invalidEmail);
      return;
    }

    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setServerError("");

    // Validation
    if (!email.trim()) {
      setError(copy.emptyEmail);
      return;
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(copy.invalidEmail);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || copy.sendFailure);
      }

      setStatus("success");
    } catch (err) {
      setStatus("failure");

      setServerError(
        err instanceof Error ? err.message : copy.submitFailureRetry
      );
    }
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
            <CheckCircle2 className="h-7 w-7 text-blue-600" />
          </div>

          <h1 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            {copy.successTitle}
          </h1>

          <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            {copy.successDescription}
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            {copy.backToLogin}
            <BackArrow className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-6 py-16 dark:bg-slate-950"
    >
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {copy.heading}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            {copy.subheading}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 dark:bg-slate-900 dark:ring-slate-800"
        >
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
              {copy.emailLabel}
            </label>

            <input
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setServerError("");
              }}
              onBlur={handleBlur}
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition-colors focus:ring-2 dark:bg-slate-900 ${
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:ring-red-500/20"
                  : "border-gray-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
              }`}
            />

            {error && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          {/* Server Error */}
          {status === "failure" && serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {serverError}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              !email.trim() ||
              !EMAIL_PATTERN.test(email.trim()) ||
              status === "submitting"
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-slate-700"
          >
            {status === "submitting" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {status === "submitting" ? copy.sending : copy.sendLink}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              <BackArrow className="h-4 w-4" />
              {copy.backToLogin}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
