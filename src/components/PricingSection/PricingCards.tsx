"use client";
import { Check } from "lucide-react";
import Link from "next/link";

export type Plan = {
  id: number;
  nameAr: string; nameEn?: string | null;
  descriptionAr: string; descriptionEn?: string | null;
  price: number; priceLabelAr?: string | null;
  currency: string; billingPeriod: string;
  featuresAr: string[]; featuresEn?: string[] | null;
  ctaTextAr: string; ctaTextEn?: string | null; ctaTarget: string;
  badgeAr?: string | null; badgeEn?: string | null;
};

// billingPeriod has no _en column in pricing_plans (unlike name/description/features/...),
// so its handful of known values are translated locally instead of adding a schema column.
export const BILLING_PERIOD_EN: Record<string, string> = { "شهريًا": "monthly", "لمدة 7 أيام": "for 7 days" };

// Purely presentational re-ordering for rendering only: keeps the admin-configured
// displayOrder untouched in data/state, just decides visual position so the
// highlighted (badge) plan reads as centered among the cards.
function withFeaturedCentered(plans: Plan[]): Plan[] {
  if (plans.length < 3) return plans;
  const idx = plans.findIndex((p) => p.badgeAr || p.badgeEn);
  if (idx < 0) return plans;
  const rest = [...plans.slice(0, idx), ...plans.slice(idx + 1)];
  rest.splice(Math.floor(plans.length / 2), 0, plans[idx]);
  return rest;
}

export default function PricingCards({ plans, ar, motion = false }: { plans: Plan[]; ar: boolean; motion?: boolean }) {
  const ordered = withFeaturedCentered(plans);
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
      {ordered.map((p, i) => {
        const featured = !!(p.badgeAr || p.badgeEn);
        const name = ar ? p.nameAr : p.nameEn || p.nameAr;
        const desc = ar ? p.descriptionAr : p.descriptionEn || p.descriptionAr;
        const features = ar ? p.featuresAr : p.featuresEn?.length ? p.featuresEn : p.featuresAr;
        const cta = ar ? p.ctaTextAr : p.ctaTextEn || p.ctaTextAr;
        return (
          <div
            key={p.id}
            className={`${motion ? `motion-card motion-enter motion-delay-${i + 1} ` : ""}relative flex h-full flex-col rounded-2xl border bg-white p-6 dark:bg-neutral-900 ${
              featured
                ? "border-2 border-blue-600 shadow-lg dark:border-blue-500"
                : "border-neutral-200 shadow-sm dark:border-neutral-800"
            }`}
          >
            {featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                {ar ? p.badgeAr : p.badgeEn || p.badgeAr}
              </span>
            )}
            <div className="text-center">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{name}</h3>
              <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">{desc}</p>
              <div className="mt-6 flex items-end justify-center gap-2">
                <span className={`text-4xl font-extrabold ${featured ? "text-blue-600 dark:text-blue-400" : "text-neutral-900 dark:text-white"}`}>
                  {ar && p.priceLabelAr ? p.priceLabelAr : p.price}
                </span>
                <div className="flex flex-col items-start pb-1 text-xs text-neutral-400 dark:text-neutral-500">
                  <span>{p.currency}</span>
                  <span>{ar ? p.billingPeriod : BILLING_PERIOD_EN[p.billingPeriod] ?? p.billingPeriod}</span>
                </div>
              </div>
              <Link
                href={p.ctaTarget || "/register"}
                className={`btn-motion mt-6 block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                  featured
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                }`}
              >
                {cta}
              </Link>
            </div>
            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                  <Check className="h-4 w-4 shrink-0 text-blue-600" strokeWidth={2.5} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
