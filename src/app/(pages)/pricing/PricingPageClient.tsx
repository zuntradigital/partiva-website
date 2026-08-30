"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import FaqAccordion from "@/src/components/FaqAccordion/FaqAccordion";
import { useLanguage } from "@/src/components/LanguageProvider/LanguageProvider";
import GenericSection from "@/src/components/GenericSection/GenericSection";
import type { PageSection } from "@/src/app/lib/pagesApi";
import { resolveFaqItems, resolveCategoryLabels } from "@/src/app/(pages)/faq/faqData";
import type { BackendFaqItem } from "@/src/app/lib/faqApi";
import PricingCards from "@/src/components/PricingSection/PricingCards";
import type { PricingData } from "@/src/app/lib/pricingApi";
import RevealOnScroll from "@/src/components/RevealOnScroll/RevealOnScroll";

const API=process.env.NEXT_PUBLIC_API_URL||process.env.NEXT_PUBLIC_BACKEND_API_URL||"http://localhost:5000";
// Pricing FAQs are the same DB-backed FAQ entries the Dashboard's FAQ manager
// edits (category "الأسعار والخطط" / "Pricing & plans") -- fetched here
// instead of duplicating their copy as hardcoded strings, so edits made in
// the Dashboard show up here too.
const PRICING_FAQ_CATEGORY_AR = "الأسعار والخطط";
export default function PricingPageClient({initialPricing,initialSections}:{initialPricing:PricingData;initialSections:{mainVisible:boolean;main:PageSection|null;extras:PageSection[]}}){const {locale}=useLanguage(),ar=locale==="ar";const [faqItems,setFaqItems]=useState<BackendFaqItem[]>([]);const pricingFaqItems=faqItems.filter(item=>item.categoryAr===PRICING_FAQ_CATEGORY_AR);const faq=resolveFaqItems(pricingFaqItems,locale);const faqCategoryLabels=resolveCategoryLabels(pricingFaqItems,locale);const data=initialPricing;const sections=initialSections;useEffect(()=>{fetch(`${API}/api/faq`,{cache:"no-store"}).then(r=>r.ok?r.json():null).then(r=>r?.success&&setFaqItems(r.data)).catch(()=>{})},[]);const copy=ar?{badge:"الأسعار",title:sections.main?.bodyAr?(sections.main?.titleAr||"خطط تناسب جميع أحجام الأعمال"):"خطط تناسب جميع أحجام الأعمال",description:sections.main?.bodyAr||"اختر الخطة المناسبة لك وابدأ رحلتك نحو إدارة أكثر احترافية",currency:"الأسعار بالريال السعودي",contact:"تواصل معنا",faqBadge:"الأسئلة الشائعة",faqTitle:"أسئلة عن الأسعار",closing:"مش متأكد من الخطة المناسبة؟",closingDesc:"ابدأ بالتجربة المجانية لمدة أسبوع واكتشف Partiva بنفسك.",trial:"ابدأ تجربتك المجانية",faq:"الأسئلة الشائعة"}:{badge:"Pricing",title:sections.main?.bodyEn?(sections.main?.titleEn||"Plans for every business size"):"Plans for every business size",description:sections.main?.bodyEn||"Choose the plan that fits your business.",currency:"Prices are in Saudi Riyals",contact:"Contact us",faqBadge:"Frequently asked questions",faqTitle:"Pricing questions",closing:"Not sure which plan is right?",closingDesc:"Start a free one-week trial.",trial:"Start free trial",faq:"FAQ"};return <>{sections.mainVisible&&<main dir={ar?"rtl":"ltr"} lang={locale} data-language-managed className="mx-auto max-w-6xl px-6 py-16">
  <RevealOnScroll variant="fade">
    <section className="text-center"><span className="inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">{copy.badge}</span><h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">{copy.title}</h1><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">{copy.description}</p><p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">{copy.currency}</p></section>
  </RevealOnScroll>
  <RevealOnScroll variant="scale" delay={0.1}>
    <section className="mt-12"><PricingCards plans={data.plans} ar={ar} /></section>
  </RevealOnScroll>
  {data.customContact&&<RevealOnScroll variant="up"><section className="mt-10 rounded-2xl bg-[#0a1229] px-8 py-8 text-white"><div className={`flex flex-col items-center justify-between gap-6 text-center md:flex-row ${ar?"md:text-right":"md:text-left"}`}><div><h2 className="text-xl font-bold">{(ar?data.customContact.titleAr:data.customContact.titleEn)||data.customContact.titleAr}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">{(ar?data.customContact.descriptionAr:data.customContact.descriptionEn)||data.customContact.descriptionAr}</p></div><Link href="/contact" className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0a1229]">{copy.contact}</Link></div></section></RevealOnScroll>}
  <RevealOnScroll variant="up">
    <section className="mt-14"><div className="mb-6 text-center"><span className="text-sm font-semibold text-blue-600">{copy.faqBadge}</span><h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">{copy.faqTitle}</h2></div><FaqAccordion items={faq} categoryLabels={faqCategoryLabels}/></section>
  </RevealOnScroll>
  <RevealOnScroll variant="scale">
    <section className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center dark:border-neutral-800 dark:bg-neutral-900/60"><p className="text-lg font-semibold text-neutral-900 dark:text-white">{copy.closing}</p><p className="mt-2 text-sm text-neutral-500">{copy.closingDesc}</p><div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/register" className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white">{copy.trial}</Link><Link href="/faq" className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">{copy.faq}</Link></div></section>
  </RevealOnScroll>
</main>}{sections.extras.map(s=><GenericSection key={s.id} titleAr={s.titleAr} titleEn={s.titleEn} bodyAr={s.bodyAr} bodyEn={s.bodyEn}/>)}</>}
