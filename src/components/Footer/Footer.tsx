"use client";

import { Mail, MapPin } from "lucide-react";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
  FaGlobe,
} from "react-icons/fa";
import { LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import type { BackendContactInfo } from "@/src/app/lib/contactApi";

const API = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

const linkColumns = [
  {
    titleAr: "المنتج",
    titleEn: "Product",
    links: [
      { labelAr: "المميزات", labelEn: "Features", href: "/features" },
      { labelAr: "الأسعار", labelEn: "Pricing", href: "/pricing" },
      { labelAr: "الاسئلة", labelEn: "questions", href: "/faq" },
    ],
  },
  {
    titleAr: "الشركة",
    titleEn: "Company",
    links: [
      { labelAr: "من نحن", labelEn: "About us", href: "/about" },
      { labelAr: "المدونة", labelEn: "Blog", href: "/articles" },
      { labelAr: "اتصل بنا", labelEn: "Contact us", href: "/contact" },
    ],
  },
  {
    titleAr: "الدعم",
    titleEn: "Support",
    links: [
      { labelAr: "مركز المساعدة", labelEn: "Help center", href: "/help" },
      { labelAr: "الدعم الفني", labelEn: "Technical support", href: "/support" },
      { labelAr: "سياسة الخصوصية", labelEn: "Privacy policy", href: "/privacy" },
      { labelAr: "الشروط والأحكام", labelEn: "Terms & conditions", href: "/terms" },
    ],
  },
];

// Icon per platform name (as stored in the Dashboard's social links list) --
// unrecognized platform names fall back to a generic link icon so a new
// entry never disappears from the Footer.
const SOCIAL_ICONS: Record<string, typeof FaLinkedin> = {
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  x: FaTwitter,
  youtube: FaYoutube,
  facebook: FaFacebook,
};

function slugOf(href: string): string {
  return href === "/" ? "home" : href.replace(/^\//, "");
}

export default function Footer({
  contact,
  visibleNavSlugs: initialVisibleNavSlugs,
  logo,
}: {
  contact: BackendContactInfo;
  visibleNavSlugs: string[];
  logo: { src: string; altAr: string; altEn: string } | null;
}) {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const pathname = usePathname();
  const logoSrc = logo?.src ?? "/images/logo.png";
  const logoAlt = (isArabic ? logo?.altAr : logo?.altEn) || logo?.altAr || "Partiva";

  // Server-rendered initial value for a correct first paint, refreshed on
  // every client-side navigation below -- the root layout that renders this
  // component is preserved (not re-rendered) by Next.js across same-layout
  // navigations, so the server-fetched prop alone would otherwise go stale.
  const [visibleNavSlugs, setVisibleNavSlugs] = useState(initialVisibleNavSlugs);
  // Each page's own Dashboard-editable title overrides that link's label,
  // so an admin can rename a footer link from Pages -> [page] -> title
  // without a separate "footer label" field.
  const [pageTitles, setPageTitles] = useState<Record<string, { titleAr: string; titleEn: string | null }>>({});
  // The footer tagline reuses Home's hero eyebrow/badge (same source as
  // HeroSection's own eyebrow) so editing it once from Pages -> Home -> hero
  // updates both places consistently.
  const [heroBadge, setHeroBadge] = useState<{ badgeAr: string | null; badgeEn: string | null } | null>(null);
  useEffect(() => {
    fetch(`${API}/api/pages`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => {
        if (!r?.success) return;
        setVisibleNavSlugs(r.data.filter((p: { showInNav: boolean }) => p.showInNav).map((p: { slug: string }) => p.slug));
        setPageTitles(Object.fromEntries(r.data.map((p: { slug: string; titleAr: string; titleEn: string | null }) => [p.slug, { titleAr: p.titleAr, titleEn: p.titleEn }])));
        type Section = { key: string; badgeAr: string | null; badgeEn: string | null };
        const hero = r.data.find((p: { slug: string }) => p.slug === "home")?.sections.find((s: Section) => s.key === "hero");
        setHeroBadge(hero ? { badgeAr: hero.badgeAr, badgeEn: hero.badgeEn } : null);
      })
      .catch(() => {});
  }, [pathname]);
  const labelFor = (link: { labelAr: string; labelEn: string; href: string }) => {
    const page = pageTitles[slugOf(link.href)];
    return (isArabic ? page?.titleAr : page?.titleEn) || (isArabic ? link.labelAr : link.labelEn);
  };

  // Route visibility is managed from the Dashboard's Pages section -- a
  // column disappears entirely once none of its links are still visible.
  const visibleColumns = linkColumns
    .map((col) => ({ ...col, links: col.links.filter((l) => visibleNavSlugs.includes(slugOf(l.href))) }))
    .filter((col) => col.links.length > 0);

  const loadFeatures = () =>
    import("../RevealOnScroll/motion-features").then(
      (module) => module.default,
    );

  const copy = isArabic
    ? {
        contactHeading: "تواصل معنا",
        taglineLine1: "منصة متكاملة لإدارة أعمال قطع الغيار",
        taglineLine2: "مصممة لمساعدتك على النمو والنجاح",
        rights: "© 2025 Partiva. جميع الحقوق محفوظة",
        credit: "تصميم وتطوير ZYNTRA LTD",
      }
    : {
        contactHeading: "Contact us",
        taglineLine1: "A complete platform for managing auto-parts businesses",
        taglineLine2: "Designed to help you grow and succeed",
        rights: "© 2025 Partiva. All rights reserved",
        credit: "Designed & developed by ZYNTRA LTD",
      };

  const tagline = (isArabic ? heroBadge?.badgeAr : heroBadge?.badgeEn) || copy.taglineLine1;
  const address = (isArabic ? contact.addressAr : contact.addressEn || contact.addressAr) ?? "";
  const whatsappNumber = contact.whatsappNumber ?? "";
  const whatsappLink = contact.whatsappLink ?? "#";
  const websiteUrl = contact.websiteUrl ?? "#";

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.footer
        dir={isArabic ? "rtl" : "ltr"}
        className="bg-[#0a1229] pt-16"
        lang={locale}
        data-language-managed
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-5">
            {/* Contact */}
            <m.div
              className="sm:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.45 }}
            >
              <h4 className="mb-4 font-bold text-white">{copy.contactHeading}</h4>

              <ul className="space-y-3 text-sm text-gray-400">
                {/* WhatsApp */}
                {whatsappNumber && (
                  <li className="flex items-center justify-end gap-2">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 transition-colors hover:text-white"
                    >
                      <span dir="ltr">{whatsappNumber}</span>
                      <FaWhatsapp className="h-4 w-5 text-blue-500" />
                    </a>
                  </li>
                )}

                {/* Website */}
                {contact.websiteUrl && (
                  <li className="flex items-center justify-end gap-2">
                    <a
                      href={`mailto:${websiteUrl}`}
                      dir="ltr"
                      className="transition-colors hover:text-blue-400"
                    >
                      {contact.websiteUrl}
                    </a>

                    <Mail className="h-4 w-4 shrink-0 text-blue-500" />
                  </li>
                )}

                {/* Location */}
                {address && (
                  <li className="flex items-center justify-end gap-2 text-right">
                    <span>{address}</span>
                    <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
                  </li>
                )}
              </ul>
            </m.div>

            {/* Link Columns */}
            {visibleColumns.map((col, index) => (
              <m.div
                key={col.titleEn}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.18 + index * 0.09,
                  duration: 0.45,
                }}
              >
                <h4 className="mb-4 font-bold text-white">
                  {isArabic ? col.titleAr : col.titleEn}
                </h4>

                <ul className="space-y-3 text-sm text-gray-400">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-white"
                      >
                        {labelFor(link)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </m.div>
            ))}

            {/* Brand */}
            <m.div
              className="sm:col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.48, duration: 0.45 }}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <img src={logoSrc} alt={logoAlt} width={120} height={40} className="h-14 w-auto" />
              </Link>

              <p className="mb-5 text-right text-sm leading-relaxed text-gray-400 lg:text-left">
                {tagline}
                <br />
                {copy.taglineLine2}
              </p>

              {/* Social Media */}
              <div className="flex justify-end gap-3 lg:justify-start">
                {contact.social.map(({ id, platform, url }) => {
                  const Icon = SOCIAL_ICONS[platform.trim().toLowerCase()] ?? FaGlobe;
                  const href = url || "#";
                  return (
                    <m.a
                      key={id}
                      href={href}
                      target={href !== "#" ? "_blank" : undefined}
                      rel={href !== "#" ? "noopener noreferrer" : undefined}
                      aria-label={platform}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-300 transition-colors hover:bg-blue-600 hover:text-white"
                      whileHover={{ y: -3, scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <Icon className="h-4 w-4" />
                    </m.a>
                  );
                })}
              </div>
            </m.div>
          </div>

          {/* Bottom bar */}
          <m.div
            className="border-t border-white/10 py-6 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.58, duration: 0.4 }}
          >
            {copy.rights}
          </m.div>
        </div>
        <a
  href="https://zyntra.ltd/en/"
  target="_blank"
  rel="noopener noreferrer"
  className="block py-6 text-center text-sm"
>
  <div className="credit-neon mb-4 inline-block">{copy.credit}</div>
</a>
      </m.footer>
    </LazyMotion>
  );
}
