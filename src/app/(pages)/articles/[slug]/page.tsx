import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetails from "@/src/components/ArticlesComponents/ArticleDetails";
import { articles } from "@/src/app/data/articles";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return article ? { title: `${article.title} | Partiva`, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return <ArticleDetails article={article} />;
}
