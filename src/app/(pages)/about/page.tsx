import type { Metadata } from "next";
import AboutContent from "./AboutContent";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import ProblemSection from "@/src/components/HomeStory/ProblemSection";
import { fetchPages, resolveMainAndExtras } from "@/src/app/lib/pagesApi";

const TITLE = "About Partiva | Vision & Platform Model";
const DESCRIPTION =
  "Partiva is a business management system with an optional trade network — manage your business independently, and optionally connect to search, sell, and buy with other traders.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default async function AboutPage() {
  const pages = await fetchPages();
  const { mainVisible, extras } = resolveMainAndExtras(pages, "about");
  const aboutSections = pages.find((p) => p.slug === "about")?.sections ?? [];
  const mainSection = aboutSections.find((s) => s.key === "main");
  const dualModel = aboutSections.find((s) => s.key === "dual-model") ?? null;
  const segmentsSection = aboutSections.find((s) => s.key === "segments") ?? null;
  const stepsSection = aboutSections.find((s) => s.key === "about-steps") ?? null;
  return (
    <>
      {mainVisible && (
        <AboutContent
          override={
            mainSection
              ? { titleAr: mainSection.titleAr, titleEn: mainSection.titleEn, bodyAr: mainSection.bodyAr, bodyEn: mainSection.bodyEn }
              : undefined
          }
          dualModel={dualModel}
          segments={segmentsSection}
          steps={stepsSection}
        />
      )}
      {extras.map((s) =>
        s.key === "philosophy" ? (
          <ProblemSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
        ) : (
          <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
        )
      )}
    </>
  );
}
