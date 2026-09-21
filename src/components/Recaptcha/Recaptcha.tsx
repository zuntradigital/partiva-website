"use client";

// Shared "Are you a robot?" verification widget (Google reCAPTCHA v2
// checkbox) used by every public Website form that submits information to
// the backend (Contact, Register). A real, server-verified control, not a
// visual-only checkbox -- see contact-messages.routes.ts /
// company-requests.routes.ts for the corresponding backend verification via
// Google's siteverify API, which is what actually decides whether a
// submission is accepted.
import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useTheme } from "@/src/components/ThemeProvider/ThemeProvider";
import { useRecaptchaSiteKey } from "./RecaptchaConfig";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          hl?: string;
          theme?: "light" | "dark";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
    };
    __onRecaptchaApiLoad?: () => void;
  }
}

// Build-time fallback only (local development). Production reads the key at
// request time from the root layout -- see app/lib/recaptchaKey.ts.
const BUILD_TIME_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

// Google's PUBLIC test site key: renders "This reCAPTCHA is for testing
// purposes only" and only pairs with Google's test secret, which accepts every
// token. It must never be what a real visitor sees, so on any non-local host
// it is treated as "not configured" instead of being rendered.
const GOOGLE_TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

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

type WidgetProps = {
  locale: string;
  onVerify: (token: string) => void;
  onExpire: () => void;
};

// The visible frame around Google's fixed-size (304x78) checkbox iframe: same
// border/background language as the form inputs, dark-mode aware, and scaled
// down on very narrow screens instead of overflowing the card.
const WIDGET_WIDTH = 304;
const WIDGET_HEIGHT = 78;

function VerificationFrame({ locale, children }: { locale: string; children: React.ReactNode }) {
  const isArabic = locale === "ar";
  // Google's iframe is a fixed 304px; on a narrow card it would be clipped (the
  // checkbox itself could be cut off), so scale it to whatever width is available.
  const slotRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / WIDGET_WIDTH));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-900/60">
      <div className="mb-2.5 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        <span>{isArabic ? "حماية من الرسائل الآلية — تحقق سريع بنقرة واحدة" : "Spam protection — one quick click to verify"}</span>
      </div>
      <div ref={slotRef} dir="ltr" className="w-full overflow-hidden" style={{ height: WIDGET_HEIGHT * scale }}>
        <div style={{ width: WIDGET_WIDTH, height: WIDGET_HEIGHT, transform: `scale(${scale})`, transformOrigin: "left top" }}>{children}</div>
      </div>
    </div>
  );
}

function Notice({ locale }: { locale: string }) {
  return (
    <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
      {locale === "ar"
        ? "خدمة التحقق (reCAPTCHA) غير متاحة حاليًا، يرجى المحاولة لاحقًا أو التواصل معنا عبر واتساب."
        : "The verification service (reCAPTCHA) is temporarily unavailable. Please try again later or contact us on WhatsApp."}
    </p>
  );
}

function Widget({ locale, onVerify, onExpire, siteKey, theme }: WidgetProps & { siteKey: string; theme: "light" | "dark" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadRecaptchaApi().then(() => {
      if (cancelled || !containerRef.current || renderedRef.current || !window.grecaptcha) return;
      renderedRef.current = true;
      window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        hl: locale,
        theme,
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

  return (
    <VerificationFrame locale={locale}>
      <div ref={containerRef} className="g-recaptcha" />
    </VerificationFrame>
  );
}

export default function Recaptcha(props: WidgetProps) {
  const { theme } = useTheme();
  const providedKey = useRecaptchaSiteKey();
  const siteKey = (providedKey ?? BUILD_TIME_SITE_KEY).trim();

  // Decided after mount (needs window.location) so server and first client
  // render agree.
  // Nothing is rendered until then, so the test widget can never flash on a live site.
  const [keyCheck, setKeyCheck] = useState<"pending" | "ok" | "blocked">("pending");
  useEffect(() => {
    if (siteKey === GOOGLE_TEST_SITE_KEY && process.env.NODE_ENV === "production" && !LOCAL_HOSTS.has(window.location.hostname)) {
      // eslint-disable-next-line no-console
      console.error("reCAPTCHA is configured with Google's public TEST site key on a non-local host. Set RECAPTCHA_SITE_KEY to the real production site key (and RECAPTCHA_SECRET_KEY on the backend).");
      setKeyCheck("blocked");
    } else {
      setKeyCheck("ok");
    }
  }, [siteKey]);

  // The widget (and any token in the parent) is reset when the site theme
  // changes, because reCAPTCHA cannot restyle an already-rendered widget.
  const firstThemeRun = useRef(true);
  // Parents pass a fresh inline callback every render; keep the latest in a ref so
  // ONLY a real theme change (never a re-render) can trigger the reset.
  const onExpireRef = useRef(props.onExpire);
  onExpireRef.current = props.onExpire;
  useEffect(() => {
    if (firstThemeRun.current) {
      firstThemeRun.current = false;
      return;
    }
    onExpireRef.current();
  }, [theme]);

  if (!siteKey) {
    // Missing configuration is a deployment error, not a normal runtime
    // state -- fail loudly in the console rather than silently letting the
    // form appear submittable with no real verification in front of it.
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("RECAPTCHA_SITE_KEY / NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured -- the verification widget cannot render.");
    }
    // Still not bypassed: the form stays unsubmittable (no token). But tell the
    // visitor why instead of leaving a silently dead Submit button.
    return <Notice locale={props.locale} />;
  }
  if (keyCheck === "pending") return null;
  if (keyCheck === "blocked") return <Notice locale={props.locale} />;

  return <Widget key={theme} {...props} siteKey={siteKey} theme={theme} />;
}
