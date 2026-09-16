export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Decision Required: exact phone validation is regionally variable given planned
// Gulf expansion (Master §39). Placeholder covers KSA mobile numbers only.
export const PHONE_PATTERN = /^(?:\+966|0)?5\d{8}$/;

// Register-your-company form's contact phone: exactly 11 digits, digits only,
// no country/format assumptions (deliberately not PHONE_PATTERN above).
export const COMPANY_PHONE_PATTERN = /^\d{11}$/;

export function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white outline-none transition-colors focus:ring-2 dark:bg-neutral-900 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:ring-red-500/20"
      : "border-neutral-200 focus:border-blue-400 focus:ring-blue-100 dark:border-neutral-700 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
  }`;
}
