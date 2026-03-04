---
title: "Next.js × docker-compose × microCMS × VercelでJAMstackブログを作る - カスタム編"
date: "2022-01-29T15:00:00.000Z"
---

前回までで作ったJAMstackブログをアップデートします。  
随時更新中…✍️  

# TOPページに必要な情報だけを取得

TOPページのソースを見ると、下部にそれぞれの記事の内容まで取得されています。  
記事が増えていくとソースが無限に長くなっていくので、必要な要素だけ取得するようにします。  
`index.js`の`getStaticProps`で、id、title、dateだけを取得するように設定します。  

###### index.js
```javascript
export const getStaticProps = async () => {
 const data = await client.get({ endpoint: "blog", queries: {fields: 'id,title,date'} });　//追加

 return {
  props: {
   blog: data.contents,
  },
 };
};
```

  
# 詳細ページのURLを任意のものに変える

詳細ページの末尾のURLは、microCMSの記事のコンテンツID（英数字混在）になっています。  
一応記事編集時にコンテンツIDを編集することで任意のURLにすることができますが、  
多分コンテンツIDはそのままでURLのフィールド作ってそこからURL書き換えすしたほうがいいと思う…  
力量及ばず  

# Google Analyticsを設置

執筆中…  
  
  
