"use client";

import { useMemo, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import type { Article } from "@/src/app/types/article";
import ArticleCard from "./ArticleCard";
import { useLanguage } from "../LanguageProvider/LanguageProvider";

const ARTICLES_PER_PAGE = 9;

export default function ArticlesList({ articles }: { articles: Article[] }) {
  const { locale } = useLanguage();
  const localizedArticles = useMemo(() => articles.filter((article) => article.language === locale), [articles, locale]);
  const allLabel = locale === "ar" ? "الكل" : "All";
  const categories = useMemo(() => [allLabel, ...Array.from(new Set(localizedArticles.map((article) => article.category)))], [allLabel, localizedArticles]);
  const [activeCategory, setActiveCategory] = useState(allLabel);
  const [page, setPage] = useState(1);
  const selectedCategory = categories.includes(activeCategory) ? activeCategory : allLabel;
  const visibleArticles = selectedCategory === allLabel ? localizedArticles : localizedArticles.filter((article) => article.category === selectedCategory);
  const totalPages = Math.max(1, Math.ceil(visibleArticles.length / ARTICLES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedArticles = visibleArticles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);
  const copy = locale === "ar"
    ? { badge: "مركز المعرفة", title: "مقالات تساعدكِ على إدارة أعمالك بذكاء", description: "أدلة عملية ونصائح بسيطة لتنظيم المخزون والمبيعات والعملاء في مكان واحد.", categories: "تصنيفات المقالات", list: "قائمة المقالات", empty: "لا توجد مقالات في هذا التصنيف حاليًا.", previous: "السابق", next: "التالي", pagination: "ترقيم صفحات المقالات" }
    : { badge: "Knowledge Center", title: "Practical insights to manage your business smarter", description: "Clear guides for organizing inventory, sales, and customers in one place.", categories: "Article categories", list: "Article list", empty: "There are no articles in this category yet.", previous: "Previous", next: "Next", pagination: "Article pagination" };

  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} data-language-managed className="min-h-[70vh] bg-linear-to-b from-blue-50/70 via-white to-white px-5 py-12 sm:px-8 sm:py-16 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"><BookOpen className="h-4 w-4" aria-hidden="true" />{copy.badge}</span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight text-slate-950 sm:text-5xl dark:text-white">{copy.title}</h1>
          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">{copy.description}</p>
        </header>
        <div className="mt-10 flex flex-wrap justify-center gap-2.5" aria-label={copy.categories}>
          {categories.map((category) => <button key={category} type="button" onClick={() => { setActiveCategory(category); setPage(1); }} className={`rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${selectedCategory === category ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-700 dark:hover:text-blue-400"}`}>{category}</button>)}
        </div>
        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label={copy.list}>
          {paginatedArticles.map((article, index) => <ArticleCard key={article.slug} article={article} priority={index < 3} />)}
        </section>
        {visibleArticles.length === 0 && <p className="py-16 text-center text-slate-500 dark:text-slate-400">{copy.empty}</p>}
        <nav
  className="mt-12 flex flex-wrap items-center justify-center gap-2"
  aria-label={copy.pagination}
>
  {/* Previous */}
  <button
    type="button"
    onClick={() => setPage((current) => Math.max(1, current - 1))}
    disabled={currentPage === 1}
    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:text-blue-400"
  >
    {locale === "ar" ? (
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
    ) : (
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
    )}

    {copy.previous}
  </button>

  {/* Page numbers */}
  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
    (pageNumber) => (
      <button
        key={pageNumber}
        type="button"
        onClick={() => setPage(pageNumber)}
        disabled={totalPages === 1}
        aria-current={
          currentPage === pageNumber ? "page" : undefined
        }
        className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-bold transition-colors ${
          currentPage === pageNumber
            ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-700 dark:hover:text-blue-400"
        } ${
          totalPages === 1
            ? "cursor-default"
            : ""
        }`}
      >
        {pageNumber}
      </button>
    )
  )}

  {/* Next */}
  <button
    type="button"
    onClick={() =>
      setPage((current) => Math.min(totalPages, current + 1))
    }
    disabled={currentPage === totalPages}
    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:text-blue-400"
  >
    {copy.next}

    {locale === "ar" ? (
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
    ) : (
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
    )}
  </button>
</nav>
      </div>
    </main>
  );
}
