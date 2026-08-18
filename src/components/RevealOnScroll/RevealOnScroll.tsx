"use client";

import { useState, type ReactNode } from "react";
import { LazyMotion } from "motion/react";
import * as m from "motion/react-m";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
};

export default function RevealOnScroll({ children, className = "" }: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);

  const loadFeatures = () => import("./motion-features").then((module) => module.default);

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        className={`scroll-reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -6%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onViewportEnter={() => setIsVisible(true)}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
