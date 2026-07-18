import "server-only";

import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
import path from "path";

import React from "react";
import * as runtime from "react/jsx-runtime";
import type { Root, RootContent } from "hast";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeReact from "rehype-react";

import * as MDX from "@/libs/Typography";

/**
 * Types definitions for article metadata and article content
 */
export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
};
export type ArticleContent = ArticleMeta & {
  content: React.ReactNode;
};

/**
 * Directory and file name definitions for articles
 */
const ARTICLES_DIR = path.join(process.cwd(), "app", "articles", "mds");
const DATE_PREFIX_REGEX = /^\d{2}-\d{2}-\d{2}_/;

/**
 * Finds the corresponding markdown file
 */
function getMarkdownFilePath(slug: string): string {
  const files = fs.readdirSync(ARTICLES_DIR);
  const file = files.find((f) => f.replace(DATE_PREFIX_REGEX, "") === `${slug}.md`);
  return path.join(ARTICLES_DIR, file || "");
}

/**
 * Returns the raw content and metadata of a markdown file
 */
function readAndParseMarkdownFile(slug: string) {
  const fullPath = getMarkdownFilePath(slug);
  const fileContent = fs.readFileSync(fullPath, "utf8");
  return { ...matter(fileContent), fileName: path.basename(fullPath, ".md") };
}

/**
 * Generates an SVG string from Mermaid code
 */
function generateMermaidSvg(code: string, articleFolderName: string): string {
  const hash = crypto.createHash("md5").update(code).digest("hex");
  const articleImagesDir = path.join(process.cwd(), "public", "images", "articles", articleFolderName);
  const svgPath = path.join(articleImagesDir, `mermaid-${hash}.svg`);

  // Make directory if it doesn't exist
  if (!fs.existsSync(articleImagesDir)) {
    fs.mkdirSync(articleImagesDir, { recursive: true });
  }

  // Return the cached SVG if it exists
  if (fs.existsSync(svgPath)) {
    return fs.readFileSync(svgPath, "utf8");
  }

  // Create a temporary .mmd file for each Mermaid code block and save it to the article directory)
  const tmpMmd = path.join(articleImagesDir, `tmp-${hash}.mmd`);
  fs.writeFileSync(tmpMmd, code);

  try {
    // Generate the full path to the mmdc command instad of npx command
    const mmdc = path.join(process.cwd(), "node_modules", ".bin", "mmdc");

    // Execute mmdc to generate SVG from the .mmd file
    execSync(`${mmdc} -i ${tmpMmd} -o ${svgPath} --svgId m-${hash} -t neutral -p puppeteer-config.json`, {
      stdio: "pipe",
    });
    return fs.readFileSync(svgPath, "utf8");
  } catch (error: unknown) {
    const maybeError = error as { stderr?: { toString(): string }; message?: string };
    const stderr = maybeError.stderr?.toString() || "";
    const message = error instanceof Error ? error.message : maybeError.message || "Unknown error";
    console.error("Mermaid generation failed:", message, stderr);
    return `<div class="error">Mermaid generation failed: ${stderr || message}</div>`;
  } finally {
    if (fs.existsSync(tmpMmd)) fs.unlinkSync(tmpMmd);
  }
}

/**
 * Custom plugin to converts Mermaid code blocks into SVG.
 */
type HastNode = Root | RootContent;

const mermaidBlockToSvg = (articleFolderName: string) => (tree: Root) => {
  const visit = (node: HastNode) => {
    // Detect code blocks that <pre><code class="language-mermaid">...</code></pre>
    if (node.type === "element" && node.tagName === "pre") {
      const codeNode = node.children?.[0];
      if (codeNode?.type === "element" && codeNode.tagName === "code") {
        const className = codeNode.properties.className;
        const classList = Array.isArray(className)
          ? className.map(String)
          : typeof className === "string"
            ? className.split(/\s+/)
            : [];
        
        // Process only Mermaid code blocks
        if (classList.includes("language-mermaid")) {
          const rawCode = codeNode.children[0]?.type === "text" ? codeNode.children[0].value : "";
          // Generate SVG from Mermaid code 
          const svgContent = generateMermaidSvg(rawCode, articleFolderName);

          // Convert the node to div[data-mermaid] and store the SVG in properties
          node.tagName = "div";
          node.properties = {
            "data-mermaid": "true",
            "data-svg": svgContent,
          };
          node.children = [];
          return;
        }
      }
    }
    if ("children" in node) {
      node.children.forEach(visit);
    }
  };
  visit(tree);
};

/**
 * Converts markdown content to React nodes
 * applying some plugins
 */
async function markdownToReact(content: string, articleFolderName: string) {
  const processed = await remark()
    .use(remarkGfm)    // Plugin for GitHub Flavored Markdown
    .use(remarkBreaks) // Plugin to treat line breaks as <br>
    .use(remarkRehype) // Plugin to convert markdown to HTML
    .use(mermaidBlockToSvg, articleFolderName) // Custom plugin to handle Mermaid diagrams
    .use(rehypePrettyCode,  // Plugin for syntax highlighting
      {
        theme: "everforest-dark",
      })
    .use(rehypeReact,  // Plugin to convert HTML to React components
      {
        ...runtime,
        components: {  // Map HTML tags to custom React components
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
          // If it's a Mermaid block that div[data-mermaid], render the SVG directly
          div: ({
            "data-mermaid": isMermaid,
            "data-svg": svgContent,
            ...props
          }: React.ComponentPropsWithoutRef<"div"> & {
            "data-mermaid"?: string;
            "data-svg"?: string;
          }) => {
            if (isMermaid) {
              return (
                <div
                  className="mermaid-container"
                  dangerouslySetInnerHTML={{ __html: svgContent ?? "" }}
                />
              );
            }
            return <div {...props} />;
          },
        },
      })
    .process(content);

  return processed.result;
}

/**
 * Returns metadata for all articles (newest first).
 */
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

/**
 * Returns the content of a specific article as React nodes, along with its metadata.
 */
export async function getArticleContent(slug: string): Promise<ArticleContent> {
  const { data, content, fileName } = readAndParseMarkdownFile(slug);
  const reactContent = await markdownToReact(content, fileName);

  return { ...data, content: reactContent } as ArticleContent;
}
