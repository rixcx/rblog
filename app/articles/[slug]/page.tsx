import { getArticleContent } from "@/libs/remark";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleContent(slug);

  return (
    <article className="">
      <header className="mb-20">
        <h1 className="text-5xl font-bold mb-2">{article.title}</h1>
        <data className="font-playfair text-md">{article.date}</data>
      </header>
      <div>{article.content}</div>
    </article>
  );
}
