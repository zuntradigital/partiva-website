"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { LazyMotion, useMotionValue, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import { usePrefersReducedMotion } from "@/src/app/lib/usePrefersReducedMotion";

// Desktop-only subtle mouse-parallax on the hero product shot (SRS §8-9):
// small spring-smoothed transform-only translate, capped at a few pixels.
// Wraps the existing `.motion-float` card as a separate outer element so
// this translate and the card's own perpetual CSS float animation each own
// their own element's `transform` instead of fighting over one.
const PARALLAX_RANGE_PX = 10;

function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.4 });

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const active = finePointer && !reduceMotion;

  function handlePointerMove(event: React.PointerEvent) {
    if (!active) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * PARALLAX_RANGE_PX * 2);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * PARALLAX_RANGE_PX * 2);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  const loadFeatures = () => import("@/src/components/RevealOnScroll/motion-features").then((mod) => mod.default);

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        ref={ref}
        style={active ? { x: springX, y: springY } : undefined}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

const trustBadgesAr = [
  "تجربة مجانية 14 يوم",
  "لا تحتاج بطاقة ائتمانية",
  "إلغاء في أي وقت",
];

const trustBadgesEn = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
];

// English-only accent-color treatment: whichever of these phrases appear in
// the (default or Dashboard-overridden) title get a blue/purple highlight,
// matching the site's blue accent plus the existing purple accent already
// used on the About page. Text content itself is untouched -- phrases that
// aren't present are simply skipped, so an unrelated override title still
// renders safely as plain white text.
const HERO_TITLE_HIGHLIGHTS: { phrase: string; className: string }[] = [
  { phrase: "confidence", className: "text-blue-400" },
  {
    phrase: "smarter",
    className: "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",
  },
  {
    phrase: "business environment",
    className: "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",
  },
];

function renderHighlightedTitle(title: string) {
  const matches = HERO_TITLE_HIGHLIGHTS.map(({ phrase, className }) => {
    const start = title.indexOf(phrase);
    return start === -1 ? null : { start, end: start + phrase.length, className };
  })
    .filter((m): m is { start: number; end: number; className: string } => m !== null)
    .sort((a, b) => a.start - b.start);

  if (matches.length === 0) return title;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.start < cursor) return;
    if (m.start > cursor) nodes.push(title.slice(cursor, m.start));
    nodes.push(
      <span key={i} className={m.className}>
        {title.slice(m.start, m.end)}
      </span>,
    );
    cursor = m.end;
  });
  if (cursor < title.length) nodes.push(title.slice(cursor));
  return nodes;
}

// The override props let the Dashboard's Pages -> Sections editor replace
// this section's heading/body per-locale (mirrors CTASection), without
// touching its design/layout or the CTA buttons below it.
export default function HeroSection({
  image,
  override,
}: {
  image?: { src: string; altAr: string; altEn: string } | null;
  override?: {
    titleAr?: string | null; titleEn?: string | null; bodyAr?: string | null; bodyEn?: string | null;
    badgeAr?: string | null; badgeEn?: string | null;
    ctaLabelAr?: string | null; ctaLabelEn?: string | null; ctaHref?: string | null;
    cta2LabelAr?: string | null; cta2LabelEn?: string | null; cta2Href?: string | null;
  };
}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const trustBadges = isArabic ? trustBadgesAr : trustBadgesEn;

  const copy = isArabic
    ? {
        // Reuses the platform's established footer tagline as the eyebrow --
        // not new copy, just the same line already used site-wide.
        eyebrow: override?.badgeAr || "منصة متكاملة لإدارة أعمال قطع الغيار",
        title: override?.titleAr || "منصة متكاملة لإدارة أعمال قطع الغيار",
        description:
          override?.bodyAr ||
          "Partiva تساعدك على إدارة عملائك، مخزونك، مشترياتك، مبيعاتك وتقاريرك بسهولة من منصة واحدة متكاملة وآمنة.",
        ctaPrimary: override?.ctaLabelAr || "ابدأ تجربتك المجانية",
        ctaSecondary: override?.cta2LabelAr || "استعرض المميزات",
        imageAlt: "واجهة منصة Partiva لإدارة الأعمال",
      }
    : {
        eyebrow: override?.badgeEn || "A complete platform for managing auto-parts businesses",
        title: override?.titleEn || "One complete platform for managing auto-parts businesses",
        description:
          override?.bodyEn ||
          "Partiva helps you manage customers, inventory, purchasing, sales, and reports from one secure, integrated platform.",
        ctaPrimary: override?.ctaLabelEn || "Start your free trial",
        ctaSecondary: override?.cta2LabelEn || "Explore features",
        imageAlt: "Partiva business management platform interface",
      };
  const ctaHref = override?.ctaHref || "/register";
  const cta2Href = override?.cta2Href || "/features";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#0a1229]"
      lang={locale}
      data-language-managed
    >
      {/* ambient glow */}
      <div className="motion-glow pointer-events-none absolute left-1/3 top-0 h-150 w-150 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="motion-glow pointer-events-none absolute -left-20 bottom-0 h-100 w-100 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-28">
        {/* Text column */}
        <div className={isArabic ? "text-center lg:text-right" : "text-center lg:text-left"}>
          <div className="motion-text inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-300 ring-1 ring-white/10">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
            {copy.eyebrow}
          </div>

          <h1
            className={
              isArabic
                ? "motion-text motion-delay-1 mt-5 text-4xl font-bold leading-[1.15] text-white sm:text-5xl lg:text-6xl"
                : "motion-text motion-delay-1 mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            }
          >
            {isArabic ? copy.title : renderHighlightedTitle(copy.title)}
          </h1>

          <p
            className={
              isArabic
                ? "motion-text motion-delay-2 mx-auto mt-6 max-w-lg text-base leading-relaxed text-gray-400 lg:mx-0"
                : "motion-text motion-delay-2 mx-auto mt-5 max-w-lg text-base leading-7 text-gray-400 sm:text-lg sm:leading-8 lg:mx-0"
            }
          >
            {copy.description}
          </p>

          <div className="motion-text motion-delay-3 mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={ctaHref}
              className="group flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              {copy.ctaPrimary}
            </Link>

            <Link
              href={cta2Href}
              className="rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-white/5"
            >
              {copy.ctaSecondary}
            </Link>
          </div>

          <div className="motion-text motion-delay-4 mx-auto mt-9 flex max-w-md flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-xs text-gray-500 lg:mx-0 lg:justify-start">
            {trustBadges.map((badge) => (
              <div key={badge} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image column */}
        <div className="motion-enter motion-delay-2 relative mx-auto w-full max-w-xl lg:max-w-none">
          {/* grounding glow beneath the product shot */}
          <div className="pointer-events-none absolute inset-x-10 bottom-0 h-20 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true" />

          <HeroParallax>
            <div className="motion-float relative rounded-3xl bg-white/[0.03] p-3 ring-1 ring-white/10 shadow-2xl shadow-black/40 sm:p-4">
              <img
                src={image?.src ?? "/images/home.jpeg"}
                alt={(isArabic ? image?.altAr : image?.altEn) || copy.imageAlt}
                width={900}
                height={650}
                className="h-auto w-full rounded-2xl object-contain"
              />

              {/* floating accent -- a single deliberate detail, given its own
                  one-time entrance (not decoration for its own sake) */}
              <div className="motion-enter motion-delay-4 absolute -top-4 -end-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 ring-4 ring-[#0a1229]">
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
            </div>
          </HeroParallax>
        </div>
      </div>
    </section>
  );
}
