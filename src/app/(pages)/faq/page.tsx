// app/faq/page.tsx
// PAGE-FAQ — "FAQ" (Recommended) (SRS Section 6)
// Priority: P1 | Auth: None | SEO: Indexable + FAQPage schema (Section 11.3)
// Purpose: answer objections — network opt-in, data isolation, review
// process — for ALL audiences. Primary CTA: Register.
//
// Section 11.3 hard rule: FAQPage schema MUST match visible accordion
// content exactly — no hidden/answer-only schema content. `resolveFaqItems`
// (FaqContent.tsx) is the single source of truth for both the rendered
// accordion and the injected JSON-LD, resolved here using the same
// cookie-based initial locale the rest of the app uses for first paint.

import type { Metadata } from "next";
import { cookies } from "next/headers";
import FaqContent from "./FaqContent";
import { resolveFaqItems } from "./faqData";

export const metadata: Metadata = {
  title: "Partiva FAQ | Network, privacy, and review process", // CONTENT REQUIRED
  description:
    "CONTENT REQUIRED — meta description covering network opt-in, data isolation, and the registration review process.",
  alternates: {
    canonical: "/faq",
    languages: {
      ar: "/ar/faq",
      en: "/en/faq",
    },
  },
};

export default async function FaqPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("partiva-locale")?.value;
  const locale = savedLocale === "en" ? "en" : "ar";

  // FAQPage structured data — generated from the same resolver that
  // FaqContent renders from, so schema and visible content can never
  // drift apart for the initial (crawlable) render.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: resolveFaqItems(locale).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqContent />
    </>
  );
}
