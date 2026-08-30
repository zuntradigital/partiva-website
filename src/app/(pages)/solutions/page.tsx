import type { Metadata } from "next";
import SolutionsPageHero from "@/src/components/SolutionsStory/SolutionsPageHero";
import SolutionSpotlightSection from "@/src/components/SolutionsStory/SolutionSpotlightSection";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import { fetchPages, DATA_SECTION_KEYS } from "@/src/app/lib/pagesApi";

const TITLE = "Partiva | Solutions";
const DESCRIPTION =
  "Discover solutions designed specifically to fit your business needs and help you grow and expand with confidence.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/solutions" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const KNOWN_SEGMENTS = ["merchant", "workshop", "distributor"];

export default async function SolutionsPage() {
  const pages = await fetchPages();
  const sections = pages.find((p) => p.slug === "solutions")?.sections ?? [];
  const main = sections.find((s) => s.key === "main") ?? null;
  const benefits = sections.find((s) => s.key === "benefits") ?? null;
  const sorted = [...sections].filter((s) => s.key !== "main" && !DATA_SECTION_KEYS.has(s.key)).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <>
      <SolutionsPageHero override={main ? { titleAr: main.titleAr, titleEn: main.titleEn, bodyAr: main.bodyAr, bodyEn: main.bodyEn } : null} />
      {sorted.map((s, i) =>
        KNOWN_SEGMENTS.includes(s.key) ? (
          <SolutionSpotlightSection
            key={s.id}
            segmentKey={s.key}
            index={i}
            titleAr={s.titleAr}
            titleEn={s.titleEn}
            bodyAr={s.bodyAr}
            bodyEn={s.bodyEn}
            benefits={benefits}
          />
        ) : (
          <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
        )
      )}
    </>
  );
}
