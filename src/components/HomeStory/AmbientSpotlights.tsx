"use client";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/src/app/lib/usePrefersReducedMotion";

// Two soft glows fixed to the viewport (so they sit on the page's own
// background behind every section, not clipped inside any one card) that
// travel down as the whole page scrolls -- 0% scrolled keeps them near the
// top of the screen, 100% scrolled (bottom of the page) eases them toward
// the bottom, so they drift past each section in turn instead of being
// pinned to one. Each also keeps a small independent drift of its own (see
// .motion-glow/.motion-swirl in globals.css) so the page never feels static
// even while the scroll position itself is still. Visible in both themes,
// just dimmer in light mode so it reads as ambient tint, not a smudge.
export default function AmbientSpotlights() {
  const spot1Ref = useRef<HTMLDivElement>(null);
  const spot2Ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const vh = window.innerHeight;
      if (spot1Ref.current) spot1Ref.current.style.transform = `translateY(${vh * (0.05 + progress * 0.8)}px)`;
      if (spot2Ref.current) spot2Ref.current.style.transform = `translateY(${vh * (0.85 - progress * 0.75)}px)`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div ref={spot1Ref} className="absolute start-0">
        <div className="motion-glow h-80 w-80 -translate-x-1/3 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20" />
      </div>
      <div ref={spot2Ref} className="absolute end-0">
        <div className="motion-swirl h-72 w-72 translate-x-1/3 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15" />
      </div>
    </div>
  );
}
