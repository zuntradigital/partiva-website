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
import { fetchFaqItems } from "@/src/app/lib/faqApi";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import { fetchPages, resolveMainAndExtras } from "@/src/app/lib/pagesApi";

const TITLE = "Partiva FAQ | Network, privacy, and review process";
const DESCRIPTION =
  "Answers to common questions about Partiva's optional business network, data isolation between businesses, and the registration review process.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default async function FaqPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("partiva-locale")?.value;
  const locale = savedLocale === "en" ? "en" : "ar";

  const items = await fetchFaqItems();
  const pages = await fetchPages();
  const { mainVisible, main, extras } = resolveMainAndExtras(pages, "faq");

  // FAQPage structured data — generated from the same resolver that
  // FaqContent renders from, so schema and visible content can never
  // drift apart for the initial (crawlable) render. Skipped entirely when
  // the section itself is hidden, for the same reason -- schema must match
  // what's actually visible.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: resolveFaqItems(items, locale).map((item) => ({
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
      {mainVisible && (
        <>
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            // `<` is escaped so answer text can never prematurely close this tag.
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
          <FaqContent items={items} override={main ? { titleAr: main.titleAr, titleEn: main.titleEn, bodyAr: main.bodyAr, bodyEn: main.bodyEn } : null} />
        </>
      )}
      {extras.map((s) => (
        <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
      ))}
    </>
  );
}
