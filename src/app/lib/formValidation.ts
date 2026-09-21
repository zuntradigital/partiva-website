export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The one phone-number rule for every public form: exactly 10 digits, digits
// only, no other formatting/country/prefix requirements. Used by both the
// Contact form and the Register-your-company form so the requirement is
// identical everywhere, front end and back end (the backend mirrors it in
// utils/phone.ts, used by contact-messages.routes.ts and
// company-requests.routes.ts).
export const PHONE_PATTERN = /^\d{10}$/;

// The one user-facing error for that rule, in both languages, so the two forms
// can never disagree on wording.
export function phoneErrorMessage(isArabic: boolean) {
  return isArabic ? "رقم الجوال يجب أن يتكون من 10 أرقام بالضبط" : "The phone number must be exactly 10 digits";
}

export function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white outline-none transition-colors focus:ring-2 dark:bg-neutral-900 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:ring-red-500/20"
      : "border-neutral-200 focus:border-blue-400 focus:ring-blue-100 dark:border-neutral-700 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
  }`;
}
