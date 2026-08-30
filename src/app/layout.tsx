import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer"
import LanguageProvider from "../components/LanguageProvider/LanguageProvider";
import ThemeProvider from "../components/ThemeProvider/ThemeProvider";
import LiveContentSync from "../components/LiveContentSync/LiveContentSync";
import { fetchContactInfo } from "./lib/contactApi";
import { fetchPages } from "./lib/pagesApi";
import { fetchMedia, resolveMedia } from "./lib/mediaApi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://partiva.tech"),
  title: "Partiva | One complete platform for managing auto-parts businesses",
  description:
    "Partiva helps you manage customers, inventory, purchasing, sales, and reports from one secure, integrated platform.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("partiva-locale")?.value;
  const locale = savedLocale === "en" ? "en" : "ar";

  const savedTheme = cookieStore.get("partiva-theme")?.value;
  const theme = savedTheme === "dark" ? "dark" : "light";

  const contact = await fetchContactInfo();
  const pages = await fetchPages();
  // Route visibility/nav-placement is managed from the Dashboard's Pages
  // section -- Navbar/Footer only ever list routes still marked visible.
  const visibleNavSlugs = pages.filter((p) => p.showInNav).map((p) => p.slug);

  // The site logo is Media-Library-managed (usage: route=null, section=
  // "navbar"/"footer") -- resolveMedia returns null if unmanaged/unreachable,
  // in which case Navbar/Footer fall back to their built-in default image.
  const media = await fetchMedia();
  const navbarLogo = resolveMedia(media, null, "navbar");
  const footerLogo = resolveMedia(media, null, "footer");

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
    >

      {/* suppressHydrationWarning here only covers body's own attributes (not
          its subtree) -- needed because browser extensions like ColorZilla
          inject attributes such as cz-shortcut-listen directly onto <body>
          after the server render, which is a real, unavoidable server/client
          difference rather than an app rendering bug. */}
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider initialTheme={theme}>
          <LanguageProvider initialLocale={locale}>
            <LiveContentSync />
            <Navbar visibleNavSlugs={visibleNavSlugs} logo={navbarLogo ? { src: navbarLogo.url, altAr: navbarLogo.altAr, altEn: navbarLogo.altEn } : null} />
            {children}
            <Footer contact={contact} visibleNavSlugs={visibleNavSlugs} logo={footerLogo ? { src: footerLogo.url, altAr: footerLogo.altAr, altEn: footerLogo.altEn } : null} />
          </LanguageProvider>
        </ThemeProvider>

        </body>

    </html>
  );
}
