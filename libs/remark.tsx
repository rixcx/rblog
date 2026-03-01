import "server-only";

import React from "react";
import * as runtime from "react/jsx-runtime";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
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

const ARTICLES_DIR = path.join(process.cwd(), "app", "articles", "mds");
const DATE_PREFIX_REGEX = /^\d{2}-\d{2}-\d{2}_/;

function getMarkdownFilePath(slug: string): string {
  const files = fs.readdirSync(ARTICLES_DIR);
  const file = files.find((f) => f.replace(DATE_PREFIX_REGEX, "") === `${slug}.md`);
  return path.join(ARTICLES_DIR, file || "");
}

function readAndParseMarkdownFile(slug: string) {
  const fullPath = getMarkdownFilePath(slug);
  const fileContent = fs.readFileSync(fullPath, "utf8");
  return matter(fileContent);
}

async function markdownToReact(content: string) {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: "everforest-dark",
    })
    .use(rehypeReact, {
      ...runtime,
      components: {
        h1: MDX.H1,
        h2: MDX.H2,
        h3: MDX.H3,
        h4: MDX.H4,
        h5: MDX.H5,
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
  return fs.readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .reverse()
    .map((file) => {
      const slug = file.replace(".md", "").replace(DATE_PREFIX_REGEX, "");
      const { data } = readAndParseMarkdownFile(slug);
      return { slug, ...data } as ArticleMeta;
    });
}

export async function getArticleContent(slug: string): Promise<ArticleContent> {
  const { data, content } = readAndParseMarkdownFile(slug);
  const reactContent = await markdownToReact(content);

  return { ...data, content: reactContent } as ArticleContent;
}
