import { getArticleContent } from "@/libs/remark";
import { formatDate } from "@/utils/date";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleContent(slug);

  return (
    <article className="">
      <div className="border-deco-x">
        <header className="border-deco-b">
          <div className="py-10 px-6.5">
            <h1 className="text-5xl font-bold mb-2">{article.title}</h1>
            <data className="inline-block font-playfair text-md transform scale-y-80">{formatDate(article.date)}</data>
          </div>
          <span className="border-deco-joint-r"></span>
          <span className="border-deco-joint-l"></span>
        </header>
        <div className="pt-10 px-6.5 pb-14">
          {article.content}
        </div>
      </div>
    </article>
  );
}
