import { cookies } from "next/headers";
import ArticlesList from "@/src/components/ArticlesComponents/ArticlesList";
import { fetchAllArticles } from "@/src/app/lib/articlesApi";
import { fetchPages } from "@/src/app/lib/pagesApi";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("partiva-locale")?.value === "en" ? "en" : "ar";
  const title = locale === "ar" ? "المقالات | Partiva" : "Articles | Partiva";
  const description =
    locale === "ar"
      ? "أدلة عملية ونصائح بسيطة لتنظيم المخزون والمبيعات والعملاء في مكان واحد."
      : "Clear guides for organizing inventory, sales, and customers in one place.";
  return {
    title,
    description,
    alternates: { canonical: "/articles" },
    openGraph: { title, description },
  };
}

export default async function ArticlesPage() {
  const articles = await fetchAllArticles();
  const pages = await fetchPages();
  const main = pages.find((p) => p.slug === "articles")?.sections.find((s) => s.key === "main") ?? null;
  return <ArticlesList articles={articles} override={main ? { titleAr: main.titleAr, titleEn: main.titleEn, bodyAr: main.bodyAr, bodyEn: main.bodyEn } : null} />;
}
