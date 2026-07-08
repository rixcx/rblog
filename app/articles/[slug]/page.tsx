import { getArticleContent, getAllArticlesMeta } from "@/libs/remark";
import { formatDate } from "@/utils/date";
import styles from "@/app/styles/pages/article.module.css";

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
      <div className={styles.frame}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <h1 className={styles.title}>{article.title}</h1>
            <time className={styles.date}>{formatDate(article.date)}</time>
          </div>
          <span className={styles.jointRight}></span>
          <span className={styles.jointLeft}></span>
        </header>

        <section className={styles.body}>
          <div className="markdown-body">
            {article.content}
          </div>
        </section>
      </div>
    </article>
  );
}
