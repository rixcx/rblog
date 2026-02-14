import "server-only";

import React from "react";
import * as runtime from "react/jsx-runtime";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import * as MDX from "@/components/mdx/Typography";

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
};
export type ArticleContent = ArticleMeta & {
  content: React.ReactNode;
};

// 定数とヘルパー関数
const ARTICLES_DIR = path.join(process.cwd(), "app", "articles", "mds");

function getMarkdownFilePath(slug: string): string {
  return path.join(ARTICLES_DIR, `${slug}.md`);
}

function readAndParseMarkdownFile(slug: string) {
  const fullPath = getMarkdownFilePath(slug);
  const fileContent = fs.readFileSync(fullPath, "utf8");
  return matter(fileContent);
}

async function markdownToReact(content: string) {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeReact, {
      ...runtime,
      components: {
        h1: MDX.H1,
        h2: MDX.H2,
        p: MDX.P,
        a: MDX.A,
        ul: MDX.Ul,
        ol: MDX.Ol,
        li: MDX.Li,
        code: MDX.Code,
        pre: MDX.Pre,
        blockquote: MDX.Blockquote,
        table: MDX.Table,
        th: MDX.Th,
        td: MDX.Td,
        hr: MDX.Hr,
        img: MDX.Img,
      },
    })
    .process(content);

  return processed.result;
}

export function getAllArticlesMeta(): ArticleMeta[] {
  const files = fs.readdirSync(ARTICLES_DIR);

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(".md", "");
      const { data } = readAndParseMarkdownFile(slug);

      return {
        slug,
        ...data,
      } as ArticleMeta;
    });
    
}

export async function getArticleContent(slug: string): Promise<ArticleContent> {
  const { data, content } = readAndParseMarkdownFile(slug);
  const reactContent = await markdownToReact(content);

  return {
    ...data,
    content: reactContent,
  } as ArticleContent;
}

