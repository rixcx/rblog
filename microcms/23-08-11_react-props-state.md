---
title: "Reactのpropsとstateの基本を学ぶ"
date: "2023-08-11T15:00:00.000Z"
---

Reactのstateやpropsがよく分からなかったので覚書です。  
環境はReact × Typescript。  
  
# 環境構築

任意のフォルダにcreate-react-appでプロジェクトを作成。Typescriptも勉強したかったのでオプション指定してTypescriptのテンプレで作成。

```
$ npx create-react-app react-todo --template typescript
```

  
## ローカルサーバーの立ち上げ

下記コマンドを叩くと http://localhost:3000/ でローカルサーバーが立ち上がり、プロジェクトをブラウザで見れるようになります。  
App.tsxのテキストを適当に変えてファイルを保存すると、ブラウザに変更が反映されます。

```
$ npm start
```

  
## App.tsxの編集

index.tsxはApp.tsxをインナーとして表示しているため、App.tsxを編集していきます。とりあえず<div className="App">の中身は全部消しておく。  
cssについては割愛しますが、pure cssならとりあえずApp.cssを編集すれば良いだけなのでHTMLとCSSの知識がある人なら問題なくCSS反映できるかと思います。  
  
# propsについて

propsとは、親コンポーネントから子コンポーネントに渡されるオブジェクトのこと。  

## サンプルコード

とりあえずこんな感じに書いてみます。

```
function App() { //親コンポーネント
  return (
    <div className="App">
      <Welcome name="Sakura" />;
    </div>
  );
}

function Welcome(props: {name: string}) {  //子コンポーネント
  return <div>Hello, {props.name}.</div>;
}
```

  
流れを見てみます。

1. `<Welcome name="Sakura" />;`で子コンポーネントであるWelcomeコンポーネントを呼び出し。この時、props として `{name: 'Sakura'} `を渡します。
2. `(props: {name: string})`で渡されたpropsをpropsという変数に格納。`name: string`はTypescriptのための型指定です。（nameはstring型であるという宣言。例えばname={01}と渡された場合、number型なのでエラーが起こる）
3. `return <h1>Hello, {props.name}.</h1>;`で渡されたオブジェクト`{name: 'Sakura'}`を投入して返します。

  
複数の値を渡すことももちろん可能。またコンポーネントを繰り返し呼び出すこともできる。コンポーネントはこれが利点。（PHPのクラスのような感じ？

```
function App() {
  return (
    <div className="App">
      <Welcome name="Sakura" age={26} />
      <Welcome name="Kaede" age={30} />
    </div>
  );
}

function Welcome(props: {name: string, age: number}) {
   return <><div>Hello, {props.name}.</div><p>age:{props.age}</p></>
}
```

名前と年齢を表示する嫌な画面  
  
## 余談：Typescriptの型指定について

`Welcome(props: {name: string})`で行っている型指定の書き方ですが、`Welcome(props: string)`ではエラーとなります。  
親から子に渡されるpropsはオブジェクトのため（上の場合場合`{name: 'Sakura', age: 26}` というオブジェクト）、一括で指定するようなこの書き方ができないためです。  
なお、`Welcome(props: any)`という書き方をすると通ります。（anyは型チェックをしない型のため）（ただしTypescriptである利点がなくなる）  
  
nameとageのように複数のpropsを渡したい時、上のコードのように引数部分に型指定することもできますが、typeもしくはinterface文で型をまとめて定義しておく方法もあります。

```
type WelcomeProps = {
  name: string;
  age: number;
}

function App() {
  return (
    <div className="App">
      <Welcome name="Sakura" age={26} />
      <Welcome name="Kaede" age={30} />
    </div>
  );
}

function Welcome(props: WelcomeProps) {
   return <><div>Hello, {props.name}.</div><p>age:{props.age}</p></>
}
```

  
# **state**について

stateとは、コンポーネントの状態を管理する仕組み。stateが更新されるとコンポーネントはそれに再レンダーで応じます。**クラスコンポーネント**でのみ使用可能です。  
  
…クラスコンポーネントとは？  
  
## 関数コンポーネントとクラスコンポーネント

Reactでは、コンポーネントの書き方に「関数コンポーネント」と「クラスコンポーネント」いう2つの書き方が存在します。  

##### 関数コンポーネント

```
function Welcome(props) {
  return <div>Hello, {props.name}</div>;
}
```

  
##### クラスコンポーネント

```
class Welcome extends React.Component {
  render() {
    return <div>Hello, {this.props.name}</div>;
  }
}
```

  
クラスコンポーネントは昔から存在している書き方、関数コンポーネントはモダンな書き方。  
技術記事を見ていると割とクラスコンポーネントな書き方をよく見かける気がします。  
  
stateはクラスコンポーネントでしか使えないそうなので、クラスコンポーネントで書くべきなのか？と思いましたが、現在はReact Hooksという機能によって関数コンポーネントでもstateが使えるようになっているそうです。  
（React Hooks…stateなどの Reactの機能をクラスを書かずに使えるようになる機能）  
  
## サンプルコード

ボタンを押すとカウントされるコードをReact Hooksを使って書いてみます。

```
import React, { useState } from 'react';

function App() {
  return (
    <div className="App">
       <Count />
    </div>
  );
}

function Count() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

  
1. ファイルの先頭に`import React, { useState } from 'react';`を記述し、stateに必要なuseStateをインポートします。
2. `App()` に` <Count />`を追加しCountコンポーネントを読み込みます。
3. `Count()`にコードを書いていきます。`const [count, setCount] = useState(0);`でstate変数を定義します。それぞれ`const [stateの変数, stateを更新する関数] = useState(stateの初期値)`となります。
4. `<p>You clicked {count} times</p>`で指定した変数countを表示します。初期値で0を指定しているので、最初は0が表示されます。
5. `<button onClick={() ` _`=>`_` setCount(count + 1)}>`でonClickイベントを設定し、上で設定したstateを更新する関数である`setCount`でcountに1をプラスします。

  
## サンプルコード

文字の変更についても試してみたかったので、~~夢小説よろしく~~入力された値で文字を変更する機能も作ってみました。

```
function NameChange() {
  /* 入力で使う変数inputNameを定義 */
  const [inputName, setinputName] = useState("xxx");
  
  /* 変更後の名前で使う変数changeNameを定義 */
  const [changeName, setchangeName] = useState("xxx");

  /* 
    ボタンをクリックすると発火するonClickChangeNameを定義
    setchangeName(name);→changeNameをinputNameの値に変更
    setinputName("");→inputNameを空に変更
   */
  const onClickChangeName = (inputName: string) => {
    setchangeName(inputName);
    setinputName("");
  }
 
  return (
    <div>
      <p>What's your name?</p>
        {/* valueにはinputNameを指定。onChangeイベントで入力があったときに入力の値（valueの値）でsetinputNameを実行 */}
        <input type="text" value={inputName} onChange={(event) => setinputName(event.target.value)}/>
        
        {/* ボタンをクリックするとonClickChangeNameを実行。引数にはinputNameを指定*/}
        <button onClick={() => onClickChangeName(inputName) }>chenge name</button>
      <p>I am {changeName}. </p>
    </div>
  );
}
```

  
# 終わりに

Reactの基本構文とコンポーネント、props、stateの基本について理解が深まりました。  
やはり簡単なコードでもいいので自分で動かすことで、より知識が身につきますね…  
  
# 参考サイト

・props  
<https://ja.legacy.reactjs.org/docs/components-and-props.html>  
<https://monohibi.com/posts/react-basics-props-state>  
<https://qiita.com/rio%5Fthreehouse/items/7632f5a593cf218b9504#props>  
  
・state  
<https://www.twilio.com/ja/blog/react-choose-functional-components-jp>  
<https://ja.legacy.reactjs.org/docs/components-and-props.html#function-and-class-components>  
<https://ja.legacy.reactjs.org/docs/hooks-overview.html>  
<https://reffect.co.jp/react/react-hook-usestate-understand/>  
<https://zenn.dev/swata%5Fdev/articles/7f8ef4333057d7>  
