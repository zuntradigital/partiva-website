import type { Metadata } from "next";
import NetworkIntroSection from "@/src/components/BusinessNetworkStory/NetworkIntroSection";
import NetworkPrivacySection from "@/src/components/BusinessNetworkStory/NetworkPrivacySection";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import { fetchPages, DATA_SECTION_KEYS } from "@/src/app/lib/pagesApi";

const TITLE = "Partiva | Business Network";
const DESCRIPTION =
  "Joining the Partiva trade network is completely optional. You can use Partiva to manage your business without joining any network — the network is for businesses that want to search, sell, and buy with other traders.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/business-network" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default async function BusinessNetworkPage() {
  const pages = await fetchPages();
  const sections = pages.find((p) => p.slug === "business-network")?.sections ?? [];
  const highlights = sections.find((s) => s.key === "highlights") ?? null;
  const sorted = [...sections].filter((s) => !DATA_SECTION_KEYS.has(s.key)).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <>
      {sorted.map((s) => {
        if (s.key === "intro") {
          return <NetworkIntroSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} highlights={highlights} />;
        }
        if (s.key === "privacy") {
          return <NetworkPrivacySection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />;
        }
        return <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />;
      })}
    </>
  );
}
