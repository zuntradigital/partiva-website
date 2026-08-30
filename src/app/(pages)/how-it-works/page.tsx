import type { Metadata } from "next";
import HowItWorksContent from "./HowItWorksContent";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import { fetchPages, resolveMainAndExtras } from "@/src/app/lib/pagesApi";

const TITLE = "How Partiva onboarding works | Registration to go-live";
const DESCRIPTION =
  "See how Partiva onboarding works: register your business, our team reviews your request, you're notified of the decision by email, then you sign in and get started — no instant activation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/how-it-works" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default async function HowItWorksPage() {
  const pages = await fetchPages();
  const { mainVisible, main, extras } = resolveMainAndExtras(pages, "how-it-works");
  const steps = pages.find((p) => p.slug === "how-it-works")?.sections.find((s) => s.key === "steps") ?? null;
  return (
    <>
      {mainVisible && <HowItWorksContent override={main ? { titleAr: main.titleAr, titleEn: main.titleEn, bodyAr: main.bodyAr, bodyEn: main.bodyEn } : null} steps={steps} />}
      {extras.map((s) => (
        <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
      ))}
    </>
  );
}
