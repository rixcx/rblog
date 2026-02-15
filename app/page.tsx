import Image from "next/image";
import Link from "next/link";
import { getAllArticlesMeta }  from "@/libs/remark";

const articlesMeta = await getAllArticlesMeta();

export default function Index() {
  return (
    <div className="">
      <main className="">
        <h1 className="text-4xl font-bold">
          r.blog
        </h1>
        <ul className="border-t border-(--text-primary) mt-4">
        
        {articlesMeta.map((article) => (
          <li key={article.slug}>
            <Link href={`/articles/${article.slug}`} className="block border-b border-(--text-primary) py-4">
              <h2>{article.title}</h2>
              <data className="font-playfair">{article.date}</data>
            </Link>
          </li>
        ))}

        </ul>
      </main>
    </div>
  );
}
