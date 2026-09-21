// Server-only: resolves the reCAPTCHA v2 SITE key at REQUEST time.
//
// Why not just NEXT_PUBLIC_RECAPTCHA_SITE_KEY: Next.js inlines every
// NEXT_PUBLIC_* value into the JavaScript bundle at BUILD time, so a key
// added to the host's environment after (or without) a rebuild never reaches
// the browser -- the deployed bundle kept Google's public TEST key from a
// local .env file, which is what produced the "This reCAPTCHA is for testing
// purposes only" banner and tokens the backend's real secret rejects.
//
// RECAPTCHA_SITE_KEY is a plain runtime variable (never inlined), so the host
// can set/rotate it and just restart the app. NEXT_PUBLIC_RECAPTCHA_SITE_KEY
// stays as the fallback so local development keeps working unchanged.
export function getRecaptchaSiteKey(): string {
  const runtime = process.env["RECAPTCHA_SITE_KEY"];
  return (runtime && runtime.trim()) || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
}
