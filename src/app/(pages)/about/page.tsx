import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Partiva | Vision & Platform Model",
  description:
    "CONTENT REQUIRED — meta description explaining Partiva's dual model (business management + optional trade network).",
  alternates: {
    canonical: "/about",
    languages: {
      ar: "/ar/about",
      en: "/en/about",
    },
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
