---
title: "Cahephp3で管理機能付きカフェサイトを作る - 01"
date: "2022-03-03T15:00:00.000Z"
---

Cakephp3のブログチュートリアルは終わったけど、そこから何を作ればいいのかわからない、作りたいサービス考えたけど次にやるにはハードル高い…  
ということで、管理画面からニュースやメニューを更新できる簡単な管理機能付きのカフェサイトをつくってみます。  

# できるもの

* 管理画面にログインし、管理画面からユーザー作成、ニュース、メニュー情報更新（目標：管理画面とログインフローの作り方を学ぶ）
* ニュースには複数カテゴリ、メニューには単一カテゴリがつく（目標：DB構造とリレーションを理解する）

  
# 環境

CakePHP3のローカル環境はすでに構築済として進めていきます。

* MacBook Pro（M1チップ）
* Docker（docker-compose）
* Apache/2.4.52 （OSはDebian）
* MySQL 8.0.28
* phpMyAdmin 5.1.1
* CakePHP 3.10

  
# 構築の流れ

**注意**  
Cakephp構築は初心者です。間違ったところ・推奨されないものもあるかもしれません、ご了承ください。  
作りながらメモを取るように書いてるので大雑把・足りてないところもあるかもしれません。  
とりあえず仕組みを作ることを優先し、レイアウトやデザインについては次回行います。  

## １）サイトマップ、DB設計

サイトマップとER図を考えます。  
ブログチュートリアルの応用のイメージで下記のようにしました。  
ツールについては、VSCodeで図が書ける「Draw.io integration」という拡張機能を使用しています。  
![](https://images.microcms-assets.io/assets/d28f59f0513b4ee89b2a2a0633e54732/4de744c18e664aa3a481ba65a78ba04b/img_sitemap.png)  
※後で気づきましたが上のサイトマップにニュースカテゴリとメニューカテゴリを忘れていました…  
  
![](https://images.microcms-assets.io/assets/d28f59f0513b4ee89b2a2a0633e54732/4ade4a51dc604a5da8deb36665ff83c5/img_er.png)  
カラムについては、作りながら後で追加したもの（dateとか）もあるので最初は大雑把でいいと思います。  

## ２）ワイヤー、デザイン

ワイヤーとデザインを作成します。（ワイヤーのデータが残っていませんでした…）  
![](https://images.microcms-assets.io/assets/d28f59f0513b4ee89b2a2a0633e54732/353923b10a9d49129ab4cb97a390303d/img_design.png)  

## ３）DB作成

phpMyAdminでER図を元にテーブルを作っていきます。SQLタブで下記を実行。  
半角に見える全角スペースや、カンマの位置、主キー、外部キーの設定ミスに注意。  
わたしはそれで詰まりました。

```
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
) CHARSET=utf8mb4;

CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY user_key (user_id) REFERENCES users(id),
    slug VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    UNIQUE KEY (slug)
) CHARSET=utf8mb4;

CREATE TABLE newscategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
) CHARSET=utf8mb4;

CREATE TABLE newscategories_news (
    id INT AUTO_INCREMENT,
    newscategory_id INT NOT NULL,
    news_id INT NOT NULL,
    PRIMARY KEY (id, newscategory_id, news_id),
    FOREIGN KEY newscategory_key(newscategory_id) REFERENCES newscategories(id),
    FOREIGN KEY news_key(news_id) REFERENCES news(id)
) CHARSET=utf8mb4;

CREATE TABLE menucategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
) CHARSET=utf8mb4;

CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY user_key (user_id) REFERENCES users(id),
    menucategory_id INT NOT NULL,
    FOREIGN KEY menucategory_key (menucategory_id) REFERENCES menucategories(id),
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    UNIQUE KEY (slug)
) CHARSET=utf8mb4;
```

  
作ったテーブルにデータを流し込んでおきます。  
NOW()という関数で現在の時刻を流し込むことができますが、前後に空白があるとエラーになってうまく登録できなかったのでカンマの前後は詰めておきます。

```
INSERT INTO users(username, password, name, created_at, updated_at)
VALUES('root','root','管理ユーザー',NOW(),NOW());

INSERT INTO news(user_id, slug, date, title, body, created_at, updated_at)
VALUES(1,'first',NOW(),'サイトリニューアルのお知らせ','サイトリニューアルしました。',NOW(),NOW());

INSERT INTO newscategories(title, created_at, updated_at)
VALUES('お知らせ',NOW(),NOW());

INSERT INTO newscategories_news(newscategory_id, news_id)
VALUES(1,1);

INSERT INTO menucategories(title)
VALUES('ケーキ');

INSERT INTO menus(user_id, menucategory_id, slug, title,　price, body, created_at, updated_at)
VALUES(1,1,'daymenu','日替わりケーキ・パン','700円','店内で丁寧に焼き上げた日替わりのケーキやパンです。',NOW(),NOW());
```

  
## ４）トップ画面の作成

CakePHP3でページを作っていきます。  
まずはフロント画面（ユーザーに見える画面）から。  
IndexesControllerをbakeコマンドで作ります。Dockerの場合はコンテナに入らないとbakeコマンドが使えないので注意。

```
$ docker exec -it cakephp3が入ってるコンテナ名 bash　//コンテナに入る
$ bin/cake bake controller Indexes
```

  
作ったControllerのindexメソッドの中身は削除、それ以外のメソッドは削除しておきます。  
/src/Controller/IndexesController.php

```
public function index()
  {
    //NOP
  }

//これ以外のviewなどのメソッドは削除
```

  
手動で /src/Template/Indexes/index.ctp に Viewファイルを作成。中身は一旦ダミーでOK。  
Modelは不要なので作りません。  
  
localhostで表示されるようにしたいのでルーティングを変更。  
/config/routes.php

```
$routes->connect('/', ['controller' => 'Pages', 'action' => 'display', 'home']);
↓　変更
$routes->connect('/', ['controller' => 'Indexes', 'action' => 'index']);
```

  
localhostで作ったトップページが表示されたらOKです👏  
  
トップページでは、ニュースのタイトル・日付など情報を表示させたい＝Newsテーブルのデータを引っ張りたいので、その設定をしていきます。  
/src/Controller/IndexesController.php

```
use Cake\ORM\TableRegistry; //他テーブルの情報取得

public function initialize()　//追加
　　{
　　　　parent::initialize();
　　　　$this->news = TableRegistry::getTableLocator()->get("news");
　　}

public function index()
　　{　//以下追加
　　　　$news = $this->news->find('all');　
　　　　$this->set(compact('news'));
　　}
```

  
/src/Template/Indexes/index.ctp

```
<table>		
  <tr>		
    <td>リンク</td>		
    <td>タイトル</td>		
    <td>日付</td>		
    <td>内容</td>		
  </tr>		
  <?php foreach ($news as $news): ?>		
    <tr>		
        <td><?= $this->Html->link("more", ['controller' => 'News','action' => 'view', $news->id]) ?></td>
        <td><?= $news->title ?></td>
        <td><?= $news->date ?></td>
        <td><?= $news->body ?></td>
    </tr>
  <?php endforeach; ?>
</table> 
```

  
トップページでニュースの情報が取得できていればOKです👏  
リンクをクリックしても、ニュースの詳細ページはまだ表示されないと思うので作成していきます。  

## ５）ニュース画面の作成

ニュース一覧ページ、ニュース詳細ページを作成します。

```
$ bin/cake bake all news
```

/src/Template/Newsのうち、add.ctpとedit.ctpは不要なので削除します。  
NewsController.phpからもaddとeditメソッドは削除しておきます。  
  
ルーティングにも追加。  
/config/routes.php

```
$routes->connect('/news', ['controller' => 'News', 'action' => 'index']);
$routes->connect('/news/*', ['controller' => 'News', 'action' => 'view']);
```

  
これで一覧と詳細が見れるようになりました。  
  
日付を見ると、月/日/年という表示になっているので、フォーマットします。  
/src/Model/Entity/News.php

```
public function formatdate($date)
  {
    $formatdate = $date->i18nFormat('yyyy/MM/dd');
    return $formatdate;
  }
```

  
/src/Template/Indexes/index.ctp などの`$news>date`

```
<?= $news->date ?>
↓
<?= $news->formatdate($news->date) ?>
```

  
これで2022/1/1などの表記で表示されるようになりました👏  

## ６）メニュー画面の作成

メニュー一覧ページを作成します。流れはニュースのときと同様。  
トップページには情報を引っ張らないので、src/Template/Indexes/index.ctpには一覧へのリンクのみ設置しておきます。  
  
ここまででひとまずDBのデータをフロントに表示させることができました🎉  

## ７）管理画面の作成

管理画面を作成していきます。  
ControllerやViewなどはフロントと分けて管理したいので、Adminというディレクトリに格納することにします。  
prefixオプションをつけてbakeすると、/src/Template/Admin/Users/index.ctp と指定したディレクトリに生成されます👏

```
$ bin/cake bake all users --prefix Admin
```

  
この状態でlocalhost/admin/usersにアクセスしてもエラーとなります。  
正しくルーティングされるように、prefix用のルーティングを設定します。  
config/routes.php

```
//追加
Router::prefix('admin', function ($routes) {
　　$routes->fallbacks(DashedRoute::class);
});
```

  
ついでにログイン画面のadmin/loginと管理画面トップページのadmin/homeのページも作っておきます。

```
$ bin/cake bake controller Login --prefix Admin
$ bin/cake bake controller Home --prefix Admin
```

ここもviewメソッドなど不要な記述は削除しておきます。  
  
/src/Template/Admin/Login/index.ctp  
/src/Template/Admin/Home/index.ctp  
中身は一旦なんでもOK。  
  
ルーティングの追加

```
Router::prefix('admin', function ($routes) {
　　$routes->fallbacks(DashedRoute::class);
　　$routes->connect('/home', ['controller' => 'Home', 'action' => 'index']);
　　$routes->connect('/login', ['controller' => 'Login', 'action' => 'index']);
});
```

  
## ８）ログイン機能の作成

ログイン画面の/admin/login以外はログインできたユーザーしか見れないようにしたいので、ログイン機能（認証機能）をつけていきます。  
Cakephp3ではAuthComponentというコンポーネントを使用することでログイン機能を実装することができます。  
  
/src/Controller/AppController.php

```
public function initialize()
{
〜省略〜
	/*
	  * ログイン機能（AuthComponent）
	  */
	$this->loadComponent('Flash');
	$this->loadComponent('Auth',[
	    'authenticate' => [
	        'Form' => [
	            'userModel' => 'Users', //認証に使うモデル（テーブル）の指定
	            'fields' => [ // ユーザー名とパスワードに使うカラムの指定。省略した場合はusernameとpasswordになる
	            'username' => 'username',
	            'password' => 'password'
	            ]
	        ]
	    ],
	    'loginAction' => [ //ログインを行う画面
	      'controller' => 'Login',
	      'action' => 'index'
	    ],
	    'loginRedirect' => [ //ログイン後表示される画面
	        'controller' => 'Home',
	        'action' => 'index'
	    ],
	    'logoutRedirect' => [ //ログアウト後表示される画面
           'controller' => 'Login',
           'action' => 'index'
	    ],
	    'unauthorizedRedirect' => $this->referer() // 未認証時、元のページを返す
	]);
}
```

  
/src/Controller/Admin/LoginController.php

```
 public function index()
  {
          if ($this->request->is('post')) {
              $admin = $this->Auth->identify();
              if ($admin) {
                  $this->Auth->setUser($admin);
                  return $this->redirect($this->Auth->redirectUrl());
              }
              $this->Flash->error('管理者IDかパスワードが不正です。');
          }
    }
}
```

  
/src/Template/Admin/Login/index.ctp

```
<div class="form">
  <?= $this->Form->create() ?>
  <?= $this->Form->control('username') ?>
  <?= $this->Form->control('password') ?>
  <?= $this->Form->button('Login') ?>
  <?= $this->Form->end() ?>
</div>
```

  
このままだと全てのページに認証が必要なことになるので、認証が必要なページとそうでないページを指定します。  
/src/Controller/AppController.php

```
public function beforeFilter(Event $event)
{
   $this->Auth->allow(); //とりあえず一回全部認証
}
```

AppControllerはすべてのページに影響するので、Adminも含むすべてのページが認証不要になります。  
なので認証が必要なページには個別で指定をします。  
  
/src/Controller/Admin/HomeController.php など

```
use Cake\Event\Event;　//追加

public function beforeFilter(Event $event)
    {
        $this->Auth->deny();　//認証許可を取り消し
    }
```

  
これで管理画面/admin/以下にはにログインが必要になりました🎉  

### その後のログインで詰まった

ログイン画面を作ったあとに、SQLで流し込んで作成していたroot/rootユーザーでログインを試みても弾かれログインできず…  
パスワードをハッシュ化されていないとだめだそうで、ハッシュ化するようにしていきます。  
  
/src/Model/Entity/User.phpにパスワードハッシュ化処理を入れます。  
/src/Model/Entity/User.php

```
use Cake\Auth\DefaultPasswordHasher;

protected function _setPassword($password)
    {
        if (strlen($password) > 0) {
          return (new DefaultPasswordHasher)->hash($password);
        }
    }
```

  
今のままだと/admin/user/addにアクセスできないので、いったん認証なしでもアクセスできるようにします。  
src/Controller/AppController.phpのbeforeFilterメソッドを変更。

```
public function beforeFilter(Event $event)
{
  // view と index アクションのみ許可
  $this->Auth->allow(['index', 'add']);
}
```

すべてのコントローラのindexとaddが見れるように。  
  
/admin/user/addにアクセスして、ユーザーを作成。するとパスワードがハッシュ化されて登録されます。  
このユーザーでログインを試すと入れました。  
  
最初に流し込んだrootユーザーのパスワードは、ユーザー情報編集画面で新しいパスワードに変えるか、Cakephp3で作成されてハッシュ化されたパスワードをphpMyAdminで編集すると反映されます。  
  
$this->Auth->allow()は戻しておきます。  

## ９）残りの管理機能の作成

ニュースとニュースカテゴリ、メニューとメニューカテゴリの管理画面を作っていきます。  
ニュース

```
$ bin/cake bake all news --prefix Admin
```

上書きを聞かれたらしなくてOK。  
  
ニュースカテゴリー

```
$ bin/cake bake all newscategories --prefix Admin
```

テーブル作成時に1つのニュースには複数のカテゴリをつけられるようにしたので、ニュースを作成・編集する際にちゃんとカテゴリが選択できるようになっています。  
  
メニュー

```
$ bin/cake bake all menus --prefix Admin
```

  
メニューカテゴリー

```
bin/cake bake all menucategories --prefix Admin
```

こちらは1つのメニューには1カテゴリと設計したので、メニュー作成の際には1カテゴリだけが選ばれるようになっています。  

## １０）管理画面を整えていく

### ログアウト処理

/admin/logoutにアクセスするとログアウトできるようにします。  
ControllerとViewを作成。  
Controllerはbakeで。

```
$ bin/cake bake controller Logout --prefix Admin
```

  
indexメソッドは下記のように書き換え、その他のメソッドは削除します。

```
public function index()
    {
        return $this->redirect($this->Auth->logout());
    }
```

  
ルーティング追加

```
Router::prefix('admin', function ($routes) {
        $routes->connect('/logout', ['controller' => 'Logout', 'action' => 'index']);
    });
```

これで/admin/logoutにアクセスするとログアウトできるようになります。  

### サイドナビ

各画面にたどり着きやすいように一時的にサイドバーにナビを作っておきます。  
Elementで切り出しますが、管理画面でのみ使いたいので/Admin/Element/に作ります。  
/Template/Admin/Element/side.ctp

```
<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Users') ?></li>
        <li><?= $this->Html->link(__('List User'), ['controller' => 'Users', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?></li>
        <li class="heading"><?= __('News') ?></li>
        <li><?= $this->Html->link(__('List News'), ['controller' => 'News', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New News'), ['controller' => 'News', 'action' => 'add']) ?></li>
        <li class="heading"><?= __('Newscategories') ?></li>
        <li><?= $this->Html->link(__('List Newscategories'), ['controller' => 'Newscategories', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Newscategories'), ['controller' => 'Newscategories', 'action' => 'add']) ?></li>
        <li class="heading"><?= __('Menus') ?></li>
        <li><?= $this->Html->link(__('List Menus'), ['controller' => 'Menus', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Menu'), ['controller' => 'Menus', 'action' => 'add']) ?></li>
        <li class="heading"><?= __('Menusategories') ?></li>
        <li><?= $this->Html->link(__('List Menucategories'), ['controller' => 'Menucategories', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Menucategories'), ['controller' => 'Menucategories', 'action' => 'add']) ?></li>
    </ul>
</nav>
```

  
/Template/Admin/Home/index.ctp などの各ctpでは以下の記述で呼び出せます。

```
<?= $this->element('sidebar'); ?>
```

  
### Created At、Updated Atの日付

各管理項目のCreated At、Updated Atに現在の時刻がでるようにします。  
各add.ctpとedit.ctpのcreated\_atとupdated\_atを下記のようにします。  
（テーブルとカラム作るときにNOT NULLが必要だったかもしれない・・・）

```
echo $this->Form->control('created_at', ['empty' => true]);
↓
echo $this->Form->control('created_at');
```

  
/config/app.phpのdefaultTimezoneの値をAsia/Tokyoにします。

```
'App' => [
 　　　　　　　　〜略〜〜
        'defaultTimezone' => env('APP_DEFAULT_TIMEZONE', 'Asia/Tokyo'),
```

現在の時間が表示されるようになりました👏  
  
  
ここまでで、ユーザー、ニュース、ニュースカテゴリ、メニュー、メニューカテゴリが管理画面から操作できるようになったので、実際に登録して、新規作成、編集、削除、リレーションが正しくできているか、公開画面側の表示、DB側の表示は問題ないかを確認しておきます。  
動きに問題がなければ、管理機能関連の構築は一旦終了です🎉  
  
次回からはレイアウト、デザインなどの構築に入っていきます。  
  
  
# 参考サイト

・Draw.io integration  
<https://techtechmedia.com/draw-io-integration/>  
  
・DB設計など大まかな流れ  
<https://book.cakephp.org/3/ja/tutorials-and-examples/blog/blog.html>  
  
・他のテーブルの情報を引っ張る  
<https://absg.hatenablog.com/entry/2016/04/26/185406>  
  
・ログイン機能  
<https://book.cakephp.org/3/ja/tutorials-and-examples/blog-auth-example/auth.html>  
  
・パスワードハッシュ化  
<https://teratail.com/questions/27139>
