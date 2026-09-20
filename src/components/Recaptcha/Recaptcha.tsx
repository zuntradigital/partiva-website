"use client";

// Shared "Are you a robot?" verification widget (Google reCAPTCHA v2
// checkbox) used by every public Website form that submits information to
// the backend (Contact, Register). A real, server-verified control, not a
// visual-only checkbox -- see contact-messages.routes.ts /
// company-requests.routes.ts for the corresponding backend verification via
// Google's siteverify API, which is what actually decides whether a
// submission is accepted.
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          hl?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
    };
    __onRecaptchaApiLoad?: () => void;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

// Loaded once per page, shared by every widget instance -- concurrent
// mounts (unlikely, but cheap to guard) all await the same promise instead
// of injecting the script tag more than once.
let scriptLoadPromise: Promise<void> | null = null;
function loadRecaptchaApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha?.render) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve) => {
    window.__onRecaptchaApiLoad = () => resolve();
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?onload=__onRecaptchaApiLoad&render=explicit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

export default function Recaptcha({
  locale,
  onVerify,
  onExpire,
}: {
  /** "ar" | "en" -- pass a new `key` from the parent when this changes so the widget remounts in the new language (reCAPTCHA cannot change language on an already-rendered widget). */
  locale: string;
  onVerify: (token: string) => void;
  onExpire: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadRecaptchaApi().then(() => {
      if (cancelled || !containerRef.current || renderedRef.current || !window.grecaptcha) return;
      renderedRef.current = true;
      window.grecaptcha.render(containerRef.current, {
        sitekey: SITE_KEY,
        hl: locale,
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": onExpire,
      });
    });
    return () => {
      cancelled = true;
    };
    // Rendered exactly once per mount -- the parent remounts this component
    // (via `key`) rather than us reacting to prop changes, since reCAPTCHA
    // widgets are not designed to be reconfigured in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!SITE_KEY) {
    // Missing configuration is a deployment error, not a normal runtime
    // state -- fail loudly in the console rather than silently letting the
    // form appear submittable with no real verification in front of it.
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured -- the verification widget cannot render.");
    }
    return null;
  }

  return <div ref={containerRef} className="g-recaptcha" />;
}
