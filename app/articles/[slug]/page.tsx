import { getArticleContent, getAllArticlesMeta } from "@/libs/remark";
import { formatDate } from "@/utils/date";
import "@/app/styles/mdx.css?${Date.now()}";

export async function generateStaticParams() {
  const articles = getAllArticlesMeta();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleContent(slug);

  return (
    <article>
      <div className="border-deco-x">
        <header className="border-deco-b">
          <div className="py-5 md:py-10 px-3 md:px-6.5">
            <h1 className="text-2xl md:text-4xl font-bold mb-0.75 md:mb-2">{article.title}</h1>
            <time className="inline-block font-playfair text-[0.8rem] md:text-md transform scale-y-80">{formatDate(article.date)}</time>
          </div>
          <span className="border-deco-joint-r"></span>
          <span className="border-deco-joint-l"></span>
        </header>

        <section className="pt-10 md:pt-15 px-3 md:px-6.5 pb-14">
          <div className="markdown-body">
            {article.content}
          </div>
        </section>
      </div>
    </article>
  );
}
