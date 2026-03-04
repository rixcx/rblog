---
title: "$ bin/cake bakeでFailed to find a CLI version of PHP; falling back to system standard php executableになる件"
date: "2022-02-04T15:00:00.000Z"
---

2022/02/12 - 追記  
そもそもローカル側でbakeは出来ないので、単純にローカルにphpをインストールしただけの記事になっております🙇‍♀️  
  
\- - - - -  
  
CakePHPの構築を進めるにあたり、`$ bin/cake bake`を打つと

```
Failed to find a CLI version of PHP; falling back to system standard php executable
```

でbakeが出来ませんでした。  
  
和訳すると『CLI版のPHPが見つからず、システム標準のPHP実行ファイルにフォールバックしています。』とのことで、一旦PHP確認のため`$ php- v`を叩いてみると

```
command not found: php
```

でphpコマンドが使えない！  
ということはそもそもマシンにPHPが入っていない😕  
Dockerイメージ（php:X.X-apache）のせいでPHP入りとかなんとか思っていたけど、それはあくまでコンテナ内の話…  
  
そもそもmacにはPHP入っていなかったっけと調べてみると、macOS MontereyからPHPが含まれなくなったとのこと。  
  
パッケージはHomebrewで管理しているので、PHPもHomebrewでインストールします。  

# HomebrewでPHPをインストール

## 1.PHPのインストール

まずはHomebrewでインストールできるphpの確認

```
$ brew search php
==> Formulae
brew-php-switcher    php-cs-fixer@2       php@8.0              phpmyadmin           pup
php                  php@7.2              phpbrew              phpstan
php-code-sniffer     php@7.3              phplint              phpunit
php-cs-fixer         php@7.4              phpmd                pcp
```

色々出てきますが、phpがついたパッケージが検索されているっぽい。  
`php@8.0`が最新なので、これをインストールしていきます。  

```
$ brew install php@8.0
```

  
長々としたインストールが完了したらパッケージ確認コマンドで確認。

```
$ brew list
```

aprとか見知らぬパッケージが入ってましたが、phpに依存しているパッケージとのこと。php@8.0があればOKです。  
  
ここで`$ php -v`をしてもまだコマンドは使えません。  
ここでインストールしたphpを使いますと指定する必要があります。  
（パスを通す、と言います）  

## 2.パスを通す

パスを通す、という作業がいまいちわからない人（自分）向けに2通りの方法を紹介します。  
やっていることは手作業で通すかコマンドでやるかの違いです。  

### １）手作業でパスを通す

設定ファイルはホームディレクトリ（Finderで家のマークのアイコンの、ユーザー名がついているディレクトリ）にあります。  
設定ファイルは使用しているシェルによって変わりますが、自分はzshを使っているので.zshrcファイルになります。  
  
.zshrcファイルを開き、下記を追記します。

```
export PATH=/opt/homebrew/opt/php@8.0/bin:$PATH
```

  
ターミナルに戻り、下記コマンドで設定を反映させます。

```
$ source ~/.zshrc
```

  
`$ php -v`で挙動を確認。  
バージョンが表示されたらOKです🎉  

### ２）コマンドでパスを通す

インストールしたときに出てきている`If you need to have php@8.0 first in your PATH, run:`を実行します。

```
echo 'export PATH="/opt/homebrew/opt/php@8.0/bin:$PATH"' >> ~/.zshrc
```

ホームディレクトリにある.zshrcに'export PATH="/opt/homebrew/opt/php@8.0/bin:$PATH"'を出力して、という意味で、１の最初の作業と同じです。  
  
その後の設定の反映は１と同じです。  
  
これでphpが使えるようになりました👏  
  
プロジェクトに戻り、`$ bin/cake bake`を叩くとちゃんとタスクリストが表示されました。  
※ただしbakeコマンドはコンテナ内だけしか出来ないので、単純にphpをローカルにインストールしただけになりました…  
  
  
# 参考サイト

<https://zenn.dev/datchlive/articles/c1faecb382355f>  
<https://c-limber.co.jp/blog/1691>  
<https://qiita.com/tetsu-upstr/items/7fa800488dc29228d7fd>
