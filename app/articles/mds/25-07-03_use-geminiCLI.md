---
title: "Gemini CLI を使ってみる"
date: "2025-07-03T15:00:00.000Z"
---

# Gemini CLIとは？

Google Geminiをターミナルから使うことができるツール。  
他のAIツールより無料枠が広く使いやすいらしい。  
日々の業務でGithub copilotなどを頻繁に使っていてかなり助かっている一方、個人ではお金がかかるというところで懸念していたので、Gemini CLIを導入してみることにしました。  
  
# セットアップ

[Quickstart](https://github.com/google-gemini/gemini-cli) を参考に進めていきます。  
```bash
npx https://github.com/google-gemini/gemini-cli
```

上記のコマンドを叩くとカラーテーマを選ぶ画面に。  
カラーを選んでEnderを押すと、認証方法を選ぶ画面に。
```text
Select Auth Method 
│ ● Login with Google 
│ ○ Gemini API Key (AI Studio) 
│ ○ Vertex AI   
```

スタンダートに Login with Google を選択すると、ブラウザが開きログイン画面に遷移。  
手順に沿って進み、ターミナルへ戻ると、Geminiが使える様になりました👏  
  
# なにかお願いしてみる

ちょうど作業していたプロジェクトで、ローカル環境を開くときにdockerの起動とViteのサーバーの起動の2度手間になっている部分があるので、改善してもらおうと思います。  
![](https://images.microcms-assets.io/assets/d28f59f0513b4ee89b2a2a0633e54732/3a83ea8c4b7c43a3bc5d56d8f1b851b9/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202025-07-04%2022.30.49.png?w=700&h=278)  
  
するとディレクトリの中を解析し、色々提案をしてくれます。  
![](https://images.microcms-assets.io/assets/d28f59f0513b4ee89b2a2a0633e54732/a989ed4a63b744a4b0f7194ec499610f/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202025-07-04%2022.32.45.png?w=700&h=515)  
複数のnpmスクリプトを並行して実行するためのパッケージconcurrently を使うことを提案されました。  
  
![](https://images.microcms-assets.io/assets/d28f59f0513b4ee89b2a2a0633e54732/7438a9004c2d43dba73100602f594331/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202025-07-04%2022.40.54.png?w=700&h=606)  
ルートディレクトリに package.json を作成するやconcurrently をインストールする、package.jsonに書き込む、など、ファイルに変更を求めるという場面では認証を求められます。  
設定ができたようなので提案されたコマンドを打ってみると、確かにどちらも1コマンドでローカル環境が立ち上がりました。  
  
ディレクトリを確認すると、node\_modulesファイルの変更がとんでもなく上がってきていたので.gitignoreに書くよう依頼します。  
![](https://images.microcms-assets.io/assets/d28f59f0513b4ee89b2a2a0633e54732/8eee24e500d8471dbb205a9382e8f3b8/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202025-07-04%2022.44.13.png?w=700&h=493)  
  
# コミットもお願いしてみる

作業の途中で他に変更したファイルもいくつかあったので、プロンプトにはその指示もいれました。  
![](https://images.microcms-assets.io/assets/d28f59f0513b4ee89b2a2a0633e54732/aa7fd2378b9b47cd923635340dbc42f5/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202025-07-04%2022.55.13.png?w=700&h=505)  
見事にコミットしてくれました🐱  
  
# 終わりに

Claude codeやGithub Copilotと同じくらいの力を無料範囲でここまでできるのはすごい  
ただし無料枠はデータ収集されるので取り扱いには注意、かつまだまだプレビュー中なので今後制限は狭くなるのかもしれない...

> your **prompts, answers, and related code are collected** and may be used to improve Google's products

<https://github.com/google-gemini/gemini-cli/blob/main/docs/tos-privacy.md>
