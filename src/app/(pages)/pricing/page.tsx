import type { Metadata } from "next";
import { fetchPricing } from "@/src/app/lib/pricingApi";
import { fetchPages, resolveMainAndExtras } from "@/src/app/lib/pagesApi";
import PricingPageClient from "./PricingPageClient";

const TITLE = "Pricing | Partiva";
const DESCRIPTION = "Plans for every business size. Choose the plan that fits your business.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default async function PricingPage() {
  const pricing = await fetchPricing();
  // Reuses the same /api/pages fetch the root layout already makes for
  // this request (Next dedupes identical fetch()+options within one render)
  // instead of the client re-fetching it after mount.
  const pages = await fetchPages();
  const sections = resolveMainAndExtras(pages, "pricing");
  return <PricingPageClient initialPricing={pricing} initialSections={sections} />;
}
