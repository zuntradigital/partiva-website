"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/src/app/lib/usePrefersReducedMotion";

// SRS §10-13 "Scroll Product Storytelling": a connecting thread between the
// home page's existing narrative sections (Problem -> What Is Partiva ->
// Core Value Pillars -> Solutions -> Business Network), so scrolling through
// them reads as one synced progression rather than unrelated blocks. The
// sections themselves, their copy, and their order are untouched -- each
// just carries a `data-story-marker` attribute (added where it already
// renders) that this component discovers at runtime, so it works regardless
// of how many of the five are actually visible/ordered for a given admin
// configuration.
//
// Deliberately not Motion-driven: this is a plain rAF-throttled scroll
// listener writing directly to two refs' `style.transform`/`style.opacity`
// (transform+opacity only, SRS §47), which avoids a per-frame React
// re-render entirely -- lighter than wiring up Motion's `useScroll` for
// something this small. Desktop/tablet only (SRS §50); hidden entirely
// under reduced motion since it's a purely decorative aid, not essential
// content (SRS §49/§54).
//
// Two effects, not one: the component renders nothing (and so attaches no
// refs) until `markers` is populated, so the scroll-listener effect must
// depend on `markers` and run in the commit *after* that JSX exists --
// calling it inline in the same effect that discovers the markers would
// read refs from the still-null previous render.
const DOT_GAP_PX = 28;

export default function StoryProgressRail() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<HTMLSpanElement[]>([]);
  const [markers, setMarkers] = useState<HTMLElement[]>([]);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const found = Array.from(document.querySelectorAll<HTMLElement>("[data-story-marker]")).filter((el) => el.offsetParent !== null);
    if (found.length >= 2) setMarkers(found);
  }, [reduceMotion]);

  useEffect(() => {
    if (markers.length < 2) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const first = markers[0].getBoundingClientRect();
      const last = markers[markers.length - 1].getBoundingClientRect();
      const viewportH = window.innerHeight;
      const rangeTop = first.top + window.scrollY;
      const rangeBottom = last.bottom + window.scrollY;
      const rangeHeight = Math.max(rangeBottom - rangeTop, 1);
      const scrollMid = window.scrollY + viewportH / 2;
      const progress = Math.min(Math.max((scrollMid - rangeTop) / rangeHeight, 0), 1);

      // Only visible while the tracked range is actually near the viewport,
      // so the rail doesn't linger over unrelated sections above/below it.
      const inRange = first.top < viewportH && last.bottom > 0;
      if (wrapRef.current) wrapRef.current.style.opacity = inRange ? "1" : "0";
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`;

      const activeIndex = Math.min(Math.floor(progress * markers.length), markers.length - 1);
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        dot.style.transform = i <= activeIndex ? "scale(1)" : "scale(0.55)";
        dot.style.opacity = i <= activeIndex ? "1" : "0.4";
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [markers]);

  if (reduceMotion || markers.length < 2) return null;

  const dotCount = markers.length;
  const trackHeight = (dotCount - 1) * DOT_GAP_PX;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-inline-start-5 top-1/2 z-30 hidden -translate-y-1/2 opacity-0 transition-opacity duration-300 lg:block"
    >
      <div className="relative w-1.5" style={{ height: `${trackHeight}px` }}>
        <div className="absolute inset-x-0 top-0 bottom-0 mx-auto w-px bg-black/10 dark:bg-white/10" />
        <div
          ref={fillRef}
          className="absolute top-0 mx-auto w-px origin-top bg-blue-600"
          style={{ insetInlineStart: 0, insetInlineEnd: 0, height: `${trackHeight}px`, transform: "scaleY(0)" }}
        />
        {Array.from({ length: dotCount }).map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) dotRefs.current[i] = el;
            }}
            className="absolute start-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-600 transition-transform duration-300"
            style={{ top: `${i * DOT_GAP_PX}px`, transform: "scale(0.55)", opacity: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}
