import { getArticleContent } from "@/libs/remark";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleContent(slug);

  return (
    <article className="prose lg:prose-xl mx-auto py-8">
      <header className="mb-20">
        <h1 className="text-5xl font-bold mb-2 pb-2">{article.title}</h1>
        <p><time>{article.date}</time></p>
      </header>
      <div>{article.content}</div>
    </article>
  );
}
