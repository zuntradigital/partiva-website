import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";
import type { Article } from "@/src/app/types/article";
import CoverWatermark from "./CoverWatermark";

type Props = { article: Article; priority?: boolean };

export default function ArticleCard({ article, priority = false }: Props) {
  const isArabic = article.language === "ar";
  const copy = isArabic ? { minutes: "دقائق قراءة", read: "اقرء المقال", locale: "ar-EG" } : { minutes: "min read", read: "Read article", locale: "en-US" };
  return (
    <article dir={isArabic ? "rtl" : "ltr"} data-language-managed className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900">
      <Link href={`/articles/${article.slug}`} className="relative block aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800" aria-label={article.title}>
        <Image src={article.cover.src} alt={article.cover.alt} fill priority={priority} sizes="(min-width: 1280px) 31vw, (min-width: 640px) 46vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/45 via-transparent to-transparent" />
        <CoverWatermark className="absolute bottom-3 left-3 h-6 w-auto" />
        <span className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-blue-300">{article.category}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>{article.readMinutes} {copy.minutes}</span><span aria-hidden="true">•</span>
          <time dateTime={article.publishedAt}>{new Intl.DateTimeFormat(copy.locale, { year: "numeric", month: "long", day: "numeric" }).format(new Date(article.publishedAt))}</time>
        </div>
        <h2 className="text-xl font-bold leading-8 text-slate-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400"><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{article.excerpt}</p>
        <Link href={`/articles/${article.slug}`} className="mt-6 inline-flex items-center gap-2 self-start text-sm font-bold text-blue-700 transition-colors hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">{copy.read} <ArrowLeft className={`h-4 w-4 transition-transform ${isArabic ? "group-hover:-translate-x-1" : "rotate-180 group-hover:translate-x-1"}`} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
