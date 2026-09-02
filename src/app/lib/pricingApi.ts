// Fetches pricing plans from the admin backend's public API. Mirrors
// contactApi.ts/pagesApi.ts so pricing data can be fetched server-side and
// passed down as props (kept live via LiveContentSync's router.refresh())
// instead of each pricing view re-fetching it itself.
import type { Plan } from "@/src/components/PricingSection/PricingCards";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export interface CommissionTier {
  min: number;
  max: number | null;
  rate: number;
}

export interface CommissionConfig {
  freePartsLimit: number;
  freePeriodDays: number;
  currency: string;
  tiers: CommissionTier[];
  headlineAr: string;
  headlineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  disclaimerAr: string;
  disclaimerEn: string;
  ctaTextAr: string;
  ctaTextEn: string;
  ctaSecondaryTextAr: string;
  ctaSecondaryTextEn: string;
}

export interface PricingData {
  plans: Plan[];
  customContact: { titleAr?: string; titleEn?: string; descriptionAr?: string; descriptionEn?: string } | null;
  commissionConfig: CommissionConfig | null;
}

// Mirrors the values seeded by 031_seed_commission_pricing_config.sql. Used
// only if the backend is unreachable or the settings row hasn't been seeded
// yet, so the pricing page never breaks -- same fail-open pattern already
// used elsewhere on the site. Not the source of truth: the DB/CMS value
// (edited from the dashboard's Pricing page) always takes precedence.
export const DEFAULT_COMMISSION_CONFIG: CommissionConfig = {
  freePartsLimit: 100,
  freePeriodDays: 90,
  currency: "SAR",
  tiers: [
    { min: 1, max: 500, rate: 2.0 },
    { min: 501, max: 2000, rate: 1.75 },
    { min: 2001, max: null, rate: 1.5 },
  ],
  headlineAr: "بدون اشتراك شهري. ادفع فقط عندما تبيع.",
  headlineEn: "No Monthly Subscription. Pay Only When You Sell.",
  descriptionAr:
    "انضم إلى Partiva مجانًا، أضف منتجاتك، وابدأ الوصول للعملاء عبر شبكتنا. أول 100 قطعة ناجحة أو أول 90 يومًا بدون عمولة، أيهما يأتي أولًا.",
  descriptionEn:
    "Join Partiva for free, list your inventory, and start reaching customers through our network. Your first 100 successful parts or your first 90 days are commission-free, whichever comes first.",
  disclaimerAr:
    "الأسعار ونسب العمولة تخضع للشروط التجارية المعمول بها لدى Partiva وقد يتم تحديثها من وقت لآخر. تُحدَّد النسبة المطبقة على التاجر وفقًا لحالته وحجم معاملاته وشروط التسعير السارية وقت المعاملة.",
  disclaimerEn:
    "Pricing and commission rates are subject to Partiva's applicable commercial terms and may be updated from time to time. The applicable rate for a merchant is determined according to the merchant's status, transaction volume, and the pricing terms effective at the time of the applicable transaction.",
  ctaTextAr: "انضم إلى Partiva مجانًا",
  ctaTextEn: "Join Partiva Free",
  ctaSecondaryTextAr: "كيف تعمل",
  ctaSecondaryTextEn: "How It Works",
};

const EMPTY_PRICING: PricingData = { plans: [], customContact: null, commissionConfig: DEFAULT_COMMISSION_CONFIG };

interface ApiSuccess<T> {
  success: true;
  data: T;
}

export async function fetchPricing(): Promise<PricingData> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/pricing`, { cache: "no-store" });
    const json = (await response.json().catch(() => null)) as ApiSuccess<PricingData> | null;
    if (!response.ok || !json?.success) return EMPTY_PRICING;
    return { ...json.data, commissionConfig: json.data.commissionConfig ?? DEFAULT_COMMISSION_CONFIG };
  } catch {
    return EMPTY_PRICING;
  }
}
