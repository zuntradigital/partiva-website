export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Decision Required: exact phone validation is regionally variable given planned
// Gulf expansion (Master §39). Placeholder covers KSA mobile numbers only.
export const PHONE_PATTERN = /^(?:\+966|0)?5\d{8}$/;

export function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition-colors focus:ring-2 dark:bg-slate-900 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:ring-red-500/20"
      : "border-gray-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
  }`;
}
