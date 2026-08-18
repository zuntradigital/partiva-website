import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import type { Article } from "@/src/app/types/article";
import ArticleContent from "./ArticleContent";
import CoverWatermark from "./CoverWatermark";

export default function ArticleDetails({ article }: { article: Article }) {
  const isArabic = article.language === "ar";
  const publishedDate = new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(article.publishedAt));
  const copy = isArabic ? { back: "العودة إلى المقالات", minutes: "دقائق قراءة" } : { back: "Back to articles", minutes: "min read" };

  return (
    <main dir={isArabic ? "rtl" : "ltr"} data-language-managed className="bg-white px-5 py-10 sm:px-8 sm:py-14 dark:bg-slate-950">
      <article className="mx-auto max-w-4xl">
        <Link href="/articles" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"><ArrowRight className={`h-4 w-4 ${isArabic ? "" : "rotate-180"}`} aria-hidden="true" />{copy.back}</Link>
        <header className="mt-8 text-center">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">{article.category}</span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-slate-950 sm:text-5xl dark:text-white">{article.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />{publishedDate}</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />{article.readMinutes} {copy.minutes}</span>
          </div>
        </header>
        <div className="relative mt-10 aspect-16/8 overflow-hidden rounded-3xl bg-slate-100 shadow-xl shadow-blue-950/10 dark:bg-slate-800">
          <Image src={article.cover.src} alt={article.cover.alt} fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
          <CoverWatermark className="absolute bottom-4 right-4 h-8 w-auto" />
        </div>
        <div className="article-prose mx-auto mt-12 max-w-3xl text-slate-700 dark:text-slate-300"><ArticleContent blocks={article.content} /></div>
      </article>
    </main>
  );
}
