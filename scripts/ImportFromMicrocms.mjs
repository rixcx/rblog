
import { createClient } from 'microcms-js-sdk';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import fs from 'fs/promises';
import path from 'path';

const client = createClient({
  serviceDomain: '',
  apiKey: '',
});

const nodeHtmlMarkdown = new NodeHtmlMarkdown();

async function main() {
  const data = await client.get({ endpoint: 'blog',queries: { limit: 20 }});

  const dir = path.join(process.cwd(), 'microcms');
  await fs.mkdir(dir, { recursive: true });

  for (const post of data.contents) {
    const md = `---
title: "${post.title}"
date: "${post.date}"
---

${nodeHtmlMarkdown.translate(post.body)}
`;

    const filePath = path.join(dir, `${post.url}.md`);
    await fs.writeFile(filePath, md);
  }
}

main();