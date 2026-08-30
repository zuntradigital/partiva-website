"use client";

import { useEffect, useState } from "react";

// Shared by every JS-driven Motion animation added for the motion design
// system (RevealOnScroll already does this check inline; this is the same
// logic factored out so parallax/scroll-rail/active-step/counter/testimonial
// pieces don't each re-implement it). The site-wide CSS
// `prefers-reduced-motion` rule in globals.css only forces CSS
// transition/animation durations to 1ms -- it can't reach a Motion
// `transition`/`animate` prop, so that has to be checked in JS too.
// Starts `false` to match SSR and updates post-mount to avoid a hydration
// mismatch.
export function usePrefersReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const handleChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduceMotion;
}
