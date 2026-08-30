// Fetches pricing plans from the admin backend's public API. Mirrors
// contactApi.ts/pagesApi.ts so pricing data can be fetched server-side and
// passed down as props (kept live via LiveContentSync's router.refresh())
// instead of each pricing view re-fetching it itself.
import type { Plan } from "@/src/components/PricingSection/PricingCards";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export interface PricingData {
  plans: Plan[];
  customContact: { titleAr?: string; titleEn?: string; descriptionAr?: string; descriptionEn?: string } | null;
}

const EMPTY_PRICING: PricingData = { plans: [], customContact: null };

interface ApiSuccess<T> {
  success: true;
  data: T;
}

export async function fetchPricing(): Promise<PricingData> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/pricing`, { cache: "no-store" });
    const json = (await response.json().catch(() => null)) as ApiSuccess<PricingData> | null;
    if (!response.ok || !json?.success) return EMPTY_PRICING;
    return json.data;
  } catch {
    return EMPTY_PRICING;
  }
}
