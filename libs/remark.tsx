import React from "react";
import Image from "next/image";
import * as runtime from "react/jsx-runtime";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
};
export type ArticleContent = ArticleMeta & {
  content: React.ReactNode;
};

export function getAllArticlesMeta(): ArticleMeta[] {
  const dir = "app/articles/mds";
  const files = fs.readdirSync(dir);

  return files.map((file) => {
    const slug = file.replace(".md", "");
    const fullPath = `${dir}/${file}`;
    const fileContent = fs.readFileSync(fullPath, "utf8");
    
    // frontmatterを解析
    const { data } = matter(fileContent);

    return {
      slug,
      ...data,
    } as ArticleMeta;
  });
}


async function markdownToReact(content: string) {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeReact, {
      ...runtime,
      components: {
        img: ({ src = "", alt = "" }) => (
          <Image
            src={src}
            alt={alt}
            width={800}
            height={400}
            className="rounded-lg my-6"
          />
        ),
      },
    })
    .process(content);

  return processed.result;
}




export async function getArticleContent(slug: string): Promise<ArticleContent> {
  const dir = "app/articles/mds";
  const fullPath = `${dir}/${slug}.md`;
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // frontmatterとcontentを解析
  const { data, content } = matter(fileContents);

  // contentのMarkdownをReactコンポーネントに変換
  const reactContent = await markdownToReact(content);

  return {
    ...data,
    content: reactContent,
  } as ArticleContent;
}

