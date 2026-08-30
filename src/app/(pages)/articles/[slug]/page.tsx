import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetails from "@/src/components/ArticlesComponents/ArticleDetails";
import { fetchArticleBySlug } from "@/src/app/lib/articlesApi";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return {};

  const { seo } = article;
  return {
    title: `${seo.title} | Partiva`,
    description: seo.description,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    robots: seo.robots === "noindex" ? "noindex" : "index, follow",
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: article.cover.src ? [article.cover.src] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleDetails article={article} />;
}
