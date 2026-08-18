"use client";

import { Mail, MapPin } from "lucide-react";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

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

const socials = [
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
  { icon: FaFacebook, href: "#", label: "Facebook" },
];

export default function Footer() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const loadFeatures = () =>
    import("../RevealOnScroll/motion-features").then(
      (module) => module.default,
    );

  const copy = isArabic
    ? {
        contactHeading: "تواصل معنا",
        location: "مركز قريش التجارى _ تقاطع طريق المدينه مع شارع قريش",
        taglineLine1: "منصة متكاملة لإدارة أعمال قطع الغيار",
        taglineLine2: "مصممة لمساعدتك على النمو والنجاح",
        rights: "© 2025 Partiva. جميع الحقوق محفوظة",
        credit: "تصميم وتطوير ZYNTRA LTD",
      }
    : {
        contactHeading: "Contact us",
        location: "مركز قريش التجارى _ تقاطع طريق المدينه مع شارع قريش",
        taglineLine1: "A complete platform for managing auto-parts businesses",
        taglineLine2: "Designed to help you grow and succeed",
        rights: "© 2025 Partiva. All rights reserved",
        credit: "Designed & developed by ZYNTRA LTD",
      };

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
          <div className="grid grid-cols-2 gap-10 pb-12 sm:grid-cols-3 lg:grid-cols-5">
            {/* Contact */}
            <m.div
              className="col-span-2 sm:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.45 }}
            >
              <h4 className="mb-4 font-bold text-white">{copy.contactHeading}</h4>

              <ul className="space-y-3 text-sm text-gray-400">
                {/* WhatsApp */}
                <li className="flex items-center justify-end gap-2">
                  <a
                    href="https://wa.me/966590843000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <span dir="ltr">+966 59 084 3000</span>
                    <FaWhatsapp className="h-4 w-5 text-blue-500" />
                  </a>
                </li>

                {/* Website */}
                <li className="flex items-center justify-end gap-2">
                  <a
                    href="https://partiva.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="transition-colors hover:text-blue-400"
                  >
                    https://partiva.tech/
                  </a>

                  <Mail className="h-4 w-4 shrink-0 text-blue-500" />
                </li>

                {/* Location */}
                <li className="flex items-center justify-end gap-2 text-right">
                  <span>{copy.location}</span>
                  <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
                </li>
              </ul>
            </m.div>

            {/* Link Columns */}
            {linkColumns.map((col, index) => (
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
                        {isArabic ? link.labelAr : link.labelEn}
                      </Link>
                    </li>
                  ))}
                </ul>
              </m.div>
            ))}

            {/* Brand */}
            <m.div
              className="col-span-2 sm:col-span-3 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.48, duration: 0.45 }}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="Partiva"
                  width={120}
                  height={40}
                  priority
                />
              </Link>

              <p className="mb-5 text-right text-sm leading-relaxed text-gray-400 lg:text-left">
                {copy.taglineLine1}
                <br />
                {copy.taglineLine2}
              </p>

              {/* Social Media */}
              <div className="flex justify-end gap-3 lg:justify-start">
                {socials.map(({ icon: Icon, href, label }) => (
                  <m.a
                    key={label}
                    href={href}
                    target={href !== "#" ? "_blank" : undefined}
                    rel={href !== "#" ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-300 transition-colors hover:bg-blue-600 hover:text-white"
                    whileHover={{ y: -3, scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <Icon className="h-4 w-4" />
                  </m.a>
                ))}
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
  className="transition-colors hover:text-blue-600 border-t border-white/10 py-6 text-center text-sm text-gray-500 "
>
  <div className="mb-4">{copy.credit}</div>
</a>
      </m.footer>
    </LazyMotion>
  );
}
