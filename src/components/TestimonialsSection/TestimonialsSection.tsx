"use client";

import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

type Testimonial = {
  quoteAr: string;
  quoteEn: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  initials: string;
  avatarColor: string;
};

const testimonials: Testimonial[] = [
  {
    quoteAr:
      "منصة ممتازة وسهلة الاستخدام، ساعدتنا على تنظيم مخزوننا وزيادة مبيعاتنا بشكل ملحوظ.",
    quoteEn:
      "An excellent, easy-to-use platform that helped us organize inventory and increase sales significantly.",
    nameAr: "أحمد القحطاني",
    nameEn: "Ahmed Al-Qahtani",
    roleAr: "متجر قطع الغيار الذكي",
    roleEn: "Smart Spare Parts Store",
    initials: "أق",
    avatarColor: "bg-blue-100 text-blue-700",
  },
  {
    quoteAr:
      "التقارير دقيقة والدعم الفني سريع. أنصح بها لكل صاحب عمل في مجال قطع الغيار.",
    quoteEn:
      "The reports are accurate and support is fast. I recommend it to every auto-parts business owner.",
    nameAr: "سلمان العتيبي",
    nameEn: "Salman Al-Otaibi",
    roleAr: "شركة مسار القطع",
    roleEn: "Masar Parts Company",
    initials: "سع",
    avatarColor: "bg-amber-100 text-amber-700",
  },
  {
    quoteAr:
      "أفضل نظام استخدمناه لإدارة أعمالنا، وفر علينا الكثير من الوقت والجهد.",
    quoteEn:
      "The best system we have used to manage our business; it saved us considerable time and effort.",
    nameAr: "محمد الشهري",
    nameEn: "Mohammed Al-Shahri",
    roleAr: "ورشة النخبة",
    roleEn: "Elite Workshop",
    initials: "مش",
    avatarColor: "bg-emerald-100 text-emerald-700",
  },
];

export default function TestimonialsSection() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, []);

  const copy = isArabic
    ? {
        badge: "آراء عملائنا",
        title: "ماذا يقول عملاؤنا عن Partiva",
        prev: "التقييم السابق",
        next: "التقييم التالي",
        goTo: (n: number) => `الانتقال للتقييم ${n}`,
        faq: "الأسئلة الشائعة",
      }
    : {
        badge: "Customer testimonials",
        title: "What our customers say about Partiva",
        prev: "Previous testimonial",
        next: "Next testimonial",
        goTo: (n: number) => `Go to testimonial ${n}`,
        faq: "Frequently asked questions",
      };

  const testimonial = testimonials[currentIndex];

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-gray-50 py-16 dark:bg-slate-900"
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

          <div className="mx-auto mt-4 h-1 w-10 rounded-full bg-blue-600" />
        </div>

        {/* Carousel */}
        <div className="relative mx-auto max-w-2xl">
          {/* Card */}
          <div className="px-6 sm:px-9">
            <div
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
                {isArabic ? testimonial.quoteAr : testimonial.quoteEn}
              </p>

              {/* Bottom */}
              <div className="mt-6 flex items-center justify-between gap-4">
                {/* User */}
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-full text-xs font-bold
                      ${testimonial.avatarColor}
                    `}
                  >
                    {testimonial.initials}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                      {isArabic
                        ? testimonial.nameAr
                        : testimonial.nameEn}
                    </div>

                    <div className="mt-0.5 text-[11px] text-gray-400 dark:text-slate-400">
                      {isArabic
                        ? testimonial.roleAr
                        : testimonial.roleEn}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
            </div>
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