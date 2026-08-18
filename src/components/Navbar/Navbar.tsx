"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageProvider/LanguageProvider";
import { useTheme } from "../ThemeProvider/ThemeProvider";

const navLinks = [
  {
    labelAr: "الرئيسية",
    labelEn: "Home",
    section: "",
    route: "/",
  },
  {
    labelAr: "المميزات",
    labelEn: "Features",
    section: "#features",
    route: "/features",
  },
  {
    labelAr: "كيف تعمل",
    labelEn: "How it works",
    section: "#how-it-works",
    route: "/how-it-works",
  },
  {
    labelAr: "الأسعار",
    labelEn: "Pricing",
    section: "#pricing",
    route: "/pricing",
  },
  {
    labelAr: "المقالات",
    labelEn: "Articles",
    section: "/articles",
    route: "/articles",
  },
  {
    labelAr: "من نحن",
    labelEn: "About us",
    section: "/about",
    route: "/about",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { locale, toggleLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isArabic = locale === "ar";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathname === "/";

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu with Escape
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const copy = isArabic
    ? {
        login: "تسجيل الدخول",
        register: "ابدأ الآن مجانًا",
      }
    : {
        login: "Log in",
        register: "Start free",
      };

  return (
    <header
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      data-language-managed
      className={`
        sticky top-0 z-50
        transition-all duration-300
        ${
          isScrolled
            ? "bg-slate-400 shadow-md dark:bg-slate-600"
            : "bg-white shadow-sm dark:bg-slate-700"
        }
      `}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
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

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-4 md:flex lg:gap-6">
          {navLinks.map((link) => {
            const href =
              link.route === "/"
                ? "/"
                : isHome
                  ? link.section
                  : link.route;

            return (
              <Link
                key={link.route}
                href={href}
                className="
                  text-sm font-medium
                  text-slate-700
                  transition-colors
                  hover:text-blue-600
                  dark:text-slate-300
                  dark:hover:text-blue-400
                "
              >
                {isArabic ? link.labelAr : link.labelEn}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            title={theme === "dark" ? "Light" : "Dark"}
            className={`
              flex h-9 w-9 items-center justify-center
              rounded-lg border transition-colors
              ${
                isScrolled
                  ? "border-blue-200 text-slate-700 hover:bg-blue-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  : "border-gray-200 text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              }
            `}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* Language */}
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={
              locale === "ar"
                ? "Switch to English"
                : "التبديل إلى العربية"
            }
            title={locale === "ar" ? "English" : "العربية"}
            className={`
              flex h-9 w-9 items-center justify-center
              rounded-lg border transition-colors
              ${
                isScrolled
                  ? "border-blue-200 text-slate-700 hover:bg-blue-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  : "border-gray-200 text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              }
            `}
          >
            <span className="text-sm font-semibold uppercase">
              {locale === "ar" ? "AR" : "EN"}
            </span>
          </button>

          {/* Login */}
          <Link
            href="/login"
            className={`
              hidden rounded-lg border px-4 py-2
              text-sm font-medium transition-colors md:block
              ${
                isScrolled
                  ? "border-blue-200 text-slate-700 hover:bg-blue-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  : "border-gray-200 text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              }
            `}
          >
            {copy.login}
          </Link>

          {/* Register */}
          <Link
            href="/register"
            className="
              hidden rounded-lg bg-blue-600
              px-4 py-2 text-sm font-semibold text-white
              transition-colors hover:bg-blue-700 md:block
            "
          >
            {copy.register}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            className={`
              flex h-9 w-9 items-center justify-center
              rounded-lg border transition-colors md:hidden
              ${
                isScrolled
                  ? "border-blue-200 text-slate-700 hover:bg-blue-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  : "border-gray-200 text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              }
            `}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="
                fixed inset-0 z-50 cursor-default
                bg-slate-950/60 backdrop-blur-sm md:hidden
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              className={`
                fixed inset-y-0 z-60
                flex w-[min(86vw,360px)]
                flex-col
                px-6 pb-7 pt-5
                shadow-2xl md:hidden
                ${
                  theme === "dark"
                    ? "bg-[#0d1733] text-white"
                    : "bg-white text-slate-900"
                }
                ${locale === "ar" ? "right-0" : "left-0"}
              `}
              initial={{
                x: locale === "ar" ? 380 : -380,
                opacity: 0.6,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: locale === "ar" ? 380 : -380,
                opacity: 0.6,
              }}
              transition={{
                type: "spring",
                stiffness: 360,
                damping: 34,
              }}
              aria-label="Navigation menu"
            >
              {/* Mobile Header */}
              <div
                className={`
                  flex items-center justify-between
                  border-b pb-5
                  ${
                    theme === "dark"
                      ? "border-white/10"
                      : "border-slate-200"
                  }
                `}
              >
                <Image
                  src="/images/logo.png"
                  alt="Partiva"
                  width={120}
                  height={40}
                />

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className={`
                    flex h-9 w-9 items-center justify-center
                    rounded-lg transition-colors
                    ${
                      theme === "dark"
                        ? "bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }
                  `}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((link, index) => {
                  const href =
                    link.route === "/"
                      ? "/"
                      : isHome
                        ? link.section
                        : link.route;

                  return (
                    <motion.div
                      key={link.route}
                      initial={{
                        opacity: 0,
                        x: locale === "ar" ? 18 : -18,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.08 + index * 0.045,
                      }}
                    >
                      <Link
                        href={href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`
                          block rounded-xl px-4 py-3
                          text-base font-medium
                          transition-colors
                          ${
                            theme === "dark"
                              ? "text-gray-200 hover:bg-white/8 hover:text-white"
                              : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                          }
                        `}
                      >
                        {isArabic ? link.labelAr : link.labelEn}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile Actions */}
              <div
                className={`
                  mt-auto space-y-3
                  border-t pt-5
                  ${
                    theme === "dark"
                      ? "border-white/10"
                      : "border-slate-200"
                  }
                `}
              >
                {/* Login */}
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    block rounded-xl border
                    px-4 py-3 text-center text-sm font-semibold
                    transition-colors
                    ${
                      theme === "dark"
                        ? "border-white/15 text-gray-100 hover:bg-white/5"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }
                  `}
                >
                  {copy.login}
                </Link>

                {/* Register */}
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="
                    block rounded-xl bg-blue-600
                    px-4 py-3 text-center text-sm font-semibold
                    text-white transition-colors hover:bg-blue-700
                  "
                >
                  {copy.register}
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}