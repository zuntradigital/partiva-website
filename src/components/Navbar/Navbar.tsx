"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    labelAr: "الحلول",
    labelEn: "Solutions",
    section: "/solutions",
    route: "/solutions",
  },
  {
    labelAr: "الشبكة التجارية",
    labelEn: "Business Network",
    section: "/business-network",
    route: "/business-network",
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
  {
    labelAr: "الأسئلة الشائعة",
    labelEn: "FAQ",
    section: "/faq",
    route: "/faq",
  },
];

function slugOf(route: string): string {
  return route === "/" ? "home" : route.replace(/^\//, "");
}

// A link is "active" on its own route and on any nested route beneath it
// (e.g. /articles/[slug] keeps "Articles" marked active), but never merely
// because its Home-page anchor href happens to match -- only the actual
// page route counts.
function isLinkActive(pathname: string, route: string): boolean {
  if (route === "/") return pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
}

const API = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

export default function Navbar({
  visibleNavSlugs: initialVisibleNavSlugs,
  logo,
}: {
  visibleNavSlugs: string[];
  logo: { src: string; altAr: string; altEn: string } | null;
}) {
  const logoSrc = logo?.src ?? "/images/logo.png";
  const pathname = usePathname();
  const { locale, toggleLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isArabic = locale === "ar";
  const logoAlt = (isArabic ? logo?.altAr : logo?.altEn) || logo?.altAr || "Partiva";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Server-rendered initial value for a correct first paint, refreshed on
  // every client-side navigation below -- the root layout that renders this
  // component is preserved (not re-rendered) by Next.js across same-layout
  // navigations, so the server-fetched prop alone would otherwise go stale.
  const [visibleNavSlugs, setVisibleNavSlugs] = useState(initialVisibleNavSlugs);
  // Each page's own Dashboard-editable title overrides that link's label,
  // so an admin can rename a nav item from Pages -> [page] -> title without
  // a separate "nav label" field.
  const [pageTitles, setPageTitles] = useState<Record<string, { titleAr: string; titleEn: string | null }>>({});

  // LiveContentSync's focus/visibility-triggered router.refresh() re-fetches
  // this prop from the server, but a useState's initial value is only ever
  // read once -- without this, that refresh silently never reached the
  // Navbar, so a Dashboard nav-visibility toggle only applied after a full
  // page reload.
  useEffect(() => {
    setVisibleNavSlugs(initialVisibleNavSlugs);
  }, [initialVisibleNavSlugs]);

  useEffect(() => {
    fetch(`${API}/api/pages`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((r) => {
        if (!r?.success) return;
        setVisibleNavSlugs(r.data.filter((p: { showInNav: boolean }) => p.showInNav).map((p: { slug: string }) => p.slug));
        setPageTitles(Object.fromEntries(r.data.map((p: { slug: string; titleAr: string; titleEn: string | null }) => [p.slug, { titleAr: p.titleAr, titleEn: p.titleEn }])));
      })
      .catch(() => {});
  }, [pathname]);

  const isHome = pathname === "/";
  const visibleLinks = navLinks.filter((link) => visibleNavSlugs.includes(slugOf(link.route)));
  const labelFor = (link: (typeof navLinks)[number]) => {
    const page = pageTitles[slugOf(link.route)];
    return (isArabic ? page?.titleAr : page?.titleEn) || (isArabic ? link.labelAr : link.labelEn);
  };

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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-700">
          <img src={logoSrc} alt={logoAlt} width={120} height={40} className="h-11 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden min-w-0 items-center gap-0.5 overflow-x-auto md:flex lg:gap-1">
          {visibleLinks.map((link) => {
            const href =
              link.route === "/"
                ? "/"
                : isHome
                  ? link.section
                  : link.route;
            const active = isLinkActive(pathname, link.route);

            return (
              <Link
                key={link.route}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`
                  nav-underline whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium
                  transition-colors
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-700
                  ${
                    active
                      ? "font-semibold text-blue-600 dark:text-blue-400"
                      : "text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                  }
                `}
              >
                {labelFor(link)}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
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
              rounded-full border transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-700
              ${
                isScrolled
                  ? "border-blue-200 text-slate-700 hover:bg-blue-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  : "border-gray-200 text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              }
            `}
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
            ) : (
              <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
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
              rounded-full border transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-700
              ${
                isScrolled
                  ? "border-blue-200 text-slate-700 hover:bg-blue-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  : "border-gray-200 text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              }
            `}
          >
            <span className="text-xs font-semibold uppercase">
              {locale === "ar" ? "AR" : "EN"}
            </span>
          </button>

          <span className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 md:block" aria-hidden="true" />

          {/* Login */}
          <Link
            href="/login"
            className={`
              hidden whitespace-nowrap rounded-full border px-4 py-2
              text-sm font-medium transition-colors md:block
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-700
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
              hidden whitespace-nowrap rounded-full bg-blue-600
              px-5 py-2 text-sm font-semibold text-white
              transition-colors hover:bg-blue-700 md:block
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-700
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
              rounded-full border transition-colors md:hidden
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-700
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
                overflow-y-auto overflow-x-hidden
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
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                  <img src={logoSrc} alt={logoAlt} width={120} height={40} className="h-11 w-auto" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className={`
                    flex h-9 w-9 items-center justify-center
                    rounded-full transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                    ${
                      theme === "dark"
                        ? "bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white focus-visible:ring-offset-[#0d1733]"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-offset-white"
                    }
                  `}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="mt-6 flex flex-col gap-1">
                {visibleLinks.map((link, index) => {
                  const href =
                    link.route === "/"
                      ? "/"
                      : isHome
                        ? link.section
                        : link.route;
                  const active = isLinkActive(pathname, link.route);

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
                        aria-current={active ? "page" : undefined}
                        className={`
                          block rounded-xl px-4 py-3
                          text-base font-medium
                          transition-colors
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                          ${
                            theme === "dark" ? "focus-visible:ring-offset-[#0d1733]" : "focus-visible:ring-offset-white"
                          }
                          ${
                            active
                              ? theme === "dark"
                                ? "bg-white/8 font-semibold text-blue-400"
                                : "bg-blue-50 font-semibold text-blue-600"
                              : theme === "dark"
                                ? "text-gray-200 hover:bg-white/8 hover:text-white"
                                : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                          }
                        `}
                      >
                        {labelFor(link)}
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
                    block rounded-full border
                    px-4 py-3 text-center text-sm font-semibold
                    transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                    ${
                      theme === "dark"
                        ? "border-white/15 text-gray-100 hover:bg-white/5 focus-visible:ring-offset-[#0d1733]"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:ring-offset-white"
                    }
                  `}
                >
                  {copy.login}
                </Link>

                {/* Register */}
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    block rounded-full bg-blue-600
                    px-4 py-3 text-center text-sm font-semibold
                    text-white transition-colors hover:bg-blue-700
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                    ${theme === "dark" ? "focus-visible:ring-offset-[#0d1733]" : "focus-visible:ring-offset-white"}
                  `}
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