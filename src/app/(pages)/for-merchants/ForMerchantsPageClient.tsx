"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Sparkles, UserPlus, PackagePlus, Users, Wallet, Clock } from "lucide-react";
import FaqAccordion from "@/src/components/FaqAccordion/FaqAccordion";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import type { PageSection } from "@/src/app/lib/pagesApi";
import type { PricingData } from "@/src/app/lib/pricingApi";
import { DEFAULT_COMMISSION_CONFIG } from "@/src/app/lib/pricingApi";
import { resolveFaqItems, resolveCategoryLabels } from "@/src/app/(pages)/faq/faqData";
import type { BackendFaqItem } from "@/src/app/lib/faqApi";
import { trackPricingEvent } from "@/src/app/lib/pricingAnalytics";

const API = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
const PRICING_FAQ_CATEGORY_AR = "الأسعار والخطط";

const STEP_ICONS = [UserPlus, PackagePlus, Users, Wallet];

// SRS §22 -- Merchant Landing Page (/for-merchants). Covers all 12 required
// content items: why join, how it works, free registration/listing/
// visibility/orders, the free-launch offer, the commission model,
// settlement, FAQ and a registration CTA.
export default function ForMerchantsPageClient({ initialPricing, initialSections }: { initialPricing: PricingData; initialSections: { mainVisible: boolean; main: PageSection | null; extras: PageSection[] } }) {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const data = initialPricing;
  const cfg = data.commissionConfig ?? DEFAULT_COMMISSION_CONFIG;
  const sections = initialSections;

  const [faqItems, setFaqItems] = useState<BackendFaqItem[]>([]);
  const pricingFaqItems = faqItems.filter((item) => item.categoryAr === PRICING_FAQ_CATEGORY_AR);
  const faq = resolveFaqItems(pricingFaqItems, locale);
  const faqCategoryLabels = resolveCategoryLabels(pricingFaqItems, locale);

  useEffect(() => {
    fetch(`${API}/api/faq`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => r?.success && setFaqItems(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    trackPricingEvent("merchant_landing_view");
  }, []);

  function onCta(location: string) {
    trackPricingEvent("join_partiva_clicked");
    trackPricingEvent("pricing_cta_clicked", { location });
  }

  const copy = ar
    ? {
        badge: "للتجار",
        heroTitle: "لماذا تنضم إلى Partiva؟",
        heroBody: "انضم إلى شبكة تجار قطع الغيار مجانًا بالكامل. سجّل نشاطك التجاري، أضف منتجاتك، وابدأ الوصول لعملاء جدد بدون أي تكلفة مقدمة.",
        ctaPrimary: cfg.ctaTextAr,
        howTitle: "كيف تعمل Partiva",
        steps: [
          { title: "انضم مجانًا", body: "سجّل نشاطك التجاري مجانًا بالكامل، بدون رسوم تسجيل أو تفعيل." },
          { title: "أضف منتجاتك", body: "أضف منتجاتك ومخزونك من قطع الغيار بدون أي تكلفة." },
          { title: "استقبل العملاء والطلبات", body: "اعرض منتجاتك أمام شبكة Partiva واستقبل طلبات الشراء مجانًا." },
          { title: "ادفع فقط عند البيع الناجح", body: `بدون عمولة خلال أول ${cfg.freePartsLimit} قطعة أو ${cfg.freePeriodDays} يومًا، وبعدها تُطبَّق العمولة على المبيعات الناجحة فقط.` },
        ],
        freebiesTitle: "كل هذا مجاني",
        freebies: ["التسجيل", "إضافة المنتجات", "الظهور على الشبكة", "استقبال الطلبات"],
        freeLaunchBadge: "ابدأ البيع مجانًا",
        limitedTime: "لفترة محدودة",
        freeParts: `أول ${cfg.freePartsLimit} قطعة ناجحة`,
        freePartsSub: "0% عمولة",
        or: "أو",
        freeDays: `أول ${cfg.freePeriodDays} يومًا`,
        whichever: "أيهما يأتي أولًا",
        commissionTitle: "نموذج العمولة",
        commissionSubtitle: "شرائح عمولة على حجم المعاملات، وليست باقات أو اشتراكات.",
        tierRange: (min: number, max: number | null) => (max === null ? `+${min}` : `${min}–${max}`),
        settlementTitle: "التسوية",
        settlementBody: "تُخصم عمولة Partiva من قيمة كل معاملة ناجحة، ويتم تسوية صافي المستحق للتاجر وفق الشروط التجارية المعمول بها لدى Partiva.",
        disclaimer: cfg.disclaimerAr,
        faqBadge: "الأسئلة الشائعة",
        faqTitle: "أسئلة يطرحها التجار",
        closingTitle: "جاهز تنضم إلى Partiva؟",
        closingDesc: "التسجيل مجاني بالكامل ولا يوجد أي اشتراك شهري.",
        pricingLink: "تفاصيل التسعير الكاملة",
      }
    : {
        badge: "For Merchants",
        heroTitle: "Why Join Partiva?",
        heroBody: "Join the auto parts merchant network at no cost. Register your business, list your inventory, and start reaching new customers with zero upfront cost.",
        ctaPrimary: cfg.ctaTextEn,
        howTitle: "How Partiva Works",
        steps: [
          { title: "Join Free", body: "Register your business for free, with no registration or activation fees." },
          { title: "List Your Inventory", body: "Add your auto parts products and inventory at no cost." },
          { title: "Receive Customers & Orders", body: "Get your products in front of Partiva's network and receive purchase orders for free." },
          { title: "Pay When You Successfully Sell", body: `No commission for your first ${cfg.freePartsLimit} parts or ${cfg.freePeriodDays} days — after that, commission applies only to successful sales.` },
        ],
        freebiesTitle: "All Free",
        freebies: ["Registration", "Product Listing", "Network Visibility", "Receiving Orders"],
        freeLaunchBadge: "Start Selling for Free",
        limitedTime: "Limited Time",
        freeParts: `First ${cfg.freePartsLimit} successful parts`,
        freePartsSub: "0% commission",
        or: "OR",
        freeDays: `First ${cfg.freePeriodDays} days`,
        whichever: "Whichever comes first",
        commissionTitle: "Commission Model",
        commissionSubtitle: "Volume-based transaction rates, not subscription plans.",
        tierRange: (min: number, max: number | null) => (max === null ? `${min}+` : `${min}–${max}`),
        settlementTitle: "Settlement",
        settlementBody: "Partiva's commission is deducted from the value of each successful transaction, and the merchant's net proceeds are settled according to Partiva's applicable commercial terms.",
        disclaimer: cfg.disclaimerEn,
        faqBadge: "Frequently asked questions",
        faqTitle: "Questions merchants ask",
        closingTitle: "Ready to join Partiva?",
        closingDesc: "Registration is completely free, with no monthly subscription.",
        pricingLink: "Full pricing details",
      };

  const heroBody = ar ? sections.main?.bodyAr : sections.main?.bodyEn;
  const heroTitle = heroBody ? (ar ? sections.main?.titleAr : sections.main?.titleEn) || copy.heroTitle : copy.heroTitle;
  const heroDescription = heroBody || copy.heroBody;

  return (
    <>
      {sections.mainVisible && (
        <main dir={ar ? "rtl" : "ltr"} lang={locale} data-language-managed className="mx-auto max-w-6xl px-6 py-16">
          {/* Hero -- item 1 */}
          <RevealOnScroll variant="fade">
            <section className="text-center">
              <span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">{copy.badge}</span>
              <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">{heroTitle}</h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">{heroDescription}</p>
              <Link href="/register" onClick={() => onCta("for-merchants-hero")} className="btn-motion mt-6 inline-flex rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700">{copy.ctaPrimary}</Link>
            </section>
          </RevealOnScroll>

          {/* How Partiva Works -- item 2, SRS §23 */}
          <RevealOnScroll variant="up" delay={0.05}>
            <section className="mt-16">
              <h2 className="mb-10 text-center text-2xl font-bold text-neutral-900 dark:text-white">{copy.howTitle}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {copy.steps.map((step, i) => {
                  const Icon = STEP_ICONS[i];
                  return (
                    <div key={step.title} className="relative flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
                        <span className="absolute -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">{i + 1}</span>
                      </div>
                      <h3 className="font-bold text-neutral-900 dark:text-white">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{step.body}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </RevealOnScroll>

          {/* What's free -- items 3-6 */}
          <RevealOnScroll variant="up">
            <section className="mt-16">
              <h2 className="mb-6 text-center text-2xl font-bold text-neutral-900 dark:text-white">{copy.freebiesTitle}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {copy.freebies.map((label) => (
                  <div key={label} className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                    <Check className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
                  </div>
                ))}
              </div>
            </section>
          </RevealOnScroll>

          {/* Free launch highlight -- items 7-8 */}
          <RevealOnScroll variant="scale">
            <section className="relative mt-16 overflow-hidden rounded-2xl bg-[#0a1229] text-white shadow-lg">
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

          {/* Commission model -- item 9 */}
          <RevealOnScroll variant="up">
            <section className="mt-16">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{copy.commissionTitle}</h2>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{copy.commissionSubtitle}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {cfg.tiers.map((t, i) => (
                  <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <p className="text-sm text-neutral-400 dark:text-neutral-500">{copy.tierRange(t.min, t.max)}</p>
                    <p className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">{t.rate.toFixed(2)}%</p>
                  </div>
                ))}
              </div>
              <Link href="/pricing" className="mt-6 block text-center text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">{copy.pricingLink}</Link>
            </section>
          </RevealOnScroll>

          {/* Settlement -- item 10 (marketing-website representation only, no
              commission/settlement engine implemented -- SRS §37) */}
          <RevealOnScroll variant="fade">
            <section className="mt-16 text-center">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{copy.settlementTitle}</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">{copy.settlementBody}</p>
              <p className="mx-auto mt-4 max-w-3xl text-xs leading-6 text-neutral-400 dark:text-neutral-500">{copy.disclaimer}</p>
            </section>
          </RevealOnScroll>

          {/* FAQ -- item 11 */}
          <RevealOnScroll variant="up">
            <section className="mt-16">
              <div className="mb-6 text-center">
                <span className="text-sm font-semibold text-blue-600">{copy.faqBadge}</span>
                <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">{copy.faqTitle}</h2>
              </div>
              <FaqAccordion items={faq} categoryLabels={faqCategoryLabels} onOpen={() => trackPricingEvent("merchant_pricing_faq_opened")} />
            </section>
          </RevealOnScroll>

          {/* Registration CTA -- item 12 */}
          <RevealOnScroll variant="scale">
            <section className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.closingTitle}</p>
              <p className="mt-2 text-sm text-neutral-500">{copy.closingDesc}</p>
              <Link href="/register" onClick={() => onCta("for-merchants-closing")} className="mt-5 inline-flex rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white">{copy.ctaPrimary}</Link>
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
