import { getArticleContent } from "@/libs/remark";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleContent(slug);

  return (
    <div className="prose lg:prose-xl mx-auto py-8">
      <h1>{article.title}</h1>
      <p className="">{article.date}</p>
      <div>{article.content}</div>
    </div>
  );
}
