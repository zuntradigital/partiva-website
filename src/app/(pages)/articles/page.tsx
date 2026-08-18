import ArticlesList from "@/src/components/ArticlesComponents/ArticlesList";
import { articles } from "../../data/articles";


export const metadata = {
  title: "المقالات | Partiva",
};

export default function ArticlesPage() {
  return <ArticlesList articles={articles} />;
}
