import type { Metadata } from "next";
import FeaturesSection from "../components/FeaturesSection/FeaturesSection";
import PricingSection from "../components/PricingSection/PricingSection";
import HowItWorksSection from "../components/HowItWorksSection/HowItWorksSection";
import TestimonialsSection from "../components/TestimonialsSection/TestimonialsSection";
import CTASection from "../components/CTASection/CTASection";
import HeroSection from "../components/HeroSection/HeroSection";
import TrustedBySection from "../components/TrustedBySection/TrustedBySection";
import GenericSection from "../components/GenericSection/GenericSection";
import RevealOnScroll from "../components/RevealOnScroll/RevealOnScroll";
import StoryProgressRail from "../components/HomeStory/StoryProgressRail";
import ProblemSection from "../components/HomeStory/ProblemSection";
import WhatIsPartivaSection from "../components/HomeStory/WhatIsPartivaSection";
import CoreValuePillarsSection from "../components/HomeStory/CoreValuePillarsSection";
import SolutionsSection from "../components/HomeStory/SolutionsSection";
import BusinessNetworkSection from "../components/HomeStory/BusinessNetworkSection";
import AmbientSpotlights from "../components/HomeStory/AmbientSpotlights";
import { fetchPages, DATA_SECTION_KEYS, type PageSection } from "./lib/pagesApi";
import { fetchMedia, resolveMedia } from "./lib/mediaApi";
import { fetchPricing } from "./lib/pricingApi";
import { fetchTestimonials } from "./lib/testimonialsApi";

// Used only if the pages/sections API is unreachable, so the homepage still
// renders its default sections instead of going blank.
const DEFAULT_ORDER = ["hero", "trusted-by", "features", "pricing", "how-it-works", "testimonials", "cta"];

const TITLE = "Partiva | One complete platform for managing auto-parts businesses";
const DESCRIPTION =
  "Partiva helps you manage customers, inventory, purchasing, sales, and reports from one secure, integrated platform.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, images: ["/images/home.jpeg"] },
};

export default async function Home() {
  const pages = await fetchPages();
  const dbSections = pages.find((p) => p.slug === "home")?.sections ?? [];
  const apiReachable = pages.length > 0;

  // The public API already excludes hidden sections, so what's returned
  // (sorted by display_order) is exactly what should render, in order.
  // "Data" keys (card/step/list content consumed by a specific section
  // below, e.g. the feature grid's cards) are excluded here since they
  // aren't their own visible block -- looked up directly via dbSections.
  const sections: PageSection[] = (apiReachable
    ? [...dbSections].sort((a, b) => a.displayOrder - b.displayOrder)
    : DEFAULT_ORDER.map((key, i) => ({
        id: -1, key, titleAr: null, titleEn: null, bodyAr: null, bodyEn: null,
        badgeAr: null, badgeEn: null, ctaLabelAr: null, ctaLabelEn: null, ctaHref: null,
        cta2LabelAr: null, cta2LabelEn: null, cta2Href: null, visible: true, displayOrder: i,
      }))
  ).filter((s) => !DATA_SECTION_KEYS.has(s.key));
  const findSection = (key: string) => dbSections.find((s) => s.key === key) ?? null;

  // Media-Library-managed images for the Home page's Hero/CTA sections --
  // resolveMedia returns null if unmanaged/unreachable, in which case each
  // component falls back to its own built-in default image.
  const media = await fetchMedia();
  const heroImage = resolveMedia(media, "home", "hero");
  const ctaImage = resolveMedia(media, "home", "cta");

  const pricing = await fetchPricing();
  const testimonials = await fetchTestimonials();

  // One renderer per supported section key -- anchors (id="...") are
  // preserved exactly as before since the Navbar's in-page links (#features,
  // #pricing, #how-it-works) depend on them. Any key not listed here (e.g. a
  // Dashboard admin's newly added section) falls back to GenericSection
  // instead of being silently dropped.
  const SECTION_RENDERERS: Record<string, (section: PageSection) => React.ReactNode> = {
    hero: (s) => (
      <section id="home">
        <HeroSection
          image={heroImage ? { src: heroImage.url, altAr: heroImage.altAr, altEn: heroImage.altEn } : null}
          override={{
            titleAr: s.titleAr, titleEn: s.titleEn, bodyAr: s.bodyAr, bodyEn: s.bodyEn,
            badgeAr: s.badgeAr, badgeEn: s.badgeEn,
            ctaLabelAr: s.ctaLabelAr, ctaLabelEn: s.ctaLabelEn, ctaHref: s.ctaHref,
            cta2LabelAr: s.cta2LabelAr, cta2LabelEn: s.cta2LabelEn, cta2Href: s.cta2Href,
          }}
        />
      </section>
    ),
    "trusted-by": (s) => <TrustedBySection titleAr={s.titleAr} titleEn={s.titleEn} list={findSection("trusted-by-list")} />,
    features: (s) => (
      <section id="features">
        <FeaturesSection titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} grid={findSection("features-grid")} />
      </section>
    ),
    pricing: (s) => (
      <section id="pricing">
        <PricingSection initialPricing={pricing} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
      </section>
    ),
    "how-it-works": (s) => (
      <section id="how-it-works">
        <HowItWorksSection titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} steps={findSection("how-it-works-steps")} stats={findSection("how-it-works-stats")} />
      </section>
    ),
    testimonials: (s) => <TestimonialsSection initialTestimonials={testimonials} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />,
    problem: (s) => <ProblemSection titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />,
    "what-is-partiva": (s) => <WhatIsPartivaSection titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />,
    "core-value-pillars": (s) => <CoreValuePillarsSection titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />,
    solutions: (s) => <SolutionsSection titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />,
    "business-network": (s) => <BusinessNetworkSection titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />,
    cta: (s) => (
      <CTASection
        override={{
          titleAr: s.titleAr, titleEn: s.titleEn, bodyAr: s.bodyAr, bodyEn: s.bodyEn,
          ctaLabelAr: s.ctaLabelAr, ctaLabelEn: s.ctaLabelEn, ctaHref: s.ctaHref,
        }}
        image={ctaImage ? { src: ctaImage.url, altAr: ctaImage.altAr, altEn: ctaImage.altEn } : null}
      />
    ),
  };

  // Varies each section's scroll-reveal direction/effect so the page
  // doesn't move the same way twice in a row -- purely presentational,
  // same RevealOnScroll component and defaults everywhere else on the site.
  const SECTION_VARIANTS: Record<string, "up" | "down" | "left" | "right" | "scale" | "fade"> = {
    "trusted-by": "fade",
    problem: "up",
    "what-is-partiva": "right",
    "core-value-pillars": "up",
    solutions: "left",
    "how-it-works": "scale",
    "business-network": "right",
    pricing: "scale",
    cta: "scale",
  };

  return (
    <>
      <AmbientSpotlights />
      <StoryProgressRail />
      {sections.map((section) => {
        const render = SECTION_RENDERERS[section.key];
        const node = render ? render(section) : <GenericSection titleAr={section.titleAr} titleEn={section.titleEn} bodyAr={section.bodyAr} bodyEn={section.bodyEn} />;
        return (
          <RevealOnScroll key={section.id >= 0 ? section.id : section.key} variant={SECTION_VARIANTS[section.key]}>
            {node}
          </RevealOnScroll>
        );
      })}
    </>
  );
}
