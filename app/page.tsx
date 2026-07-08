import Link from "next/link";
import { getAllArticlesMeta } from "@/libs/remark";
import { formatDate } from "@/utils/date";
import styles from "@/app/styles/pages/home.module.css";

const articlesMeta = await getAllArticlesMeta();

export default function Index() {
  return (
    <>
      <ul className={styles.list}>
      {articlesMeta.map((article) => (
        <li key={article.slug}>
          <Link href={`/articles/${article.slug}`} className={styles.link}>
            <div className={styles.item}>
              <h2 className={styles.title}>
                <span>
                  {article.title}
                </span>
              </h2>
              <time className={styles.date}>{formatDate(article.date)}</time>
            </div>
          </Link>
        </li>
      ))}
      </ul>
    </>
  );
}
