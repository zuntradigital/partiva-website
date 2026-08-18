import type { Metadata } from "next";
import HowItWorksContent from "./HowItWorksContent";

export const metadata: Metadata = {
  title: "How Partiva onboarding works | Registration to go-live", // CONTENT REQUIRED
  description:
    "CONTENT REQUIRED — meta description walking through the registration, review, approval, and go-live journey.",
  alternates: {
    canonical: "/how-it-works",
    languages: {
      ar: "/ar/how-it-works",
      en: "/en/how-it-works",
    },
  },
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
