import { getArticleContent } from "@/libs/remark";
import { formatDate } from "@/utils/date";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleContent(slug);

  return (
    <article className="">
      <header className="mb-20">
        <h1 className="text-5xl font-bold mb-2">{article.title}</h1>
        <data className="inline-block font-playfair text-md transform scale-y-80">{formatDate(article.date)}</data>
      </header>
      <div>{article.content}</div>
    </article>
  );
}
