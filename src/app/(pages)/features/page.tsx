import type { Metadata } from "next";
import FeaturesPageClient from "./FeaturesPageClient";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import { fetchPages, resolveMainAndExtras } from "@/src/app/lib/pagesApi";

const TITLE = "Partiva | Features";
const DESCRIPTION =
  "Everything you need to manage your business and connect it to the market when needed — tools and features that help you organize your business and track your operations more simply and clearly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/features" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

// The 9 Dashboard-managed feature-detail sections render as the "Key
// Features" card grid; anything else (e.g. a future admin-added section)
// still falls back to the plain GenericSection block.
const HIGHLIGHT_KEYS = new Set([
  "business-management", "products-inventory", "branch-management", "employee-access",
  "customer-management", "supplier-management", "reports-insights", "notifications", "integrations",
]);

export default async function FeaturesPage() {
  const pages = await fetchPages();
  const { mainVisible, main, extras } = resolveMainAndExtras(pages, "features");
  const highlights = extras.filter((s) => HIGHLIGHT_KEYS.has(s.key));
  const otherExtras = extras.filter((s) => !HIGHLIGHT_KEYS.has(s.key));

  return (
    <>
      {mainVisible && <FeaturesPageClient highlights={highlights} override={main ? { titleAr: main.titleAr, titleEn: main.titleEn, bodyAr: main.bodyAr, bodyEn: main.bodyEn } : null} />}
      {otherExtras.map((s) => (
        <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
      ))}
    </>
  );
}
