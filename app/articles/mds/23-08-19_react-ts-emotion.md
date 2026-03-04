---
title: "React × Typescript × Emotion を試してみる"
date: "2023-08-19T15:00:00.000Z"
---

React（Typescript）プロジェクト作成〜コンポーネント作成〜Emotionの導入〜リセットCSSの導入〜CSSの適用まで。  

# React（Typescript）プロジェクト作成

ターミナルで任意のフォルダに移動、`$create-react-app`でプロジェクトを作成。  
`--template typescript`はTypescriptを使う場合のオプション指定。  
そこそこ時間がかかります。
```bash
$ npx create-react-app react_app --template typescript
```

  
## プロジェクトの実行

ターミナルでプロジェクト直下に移動し、下記コマンドを叩く。  
http://localhost:3000/ でブラウザで見れるようになります。
```bash
$ npm start
```

##   

# コンポーネント作成

簡単にコンポーネントを作ります。  
※この部分はプロジェクトによって異なる＆初学者なので参考程度まで…  

## ディレクトリ構成の変更

componentディレクトリと各ファイルの作成をしていきます。
```text
src
└── components
    ├── Elements
    │   ├── ButtonLink
    │   │   └── ButtonLink.tsx
    │   └── index.ts
    └── Layout
        ├── MainLayout.tsx
        └── index.ts
```


###### /src/components/Elements/ButtonLink/ButtonLink.tsx
```tsx
type ButtonLinkProps = {
  href: string;
  target: string;
  rel: string;
  children?: React.ReactNode;
};

export const ButtonLink = (props: ButtonLinkProps) => {
  return (
    <a
      href={props.href}
      target={props.target}
      rel={props.target}
    >
      {props.children}
    </a>
  );
};
```

  
###### /src/components/Elements/index.ts
```tsx
/src/components/Elements/index.ts
```

###### /src/components/Layout/MainLayout.tsx
```tsx
import { ReactNode } from 'react';

type Props = {
  children: ReactNode
};

export const MainLayout = ({children}: Props) => {
  return (
		<div>
			{children}
		</div>
  );
};
```

###### /src/components/Layout/index.ts
```typescript
export * from './MainLayout';
```

## App.tsxの編集

適当にコンテンツを表示させておきます。

###### /src/App.tsx
```tsx
import React from 'react';
import { MainLayout } from './components/Layout';
import { ButtonLink } from './components/Elements';

function App() {
  return (
    <MainLayout>
        <div>
        <h1>Hello World!</h1>
        <p>React is a JavaScript library for building user interfaces.</p>
        <ul>
          <li>Declarative</li>
          <li>Component-Based</li>
          <li>Learn Once, Write Anywhere</li>
        </ul>
        <ButtonLink
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
         Learn React
         </ButtonLink>
        <ButtonLink
          href="https://react.dev/reference/react"
          target="_blank"
          rel="noopener noreferrer"
        >
         API Reference
         </ButtonLink>
      </div>
    </MainLayout>
  );
}

export default App;
```

  
# Emotionの導入

EmotionでCSSを適用させていきます。  

## Emotionとは

CSS in JSのライブラリのひとつ。  
（CSS in JSとは：JavascriptでCSSを書く考え方。JSのファイル内にCSSを一緒に書けるので、コンポーネント指向であるReactと相性が良い）  
CSS in JSとしてはStyled Componentsが主流なようですが、Emotionのほうが今までのHTML/CSSのような形にかけてわかりやすいなと思ったので、今回はこちらを選択。  

## インストールと初期設定

React用のコマンドでインストール。
```bash
$ npm install @emotion/react
```

  
使用するファイル上部でEmotionのcssコンポーネントをインポート。
```tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
```

  
Typescriptの場合はtsconfig.jsonに設定を追加する場合もあるらしい。なくても動いた。

###### tsconfig.json
```json
"jsx": "react-jsx",
"jsxImportSource": "@emotion/react"
```

  
## EmotionのリセットCSSの適用

リセットCSSに、[emotion-resetライブラリ](https://www.npmjs.com/package/emotion-reset)を使います。  
ライブラリをインストール。
```bash
$ npm install --save emotion-reset
```

  
index.tsxにEmotion Globalコンポーネントを使ってセット。  
bodyなど全体にかけたいcssもここで設定できます。

###### /src/index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/* ↓追加↓ */
/** @jsxImportSource @emotion/react */
import { Global, css } from "@emotion/react";
import emotionReset from "emotion-reset";

const globalStyle = css`
  ${emotionReset}

  body {
    background-color: #f3f3f3;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
  {/* ↓追加↓ */}
  <Global styles={globalStyle} />
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </>
);
```

  
# CSSの適用

基本的な使い方は、タグに`css={クラス名}`をつけ、`const クラス名 = cssプロパティ;`でスタイルを指定していきます。

###### /src/App.tsx
```tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
〜省略〜
function App() {
  return (
    <MainLayout>
      <div css={wrapper}>
        <h1 css={title}>Hello World!</h1>
        <p>React is a JavaScript library for building user interfaces.</p>
        <ul css={list}>
          <li>Declarative</li>
          <li>Component-Based</li>
          <li>Learn Once, Write Anywhere</li>
        </ul>
        <ButtonLink
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
         Learn React
         </ButtonLink>
        <ButtonLink
          href="https://react.dev/reference/react"
          target="_blank"
          rel="noopener noreferrer"
        >
         API Reference
         </ButtonLink>
      </div>
    </MainLayout>
  );
}

export default App;

const wrapper = css`
  padding: 30px 20px;
`;

const title = css`
  margin-bottom: .5em;
  font-size: 38px;
  font-weight: bold;
`;

const list = css`
  margin: 1em 0;
  padding: 0 1em;
  list-style-type: circle;

	 li + li {
	  margin-top: .3em;
	 }
`;
```

オブジェクトスタイルやインラインで書く方法もありますが、この書き方が一番CSSに近いので理解しやすいと思います。  
なお、バッククォート「｀」内の CSSは、VSCodeのプラグイン「vscode-styled-components」でシンタックスハイライトや予測変換がでるので便利。  

## コンポーネントへのCSSの適用

ButtonLinkコンポーネントについては、ButtonLink.tsxにまとめてCSSを記述してみます。  
コンポーネントからpropsで値を渡し、そこからCSSを当てる実装とします。  

###### /src/App.tsx
```tsx
<ButtonLink
 className="primary"//←追加
 href="https://reactjs.org"
 target="_blank"
 rel="noopener noreferrer"
>
Learn React
</ButtonLink>
<ButtonLink
 className="secondary"//←追加
 href="https://react.dev/reference/react"
 target="_blank"
 rel="noopener noreferrer"
>
API Reference
</ButtonLink>
```

  
###### /src/components/Elements/ButtonLink/ButtonLink.tsx
```tsx
/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from '@emotion/react'

type ButtonLinkProps = {
  className?: string;
  href: string;
  target: string;
  rel: string;
  children?: React.ReactNode;
};

const cssBase = css`
  padding: 15px 30px;
  border-radius: 30px;
  font-weight: bold;
  text-decoration: none;
  
  &:hover {
    opacity: .8;
  }
`;

const csspPimary = css`
  ${cssBase}
  color: #fff;
  background-color: #087ea4;
`;

const cssSecondary = css`
  ${cssBase}
  color: #262626;
  background-color: #d8dee0;
`;

type ListsProps = {
  [key: string]: SerializedStyles
};

const buttonStyleLists: ListsProps = {
  base: cssBase,
  primary: csspPimary,
  secondary: cssSecondary,
};

export const ButtonLink = (props: ButtonLinkProps) => {
  const className = buttonStyleLists[props.className || "base"];
  return (
      <a
        css={className}
        href={props.href}
        target={props.target}
        rel={props.target}
      >
        {props.children}
      </a>
  );
}
```

流れを追ってみます。  
ButtonLinkコンポーネントに`className="クラス名"`というpropsを追加。  
`(props: ButtonLinkProps)`でButtonLinkコンポーネントに渡されたpropsの型を`ButtonLinkProps`で指定。`type ButtonLinkProps`には追加した`className`の型定義を追加します。`?`はオプションで、`className=""`があってもなくてもいいことを意味します。  
`const className = buttonStyleLists[props.className || "base"];`で、渡された`props.className`に応じて、変数`className`に`cssBase`、`csspPimary`、`cssSecondary`のいずれかを入れます。  
`buttonStyleLists`は`ListsProps`を型定義としたオブジェクトです。例えば`className="primary"`が渡された場合、primaryをキーとして`csspPimary`を返します。classNameがなかった場合は`base`が入るので、baseをキーとして`cssBase`を返します。  
あとは`css={className}`により、それぞれ指定したcssが適用されます。  
  
`props.className`をそのまま`css={props.className}`とすればいいのでは？と最初は思いましたが、それだと動きませんでした。  
`props.className`で受け取っているのは、`ButtonLinkProps`でも定義している通りstring型。対してemotionで使用するのはSerializedStylesという型。そのためそれではうまく動きません。  
  
受け取る型を`className?: SerializedStyles;`とし、`className={csspPimary}`としても、`{csspPimary}`が見つからないなどと色々手間でした。（親側でインポートもしくはCSSを記述する必要がある）  
なので`buttonStyleLists[]`を通して、string型からSerializedStyles型に変換する方針としました。  
  
レイアウトの指定については、`App.tsx`でdivなどで囲んでcssを当てる形になるかなと思っています。
```tsx
<div css={buttons}>
  <ButtonLink
    className="primary"
    href="https://reactjs.org"
    target="_blank"
    rel="noopener noreferrer"
  >
  Learn React
  </ButtonLink>
  <ButtonLink
    className="secondary"
    href="https://react.dev/reference/react"
    target="_blank"
    rel="noopener noreferrer"
  >
  API Reference
  </ButtonLink>
</div>

const buttons = css`
  margin-top: 2em;

	 a + a {
	  margin-left: 1em;
	 }
`;
```

  
# 終わりに

コンポーネントでCSSも管理できるのがCSS in JSの利点、とのことでEmotionを使ってみましたが、HTML/CSSの書き方とそっくりに実装できるのでCSS in JSというものがどういうものか理解しやすかったと思います。  
  
ただ、デザインのベース＋そのバリエーションのCSSも同一のコンポーネントで管理できるような実装にしようとすると、少し遠回りな書き方になってしまったような気がします。（このあたりは自身のコンポーネント運用についての知見が無いため適切な実装ができていない気もしますが…）  
  
Styled Componentsのやり方だとコンポーネントの継承でうまくバリエーション分けができるのかなと思いました。  
ただやはり`css={クラス名}`の書き方が便利でわかりやすくていいですね。。  
  
  
# 参考サイト

<https://zenn.dev/kiriyama/articles/630b2547a6ac79>  
<https://emotion.sh/docs/introduction>  
<https://zenn.dev/yukiyohure/articles/32801c0c6bf147>  
<https://ralacode.com/blog/post/react-emotion/>  
