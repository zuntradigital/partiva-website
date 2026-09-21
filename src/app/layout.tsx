import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer"
import LanguageProvider from "../components/LanguageProvider/LanguageProvider";
import ThemeProvider from "../components/ThemeProvider/ThemeProvider";
import LiveContentSync from "../components/LiveContentSync/LiveContentSync";
import { fetchContactInfo } from "./lib/contactApi";
import { fetchPages } from "./lib/pagesApi";
import { fetchMedia, resolveMedia } from "./lib/mediaApi";
import { getRecaptchaSiteKey } from "./lib/recaptchaKey";
import { RecaptchaConfigProvider } from "../components/Recaptcha/RecaptchaConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Geist has no Arabic glyphs, so Arabic text was silently falling back to
// each browser's own default sans-serif this whole time (Tailwind's
// `font-sans` utility was never actually wired to the Geist variable
// either -- see globals.css). Cairo matches the Dashboard's own font choice
// for cross-product consistency.
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

// Hostinger's deployment replaces the previous build's /_next/static chunks
// in place (no old-build asset retention like Vercel), so a tab left open
// across a deploy -- or one that navigates right after -- can request a
// chunk hash that no longer exists, surfacing as a raw ChunkLoadError /
// "Failed to fetch dynamically imported module" instead of the new page.
// One automatic reload (guarded so it can't loop) fetches the current HTML,
// which references the current deployment's chunk hashes. Mirrors the same
// fix already shipped in partiva-dashboard's layout.tsx. Runs as a raw
// script (not a React effect) so it's active even if React fails to mount.
const CHUNK_ERROR_RELOAD_SCRIPT = `(function(){
var FLAG='partiva_chunk_reload_attempted';
function isChunkError(e){
  var msg=(e&&(e.message||(e.reason&&e.reason.message)))||'';
  var name=(e&&(e.name||(e.reason&&e.reason.name)))||'';
  return name==='ChunkLoadError'||/Loading chunk [\\w.-]+ failed/i.test(msg);
}
function handle(e){
  if(!isChunkError(e))return;
  try{
    if(sessionStorage.getItem(FLAG))return;
    sessionStorage.setItem(FLAG,'1');
  }catch(err){return;}
  location.reload();
}
window.addEventListener('error',handle);
window.addEventListener('unhandledrejection',handle);
})();`;

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
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: CHUNK_ERROR_RELOAD_SCRIPT }} />
      </head>

      {/* suppressHydrationWarning here only covers body's own attributes (not
          its subtree) -- needed because browser extensions like ColorZilla
          inject attributes such as cz-shortcut-listen directly onto <body>
          after the server render, which is a real, unavoidable server/client
          difference rather than an app rendering bug. */}
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider initialTheme={theme}>
          <LanguageProvider initialLocale={locale}>
            <RecaptchaConfigProvider siteKey={getRecaptchaSiteKey()}>
            <LiveContentSync />
            <Navbar visibleNavSlugs={visibleNavSlugs} logo={navbarLogo ? { src: navbarLogo.url, altAr: navbarLogo.altAr, altEn: navbarLogo.altEn } : null} />
            {children}
            <Footer contact={contact} visibleNavSlugs={visibleNavSlugs} logo={footerLogo ? { src: footerLogo.url, altAr: footerLogo.altAr, altEn: footerLogo.altEn } : null} />
            </RecaptchaConfigProvider>
          </LanguageProvider>
        </ThemeProvider>

        </body>

    </html>
  );
}
