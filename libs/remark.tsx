import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import remarkhtml from "remark-html";

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
};
export type ArticleContent = ArticleMeta & {
  contentHtml: string;
};

export function getAllArticlesMeta(): ArticleMeta[] {
  const dir = "app/articles/mds";
  const files = fs.readdirSync(dir);

  return files
    .map((file) => {
      const slug = file.replace(".md", "");
      const fullPath = `${dir}/${file}`;
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data } = matter(fileContents);

      return {
        slug,
        ...data,
      } as ArticleMeta;
    });
}


export async function getArticleContent(slug: string): Promise<ArticleContent> {
  const fullPath = `app/articles/mds/${slug}.md`;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const convertedContent = await remark()
    .use(remarkhtml)
    .process(content);

  const contentHtml = convertedContent.toString();

  return {
    ...data,
    contentHtml,
  } as ArticleContent;
}
