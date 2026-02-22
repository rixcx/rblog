import Image from "next/image";
import Link from "next/link";
import { getAllArticlesMeta }  from "@/libs/remark";
import { formatDate } from "@/utils/date";

const articlesMeta = await getAllArticlesMeta();

export default function Index() {
  return (
    <>
      <ul>
      {articlesMeta.map((article) => (
        <li key={article.slug}>
          <Link href={`/articles/${article.slug}`} className="inline-block">
            <div className="py-4 flex flex-col">
              <h2 className="text-3xl font-bold link-underline inline-block">
                <span>
                  {article.title}
                </span>
              </h2>
              <data className="font-playfair text-[0.9rem] transform scale-y-80">{formatDate(article.date)}</data>
            </div>
          </Link>
        </li>
      ))}
      </ul>
    </>
  );
}
