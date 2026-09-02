"use client";

// Provider-agnostic analytics events for the pricing flow (SRS §32). Pushes
// to window.dataLayer -- the standard GTM/GA4 convention -- so events start
// flowing the moment a tag manager is installed on the site, without this
// call site needing to change. A no-op today (no analytics SDK is wired up
// yet anywhere on the site), safe to call unconditionally from any component.
export type PricingAnalyticsEvent =
  | "pricing_page_view"
  | "pricing_calculator_started"
  | "pricing_calculator_completed"
  | "join_partiva_clicked"
  | "merchant_pricing_faq_opened"
  | "merchant_landing_view"
  | "commission_model_viewed"
  | "free_100_parts_viewed"
  | "pricing_cta_clicked";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackPricingEvent(event: PricingAnalyticsEvent, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
