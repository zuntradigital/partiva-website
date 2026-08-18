"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import { EMAIL_PATTERN, inputClass } from "@/src/app/lib/formValidation";
import FormField from "@/src/components/FormField/FormField";

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

export default function Login() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

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

          <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
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

            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={values.rememberMe}
                onChange={(e) =>
                  handleChange(
                    "rememberMe",
                    e.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
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
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-slate-700"
          >
            {status === "submitting" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {status === "submitting" ? copy.submitting : copy.submit}
          </button>

          {/* Register */}
          <p className="text-center text-sm text-gray-500 dark:text-slate-400">
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
    </section>
  );
}
