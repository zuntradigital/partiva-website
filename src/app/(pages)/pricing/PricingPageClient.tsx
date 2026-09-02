"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, Sparkles, Clock } from "lucide-react";
import FaqAccordion from "@/src/components/FaqAccordion/FaqAccordion";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import type { PageSection } from "@/src/app/lib/pagesApi";
import { resolveFaqItems, resolveCategoryLabels } from "@/src/app/(pages)/faq/faqData";
import type { BackendFaqItem } from "@/src/app/lib/faqApi";
import type { PricingData, CommissionTier } from "@/src/app/lib/pricingApi";
import { DEFAULT_COMMISSION_CONFIG } from "@/src/app/lib/pricingApi";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import { trackPricingEvent } from "@/src/app/lib/pricingAnalytics";

const API = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
// Pricing FAQs are the same DB-backed FAQ entries the Dashboard's FAQ manager
// edits (category "الأسعار والخطط" / "Pricing & plans") -- fetched here
// instead of duplicating their copy as hardcoded strings, so edits made in
// the Dashboard show up here too.
const PRICING_FAQ_CATEGORY_AR = "الأسعار والخطط";

// SRS §18 -- the commission rate applied to a given monthly sales volume is
// read from commissionConfig.tiers (config-driven), never hardcoded here.
function rateForVolume(volume: number, tiers: CommissionTier[]): number {
  const tier = tiers.find((t) => volume >= t.min && (t.max === null || volume <= t.max));
  // Below the first tier's minimum (e.g. the calculator's empty/zero state)
  // shows the entry-level rate rather than falling through to the top tier.
  return tier?.rate ?? tiers[0]?.rate ?? 0;
}

export default function PricingPageClient({ initialPricing, initialSections }: { initialPricing: PricingData; initialSections: { mainVisible: boolean; main: PageSection | null; extras: PageSection[] } }) {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const [faqItems, setFaqItems] = useState<BackendFaqItem[]>([]);
  const pricingFaqItems = faqItems.filter((item) => item.categoryAr === PRICING_FAQ_CATEGORY_AR);
  const faq = resolveFaqItems(pricingFaqItems, locale);
  const faqCategoryLabels = resolveCategoryLabels(pricingFaqItems, locale);
  const data = initialPricing;
  const cfg = data.commissionConfig ?? DEFAULT_COMMISSION_CONFIG;
  const sections = initialSections;

  useEffect(() => {
    fetch(`${API}/api/faq`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => r?.success && setFaqItems(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    trackPricingEvent("pricing_page_view");
    trackPricingEvent("commission_model_viewed");
    trackPricingEvent("free_100_parts_viewed");
  }, []);

  // Calculator state (SRS §17) -- inputs default empty so nothing is
  // computed/tracked until the merchant actually interacts with it.
  const [monthlySales, setMonthlySales] = useState("");
  const [avgPartValue, setAvgPartValue] = useState("");
  const [calculatorStarted, setCalculatorStarted] = useState(false);
  const [calculatorCompleted, setCalculatorCompleted] = useState(false);

  const salesNum = Number(monthlySales) || 0;
  const valueNum = Number(avgPartValue) || 0;
  const estimatedSalesValue = salesNum * valueNum;
  const applicableRate = rateForVolume(salesNum, cfg.tiers);
  const estimatedCommission = estimatedSalesValue * (applicableRate / 100);
  const merchantReceives = estimatedSalesValue - estimatedCommission;

  useEffect(() => {
    if (salesNum > 0 && valueNum > 0 && !calculatorCompleted) {
      setCalculatorCompleted(true);
      trackPricingEvent("pricing_calculator_completed", { monthlySales: salesNum, avgPartValue: valueNum });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesNum, valueNum]);

  function onCalculatorInput() {
    if (!calculatorStarted) {
      setCalculatorStarted(true);
      trackPricingEvent("pricing_calculator_started");
    }
  }

  function onCta(location: string) {
    trackPricingEvent("join_partiva_clicked");
    trackPricingEvent("pricing_cta_clicked", { location });
  }

  const copy = ar
    ? {
        badge: "الأسعار",
        title: sections.main?.bodyAr ? sections.main?.titleAr || cfg.headlineAr : cfg.headlineAr,
        description: sections.main?.bodyAr || cfg.descriptionAr,
        currency: `الأسعار بـ${cfg.currency}`,
        ctaPrimary: cfg.ctaTextAr,
        ctaSecondary: cfg.ctaSecondaryTextAr,
        freeLaunchBadge: "ابدأ البيع مجانًا",
        limitedTime: "لفترة محدودة",
        freeParts: `أول ${cfg.freePartsLimit} قطعة ناجحة`,
        freePartsSub: "0% عمولة",
        or: "أو",
        freeDays: `أول ${cfg.freePeriodDays} يومًا`,
        whichever: "أيهما يأتي أولًا",
        tiersTitle: "شرائح العمولة حسب حجم المبيعات",
        tiersSubtitle: "هذه شرائح عمولة على حجم المعاملات، وليست باقات أو اشتراكات.",
        tierRange: (t: CommissionTier) => (t.max === null ? `+${t.min}` : `${t.min}–${t.max}`),
        tierRateLabel: "العمولة",
        comparisonTitle: "لماذا Partiva",
        comparisonFeature: "الميزة",
        comparisonValue: "Partiva",
        comparisonRows: [
          ["إنشاء الحساب", "مجاني"], ["تفعيل التاجر", "مجاني"], ["إضافة المنتجات", "مجاني"],
          ["الظهور على الشبكة", "مجاني"], ["استقبال الطلبات", "مجاني"],
          [`أول ${cfg.freePartsLimit} قطعة ناجحة`, "0%"], [`أول ${cfg.freePeriodDays} يومًا`, "0%"],
          ["بعد الفترة المجانية", "عمولة على المعاملات"], ["اشتراك شهري", "لا يوجد"], ["رسوم تأسيس", "لا يوجد"],
        ],
        calculatorTitle: "حاسبة عمولة Partiva",
        calculatorEstimatesOnly: "تقديرات فقط — وليست التزامًا تعاقديًا",
        monthlySalesLabel: "عدد القطع المباعة شهريًا",
        avgPartValueLabel: `متوسط قيمة القطعة (${cfg.currency})`,
        estimatedSalesValueLabel: "قيمة المبيعات التقديرية",
        applicableCommissionLabel: "العمولة المطبقة",
        estimatedCommissionLabel: "عمولة Partiva التقديرية",
        merchantReceivesLabel: "صافي ما يستلمه التاجر",
        transparencyTitle: "بدون اشتراك شهري",
        transparencyBody: "لا تدفع اشتراكًا شهريًا. تحصل Partiva على عمولة فقط من المعاملات الناجحة التي تتم عبر المنصة.",
        transparencyCta: "كيف يعمل تسعير Partiva؟",
        disclaimer: cfg.disclaimerAr,
        contact: "تواصل معنا",
        faqBadge: "الأسئلة الشائعة",
        faqTitle: "أسئلة عن الأسعار",
        closing: "جاهز تبدأ البيع بدون أي تكلفة؟",
        closingDesc: `أول ${cfg.freePartsLimit} قطعة ناجحة أو أول ${cfg.freePeriodDays} يومًا بدون عمولة، أيهما يأتي أولًا.`,
        faqLink: "الأسئلة الشائعة",
      }
    : {
        badge: "Pricing",
        title: sections.main?.bodyEn ? sections.main?.titleEn || cfg.headlineEn : cfg.headlineEn,
        description: sections.main?.bodyEn || cfg.descriptionEn,
        currency: `Prices are in ${cfg.currency}`,
        ctaPrimary: cfg.ctaTextEn,
        ctaSecondary: cfg.ctaSecondaryTextEn,
        freeLaunchBadge: "Start Selling for Free",
        limitedTime: "Limited Time",
        freeParts: `First ${cfg.freePartsLimit} successful parts`,
        freePartsSub: "0% commission",
        or: "OR",
        freeDays: `First ${cfg.freePeriodDays} days`,
        whichever: "Whichever comes first",
        tiersTitle: "Volume-Based Commission",
        tiersSubtitle: "These are transaction volume rates, not subscription plans.",
        tierRange: (t: CommissionTier) => (t.max === null ? `${t.min}+` : `${t.min}–${t.max}`),
        tierRateLabel: "Commission",
        comparisonTitle: "Why Partiva",
        comparisonFeature: "Feature",
        comparisonValue: "Partiva",
        comparisonRows: [
          ["Account Creation", "Free"], ["Merchant Activation", "Free"], ["Product Listing", "Free"],
          ["Network Visibility", "Free"], ["Receiving Orders", "Free"],
          [`First ${cfg.freePartsLimit} Successful Parts`, "0%"], [`First ${cfg.freePeriodDays} Days`, "0%"],
          ["After Free Period", "Transaction Commission"], ["Monthly Subscription", "None"], ["Setup Fee", "None"],
        ],
        calculatorTitle: "Partiva Commission Calculator",
        calculatorEstimatesOnly: "Estimates only — not a contractual commitment",
        monthlySalesLabel: "Monthly successful sales (parts)",
        avgPartValueLabel: `Average part value (${cfg.currency})`,
        estimatedSalesValueLabel: "Estimated Sales Value",
        applicableCommissionLabel: "Applicable Commission",
        estimatedCommissionLabel: "Estimated Partiva Commission",
        merchantReceivesLabel: "Merchant Receives",
        transparencyTitle: "No Monthly Subscription",
        transparencyBody: "You don't pay a monthly subscription. Partiva earns a commission only from successful transactions made through the platform.",
        transparencyCta: "How does Partiva pricing work?",
        disclaimer: cfg.disclaimerEn,
        contact: "Contact us",
        faqBadge: "Frequently asked questions",
        faqTitle: "Pricing questions",
        closing: "Ready to start selling at no cost?",
        closingDesc: `Your first ${cfg.freePartsLimit} successful parts or first ${cfg.freePeriodDays} days are commission-free, whichever comes first.`,
        faqLink: "FAQ",
      };

  const fmt = (n: number) => n.toLocaleString(ar ? "ar-SA" : "en-US", { maximumFractionDigits: 2 });

  return (
    <>
      {sections.mainVisible && (
        <main dir={ar ? "rtl" : "ltr"} lang={locale} data-language-managed className="mx-auto max-w-6xl px-6 py-16">
          {/* Hero -- SRS §15 */}
          <RevealOnScroll variant="fade">
            <section className="text-center">
              <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">{copy.badge}</span>
              <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">{copy.title}</h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">{copy.description}</p>
              <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">{copy.currency}</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/register" onClick={() => onCta("pricing-hero")} className="btn-motion rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">{copy.ctaPrimary}</Link>
                <Link href="/how-it-works" className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">{copy.ctaSecondary}</Link>
              </div>
            </section>
          </RevealOnScroll>

          {/* Free Launch Highlight -- SRS §16 */}
          <RevealOnScroll variant="scale" delay={0.1}>
            <section className="relative mt-12 overflow-hidden rounded-2xl bg-[#0a1229] text-white shadow-lg">
              <span className="absolute end-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm"><Clock className="h-3.5 w-3.5" />{copy.limitedTime}</span>
              <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600"><Sparkles className="h-6 w-6 text-white" /></div>
                <h2 className="text-2xl font-bold">{copy.freeLaunchBadge}</h2>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                  <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">{copy.freeParts}</span>
                  <span className="text-blue-300">{copy.or}</span>
                  <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">{copy.freeDays}</span>
                </div>
                <span className="text-3xl font-extrabold text-blue-400">{copy.freePartsSub}</span>
                <span className="text-xs text-gray-400">{copy.whichever}</span>
              </div>
            </section>
          </RevealOnScroll>

          {/* Volume-based commission tiers -- SRS §11 */}
          <RevealOnScroll variant="up">
            <section className="mt-14">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{copy.tiersTitle}</h2>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{copy.tiersSubtitle}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {cfg.tiers.map((t, i) => (
                  <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <p className="text-sm text-neutral-400 dark:text-neutral-500">{copy.tierRange(t)}</p>
                    <p className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">{t.rate.toFixed(2)}%</p>
                    <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">{copy.tierRateLabel}</p>
                  </div>
                ))}
              </div>
            </section>
          </RevealOnScroll>

          {/* Comparison -- SRS §19 */}
          <RevealOnScroll variant="up" delay={0.05}>
            <section className="mt-14">
              <h2 className="mb-6 text-center text-2xl font-bold text-neutral-900 dark:text-white">{copy.comparisonTitle}</h2>
              <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900">
                      <th className={`px-5 py-3 font-semibold text-neutral-700 dark:text-neutral-300 ${ar ? "text-right" : "text-left"}`}>{copy.comparisonFeature}</th>
                      <th className={`px-5 py-3 font-semibold text-blue-600 dark:text-blue-400 ${ar ? "text-left" : "text-right"}`}>{copy.comparisonValue}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {copy.comparisonRows.map(([feature, value], i) => (
                      <tr key={feature} className={i % 2 === 0 ? "bg-white dark:bg-neutral-950" : "bg-neutral-50/60 dark:bg-neutral-900/40"}>
                        <td className={`px-5 py-3 text-neutral-600 dark:text-neutral-400 ${ar ? "text-right" : "text-left"}`}>{feature}</td>
                        <td className={`px-5 py-3 font-semibold text-neutral-900 dark:text-white ${ar ? "text-left" : "text-right"}`}>
                          <span className="inline-flex items-center gap-1.5">
                            {(value === "Free" || value === "مجاني" || value === "0%") && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                            {value}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </RevealOnScroll>

          {/* Pricing Calculator -- SRS §17-18 */}
          <RevealOnScroll variant="up">
            <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/60 sm:p-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{copy.calculatorTitle}</h2>
                <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">{copy.calculatorEstimatesOnly}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {copy.monthlySalesLabel}
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={monthlySales}
                    onChange={(e) => { setMonthlySales(e.target.value); onCalculatorInput(); }}
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </label>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {copy.avgPartValueLabel}
                  <input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={avgPartValue}
                    onChange={(e) => { setAvgPartValue(e.target.value); onCalculatorInput(); }}
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </label>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-white p-4 text-center dark:bg-neutral-800">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">{copy.estimatedSalesValueLabel}</p>
                  <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">{fmt(estimatedSalesValue)} {cfg.currency}</p>
                </div>
                <div className="rounded-xl bg-white p-4 text-center dark:bg-neutral-800">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">{copy.applicableCommissionLabel}</p>
                  <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">{applicableRate.toFixed(2)}%</p>
                </div>
                <div className="rounded-xl bg-white p-4 text-center dark:bg-neutral-800">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">{copy.estimatedCommissionLabel}</p>
                  <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">{fmt(estimatedCommission)} {cfg.currency}</p>
                </div>
                <div className="rounded-xl bg-white p-4 text-center dark:bg-neutral-800">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">{copy.merchantReceivesLabel}</p>
                  <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">{fmt(merchantReceives)} {cfg.currency}</p>
                </div>
              </div>
            </section>
          </RevealOnScroll>

          {/* Transparency + Disclaimer -- SRS §13, §25 */}
          <RevealOnScroll variant="fade">
            <section className="mt-14 text-center">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{copy.transparencyTitle}</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">{copy.transparencyBody}</p>
              <Link href="/for-merchants" className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">{copy.transparencyCta}</Link>
              <p className="mx-auto mt-6 max-w-3xl text-xs leading-6 text-neutral-400 dark:text-neutral-500">{copy.disclaimer}</p>
            </section>
          </RevealOnScroll>

          {data.customContact && (
            <RevealOnScroll variant="up">
              <section className="mt-10 rounded-2xl bg-[#0a1229] px-8 py-8 text-white">
                <div className={`flex flex-col items-center justify-between gap-6 text-center md:flex-row ${ar ? "md:text-right" : "md:text-left"}`}>
                  <div>
                    <h2 className="text-xl font-bold">{(ar ? data.customContact.titleAr : data.customContact.titleEn) || data.customContact.titleAr}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">{(ar ? data.customContact.descriptionAr : data.customContact.descriptionEn) || data.customContact.descriptionAr}</p>
                  </div>
                  <Link href="/contact" className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0a1229]">{copy.contact}</Link>
                </div>
              </section>
            </RevealOnScroll>
          )}

          <RevealOnScroll variant="up">
            <section className="mt-14">
              <div className="mb-6 text-center">
                <span className="text-sm font-semibold text-blue-600">{copy.faqBadge}</span>
                <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">{copy.faqTitle}</h2>
              </div>
              <FaqAccordion items={faq} categoryLabels={faqCategoryLabels} onOpen={() => trackPricingEvent("merchant_pricing_faq_opened")} />
            </section>
          </RevealOnScroll>

          <RevealOnScroll variant="scale">
            <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.closing}</p>
              <p className="mt-2 text-sm text-neutral-500">{copy.closingDesc}</p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/register" onClick={() => onCta("pricing-closing")} className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white">{copy.ctaPrimary}</Link>
                <Link href="/faq" className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">{copy.faqLink}</Link>
              </div>
            </section>
          </RevealOnScroll>
        </main>
      )}
      {sections.extras.map((s) => (
        <GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn} />
      ))}
    </>
  );
}
