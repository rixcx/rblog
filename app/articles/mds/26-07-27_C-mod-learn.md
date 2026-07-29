---
title: "Stardew Valley MOD 備忘録"
date: "2026-07-27"
---

急なゲームの記事書くか迷ったけど、久しぶりに触ったら忘れていたのでメモ代わりに...

---

MOD制作に興味があったので、少し前からスタバレのMOD制作に挑戦しています。
今回はWikiを参考にしながら、C#で作るスタバレMODの環境構築と基本の書き方を見ていきます。

https://stardewvalleywiki.com/Modding:Index


# 作るもの
C#を使用したSMAPI MOD
`プレイヤーが押したキーが、コンソールログとゲーム内通知ウィンドウに表示される`


# 環境
| 項目 |  |
| ---- | ---- |
| OS | Windows 11 |
| IDE | VScode（拡張機能に`C# Dev Kit`を導入） |
| Stardew Valley | 1.6.14 |


# 開発に必要なもの
#### SMAPI
`Stardew Modding API`の略で、Stardew ValleyがMODを読み込めるようにする前提MOD。
MOD開発の視点でいえば開発用API。ゲーム内で何らかのイベントが発生したとき（例：ボタンが押されたとき）、ゲームのアセットやデータを変更したときなどに反応できます。
導入方法：公式サイトからインストーラーをダウンロード

ちなみに`Content Packs`という前提MODもありますが、こちらはJSONベースであり、主に差し替え・追加がメインのMOD向けになります。（例：アイテム追加、アイテム画像差し替え、NPCポートレート変更、セリフ変更）

#### .NET SDK 6
C#のプログラムを作るための開発ツール一式。ゲームで使用されているバージョンが`.NET SDK 6`なので、このバージョンが必要です。`dotnet`コマンドを使えるようにします。
導入方法：Microsoft公式サイトからSDKをインストール

#### NuGet - Pathoschild.Stardew.ModBuildConfig
NuGetとは.NET開発のためのパッケージマネージャー。ナゲットって読んでいいのかな
`Pathoschild.Stardew.ModBuildConfig`とはSMAPI MOD開発用のNuGetパッケージです。
導入方法：NuGetからプロジェクトへ追加


# サンプルMODを作ってみる
以下のWikiを参考に、簡単なMODを作ってみます。
https://stardewvalleywiki.com/Modding:Modder_Guide/Get_Started#Create_a_basic_mod


## １. ソリューションを作成
#### ソリューションとは
複数の関連するプロジェクトやファイルをまとめて管理するための入れ物。1つ以上のプロジェクトを束ねて、同時に開いたりビルドしたりできるようにします。なくても開発できそうですが、いったんWikiに沿ってみます。

任意のディレクトリでコマンドを実行すると`TestMods.sln`が作られます。
```bash
dotnet new sln -n TestMods
```

## 2. Class Libraryプロジェクトを作成
#### Class Libraryとは
MODの機能をクラスやメソッドに書き、部品（DLL）としてまとめたもの。SMAPIが起動時に読み込み、必要なタイミングでそのメソッドを呼ぶ。

フレームワークはSMAPI対象の`6.0`を指定します。
```bash
dotnet new classlib -n TestMod --framework net6.0
```
TestModというフォルダが作られます。

以下のコマンドでソリューションにファイルを追加しておきます。
```bash
dotnet sln add TestMod/TestMod.csproj
```

## 3. SMAPI用のNuGetパッケージを追加
`Pathoschild.Stardew.ModBuildConfig`パッケージをインストールします。
https://www.nuget.org/packages/Pathoschild.Stardew.ModBuildConfig

```bash
dotnet add TestMod package Pathoschild.Stardew.ModBuildConfig
```

**補足**
`C# Dev Kit`に組み込まれているNugetパッケージマネージャーがあるらしいが、`SDK 6.0`では動作しないらしい
>  the built-in Nuget Package Manager with the C# Dev Kit does not work with SDK 6.0.
> [Modding:IDE reference - Stardew Valley Wiki](https://stardewvalleywiki.com/Modding:IDE_reference#Create_a_mod_project:~:text=a%20NuGet%20package-,In%20Visual%20Studio%20Code,-As%20of%20August)

　
ここまでで開発環境は一通完了です。

## 4. サンプルコードを書く
`Class1.cs`を`ModEntry.cs`にリネームし、以下のコードに上書きします。

```cs
using System;
using Microsoft.Xna.Framework;
using StardewModdingAPI;
using StardewModdingAPI.Events;
using StardewModdingAPI.Utilities;
using StardewValley;

namespace TestMod
{
  /// SMAPIのModクラスを継承してメインクラスを作成
  internal sealed class ModEntry : Mod
  {

    /*********
    ** Public methods
    *********/
    /// MODを読み込んだときに1回だけ読み込まれるEntry()。PHPでいう__construct()
    /// SMAPIからhelperというイベント登録やファイル操作などのSMAPIの便利機能が渡される
    /// helperのeventのInputのButtonPressedというイベントが発生したとき、
    /// OnButtonPressed()とOnButtonPressedInGame()を呼ぶ
    public override void Entry(IModHelper helper)
    {
      helper.Events.Input.ButtonPressed += this.OnButtonPressed;
      helper.Events.Input.ButtonPressed += this.OnButtonPressedInGame;
    }

    /*********
    ** Private methods
    *********/
    /// プレイヤーがボタンを押したら、押したボタンをコンソールログに出す
    private void OnButtonPressed(object? sender, ButtonPressedEventArgs e)
    {
      // セーブデータがロードされ、ゲーム世界が利用可能になっているかを判定する
      // まだゲームを開始していないなら何もしない
      if (!Context.IsWorldReady)
        return;

      // 押されたボタンをコンソールに出す
      this.Monitor.Log($"{Game1.player.Name} pressed {e.Button}.", LogLevel.Debug);
    }

    /*********
    ** Private methods
    *********/
    /// プレイヤーがボタンを押したら、押したボタンをゲーム内通知ウィンドウに出す
    private void OnButtonPressedInGame(object? sender, ButtonPressedEventArgs e)
    {
      if (!Context.IsWorldReady)
        return;

      // 押されたボタンをゲーム内通知ウィンドウに出す
      if (e.Button == SButton.W ||e.Button == SButton.A)
      {
        Game1.showGlobalMessage($"You pressed: {e.Button}");
      }
    }
  }
}
```

### 流れ
```cs
helper.Events.Input.ButtonPressed += this.OnButtonPressed;
```
ButtonPressedイベントが発生したとき、SMAPIの内部で以下を実行しています。
```cs
OnButtonPressed(sender, e);
```
つまり、`OnButtonPressed`の引数はSMAPIがイベント発生時に自動で渡してくれています。
`OnButtonPressed()`が引数とともに実行され、コンソールにログが表示されます。
　
- `ButtonPressed`..SMAPIが用意しているイベント（event）
- `OnButtonPressed` ...作ったメソッド（event handler）

　
SMAPIの提供しているイベントは以下になります。
https://stardewvalleywiki.com/Modding:Modder_Guide/APIs/Events


### オリジナルイベントハンドラの追加
Wikiのサンプルから手を加えて、ゲーム画面にログを表示する`OnButtonPressedInGame()`を追加しています。

こちらはゲーム本体側が提供している`Game1`というコアクラスを使用しています。MODからゲームの状態を取得・変更するときによく使われます。
[Main classes - Stardew Valley Wiki](https://wiki.stardewvalley.net/Modding%3AModder_Guide/Game_Fundamentals?utm_source=chatgpt.com#Main_classes:~:text=location%0A%0A%20%20%20%20...%0A%7D-,Main%20classes,-Game1)

例えば、現在のプレイヤーの所持金を取得したいときは`Game1.player.Money`となります。


### 定義元の参照
`Game1.player`でとれるプレイヤー情報は他に何がある？`.showGlobalMessage()`以外のクラスは？となったときに便利なのが（というかほぼ必須なのが）**定義元の参照**です。
VScodeだとマウスホバーでその情報を見ることができ、右クリック→Go to difinitionでそのメソッドに飛ぶことができます。
![](/images/articles/26-07-27_C-mod-learn/01_difinition.png?w=700)


または補完候補を利用するのも手です。
![](/images/articles/26-07-27_C-mod-learn/02_difinition.gif?w=700)


## 5. manifestファイルを追加
SMAPIになんのMODかを知らせるための説明ファイルを追加します。
`manifest.json`を新規追加し、必要な情報を記載します。
```json
{
  "Name": "TestMod",
  "Author": "rixcx",
  "Version": "1.0.0",
  "Description": "押されたボタンをログに表示するテストMOD",
  "UniqueID": "rixcx.TestMod",
  "EntryDll": "TestMod.dll",
  "MinimumApiVersion": "4.0.0",
  "UpdateKeys": []
}
```

## 6. MODをビルドする
#### .NETでいうビルドとは
C#のソースコード`.cs`を、ゲームが読み込めるDLL`.dll`に変換する作業のこと。

`TestMod.csproj`がある場所に移動し、ビルドコマンドを叩きます。
```bash
cd TestMod
dotnet build
```
/binファイルが作成されたらOK。


## 7. MODの配置と起動・動作確認

Nugetパッケージの`Pathoschild.Stardew.ModBuildConfig`が正しく動作してる場合、ビルドした後に下記のフォルダにTestModフォルダが追加されているはずです。

````txt
C:\Program Files (x86)\Steam\steamapps\common\Stardew Valley\Mods
````
　
存在を確認したらスタバレを起動。
起動時のコンソールに`[SMAPI] - TestMod`があればOK！


いろいろボタンを押してみて、動作すれば成功です🚶‍♀️
![](/images/articles/26-07-27_C-mod-learn/03_result.gif?w=750)


# 終わりに
MODを作るのに時間を取られてゲームする時間がない


# 参考サイト
https://stardewvalleywiki.com/Modding:Modder_Guide/Get_Started
https://stardewvalleywiki.com/Modding:IDE_reference#Create_a_mod_project
https://stardewmodding.wiki.gg/