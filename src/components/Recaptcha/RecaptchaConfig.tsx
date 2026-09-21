"use client";

import { createContext, useContext, type ReactNode } from "react";

// Carries the server-resolved reCAPTCHA site key (see app/lib/recaptchaKey.ts)
// from the root layout to the shared Recaptcha widget, so the key is read at
// request time instead of being frozen into the client bundle at build time.
const RecaptchaSiteKeyContext = createContext<string | null>(null);

export function RecaptchaConfigProvider({ siteKey, children }: { siteKey: string; children: ReactNode }) {
  return <RecaptchaSiteKeyContext.Provider value={siteKey}>{children}</RecaptchaSiteKeyContext.Provider>;
}

/** null = no provider above (falls back to the build-time value inside Recaptcha). */
export function useRecaptchaSiteKey(): string | null {
  return useContext(RecaptchaSiteKeyContext);
}
