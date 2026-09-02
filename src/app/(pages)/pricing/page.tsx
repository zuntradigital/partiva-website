import type { Metadata } from "next";
import { fetchPricing } from "@/src/app/lib/pricingApi";
import { fetchPages, resolveMainAndExtras } from "@/src/app/lib/pagesApi";
import PricingPageClient from "./PricingPageClient";

const TITLE = "Pricing | Partiva — No Monthly Subscription, Pay Only When You Sell";
const DESCRIPTION =
  "Free merchant registration on Partiva's auto parts marketplace, with no monthly subscription. Your first 100 successful parts or first 90 days are commission-free, whichever comes first — then a simple transaction-based commission applies.";

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
