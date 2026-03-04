---
title: "docker-composeでPHP × MySQL環境を構築する"
date: "2023-03-03T15:00:00.000Z"
---

久しぶりにDockerを触ったら色々忘れていたので整理。  
シンプルにPHP開発環境を作成する。  
  
# 環境

* MacBook Pro（M1チップ）
* Docker（docker-compose）

  
# ディレクトリ構成

```text
php-mysql
├── /html
│   ├── index.php
│   └── Dockerfile
├── /mysql
└── docker-compose.yml
```

  
###### index.php
```php
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PHP</title>
</head>
<body>
  <?php phpinfo(); ?>
</body>
</html>
```

  
# docker-compose.ymlの作成

コンテナの設計図であるdocker-compose.ymlを記述。
```yml
version: '3' #このファイルのバージョン
services:    #起動するサービス（コンテナ）の設定定義

  mysql:  #「mysql」という名前でサービスを定義
    platform: linux/x86_64        #M1チップ対応のため追記
    container_name: mysql         #コンテナ名の設定
    image: mysql:8                #使用するイメージ
    volumes:                      #データのマウント設定
      - "./mysql:/var/lib/mysql"  #左辺がローカル、右辺がコンテナ
    environment:                  #環境変数の設定
      - MYSQL_ROOT_PASSWORD=root  #MySQLのrootユーザーのパスワード
      - MYSQL_DATABASE=db_test    #作成するDB名
      - MYSQL_USER=test           #ユーザー設定
      - MYSQL_PASSWORD=test       #ユーザーパスワード
      - TZ='Asia/Tokyo'           #タイムゾーンの設定
    command: --default-authentication-plugin=mysql_native_password  #mysql8用設定

  phpmyadmin:  #「phpmyadmin」という名前でサービスを定義
    container_name: phpmyadmin    #コンテナ名の設定
    image: phpmyadmin/phpmyadmin  #使用するイメージ
    environment:
      - PMA_ARBITRARY=1           #1で任意のサーバーへの接続が許可される
      - PMA_HOST=mysql            #MySQLサーバーのホスト名を定義
      - PMA_USER=test             #MySQLサーバーに接続するユーザー名
      - PMA_PASSWORD=test         #MySQLサーバーに接続するユーザーのパスワード
    ports:                        #ポート設定
       - "8080:80"                #左辺がローカル、右辺がコンテナ

  apache:  #「apache」という名前でサービスを定義
    container_name: apache        #コンテナ名の設定
    build: ./html/                #htmlフォルダにあるDockerfileからビルド
    volumes:                      #データのマウント設定
      - ./html:/var/www/html      #左辺がローカル、右辺がコンテナ
    ports:                        #ポート設定
      - "80:80"                   #左辺がローカル、右辺がコンテナ
    depends_on:                   #依存関係の定義 apache開始の前にmysqlを起動する
      - mysql
```

  
platform: linux/x86\_64 はM1MacでMySQLを使うために必要な記述。  
MySQLは8を使用。8から認証の方法が変わりそのままではエラーを起こすため、commandで追加の記述を行っています。  
  
apacheでimageの指定をしていませんが、代わりにbulidでDockerfileのパスを指定しています。  
Dockerfileを通してimageをビルドします。  
  
# Dockerfileの作成

imageの設計図であるDockerfileを記述。今回はPHPのimageのためのDockerfileを作成します。
```dockerfile
FROM php:7.2-apache 
RUN apt-get update && apt-get install -y
RUN docker-php-ext-install pdo_mysql
```

  
`FROM php:7.2-apache`でベースイメージを指定しています。  
`RUN apt-get update && apt-get install -y`でパッケージ情報を更新し、パッケージをインストールしています。（-yは全ての問い合わせに Yes で答えるオプション）  
`RUN docker-php-ext-install pdo_mysql`はPDOのMySQLをインストールしています。  
  
# コンテナの起動

ターミナルでphp-mysqlディレクトリに移動し、下記のコマンドでコンテナを立ち上げる。ターミナル移動の仕方は割愛。
```bash
$ docker-compose up -d
```

\-dはバックグラウンドでコンテナを実行するオプション。  
```bash
$ docker container ls 
```

もしくはDocker Desktopでコンテナが立ち上がっていることを確認。  
  
http://localhost/ でphpinfo が、  
http://localhost:8080/で phpMyAdminが開けたらOKです👏  
  
# DBとの接続

念の為、DBとの接続を確認してみます。index.phpを下記のように変更。  

###### index.php
```php
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PHP</title>
</head>
<body>
<?php
  try {
    $db = new PDO('mysql:dbname=db_test;host=mysql','test','test');
    echo "接続されました";
  } catch (PDOException $e) {
    echo '接続エラー: ' . $e->getMessage();
  }
?>
</body>
</html>
```

new PDOの中の値は適宜変えてください。  
  
http://localhost/ にアクセスし、「接続されました」と出ていたら成功です🎉  
接続エラーの場合は、後半のエラー文を読んでググる。  
  
# コンテナの停止

```bash
$　docker-compose stop
```

もしくはDocker Desktopで停止ボタンをクリック。  
  
# 参考サイト

<https://idealump.com/service/lab/95>  
<https://qiita.com/tarch710/items/1236a23f7ffde4c512f2>  
<https://xn--t8j3bz04sl3w.xyz/mysql/php-mysql-connection/6793/>  
<https://keruuweb.com/docker-mysql8で認証関連のエラーが発生したのでその対策/>  
  
