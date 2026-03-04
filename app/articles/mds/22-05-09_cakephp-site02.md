---
title: "Cahephp3で管理機能付きカフェサイトを作る - 02"
date: "2022-05-09T15:00:00.000Z"
---

Cakephp3のブログチュートリアルは終わったけど、そこから何を作ればいいのかわからない、作りたいサービス考えたけど次にやるにはハードル高い…  
ということで、管理画面からニュースやメニューを更新できる簡単な管理機能付きのカフェサイトをつくってみます。  
  
01は[こちら](https://rblog-and-rix.vercel.app/blog/cl452nopv6)  

# 構築の流れ

## １）Layoutの作成

共通レイアウトをフロントと管理画面の2つ作成していきます。  
フロント用には、src/Template/Layout/default.ctpのdefault.ctpを複製しfront.ctpにリネーム、  
src/Controller/IndexesController.phpのpublic function initialize()にレイアウトをセットします。
```php
$this->viewBuilder()->setLayout('front');
```

  
管理画面用にはsrc/Template/Layoutのフォルダごとsrc/Template/Adminにコピーし、その中でdefault.ctpを複製しadmin.ctpにリネーム、  
src/Controller/Admin/HomeController.phpにpublic function initialize()を追加します。
```php
public function initialize(){
　　parent::initialize();
　　$this->viewBuilder()->setLayout('admin');
}
```

  
default.ctpのheaderやfooterは/src/Template/Elementのを引っ張っていますが、Adminフォルダにコピーしたあとは自動的にsrc/Template/Admin/Elementのを引っ張ってきてくれます。  

## ２）ヘッダーのコーディング

３でsassを設定するため、先に簡単にフロントのheaderのコーディングをしておきます。  
/src/Template/Element/header.ctp
```php
<header class="header">
  <div class="header__inner container">
    <h1 class="header__logo"><?= $this->Html->image('/img/common/logo.svg', ['url' => ['controller' => 'indexes', 'action' => 'index'], 'alt' => 'mk coffee', 'width' => '196', 'height' => '43']) ?></h1>
    <nav class="header__nav">
      <ul>
        <li><?= $this->Html->link(__('ABOUT'), ['#link_about']) ?></li>
        <li><?= $this->Html->link(__('NEWS'), ['controller' => 'News','action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('MENU'), ['controller' => 'Menus', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('ACCESS'), ['#link_access']) ?></li>
      </ul>
    </nav>
  </div>
</header>
```

  
画像はここに配置します。/html/webroot/img  

## ３）webpackのインストール・設定

sass（Dart Sass）を使うために、webpackをインストールしていきます。  
コンパイル手段には他にGulpがありますが、webpackを選定したのは使ったことがなかったからです・・・  

### webpackのインストール

/apache/html直下に任意のディレクトリを作成し、移動します。今回はwebpackにしてみました。
```bash
$ mkdir webpack
$ cd webpack
```

  
package.jsonファイルを作成します。
```bash
$ npm init -y
```

  
続いてnpm installでwebpackをインストールします。  
完了後、バージョン確認をするコマンドでバージョンを確認できたらOK。
```bash
$ npm install --save-dev webpack webpack-cli
$ npx webpack -v
webpack: 5.70.0
webpack-cli: 4.9.2
webpack-dev-server not installed
```

node\_modulesというパッケージがダウンロードされたフォルダができ、gitに反映されてしまうので.gitignoreで除外しておきます。  
プロジェクトフォルダ直下の.gitignoreに下記を追加
```text
node_modules
```

  
webpackの各モジュール、プラグインをインストール。
```bash
$ npm install --save-dev css-loader sass-loader sass mini-css-extract-plugin webpack-fix-style-only-entries
```

  
apache/html/webpack/package.jsonの"main": "index.js",を削除し、"private": true,を追加します。  

### webpackの設定

/apache/html/webpackにsassを置いて、コンパイルの設定をしていきます。  
ディレクトリ構造はこんな感じに。
```text
webpack
├── node_modules
├── package-lock.json
├── package.json
└── /src
    ├── /admin（管理画面のcssを格納）
    │   
    ├── /common（共通のcss・パーツ）
    │   ├── /element（ヘッダー、フッターなど）
    │   │   └── header.scss
    │　　　│
    │   ├── /global（変数やmixinなど）
    │   │   ├── forward.scss（globalのcssをまとめる）
    │   │   ├── mixin.scss
    │   │   └── variables.scss
    │　　　│
    │   ├── layout.scss（レイアウトについてのcss）
    │   ├── reset.scss（リセットcss）
    │   └── style.scss（commonのcssをまとめる）
    │　　　　　
    ├── /menus（以下各ページのstyle.cssを格納）
   　├── /news
    ├── /top
    │　
 　  └── style.scss（webpackのエントリポイント）
```

  
cssはこんな感じにしてみました。  
/src/common/element/header.scss
```scss
@use "../global/forward" as global;

.header {
  &__inner {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100px;
  }

  &__logo {
    position: absolute;
    top: 0;
    left: 16px;
    display: block;
    width: 235px;
    padding: 56px 20px;
    background-color: global.$main-color;
  }

  &__nav {
    > ul {
      display: flex;
      justify-content: space-between;
      width: 430px;

      > li {
        font-size: 20px;
      }
    }
  }
}
```

  
/src/common/global/forward.scss
```scss
@forward "variables";
@forward "mixin";
```

  
/src/common/global/mixin.scss
```scss
$breakpoint: (
  sp: "screen and (max-width: 767px)",
  pc: "screen and (min-width: 768px)",
);

@mixin mediaquery($device) {
  @media #{map-get($breakpoint, $device)} {
    @content;
  }
}

@mixin hover {
  transition: opacity 0.3s;
  
    &:hover {
    opacity: 0.7;
  }
}

@mixin body-font {
  font-family: "Noto Sans Japanese", sans-serif;
}
```

  
/src/common/global/variables.scss
```scss
$txt-color: #1E212D;
$main-color: #336E62;
$accent-color: #B68973;
$sub-color: #E3D7CD;
$bg-color: #F8F5F2;
```

  
/src/common/layout.scss
```scss
@use "./global/forward" as global;

.container {
  width: 100%;
  max-width: 1048px;
  margin: 0 auto;
  padding: 0 16px;
}
```

  
/src/common/style.scss
```scss
@use "./global/forward" as global;

@use "reset";
@use "layout";
@use "element/header";

body {
  @include global.body-font;
  font-size: 14px;
  color: global.$txt-color;
  line-height: 1.4;
}

img {
  width: 100%;
  height: auto;
}
```

  
/src/style.scss
```scss
@forward "common/style";
```

  
globalのmixin.scss、variables.scssには変数やmixin.scssを書き、forward.scssにまとめます。  
header.scssなどで`@use "../global/forward" as global;`など、forward.scss経由で各変数を呼び出すようにしています。  
  
/src/common/style.scssでは、commonの各cssを読み込み、それを/src/style.scssから読み込むようにしています。  
/src/style.scssが最終的にコンパイル対象となります。  
  
  
webpackの設定ファイル、webpack.config.jsを書いていきます。  
/apache/html/webpack/webpack.config.js
```javascript
//path モジュールの読み込み
const path = require('path');
//MiniCssExtractPlugin の読み込み cssを別ファイルに吐き出す
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//WebpackFixStyleOnlyEntries の読み込み　jsを吐き出さないようにする
const WebpackFixStyleOnlyEntries = require("webpack-fix-style-only-entries");
 
module.exports = {
  //エントリポイント 吐き出す名前と読み込み元
  entry: {
    "style": './src/style.scss'
  },
  //出力先
  output: { 
    path: path.resolve('../','webroot','css'),
  },
  module: {
    rules: [
      {
        test: /\\.(scss|sass|css)$/i, 
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ], 
      },
    ],
  },
  //プラグインの設定
  plugins: [
    new MiniCssExtractPlugin({
      filename: './[name].css',
    }),
    new WebpackFixStyleOnlyEntries()
  ],
  watchOptions: {
    ignored: /node_modules/
  },
};
```

  
packege.jsonにコマンドを書き、npmコマンドで使えるようにします。
```json
"scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "build": "webpack --mode production",
    "dev": "webpack --mode development",
    "watch": "webpack --mode development --watch",
    "sass-ver": "sass --version"
  },
```

  
webpack直下で下記コマンドを叩くと、/apache/html/webroot/css/にstyle.cssが出来ます。  
今回はcssも大きくならなさそうだったので、フロントと管理画面でそれぞれ1つにまとめるようにしました。
```bash
//cssをビルド　
$npm run build

//監視状態にする
$npm run watch

//監視をストップする
control+C
```

  
他のページのstyle.cssを追加する場合は以下のようにします。以下はTOP（/apache/html/src/Template/Indexes/index.ctp）の例。  
/apache/html/webpack/src/top/style.scss
```scss
@use "../common/global/forward" as global;

.top {
  margin: 120px auto 0;;
}
```

  
/apache/html/webpack/src/style.scss
```scss
@forward "common/style";
@forward "top/style"; //追加
```

  
また、adminにstyle.cssを追加する場合は、webpack.config.jsのエントリポイントに読み込み元を追加します。
```javascript
entry: {
    "style": './src/style.scss',
    "admin/style": './src/admin/style.scss' //追加
  },
```

  
ここまでやって、sassのコンパイルだけならgulpのほうが楽だなと思いました（今更）  

## ４）コーディング

sassのセットアップも出来たので、本格的にHTMLとCSSをがしがし書いていきます。  
/apache/html/src/Template/Indexes/index.ctp、  
/apache/html/src/Template/News/index.ctp、view.ctpなど…  
  
コーディングについては今回は割愛します。  
TOPのコーディングのコミットはこんな感じ。  
<https://github.com/rixcx/cakephp-site/commit/a715410edf7a35cd9bdc90cf14528c56d5777857>  
  
  
# 参考サイト

・webpack  
<https://www.webdesignleaves.com/pr/css/sass%5Fwebpack.html>  
<https://qiita.com/annaaida/items/f2c372000e8358ea8d8f>  
<https://ics.media/entry/17376/>  
<https://www.webdesignleaves.com/pr/css/sass%5Fwebpack.html>  
  
  
