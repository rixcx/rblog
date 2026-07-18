---
title: "PHPのエラーと例外について"
date: "2026-07-15"
---


PHPのエラーと例外（Exception）について、理解がふわっとしたままだったので、整理をしておきたい。


# ErrorとException
一言にエラーと言っても、PHP上では`Error`と`Exception`に分かれます。
正確には`Throwable`という基底インターフェイスがあり、以下のような継承関係になっています。
```txt
Throwable 
├── Exception 
└── Error
```

（まずPHP開発におけるエラーと例外を一緒にして発言していたので、そういうところから気を付けたい）


## Error
プログラミングコードにおけるエラー。
引数が足りない、値の型が一致しない、構文エラーなど。そのためPRODにあげるべきではありません。
これらの`Error`は`catch`しなくても、発生した時点でPHPが自動的にエラーメッセージを表示し、通常は処理を終了します。

### Error クラス（例外オブジェクト）の種類
| エラー名 | 内容 |
| --- | --- |
| ArgumentCountError | 関数・メソッドの引数の数が不足などの場合に発生するエラー |
| ArithmeticError | 算術演算中に発生するエラー |
| AssertionError | assert() の条件が満たされなかったときに発生するエラー |
| DivisionByZeroError | 0で除算した場合に発生するエラー |
| CompileError | コンパイル時に検出されるエラー |
| ParseError | PHPの構文解析時に発生する構文エラー |
| TypeError | 型宣言に合わない値が渡されたり、返されたりした場合に発生するエラー |
| ValueError | 型は正しいものの、値が不正な場合に発生するエラー |
| UnhandledMatchError | match 式で一致する条件がなく、default も定義されていない場合に発生するエラー |
| FiberError | Fiberの状態が不正な場合に発生するエラー |

### エラーレベル
PHPのエラー分類。

| エラーレベル | 処理継続 | 例 |
| --- | --- | --- |
| Parse error | × | 文法ミス |
| Fatal error | × | 致命的エラー |
| Warning | ○ | ファイルが見つからない |
| Notice | ○ | 未定義変数 |

 　
 
```php
$name = "taro"
echo $firstName;

// result - 処理は継続
Notice: Undefined variable $firstName
```
```php
function test(int $x) {}
test("abc");

// result - fatalなので処理は継続しない
Fatal error: Uncaught TypeError ...
```

## Exception
開発者が投げるエラー。
正確にはエラーではなく**正常な処理を続けられない状態**を知らせるためのもの。
ファイルが見つからない、認証失敗、DB接続失敗、など。たいていはエラーとなる場合にthrowで明示的に発生させるかと思います。
PHPは通常の実行フローを中断し、エラー処理へ入っていきます。

発生した例外を 捕捉するには、コードを `try`で囲みます。
その例外は、マッチする `catch`が見つかるまで関数のコールスタックを遡っていきます。

```php
try {
    throw new Exception("エラーが発生しました。");
} catch (Exception $e) {
    echo $e->getMessage();
}

// result
エラーが発生しました。
```

### よく使われる Exception クラスの種類
| クラス名 | 内容 |
| --- | --- |
| Exception | 基本となる例外クラス |
| RuntimeException | 実行時の異常（ファイル操作や外部サービスなど） |
| InvalidArgumentException | 引数が不正な場合 |
| LogicException | プログラムのロジックに問題がある場合 |
| DomainException | 値が許容範囲外の場合 |
| OutOfBoundsException | 存在しないインデックスなどを参照した場合 |

## 例外の拡張
`Exception`を継承して自作の例外クラスをつくることもできます。
用意してあるものでは表現しきれないとき、専用の例外を作ると意味が明確になり、可読性や保守性が向上します。また、例外に独自のプロパティやメソッドを追加することもできます。


```php
// カスタム例外
class UserNotFoundException extends Exception
{
    private int $userId;
    public function __construct(int $userId)
    {
        parent::__construct("ユーザーが見つかりません。");
        $this->userId = $userId;
    }
    public function getLogMessage(): string
    {
        return "[USER_NOT_FOUND] User ID: {$this->userId}";
    }
}

// ロジック
function findUser(int $userId): array
{
    $users = [
        1 => ['id' => 1, 'name' => 'tanaka'],
        2 => ['id' => 2, 'name' => 'hayashi'],
    ];

    if (!isset($users[$userId])) {
        throw new UserNotFoundException($userId);
    }

    return $users[$userId];
}

try {
    $user = findUser(99);
    echo "ユーザー名: {$user['name']}";
} catch (UserNotFoundException $e) {
    echo $e->getMessage();
    echo PHP_EOL;
    echo $e->getLogMessage();
} catch (Exception $e) {
    echo "その他のエラーが発生しました。";
}

// result
ユーザーが見つかりません。
[USER_NOT_FOUND] User ID: 99
```

## ログと例外
例外を出す場合、調査のためにログを出すケースが多いと思います。
これらはセットで考えられますが、役割は異なります。

- **例外**：異常を呼び出し元へ伝える
- **ログ**：異常を後から調査できるように記録する


一般的には、`catch`した場所でログを記録し、例外は`throw`で上位へ伝えます。
```php
try {
    $user = findUser(99);
} catch (UserNotFoundException $e) {
    // ログに記録
    error_log($e->getLogMessage());
    // 必要なら画面用の処理
}
```

### ロガーを使う場合
ロガーを使うと、どのレベルのログとして記録するかを考えることができます。
```php
try {
    $user = findUser(99);
} catch (UserNotFoundException $e) {
    $logger->warning($e->getLogMessage());
}

// ログのイメージ
[2026-07-13 10:30:15] app.WARNING: [USER_NOT_FOUND] User ID: 99
```

例外の種類とログレベルには直接の対応関係はありません。
**システムとしてどれくらい重要な出来事か**によってログレベルを決めます。

```php
// ユーザーが存在しないのは想定内
$logger->warning(...);

// システム障害につながるなら
$logger->error(...);
```