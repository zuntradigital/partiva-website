import type { Metadata } from "next";
import { fetchPricing } from "@/src/app/lib/pricingApi";
import { fetchPages, resolveMainAndExtras } from "@/src/app/lib/pagesApi";
import ForMerchantsPageClient from "./ForMerchantsPageClient";

const TITLE = "For Merchants | Partiva — Free Registration, Pay Only When You Sell";
const DESCRIPTION =
  "Join Partiva's auto parts merchant network for free: free registration, free listing, free network visibility. Your first 100 successful parts or first 90 days are commission-free, then a simple transaction-based commission applies.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/for-merchants" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default async function ForMerchantsPage() {
  const pricing = await fetchPricing();
  const pages = await fetchPages();
  const sections = resolveMainAndExtras(pages, "for-merchants");
  return <ForMerchantsPageClient initialPricing={pricing} initialSections={sections} />;
}
