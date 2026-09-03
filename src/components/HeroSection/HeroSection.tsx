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
  "بدون اشتراك شهري",
  "التسجيل مجاني بالكامل",
  "ادفع فقط عند البيع",
];

const trustBadgesEn = [
  "No monthly subscription",
  "Free registration",
  "Pay only when you sell",
];

// Accent-color treatment: whichever of these phrases appear in the (default
// or Dashboard-overridden) title get a blue/purple highlight, matching the
// site's blue accent plus the existing purple accent already used on the
// About page. Text content itself is untouched -- phrases that aren't
// present are simply skipped, so an unrelated override title still renders
// safely as plain white text. Separate EN/AR lists since the two default
// titles are independently-written copy, not translations of each other.
const HERO_TITLE_HIGHLIGHTS_EN: { phrase: string; className: string }[] = [
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

const HERO_TITLE_HIGHLIGHTS_AR: { phrase: string; className: string }[] = [
  {
    phrase: "متكاملة",
    className: "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",
  },
  {
    phrase: "وتنظيمًا",
    className: "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",
  },
];

// Two of the previously-tried floating widget screenshots, reused as extra
// slides for the main product shot below instead of being deleted outright.
const HERO_SLIDER_EXTRA_IMAGES = ["/images/hero/hero-box-1.jpeg", "/images/hero/hero-box-5.jpeg"];
const HERO_SLIDER_INTERVAL_MS = 4500;

function renderHighlightedTitle(title: string, highlights: { phrase: string; className: string }[]) {
  const matches = highlights.map(({ phrase, className }) => {
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
        ctaPrimary: override?.ctaLabelAr || "انضم إلى Partiva مجانًا",
        ctaSecondary: override?.cta2LabelAr || "استعرض المميزات",
        imageAlt: "واجهة منصة Partiva لإدارة الأعمال",
      }
    : {
        eyebrow: override?.badgeEn || "A complete platform for managing auto-parts businesses",
        title: override?.titleEn || "One complete platform for managing auto-parts businesses",
        description:
          override?.bodyEn ||
          "Partiva helps you manage customers, inventory, purchasing, sales, and reports from one secure, integrated platform.",
        ctaPrimary: override?.ctaLabelEn || "Join Partiva Free",
        ctaSecondary: override?.cta2LabelEn || "Explore features",
        imageAlt: "Partiva business management platform interface",
      };
  const ctaHref = override?.ctaHref || "/register";
  const cta2Href = override?.cta2Href || "/features";

  // Product shot slider: the managed/default image plus two extra slides,
  // auto-advancing and crossfading in place -- same card, same size, same
  // position, only the picture inside now rotates through three instead of
  // staying on one.
  const sliderImages = [image?.src ?? "/images/home.jpeg", ...HERO_SLIDER_EXTRA_IMAGES];
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % sliderImages.length);
    }, HERO_SLIDER_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderImages.length]);

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#0a1229]"
      lang={locale}
      data-language-managed
    >
      {/* central ambient glow -- one large source behind the headline instead
          of two corner blooms, so the composition reads as a single radiant
          focal point (matches the centered layout below) rather than a
          two-column split. */}
      <div className="motion-glow pointer-events-none absolute left-1/2 top-0 h-175 w-175 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="motion-glow pointer-events-none absolute left-1/2 top-40 h-100 w-100 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Aurora/neon swirl shapes -- the curved counterpart to the straight
          beams below: two soft, off-center ellipses that slowly rotate
          around the headline (see .motion-swirl), echoing the glossy
          curved-light look of the neon reference instead of only straight
          rays. Asymmetric border-radius keeps each blob's silhouette
          irregular rather than a perfect (visibly rotating) circle. */}
      <div
        className="motion-swirl pointer-events-none absolute left-1/2 top-16 h-120 w-160 -translate-x-1/2 bg-gradient-to-br from-blue-500/25 via-cyan-400/10 to-transparent blur-3xl"
        style={{ borderRadius: "42% 58% 60% 40% / 46% 40% 60% 54%" }}
      />
      <div
        className="motion-swirl pointer-events-none absolute left-1/2 top-24 h-100 w-140 -translate-x-1/2 bg-gradient-to-tl from-purple-500/15 via-blue-400/10 to-transparent blur-3xl"
        style={{ borderRadius: "58% 42% 40% 60% / 54% 60% 40% 46%", animationDirection: "reverse", animationDuration: "58s" }}
      />

      {/* Light-beam rays fanning down from above the badge, like a spotlight
          through the composition -- distinct from the soft glow blobs above,
          this is the directional "lines of light" look. Each beam shimmers
          on its own timing (see .motion-beam) so the section keeps a
          low-key ambient pulse instead of sitting static between scroll
          entrances. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { left: "34%", rotate: "-16deg", delay: "-0.8s" },
          { left: "43%", rotate: "-6deg", delay: "-2.6s" },
          { left: "52%", rotate: "4deg", delay: "-4.1s" },
          { left: "61%", rotate: "13deg", delay: "-1.7s" },
        ].map((beam) => (
          // Rotation lives on this (static) wrapper and shimmer on the child
          // -- both need `transform`, and the keyframe animation would
          // otherwise overwrite an inline rotate on the same element every
          // frame instead of combining with it.
          <div key={beam.left} className="absolute -top-10 h-140 w-8" style={{ left: beam.left, transform: `rotate(${beam.rotate})` }}>
            <div
              className="motion-beam h-full w-full bg-gradient-to-b from-blue-300/50 via-blue-400/10 to-transparent blur-md"
              style={{ animationDelay: beam.delay }}
            />
          </div>
        ))}
      </div>

      {/* Faint grid, clipped to a center-fading mask -- gives the glow a
          surface to sit on without competing with the text. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-12 pt-24 text-center lg:pb-16 lg:pt-32">
        <div className="motion-text inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-300 ring-1 ring-white/10">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
          {copy.eyebrow}
        </div>

        <h1
          className={
            isArabic
              ? "motion-text motion-delay-1 mt-6 max-w-3xl text-2xl font-bold leading-[1.3] text-white sm:text-3xl lg:text-4xl"
              : "motion-text motion-delay-1 mt-6 max-w-3xl text-2xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-3xl lg:text-4xl"
          }
        >
          {renderHighlightedTitle(copy.title, isArabic ? HERO_TITLE_HIGHLIGHTS_AR : HERO_TITLE_HIGHLIGHTS_EN)}
        </h1>

        <p
          className={
            isArabic
              ? "motion-text motion-delay-2 mx-auto mt-6 max-w-2xl text-base leading-normal text-gray-400"
              : "motion-text motion-delay-2 mx-auto mt-5 max-w-2xl text-base leading-6 text-gray-400 sm:text-lg sm:leading-7"
          }
        >
          {copy.description}
        </p>

        <div className="motion-text motion-delay-3 mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={ctaHref}
            className="group flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            {copy.ctaPrimary}
          </Link>

          <Link
            href={cta2Href}
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-white/5"
          >
            {copy.ctaSecondary}
          </Link>
        </div>

        <div className="motion-text motion-delay-4 mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
          {trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        {/* Product shot -- previously a side-by-side column, now a wide
            showcase panel beneath the copy so the centered composition above
            stays the single focal point and the screenshot reads as
            supporting proof, not a second competing column. */}
        <div className="motion-enter motion-delay-4 relative mx-auto mt-16 w-full max-w-2xl lg:mt-20">
          {/* Neon swirl backdrop, its bottom edge flush with the panel's top
              edge -- a real cutout (proper alpha channel, no white/black
              matte to fake-remove), so no blend-mode trick is needed here,
              just normal stacking under the panel card below (pinned behind
              everything via -z-10 as a backstop so it can never cover the
              copy/CTA/trust-badges above it even if it's tall). */}
          <img
            src="/images/hero/swirl-glow.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 -z-10 bottom-full w-[42%] max-w-none -translate-x-1/2 sm:w-[34%]"
          />
          <div className="pointer-events-none absolute inset-x-16 bottom-0 h-20 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true" />

          <HeroParallax>
            <div className="motion-float relative rounded-3xl bg-white/[0.03] p-3 ring-1 ring-white/10 shadow-2xl shadow-black/40 sm:p-4">
              <div className="relative aspect-[1400/820] w-full">
                {sliderImages.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={i === 0 ? (isArabic ? image?.altAr : image?.altEn) || copy.imageAlt : ""}
                    aria-hidden={i === 0 ? undefined : true}
                    width={1400}
                    height={820}
                    className="absolute inset-0 h-full w-full rounded-2xl object-contain transition-opacity duration-700 ease-in-out"
                    style={{ opacity: i === slideIndex ? 1 : 0 }}
                  />
                ))}
              </div>

              <div className="absolute -top-4 -end-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 ring-4 ring-[#0a1229]">
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
            </div>
          </HeroParallax>
        </div>
      </div>
    </section>
  );
}
