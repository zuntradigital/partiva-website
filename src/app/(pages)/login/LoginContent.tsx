"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import { EMAIL_PATTERN, inputClass } from "@/src/app/lib/formValidation";
import FormField from "@/src/components/FormField/FormField";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import { resolveMainAndExtras, type PageSection } from "@/src/app/lib/pagesApi";

const API = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

type FormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type FieldName = keyof FormState;

const initialState: FormState = {
  email: "",
  password: "",
  rememberMe: false,
};

type SubmitStatus = "idle" | "submitting" | "success" | "failure";

function validateField(
  name: FieldName,
  values: FormState,
  isArabic: boolean
): string {
  switch (name) {
    case "email":
      if (!values.email.trim()) {
        return isArabic ? "أدخل البريد الإلكتروني" : "Enter your email address";
      }

      if (!EMAIL_PATTERN.test(values.email.trim())) {
        return isArabic ? "أدخل بريد إلكتروني صحيح" : "Enter a valid email address";
      }

      return "";

    case "password":
      if (!values.password) {
        return isArabic ? "أدخل كلمة المرور" : "Enter your password";
      }

      if (values.password.length < 8) {
        return isArabic
          ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
          : "Password must be at least 8 characters";
      }

      return "";

    default:
      return "";
  }
}

const requiredFields: FieldName[] = ["email", "password"];

export default function LoginContent() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const [sections, setSections] = useState<{ mainVisible: boolean; main: PageSection | null; extras: PageSection[] }>({ mainVisible: true, main: null, extras: [] });
  useEffect(() => {
    fetch(`${API}/api/pages`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => { if (r?.success) setSections(resolveMainAndExtras(r.data, "login")); })
      .catch(() => {});
  }, []);

  const copy = isArabic
    ? {
        heading: "تسجيل الدخول",
        subheading: "سجّل الدخول إلى حسابك في Partiva",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        hidePassword: "إخفاء كلمة المرور",
        showPassword: "إظهار كلمة المرور",
        rememberMe: "تذكرني",
        forgotPassword: "نسيت كلمة المرور؟",
        fallbackServerError: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        submitFailure: "تعذر تسجيل الدخول، حاول مرة أخرى",
        submitting: "جارِ تسجيل الدخول...",
        submit: "تسجيل الدخول",
        noAccount: "ليس لديك حساب؟",
        createAccount: "إنشاء حساب جديد",
      }
    : {
        heading: "Log in",
        subheading: "Sign in to your Partiva account",
        emailLabel: "Email address",
        passwordLabel: "Password",
        hidePassword: "Hide password",
        showPassword: "Show password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot your password?",
        fallbackServerError: "Incorrect email address or password",
        submitFailure: "Unable to sign in. Please try again.",
        submitting: "Signing in...",
        submit: "Log in",
        noAccount: "Don't have an account?",
        createAccount: "Create a new account",
      };
  const mainBody = isArabic ? sections.main?.bodyAr : sections.main?.bodyEn;
  const heroHeading = mainBody ? (isArabic ? sections.main?.titleAr : sections.main?.titleEn) || copy.heading : copy.heading;
  const heroSubheading = mainBody || copy.subheading;

  const [values, setValues] = useState<FormState>(initialState);

  const [errors, setErrors] = useState<
    Partial<Record<FieldName, string>>
  >({});

  const [touched, setTouched] = useState<
    Partial<Record<FieldName, boolean>>
  >({});

  const [showPassword, setShowPassword] = useState(false);

  const [status, setStatus] = useState<SubmitStatus>("idle");

  const [serverError, setServerError] = useState("");

  const isFormValid = requiredFields.every(
    (field) => validateField(field, values, isArabic) === ""
  );

  function handleChange<K extends FieldName>(
    name: K,
    value: FormState[K]
  ) {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(
          name,
          {
            ...values,
            [name]: value,
          },
          isArabic
        ),
      }));
    }

    // Clear server error when user edits the form
    if (serverError) {
      setServerError("");
    }
  }

  function handleBlur(name: FieldName) {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, values, isArabic),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setServerError("");

    // Validate all fields
    const nextErrors: Partial<Record<FieldName, string>> = {};

    requiredFields.forEach((field) => {
      const error = validateField(field, values, isArabic);

      if (error) {
        nextErrors[field] = error;
      }
    });

    setErrors(nextErrors);

    setTouched({
      email: true,
      password: true,
    });

    const hasErrors = Object.values(nextErrors).some(Boolean);

    if (hasErrors) {
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
          rememberMe: values.rememberMe,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || copy.fallbackServerError);
      }

      setStatus("success");

      // هنضيف الـredirect للـdashboard لما نجهز الـbackend/auth
      // مثال:
      // window.location.href = "/dashboard";

    } catch (err) {
      setStatus("failure");

      setServerError(
        err instanceof Error ? err.message : copy.submitFailure
      );
    }
  }

  return (
    <>
    {sections.mainVisible && (
    <>
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-50/70 via-neutral-50 to-white dark:from-blue-500/5 dark:via-neutral-950 dark:to-neutral-950" aria-hidden="true" />
    <section
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16"
    >
      <RevealOnScroll variant="scale" className="w-full max-w-md">
      <div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-neutral-900">
            <LogIn className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">
            {heroHeading}
          </h1>

          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            {heroSubheading}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800"
        >

          {/* Email */}
          <FormField
            label={copy.emailLabel}
            error={touched.email ? errors.email : ""}
          >
            <input
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="example@email.com"
              value={values.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
              onBlur={() => handleBlur("email")}
              className={
                inputClass(
                  !!touched.email && !!errors.email
                ) + (isArabic ? " text-right" : " text-left")
              }
            />
          </FormField>

          {/* Password */}
          <FormField
            label={copy.passwordLabel}
            error={touched.password ? errors.password : ""}
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                dir="ltr"
                autoComplete="current-password"
                placeholder="••••••••"
                value={values.password}
                onChange={(e) =>
                  handleChange("password", e.target.value)
                }
                onBlur={() => handleBlur("password")}
                className={
                  inputClass(
                    !!touched.password && !!errors.password
                  ) + " pl-11" + (isArabic ? " text-right" : " text-left")
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded dark:text-neutral-500 dark:hover:text-neutral-300 dark:focus-visible:ring-offset-neutral-900"
                aria-label={
                  showPassword ? copy.hidePassword : copy.showPassword
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </FormField>

          {/* Remember + Forgot Password */}
          <div className="flex items-center justify-between gap-4">

            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <input
                type="checkbox"
                checked={values.rememberMe}
                onChange={(e) =>
                  handleChange(
                    "rememberMe",
                    e.target.checked
                  )
                }
                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800"
              />

              <span>{copy.rememberMe}</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              {copy.forgotPassword}
            </Link>

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
            disabled={!isFormValid || status === "submitting"}
            className="btn-motion flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:disabled:bg-neutral-700 dark:focus-visible:ring-offset-neutral-900"
          >
            {status === "submitting" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {status === "submitting" ? copy.submitting : copy.submit}
          </button>

          {/* Register */}
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            {copy.noAccount}{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              {copy.createAccount}
            </Link>
          </p>

        </form>
      </div>
      </RevealOnScroll>
    </section>
    </>
    )}
    {sections.extras.map((s) => (
      <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
    ))}
    </>
  );
}
