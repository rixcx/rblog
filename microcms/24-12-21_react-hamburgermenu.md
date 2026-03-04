---
title: "Reactで実装するハンバーガーメニュー"
date: "2024-12-21T15:00:00.000Z"
---

コーダー上がり・フロントエンド初心者が、Reactの機能はこうやって使えるのかーと学びを得たのでメモ。  

# やりたいこと

ハンバーガーメニューを作りたい。  
inputタグを使ってCSSで完結する方法もありますが、せっかくJavaScriptベースのライブラリ使っているなら活用していきたいと思った次第です。  
  
昔はよくあったのがJavaScriptやjQueryを使い、クリックイベントでclassを付与してopen状態を作るということ。  
それと似たような感じで、今回はReactのstateフックという機能を使い、open状態の管理や更新を行います。  

# **環境**

* Next.js 15.1.0
* React ^19.0.0
* CSS Modules ＋ Sass 1.83.0

  
# 実装

##### Hamburger-menu.tsx

```
import { useState } from 'react';
import styles from '@/src/app/styles/HamburgerMenu.module.scss';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(!open)
  };

  return (
    <>
      <div
          className={`${styles.hamburger} ${open ? styles.open : ''}`}
          onClick={toggleOpen}
      ></div>
    </>
  );
}
```

  
流れを見ていきます。  

```
import { useState } from 'react';
```

まず、useStateフックをReact からインポートします。  
  
```
 const [open, setOpen] = useState(false);
```

次にopen状態を管理するためのstate変数を宣言します。  
`open`はstate変数、`setOpen`はopenという変数を更新するための関数、`UseState(false)`はopenという変数にfalseを初期値として与えることを意味します。（const open = falseと同じような意味）  
  
一行で言うとこんな感じ。  
`const [stateの変数, stateを更新する関数] = useState(stateの初期値)`  
  
```
const toggleOpen = () => {
  setOpen(!open)
};
```

open変数のbool値を反転させる関数を作成します。  
stateを更新する関数であるsetOpen関数と、否定論理演算子「!」を使用します。これにより、関数が発火したときにはopenがfalseの場合はtrueに、trueの場合はfalseにセットされるようになります。  
  
```
<div
  className={`${styles.hamburger} ${open ? styles.open : ''}`}
  onClick={toggleOpen}
></div>
```

最後に、ボタンとなるHTMLにonClickイベントとしてtoggleOpen関数をセット、open変数の値によって.openをつけるかを判断する三項演算子を記述します。  
  
  
あとはcssでopen状態のcssを書いていきます。  

##### HamburgerMenu.module.scss

```
.hamburger { 
  position: relative;
  border: none;
  width: 34px;
  height: 34px;
  
  &:after, &:before {
    content: "";
    display: block;
    width: 34px;
    height: 5px;
    background: #333;
    position: absolute;
    top: calc(50% + 2.5px);
    left: 0px;
    transition: transform 200ms
  }
  &:after {
    transform: translateY(-10px);
  }
  &:before {
    transform: translateY(0px);
  }
  
  &.open {
    &:after, &:before {
      top: 50%;
      transform: translateY(0px);
    }
    &:after {
      transform:rotate(45deg);
    }
    &:before {
      transform:rotate(-45deg);
    }
  }
}
```

  
# 参考サイト

<https://ja.react.dev/reference/react/useState>  
<https://kokoniarukoto.dev/blog/react-hamburger/>
