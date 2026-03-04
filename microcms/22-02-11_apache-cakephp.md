---
title: "docker-composeでApache × CakePHP3環境を構築"
date: "2022-02-11T15:00:00.000Z"
---

docker-composeでCakePHP3環境構築したいとなったときに、なかなかWebサーバーがApacheのもので理想な構成が見つからず苦労したので、これを機にまとめておこうと思います。  

# 環境

* MacBook Pro（M1チップ）
* Docker（docker-compose）
* Apache/2.4.52 （OSはDebian）※
* MySQL 8.0.28
* phpMyAdmin 5.1.1
* CakePHP 3.10

※公式のphp:7.4-apacheイメージを使うとApatch2かつOSがDebianになります。これでだいぶ詰まりました…  

# ディレクトリ構成

```
dev-cakephp-apache
├── /apache
│   ├── /html　　　　　　　#cakephpコード置き場
│   └── Dockerfile
├── /mysql
│   └──  /db    #データの保存先
└── docker-compose.yml
```

  
# 環境構築の流れ

## 1\. コンテナの作成

Apache、MySQL、phpMyAdminのコンテナを立ち上げていきます。  
環境はdocker-compose.ymlとDockerfileに記述しています。

##### docker-compose.yml

```
version: '3' #このファイルのバージョン
services:    #起動するサービス（コンテナ）の設定定義
  mysql:       #「mysql」という名前でサービスを定義
    platform: linux/x86_64           #M1チップ対応のため追記
    container_name: cakephp-mysql    #コンテナ名をつける
    image: mysql:8                   #使用するイメージ
    volumes:                         #データのマウント設定
      - "./mysql/db:/var/lib/mysql"    #左辺がローカル、右辺がコンテナ
    environment:                     #環境変数の設定
      - MYSQL_ROOT_PASSWORD=password  #MySQLのrootユーザーのパスワード
      - MYSQL_DATABASE=db_cakephp     #作成するDB名
      - MYSQL_USER=cakephp            #一般ユーザー設定
      - MYSQL_PASSWORD=cppassword     #一般ユーザーパスワード
      - TZ='Asia/Tokyo'
    ports:                           #ポート設定
      - "3306:3306"                    #左辺がローカル、右辺がコンテナ
  phpmyadmin:
    container_name: cakephp-phpmyadmin
    image: phpmyadmin/phpmyadmin
    volumes:
       - /sessions
    environment:
      - PMA_ARBITRARY=1
      - PMA_HOST=mysql                 #MySQLサーバーのホスト名を定義
      - PMA_USER=root                  #MySQLサーバーに接続するユーザー名
      - PMA_PASSWORD=password          #MySQLサーバーに接続するユーザーのパスワード　MYSQL_ROOT_PASSWORDと同じ
    ports:
       - "8080:80"
  apache:
    container_name: cakephp-apache
    build: ./apache/                 #apachのDockerfileを使用してビルド
    volumes:
      - ./apache/html:/var/www/html
    ports:
      - "80:80"
    depends_on:                      #依存関係の定義 apache開始の前にmysqlを起動する
      - mysql


```

※`platform: linux/x86_64`はM1チップだとMySQLコンテナがエラーで立ち上がらないので回避するために追加しています。不要な方は削除してください。  

##### /apache/Dockerfile

```
FROM php:7.4-apache #使用するイメージ
RUN apt-get update \\
&& apt-get install -y \\
zip \\
nano \\
libicu-dev \\
unzip
RUN docker-php-ext-install mysqli pdo pdo_mysql intl
WORKDIR /var/www/html
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "vim"]
```

  
上記ファイルを元に、まずはイメージの作成。

```
$ docker-compose build
```

  
イメージを元にコンテナを立ち上げます。

```
$ docker-compose up -d
```

  
ここまででコンテナが立ち上げられたのか一旦確認します。  
  
[localhost:8080](unsafe:localhost:8080)でphpMyAdminが、[localhost:80](unsafe:localhost:80)でApacheの403 Forbiddenな画面が表示されたらOK👏  
ちなみにこれはルートディレクトリにindex.htmlなどがなくてエラーになっているので、  
/apache/html/に適当な内容を書いたindex.htmlを置くと解消されます。  
（置いたファイルは削除してください）  

## 2.Cakephp3のインストール

Apacheコンテナの中に入り、その中でCakephp3をインストールをしていきます。

```
$ docker exec -i -t cakephp-apache bash
＝＝＝＝＝ここからコンテナ内＝＝＝＝＝
root@c75f01bc6645:/var/www/html#
```

`cakephp-apache`はdocker-compose.ymlでつけたコンテナ名です。`$ docker ps -a`のNAMESでも確認できます。  
/var/www/htmlはコンテナ内の現在地。docker-compose.ymlのvolumesで設定した通り、ローカルの/apache/htmlをマウントしています。  
  
まずはCakePHP3のインストールに必要なComposerをインストール。

```
# curl -s https://getcomposer.org/installer | php
```

  
CakePHP3をインストール。

```
# php composer.phar create-project --prefer-dist cakephp/app:3.8.* your-app-name
```

`your-app-name`にはプロジェクト名をいれてください。  
Do you trust "cakephp/plugin-installer" to… も Set Folder Permissions? もyでOK。  
インストール後、ローカルの/apache/htmlにyour-app-nameディレクトリができていれば成功です👏  
  
/var/www/html/your-app-nameのデータを、/var/www/html直下に移動させます。

```
# ls -a //一旦ファイル確認
your-app-name  composer.phar

# mv your-app-name/* /var/www/html/　//ファイルの移動
# mv your-app-name/.[^\\.]* /var/www/html/　//*だけでは隠しファイルも移動できないので正規表現を使って残りのファイルも移動

# ls -a //もう一度ファイル確認
.   .editorconfig   .github     .htaccess    README.md  cakephp        composer.lock  config     logs              plugins  tests  vendor
..  .gitattributes  .gitignore  .travis.yml  bin        composer.json  composer.phar  index.php  phpunit.xml.dist  src      tmp    webroot

# rmdir your-app-name //your-app-nameディレクトリは空っぽになったので削除します。
```

  
コンテナを抜けます。

```
# exit
＝＝＝＝＝ここまでコンテナ内＝＝＝＝＝
```

  
[localhost:80](unsafe:localhost:80)でスタイルのあたってないCakePHP3のスタートページが表示されたらOKです👏  

## 3.エラーの解消

ちょっと詰まったところだったので解決までの経緯を細々と…興味ないという方は「🍰コンテナ内でモジュールを有効化します。」まで飛ばしてください。  
  
[localhost:80](unsafe:localhost:80)のCakePHPのスタートページに、「URLリライティングが正しく設定されていません」とエラー内容と参考サイトが貼ってあります。  
1) Help me configure it のリンク先の公式ドキュメントのURL Rewriting Apacheを参考に、Apache内のhttpd.confを確認していきます。  
  
もう一度Apacheコンテナの中に入り、httpd.confを探してみる。

```
$ docker exec -i -t cakephp-apache bash
＝＝＝＝＝ここからコンテナ内＝＝＝＝＝
# cd / //一番上に移動
# find -name "httpd.conf" //httpd.confを検索
find: './proc/17/map_files': Permission denied
find: './proc/19/map_files': Permission denied
…以下10件ほど似たのが続いて終了
#
```

…見つからない？ 🤔  
Permission deniedのディレクトリには置かれないので見れなくても無視  
その後ありそうなディレクトリを見に行っても見つからず。  
  
結論からいうと、php:7.4-apacheイメージを使うとOSがDebianになるそうで、  
Debianでは設定ファイルはhttpd.confではなくapache2.confになります。  
場所が/etc/apache2/apache2.confとのことなので見に行きます。

```
# cd /etc/apache2/
# ls
apache2.conf  conf-available  conf-enabled  envvars  magic  mods-available  mods-enabled  ports.conf  sites-available  sites-enabled
# cat apache2.conf //apache2.confの中身を表示
〜〜以下apache2.confの中身〜〜
<Directory />
        Options FollowSymLinks
        AllowOverride None
        Require all denied
</Directory>
```

それらしいところがNoneになっている。  
ここを公式ドキュメント通りAllにしたらいいんだなと思いきや、Debianでは設定ファイル本体は触らず、変更したい場合は追加の設定ファイルを設定する、という方針とのこと。apache2.confの上の方にも書いていました。  
追加の設定ファイルは\*-enabled内のファイルということで、こちらを確認してみます。

```
# cd conf-enabled
# cat docker-php.conf
<FilesMatch \\.php$>
        SetHandler application/x-httpd-php
</FilesMatch>

DirectoryIndex disabled
DirectoryIndex index.php index.html

<Directory /var/www/>
        Options -Indexes
        AllowOverride All
</Directory>
```

パスが少し違うものの、こちらではAllになっているのでOKみたいです（アバウトですみません…）  
  
次にmod\_rewriteが正しくロードされているかを確認。

```
# cat /etc/apache2/mods-available/rewrite.load
LoadModule rewrite_module /usr/lib/apache2/modules/mod_rewrite.so
```

先頭の#がなくロードしているものの効いていない様子？  
  
Debianの場合、別途コマンドでrewrite\_moduleを有効にする必要があるようでした。  
  
🍰コンテナ内でモジュールを有効化します。

```
# a2enmod rewrite
# service apache2 restart
ここで自動でコンテナから抜け、Apacheコンテナが落ちるので一旦すべてストップ・再起動
$ docker-compose stop
$ docker-compose start
```

  
[localhost:80](unsafe:localhost:80)のCakePHPのスタートページにアクセスして、無事スタイルがあたっていたら成功です🎉  
モジュールの有効化は、Dockerfileに`RUN a2enmod rewrite`でもいいみたいです。  

## 4.DBの接続

CakePHPのスタートページにてDatabaseに繋げないよというエラーが出ているのでDBを接続します。  
/apache/html/config/app.phpのDatasourcesのdefaultを編集します。  
それぞれはdocker-compose.ymlで指定したホスト名とユーザー、DB名です。

```
'Datasources' => [
        'default' => [
            'className' => Connection::class,
            'driver' => Mysql::class,
            'persistent' => false,
            'host' => 'mysql',　//変更
            /*
             * CakePHP will use the default DB port based on the driver selected
             * MySQL on MAMP uses port 8889, MAMP users will want to uncomment
             * the following line and set the port accordingly
             */
            //'port' => 'non_standard_port_number',
            'username' => 'cakephp', //変更
            'password' => 'cppassword',//変更
            'database' => 'db_cakephp',//変更
　　　　　　　　　　　〜以下略〜
        ],
```

CakePHPのスタートページのDatabaseが緑のコック帽になればOKです🎉  

# 終わりに

MAMPポチーで終わっていた環境構築が、docker-composeを使うとApacheやMySQLだのサーバーに入って確認や作業だのインフラについての知識も必要になり、非常に大変でしたがその分得られた知見は多かったです。  
docker-compose.ymlやDockerfileの読み方も、初見は半年くらいかけて理解できるやつだなと思ってましたが、トライアンドエラーを繰り返してるうちにだんだん読めるようになりました👏  
php.iniの設定やこうするともっとスマートかなと思うところもあるので時間があれば直していきたいです。  
これで作ったアプリケーションを公開できて初めてdocker使えますと言えるようになると思うので、公開できるまで頑張ります🙏  

# 参考サイト

・環境構築  
<https://qiita.com/sachiko-kame/items/489231d8fef7252a87d3>  
<https://qiita.com/km42428/items/df1d0a1eefddcf771dfa>  
  
・php:7.2-apache (Apache2/Debian)周り  
<https://qiita.com/dokkoisho/items/03746e58d975bd7a35ec>  
<https://penpen-dev.com/blog/ubuntuapache2/>  
<https://qiita.com/u-akihiro/items/c7a5bb38c34858d00c2a>
