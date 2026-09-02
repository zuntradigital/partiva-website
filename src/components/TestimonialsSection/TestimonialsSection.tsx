"use client";

import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import { usePrefersReducedMotion } from "@/src/app/lib/usePrefersReducedMotion";
import type { BackendTestimonial } from "@/src/app/lib/testimonialsApi";

// Same code-split feature bundle RevealOnScroll/FaqAccordion already load --
// reusing the module path means webpack dedupes it into one shared chunk.
const loadFeatures = () =>
  import("@/src/components/RevealOnScroll/motion-features").then((mod) => mod.default);

const AVATAR_COLORS = ["bg-blue-100 text-blue-700", "bg-amber-100 text-amber-700", "bg-emerald-100 text-emerald-700"];

function initialsOf(name: string) {
  return name.trim().slice(0, 2);
}

export default function TestimonialsSection({
  initialTestimonials,
  titleAr,
  titleEn,
  bodyAr,
  bodyEn,
}: {
  initialTestimonials: BackendTestimonial[];
  titleAr?: string | null;
  titleEn?: string | null;
  bodyAr?: string | null;
  bodyEn?: string | null;
}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const testimonials = initialTestimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduceMotion = usePrefersReducedMotion();
  // Slide direction flips for RTL so "next" always visually feels forward.
  const slideOffset = isArabic ? -18 : 18;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const copy = isArabic
    ? {
        badge: "آراء عملائنا",
        title: titleAr || "ماذا يقول عملاؤنا عن Partiva",
        body: bodyAr,
        prev: "التقييم السابق",
        next: "التقييم التالي",
        goTo: (n: number) => `الانتقال للتقييم ${n}`,
        faq: "الأسئلة الشائعة",
      }
    : {
        badge: "Customer testimonials",
        title: titleEn || "What our customers say about Partiva",
        body: bodyEn,
        prev: "Previous testimonial",
        next: "Next testimonial",
        goTo: (n: number) => `Go to testimonial ${n}`,
        faq: "Frequently asked questions",
      };

  const testimonial = testimonials[currentIndex];
  if (!testimonial) return null;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="py-16"
      lang={locale}
      data-language-managed
    >
      <div className="mx-auto max-w-4xl px-5">
        {/* Header */}
        <div className="motion-text mb-10 text-center">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {copy.badge}
          </span>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            {copy.title}
          </h2>

          {copy.body && <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500 dark:text-slate-400">{copy.body}</p>}

          <div className="mx-auto mt-4 h-1 w-10 rounded-full bg-blue-600" />
        </div>

        {/* Carousel */}
        <div className="relative mx-auto max-w-2xl">
          {/* Card -- fade+slide crossfade between testimonials (SRS §38) */}
          <div className="px-6 sm:px-9">
            <LazyMotion features={loadFeatures} strict>
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={currentIndex}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: slideOffset }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -slideOffset }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="
                    min-h-56
                    rounded-2xl
                    bg-white
                    p-6
                    shadow-sm
                    ring-1 ring-gray-100
                    dark:bg-slate-800
                    dark:ring-slate-700
                    sm:p-7
                  "
                >
                  {/* Quote icon */}
                  <Quote className="mb-4 h-6 w-6 fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" />

                  {/* Quote */}
                  <p className="min-h-16 text-sm leading-7 text-gray-600 dark:text-slate-300">
                    {isArabic ? testimonial.quoteAr : testimonial.quoteEn || testimonial.quoteAr}
                  </p>

                  {/* Bottom */}
                  <div className="mt-6 flex items-center justify-between gap-4">
                    {/* User */}
                    <div className="flex items-center gap-3">
                      {testimonial.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded avatar, may be a data URL
                        <img
                          src={testimonial.imageSrc}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_COLORS[currentIndex % AVATAR_COLORS.length]}`}
                        >
                          {initialsOf(isArabic ? testimonial.nameAr : testimonial.nameEn || testimonial.nameAr)}
                        </div>
                      )}

                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">
                          {isArabic
                            ? testimonial.nameAr
                            : testimonial.nameEn || testimonial.nameAr}
                        </div>

                        <div className="mt-0.5 text-[11px] text-gray-400 dark:text-slate-400">
                          {isArabic
                            ? testimonial.roleAr
                            : testimonial.roleEn || testimonial.roleAr}
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </m.div>
              </AnimatePresence>
            </LazyMotion>
          </div>

          {/* Previous */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label={copy.prev}
            className="
              absolute inset-s-0 top-1/2 z-10
              flex h-8 w-8 -translate-y-1/2
              items-center justify-center
              rounded-full bg-white
              text-gray-600 shadow-sm
              ring-1 ring-gray-200
              transition
              hover:bg-blue-600 hover:text-white
              dark:bg-slate-800
              dark:text-slate-200
              dark:ring-slate-700
            "
          >
            {isArabic ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label={copy.next}
            className="
              absolute inset-e-0 top-1/2 z-10
              flex h-8 w-8 -translate-y-1/2
              items-center justify-center
              rounded-full bg-white
              text-gray-600 shadow-sm
              ring-1 ring-gray-200
              transition
              hover:bg-blue-600 hover:text-white
              dark:bg-slate-800
              dark:text-slate-200
              dark:ring-slate-700
            "
          >
            {isArabic ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-1.5">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={copy.goTo(index + 1)}
              className={`rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "h-1.5 w-5 bg-blue-600"
                  : "h-1.5 w-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* FAQ Button */}
        <div className="mt-7 flex justify-center">
          <Link
            href="/faq"
            className="
              rounded-lg bg-blue-600
              px-6 py-2.5
              text-xs font-semibold text-white
              transition hover:bg-blue-700
            "
          >
            {copy.faq}
          </Link>
        </div>
      </div>
    </section>
  );
}