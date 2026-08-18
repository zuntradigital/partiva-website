"use client";

import { Package, ShoppingCart, Users, BarChart3, Settings, Smartphone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as m from "motion/react-m";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

type Feature = {
  icon: React.ElementType;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

const features: Feature[] = [
  {
    icon: Package,
    titleAr: "إدارة المخزون",
    titleEn: "Inventory management",
    descriptionAr: "تتبع فريقك للمخزون مع تنبيهات ذكية للمخزون المنخفض وإدارة متعددة المستودعات",
    descriptionEn: "Track inventory with low-stock alerts and multi-warehouse management.",
  },
  {
    icon: ShoppingCart,
    titleAr: "إدارة المبيعات والمشتريات",
    titleEn: "Sales & purchasing",
    descriptionAr: "إدارة كاملة للعملية من الطلب حتى الفاتورة مع تقارير دقيقة وتحليلات متقدمة",
    descriptionEn: "Manage the whole process from order to invoice with accurate reports and analytics.",
  },
  {
    icon: Users,
    titleAr: "إدارة العملاء والموردين",
    titleEn: "Customers & suppliers",
    descriptionAr: "قاعدة بيانات متكاملة تجمع العملاء والموردين مع سجل كامل للمعاملات والتواصل",
    descriptionEn: "A complete customer and supplier database with a full transaction history.",
  },
  {
    icon: BarChart3,
    titleAr: "التقارير والتحليلات",
    titleEn: "Reports & analytics",
    descriptionAr: "تقارير شاملة تساعدك على اتخاذ قرارات أفضل وتنمية أعمالك",
    descriptionEn: "Clear reports that help you make better decisions and grow.",
  },
  {
    icon: Settings,
    titleAr: "صلاحيات مرنة",
    titleEn: "Flexible permissions",
    descriptionAr: "إدارة المستخدمين والصلاحيات بيئة لضمان أمان بيانات عملك",
    descriptionEn: "Manage users and permissions to keep your business data secure.",
  },
  {
    icon: Smartphone,
    titleAr: "متوافق مع جميع الأجهزة",
    titleEn: "Works on every device",
    descriptionAr: "استخدم Partiva من أي مكان وفي أي وقت عبر الجوال أو الكمبيوتر",
    descriptionEn: "Use Partiva anywhere, anytime, on mobile or desktop.",
  },
];

export default function FeaturesSection() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const copy = isArabic
    ? { badge: "المميزات", title: "كل ما تحتاجه لإدارة عملك بكفاءة", more: "اعرف المزيد" }
    : { badge: "Features", title: "Everything you need to run your business efficiently", more: "Learn more" };

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="bg-gray-50 py-20 dark:bg-slate-900" lang={locale} data-language-managed>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <m.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{copy.badge}</span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            {copy.title}
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-blue-600" />
        </m.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, titleAr, titleEn, descriptionAr, descriptionEn }, index) => (
            <m.div
              key={titleEn}
              className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md dark:bg-slate-800 dark:ring-slate-700"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
              </div>

              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{isArabic ? titleAr : titleEn}</h3>

              <p className="mb-5 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                {isArabic ? descriptionAr : descriptionEn}
              </p>

              <Link
                href="/features"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {copy.more}
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
