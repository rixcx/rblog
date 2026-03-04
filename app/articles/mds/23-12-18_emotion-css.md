---
title: "EmotionのコンポーネントへのCSS当て方メモ (with React×Typescript)"
date: "2023-12-18T15:00:00.000Z"
---

CSS in JSはコンポーネント内で完結できるのが利点！ということは理解できたものの、コンポーネントに対してどのようにCSSを当てていくのか悩んだのでそのメモです。  
環境はEmotion（ストリングスタイル）とReact（Typescript）です。  

# 基本の当て方

###### Parent component
```tsx
function App() {
  return (
    <div>
        <Button>
            this is a button
        </Button>
    </div>
  );
}
```

  
###### Child component
```tsx
type ButtonProps = {
  children?: React.ReactNode;
};

export const Button = (props: ButtonProps) => {
  return (
      <div css={base}>
          {props.children}
      </div>
  );
};

const base = css`
  display: inline-block;
  padding: 15px 30px;
  border-radius: 30px;
  font-weight: bold;
  color: #fff;
  background-color: #087ea4;
`;
```

  
# バリエーションのあるコンポーネントへの当て方

例えばprimary、secondaryといった、基本のボタンから少し派生したデザインがある場合の書き方について（BEMでいうmodifier;button--alertみたいな）。とりあえず2種類メモ。  

## １）コンポーネントに渡されるpropsに基づいて当てるcssを変更する

※[過去の記事](https://rblog-and-rix.vercel.app/blog/gixkvm-0j)でpropsから当てるcssを変えるコードを書いていたが、こちらの書き方のほうがわかりやすいかも  

###### Parent component
```tsx
function App() {
  return (
    <div>
      <Button>
        his is a button
      </Button>
      //typeのpropsを追加
      <Button　type="primary">
        this is a primary　button
      </Button>
    </div>
  );
}
```

  
###### Child component
```tsx
type ButtonProps = {
  type?: string;
  children?: React.ReactNode;
};

export const Button = (props: ButtonProps) => {

  //props.typeをそのままindexの検索に使うことができないため、使える型に変換
  const type = (!props.type ? "base": props.type as keyof typeof styles);

  return (
    //typeの値でstyleを検索してcssを適用
    <div css={styles[type]}>
      {props.children}
    </div>
  );
};

//extend用ベースcss
const base = css`
  display: inline-block;
  padding: 15px 30px;
  border-radius: 30px;
  font-weight: bold;
  color: #fff;
  background-color: #087ea4;
  
  &:hover {
    opacity: .8;
  }
`;

const styles = {
  base: css`
    //baseのcssをextend
    ${base}
  `,

  primary: css`
    //baseのcssをextendして上書き
    ${base}
    background-color: #3e9979;
  `,
}
```

  
## ２）バリエーションの数だけコンポーネントを作成する

###### Parent component
```tsx
function App() {
  return (
     <div>
       <Button>
         this is a button
       </Button>
       <ButtonPrimary>
         this is a primary　button
       </ButtonPrimary>
     </div>
  );
}
```

  
###### Child component
```tsx
type ButtonProps = {
  children?: React.ReactNode;
};

export const Button = (props: ButtonProps) => {
  return (
    <div css={base}>
      {props.children}
    </div>
  );
};

//Buttonとは別のコンポーネントを作成する
export const ButtonPrimary = (props: ButtonProps) => {
  return (
    <div css={primary}>
      {props.children}
    </div>
  );
};

const base = css`
  display: inline-block;
  padding: 15px 30px;
  border-radius: 30px;
  font-weight: bold;
  color: #fff;
  background-color: #087ea4;
  
  &:hover {
    opacity: .8;
  }
`;

const primary = css`
  //baseのcssをextendして上書き
  ${base}
  background-color: #3e9979;
`
```

  
どちらがいいかは模索中…  

# 親コンポーネントから子コンポーネントへレイアウトCSSを当てる

ボタンが2つ並んで間にmarginを設けたいときなど、子コンポーネントにレイアウト用のCSSを当てたい場合。  
コンポーネント自体にレイアウトとしての余白を持たせるのはご法度なので、親コンポーネントでCSSを当てたい。  
過去の記事では、コンポーネントをdivなどで囲ってスタイリングのcssを当てるやり方をしていたが、Attaching Propsを使うことで親コンポーネントから指定ができる。  

###### Parent component
```tsx
function App() {
  return (
    <div>
      <Button　css={button}> //cssを追加
        this is a button
      </Button>
      <Button　css={button}> //cssを追加
        this is a　button
      </Button>
    </div>
  );
}

//レイアウト用CSS
const button = css`
  + div {
    margin-top: 20px;
  }
`
```

  
###### Child component
```tsx
type ButtonProps = {
  children?: React.ReactNode;
  className? : string; //追加
};

export const Button = (props: ButtonProps) => {
  return (
    <div css={base} className={props.className}> //追加
      {props.children}
    </div>
  );
};

const base = css`
  display: inline-block;
  padding: 15px 30px;
  border-radius: 30px;
  font-weight: bold;
  color: #fff;
  background-color: #087ea4;
  
  &:hover {
    opacity: .8;
  }
`;
```

  
`css={base}`と`className={props.className}`といった2つのcssの書き方が混在してしまっていることがネック…  
  
  
# 参考サイト

<https://emotion.sh/docs/best-practices>  
<https://qiita.com/xrxoxcxox/items/5a520eea36232d0337bc>  
<https://qiita.com/xrxoxcxox/items/69d70c187bff1ab2e443>  
<https://qiita.com/masash49/items/25e0bcdc837d260b634e>  
  
  
