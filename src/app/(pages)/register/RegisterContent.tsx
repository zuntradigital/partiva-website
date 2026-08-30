"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, CheckCircle2, Building2 } from "lucide-react";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import { EMAIL_PATTERN, PHONE_PATTERN, inputClass } from "@/src/app/lib/formValidation";
import FormField from "@/src/components/FormField/FormField";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import { resolveMainAndExtras, type PageSection } from "@/src/app/lib/pagesApi";

const API = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

type BusinessActivity = "" | "retail" | "wholesale" | "importer" | "workshop";
type Tier = "" | "basic" | "professional" | "enterprise" | "free";

type FormState = {
  tradeName: string;
  crNumber: string;
  businessActivity: BusinessActivity;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  tier: Tier;
  consent: boolean;
};

type FieldName = keyof FormState;

const initialState: FormState = {
  tradeName: "",
  crNumber: "",
  businessActivity: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  city: "",
  tier: "",
  consent: false,
};

// WEB-DEC-07: exact CR number pattern/length is not specified in the Master SRS.
// Using a 10-digit placeholder pending Product/Legal confirmation.
const CR_NUMBER_PATTERN = /^\d{10}$/;

const businessActivities: { value: BusinessActivity; labelAr: string; labelEn: string }[] = [
  { value: "retail", labelAr: "تاجر تجزئة", labelEn: "Retailer" },
  { value: "wholesale", labelAr: "موزع بالجملة", labelEn: "Wholesale distributor" },
  { value: "importer", labelAr: "مستورد", labelEn: "Importer" },
  { value: "workshop", labelAr: "ورشة", labelEn: "Workshop" },
];

const tiers: { value: Tier; labelAr: string; labelEn: string }[] = [
  { value: "basic", labelAr: "الأساسية", labelEn: "Basic" },
  { value: "professional", labelAr: "الاحترافية", labelEn: "Professional" },
  { value: "enterprise", labelAr: "المؤسسية", labelEn: "Enterprise" },
];

function validateField(
  name: FieldName,
  values: FormState,
  isArabic: boolean
): string {
  switch (name) {
    case "tradeName":
      if (!values.tradeName.trim() || values.tradeName.trim().length < 2)
        return isArabic ? "أدخل اسم النشاط التجاري" : "Enter the business name";
      return "";
    case "crNumber":
      if (!CR_NUMBER_PATTERN.test(values.crNumber.trim()))
        return isArabic
          ? "أدخل رقم سجل تجاري صحيح"
          : "Enter a valid commercial registration number";
      return "";
    case "businessActivity":
      if (!values.businessActivity)
        return isArabic ? "اختر النشاط التجاري" : "Choose the business activity";
      return "";
    case "contactName":
      if (!values.contactName.trim())
        return isArabic ? "أدخل اسم جهة الاتصال" : "Enter the contact person's name";
      return "";
    case "contactEmail":
      if (!EMAIL_PATTERN.test(values.contactEmail.trim()))
        return isArabic ? "أدخل بريد إلكتروني صحيح" : "Enter a valid email address";
      return "";
    case "contactPhone":
      if (!PHONE_PATTERN.test(values.contactPhone.trim()))
        return isArabic ? "أدخل رقم جوال صحيح" : "Enter a valid mobile number";
      return "";
    case "tier":
      if (!values.tier)
        return isArabic ? "اختر خطة الاشتراك" : "Choose a subscription plan";
      return "";
    case "consent":
      if (!values.consent)
        return isArabic
          ? "يجب الموافقة على سياسة الخصوصية والشروط للمتابعة"
          : "You must agree to the Privacy Policy and Terms to continue";
      return "";
    default:
      return "";
  }
}

// Fields required for FR-0002 / FR-0008. City is Recommended, not required.
const requiredFields: FieldName[] = [
  "tradeName",
  "crNumber",
  "businessActivity",
  "contactName",
  "contactEmail",
  "contactPhone",
  "tier",
  "consent",
];

type SubmitStatus = "idle" | "submitting" | "success" | "failure";

export default function RegisterContent() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const [sections, setSections] = useState<{ mainVisible: boolean; main: PageSection | null; extras: PageSection[] }>({ mainVisible: true, main: null, extras: [] });
  useEffect(() => {
    fetch(`${API}/api/pages`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => { if (r?.success) setSections(resolveMainAndExtras(r.data, "register")); })
      .catch(() => {});
  }, []);

  const copy = isArabic
    ? {
        successTitle: "تم استلام طلبك",
        successDescription:
          "تم استلام طلبك وهو الآن قيد المراجعة. سنقوم بإعلامك عبر البريد الإلكتروني بمجرد اتخاذ القرار.",
        heading: "سجّل نشاطك التجاري",
        subheading: "أدخل بياناتك وسيتم مراجعة طلبك من قبل فريقنا",
        tradeNameLabel: "اسم النشاط التجاري",
        crNumberLabel: "رقم السجل التجاري",
        businessActivityLabel: "النشاط التجاري",
        businessActivityPlaceholder: "اختر النشاط التجاري",
        contactNameLabel: "اسم جهة الاتصال",
        cityLabel: "المدينة / الفرع",
        emailLabel: "البريد الإلكتروني",
        phoneLabel: "رقم الجوال",
        tierLabel: "خطة الاشتراك",
        tierPlaceholder: "اختر خطة الاشتراك",
        consentLabel: "أوافق على سياسة الخصوصية والشروط والأحكام",
        crNumberDuplicate: "هذا رقم السجل التجاري مسجل بالفعل",
        submitFailure: "تعذر إرسال الطلب",
        submitFailureRetry: "تعذر إرسال الطلب، حاول مرة أخرى",
        submitting: "جارِ الإرسال...",
        submit: "إرسال الطلب",
      }
    : {
        successTitle: "Your request has been received",
        successDescription:
          "Your request has been received and is now under review. We will notify you by email once a decision is made.",
        heading: "Register your business",
        subheading: "Enter your details and our team will review your request",
        tradeNameLabel: "Business name",
        crNumberLabel: "Commercial registration number",
        businessActivityLabel: "Business activity",
        businessActivityPlaceholder: "Choose business activity",
        contactNameLabel: "Contact person's name",
        cityLabel: "City / branch",
        emailLabel: "Email address",
        phoneLabel: "Mobile number",
        tierLabel: "Subscription plan",
        tierPlaceholder: "Choose subscription plan",
        consentLabel: "I agree to the Privacy Policy and Terms & Conditions",
        crNumberDuplicate: "This commercial registration number is already registered",
        submitFailure: "Unable to submit the request",
        submitFailureRetry: "Unable to submit the request. Please try again.",
        submitting: "Submitting...",
        submit: "Submit request",
      };
  const mainBody = isArabic ? sections.main?.bodyAr : sections.main?.bodyEn;
  const heroHeading = mainBody ? (isArabic ? sections.main?.titleAr : sections.main?.titleEn) || copy.heading : copy.heading;
  const heroSubheading = mainBody || copy.subheading;

  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState("");

  // Generated once per form session, sent with the submission per the
  // idempotency-key recommendation extending Master BR-0047 to tenant creation.
  const idempotencyKey = useRef<string>(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
  );

  const isFieldValid = (name: FieldName) =>
    validateField(name, values, isArabic) === "";
  const isFormValid = requiredFields.every(isFieldValid);

  function handleChange<K extends FieldName>(name: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Format validation does not block typing — only re-validate if already touched.
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, { ...values, [name]: value }, isArabic),
      }));
    }
  }

  function handleBlur(name: FieldName) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, values, isArabic),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    // Validating (client)
    const nextErrors: Partial<Record<FieldName, string>> = {};
    requiredFields.forEach((f) => {
      nextErrors[f] = validateField(f, values, isArabic);
    });
    setErrors(nextErrors);
    setTouched(
      requiredFields.reduce(
        (acc, f) => ({ ...acc, [f]: true }),
        {} as Record<FieldName, boolean>,
      ),
    );

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;

    // Submitting
    setStatus("submitting");
    try {
      // Mirrors [Master: API-0002 POST /tenants]. CR-number duplicate check
      // happens server-side only, on submit (see §9.2 — avoids leaking
      // registered-CR existence via blur-time enumeration).
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.field === "crNumber") {
          setErrors((prev) => ({
            ...prev,
            crNumber: copy.crNumberDuplicate,
          }));
          setStatus("idle");
          return;
        }
        throw new Error(data?.message || copy.submitFailure);
      }

      setStatus("success");
    } catch (err) {
      setStatus("failure");
      setServerError(
        err instanceof Error ? err.message : copy.submitFailureRetry,
      );
    }
  }

  if (status === "success") {
    return (
      <>
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-50/70 via-neutral-50 to-white dark:from-blue-500/5 dark:via-neutral-950 dark:to-neutral-950" aria-hidden="true" />
        <section
          dir={isArabic ? "rtl" : "ltr"}
          className="flex min-h-[70vh] items-center justify-center px-6 py-20"
          lang={locale}
          data-language-managed
        >
          <RevealOnScroll variant="scale">
            <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
                <CheckCircle2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-neutral-900 dark:text-white">
                {copy.successTitle}
              </h2>
              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                {copy.successDescription}
              </p>
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
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="px-4 pb-16 pt-6 sm:px-6"
      lang={locale}
      data-language-managed
    >
      <div className="mx-auto max-w-2xl">
        <RevealOnScroll variant="fade">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-neutral-900">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">
            {heroHeading}
          </h1>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            {heroSubheading}
          </p>
        </div>
        </RevealOnScroll>

        <RevealOnScroll variant="up" delay={0.08}>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800"
        >
          <FormField
            label={copy.tradeNameLabel}
            error={touched.tradeName ? errors.tradeName : ""}
          >
            <input
              type="text"
              maxLength={150}
              value={values.tradeName}
              onChange={(e) => handleChange("tradeName", e.target.value)}
              onBlur={() => handleBlur("tradeName")}
              className={inputClass(!!touched.tradeName && !!errors.tradeName)}
            />
          </FormField>

          <FormField
            label={copy.crNumberLabel}
            error={touched.crNumber ? errors.crNumber : ""}
          >
            <input
              type="text"
              inputMode="numeric"
              maxLength={20}
              dir="ltr"
              value={values.crNumber}
              onChange={(e) => handleChange("crNumber", e.target.value)}
              onBlur={() => handleBlur("crNumber")}
              className={
                inputClass(!!touched.crNumber && !!errors.crNumber) +
                (isArabic ? " text-right" : " text-left")
              }
            />
          </FormField>

          <FormField
            label={copy.businessActivityLabel}
            error={touched.businessActivity ? errors.businessActivity : ""}
          >
            <select
              value={values.businessActivity}
              onChange={(e) =>
                handleChange(
                  "businessActivity",
                  e.target.value as BusinessActivity,
                )
              }
              onBlur={() => handleBlur("businessActivity")}
              className={inputClass(
                !!touched.businessActivity && !!errors.businessActivity,
              )}
            >
              <option value="">{copy.businessActivityPlaceholder}</option>
              {businessActivities.map((a) => (
                <option key={a.value} value={a.value}>
                  {isArabic ? a.labelAr : a.labelEn}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label={copy.contactNameLabel}
              error={touched.contactName ? errors.contactName : ""}
            >
              <input
                type="text"
                maxLength={100}
                value={values.contactName}
                onChange={(e) => handleChange("contactName", e.target.value)}
                onBlur={() => handleBlur("contactName")}
                className={inputClass(
                  !!touched.contactName && !!errors.contactName,
                )}
              />
            </FormField>

            <FormField label={copy.cityLabel} error="">
              <input
                type="text"
                maxLength={100}
                value={values.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={inputClass(false)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label={copy.emailLabel}
              error={touched.contactEmail ? errors.contactEmail : ""}
            >
              <input
                type="email"
                dir="ltr"
                maxLength={254}
                value={values.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                onBlur={() => handleBlur("contactEmail")}
                className={
                  inputClass(!!touched.contactEmail && !!errors.contactEmail) +
                  (isArabic ? " text-right" : " text-left")
                }
              />
            </FormField>

            <FormField
              label={copy.phoneLabel}
              error={touched.contactPhone ? errors.contactPhone : ""}
            >
              <input
                type="tel"
                dir="ltr"
                maxLength={20}
                placeholder="05XXXXXXXX"
                value={values.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                onBlur={() => handleBlur("contactPhone")}
                className={
                  inputClass(!!touched.contactPhone && !!errors.contactPhone) +
                  (isArabic ? " text-right" : " text-left")
                }
              />
            </FormField>
          </div>

          <FormField label={copy.tierLabel} error={touched.tier ? errors.tier : ""}>
            <select
              value={values.tier}
              onChange={(e) => handleChange("tier", e.target.value as Tier)}
              onBlur={() => handleBlur("tier")}
              className={inputClass(!!touched.tier && !!errors.tier)}
            >
              <option value="">{copy.tierPlaceholder}</option>
              {tiers.map((t) => (
                <option key={t.value} value={t.value}>
                  {isArabic ? t.labelAr : t.labelEn}
                </option>
              ))}
            </select>
          </FormField>

          <div>
            <label className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <input
                type="checkbox"
                checked={values.consent}
                onChange={(e) => handleChange("consent", e.target.checked)}
                onBlur={() => handleBlur("consent")}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800"
              />
              <span>{copy.consentLabel}</span>
            </label>
            {touched.consent && errors.consent && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.consent}</p>
            )}
          </div>

          {status === "failure" && serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {serverError}
            </p>
          )}

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
        </form>
        </RevealOnScroll>
      </div>
    </section>
    </>
    )}
    {sections.extras.map((s) => (
      <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
    ))}
    </>
  );
}
