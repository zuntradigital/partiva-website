"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LazyMotion } from "motion/react";
import * as m from "motion/react-m";

type Variant = "up" | "down" | "left" | "right" | "scale" | "fade";

const VARIANTS: Record<Variant, { x?: number; y?: number; scale?: number }> = {
  up: { y: 32 },
  down: { y: -28 },
  left: { x: 36 },
  right: { x: -36 },
  scale: { scale: 0.94 },
  fade: {},
};

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  // All default to the values every existing caller already relies on, so
  // these are opt-in only -- passing nothing keeps current behavior exactly.
  amount?: number;
  margin?: string;
  delay?: number;
  // Varies the entrance direction/effect so different sections don't all
  // move identically. "up" (the original, only) behavior stays the default.
  variant?: Variant;
};

export default function RevealOnScroll({
  children,
  className = "",
  amount = 0.12,
  margin = "0px 0px -6%",
  delay = 0,
  variant = "up",
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  // The site-wide `prefers-reduced-motion` CSS rule only forces CSS
  // transition/animation durations to 1ms -- it can't reach this component's
  // JS-driven Motion `transition`, so that has to be checked here too.
  // Starts false (matches SSR) and updates post-mount to avoid a hydration
  // mismatch.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const handleChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const loadFeatures = () => import("./motion-features").then((module) => module.default);
  const offset = reduceMotion ? {} : VARIANTS[variant];
  // A "left"/"right" entrance starts the element translated off its normal
  // position. When that element is (or sits inside) a full-viewport-width
  // section, the translated box extends past the viewport edge and the
  // *page* gains horizontal scroll -- transform doesn't resize the box, so
  // overflow-hidden on the box itself can't stop that. It has to sit on a
  // non-transformed ancestor instead, scoped to only these two variants so
  // every other (unaffected) caller renders exactly as before.
  const clipsHorizontally = variant === "left" || variant === "right";

  const revealed = (
    <m.div
      className={`scroll-reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      initial={{ opacity: reduceMotion ? 1 : 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount, margin }}
      transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : delay }}
      onViewportEnter={() => setIsVisible(true)}
    >
      {children}
    </m.div>
  );

  return (
    <LazyMotion features={loadFeatures} strict>
      {clipsHorizontally ? <div className="overflow-x-hidden">{revealed}</div> : revealed}
    </LazyMotion>
  );
}
