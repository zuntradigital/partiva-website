import type { FaqCategory } from "@/src/app/types/faq";

type BilingualFaqItem = {
  id: string;
  category: FaqCategory;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
};

// Categories map directly to PAGE-FAQ's stated purpose: "network opt-in,
// data isolation, review process" — plus the pricing-specific FAQ block
// that Section 7 (PAGE-PRICING row) also requires, factually bound to
// FR-0009/FR-0010 (tier changes allowed anytime; limits enforced
// immediately on change).
export const faqItemsBilingual: BilingualFaqItem[] = [
  {
    id: "network-optional",
    category: "network",
    questionAr: "هل لازم أنضم للشبكة التجارية؟",
    questionEn: "Do I have to join the trade network?",
    answerAr:
      "لا، الانضمام للشبكة اختياري تمامًا. تقدر تستخدم Partiva لإدارة نشاطك فقط بدون الانضمام لأي شبكة.",
    answerEn:
      "No. Joining the network is completely optional. You can use Partiva to manage your business without joining any network.",
  },
  {
    id: "data-isolation",
    category: "privacy",
    questionAr: "بيانات نشاطي هتبقى منفصلة عن التجار التانيين؟",
    questionEn: "Will my business data be separate from other traders?",
    answerAr:
      "أيوه، كل نشاط تجاري ليه بياناته الخاصة، ومفيش أي نشاط تاني يقدر يشوفها إلا لو انت فعّلت مشاركتها عبر الشبكة الاختيارية.",
    answerEn:
      "Yes. Every business has its own data, and no other business can see it unless you enable sharing through the optional network.",
  },
  {
    id: "review-process",
    category: "review",
    questionAr: "بيحصل إيه بعد ما أسجل؟",
    questionEn: "What happens after I register?",
    answerAr:
      "طلبك بيدخل في مراجعة قبل التفعيل، وهتوصلك رسالة على الإيميل بقرار الطلب — القبول أو الرفض.",
    answerEn:
      "Your request is reviewed before activation, and you will receive an email with the decision — approval or rejection.",
  },
  {
    id: "review-instant",
    category: "review",
    questionAr: "هل التفعيل بيكون فوري؟",
    questionEn: "Is activation immediate?",
    // WEB-FR-012 / BR-0003 — must not promise instant activation.
    answerAr: "لا، التسجيل يخضع للمراجعة أولًا ولا يمنح دخولًا فوريًا.",
    answerEn:
      "No. Registration is reviewed first and does not grant immediate access.",
  },
  {
    id: "plan-change",
    category: "pricing",
    questionAr: "أقدر أغيّر خطتي بعد التسجيل؟",
    questionEn: "Can I change my plan after registration?",
    // Must factually match FR-0009 — tier changes allowed anytime.
    answerAr: "أيوه، تقدر تغيّر خطتك في أي وقت.",
    answerEn: "Yes, you can change your plan at any time.",
  },
  {
    id: "plan-limits",
    category: "pricing",
    questionAr: "بيحصل إيه لو تعديت حدود خطتي؟",
    questionEn: "What happens if I exceed my plan limits?",
    // Must factually match FR-0010 / BR-0004 — limits enforced immediately.
    answerAr: "الحدود بتتطبّق فورًا مع أي تغيير في الخطة.",
    answerEn: "Limits are applied immediately whenever the plan changes.",
  },
];

export const categoryLabelsAr: Record<FaqCategory, string> = {
  network: "الشبكة التجارية",
  privacy: "الخصوصية والبيانات",
  review: "التسجيل والمراجعة",
  pricing: "الأسعار والخطط",
};

export const categoryLabelsEn: Record<FaqCategory, string> = {
  network: "Trade network",
  privacy: "Privacy & data",
  review: "Registration & review",
  pricing: "Pricing & plans",
};

// Resolves the bilingual source into the plain {question, answer} shape
// FaqAccordion / the FAQPage JSON-LD schema expect. Plain module (no
// "use client") so it can be called from the server (page.tsx, for the
// JSON-LD) and the client (FaqContent.tsx) alike — schema must match
// visible content (Section 11.3).
export function resolveFaqItems(locale: "ar" | "en") {
  return faqItemsBilingual.map((item) => ({
    id: item.id,
    category: item.category,
    question: locale === "ar" ? item.questionAr : item.questionEn,
    answer: locale === "ar" ? item.answerAr : item.answerEn,
  }));
}
