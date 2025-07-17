---
title: Ghostの記事を検索するAlfred Workflowを作った
slug: alfred-ghost
status: published
visibility: public
tags:
  - 技術の話
  - Ghost
  - Alfred
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec128
ghost_updated_at: '2024-01-31T02:38:42.000Z'
published_at: '2024-01-31T02:27:38.000Z'
feature_image: >-
  https://hanatane.net/content/images/2024/01/tanenobu_a_casper_ghost_who_wears_a_bowler_hat_with_a_purple_ri_4859c450-9397-4366-8499-83b401a937e2.png
custom_excerpt: Ghostの記事をインクリメンタルサーチしてURLをクリップボードにコピーするAlfred Workflowを作りました
---
## alfred-ghost

タイトル通りGhostの記事をインクリメンタルサーチして公開URLをクリップボードにコピーするAlfredを作った。他にも日常周りのちょっとしたショートカットも仕込んでおいた。

-   `ghost n`: 新規記事作成
-   `ghost o`:ダッシュボードを開く
-   `ghost s {query}`: queryを含むタイトルの記事を検索。`enter`でURLコピー、`control+enter`で記事を開く

![alfredからインクリメンタルサーチで検索できる](https://hanatane.net/content/images/2024/01/b62d42ff6588b02e575d9b358438a447-1.gif)

一応ダウンロードできるようにしておいた。[jq](https://jqlang.github.io/jq/)が必要なので適宜入れてください。

[

Releases · mtane0412/alfred-ghost

alfred workflow for Ghost. Contribute to mtane0412/alfred-ghost development by creating an account on GitHub.

![](https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg)GitHubmtane0412

![](https://opengraph.githubassets.com/20cc236965a011218b0e19feb3fd2e72c4e04e5e0249b5f933b667bce327189c/mtane0412/alfred-ghost)

](https://github.com/mtane0412/alfred-ghost/releases)

## モチベーション

Ghostのエディタはdynamic menuというもので色々な埋め込みとかを簡単に追加できるようになっている。ところがどういうわけか、自分の過去の記事を参照して挿入するといった機能がありそうでない。

過去記事にリンクを張るときは毎回自分のサイトを開いて検索してURLをコピーする作業をしていたのだが、あまりにも面倒なのでAlfred workflowを作ろうと思った。

## ChatGPTでAlfred Workflow作る体験がやばい

Alfred Workflowのプログラムを使う部分はシェルスクリプト・Apple ScriptをはじめJavaScriptやPythonなんかの言語でも記述することができる。なので、Alfyなんかを利用してNode.jsで書くのがこれまでの現実的な部分だった。Node.jsを使う場合、Alfredの実行環境としてNode.jsがインストールされている状態の方がパッケージとか必要ないので作る側としては楽なのだが、使う側は要件が増えるのであまり嬉しくないポイントになる。

AlfredはMac専用アプリなので、Apple Scriptを使えば追加の環境構築必要なしにWorkflowができるのだけど、今更AppleScriptを習得するコストをかけるのもなんかいやで及び腰だった。

今はChatGPTという大変優秀なプログラマに頼れるので、こいつに要件を伝えてAppleScriptを書かせるとすんなりできるんだろうなと思って相談してみた。想像通りだが、いくらかやりとりをしながら数十分でできてしまった。

大してプログラム書く能力がない僕が、こうしてめちゃくちゃ生成AIの恩恵を感じているから、本職はもっとすごいんだろうなと思う。一方で、周囲を見渡してみると、今までプログラムを書けなかった人が生成AIを活用してプログラムを書けるようになってるかというと必ずしもそうではないという面もあるように感じる。実際今回のworkflowもAPIのレスポンスとかを調べてGPTに渡していたり、細かいところは自分でやったりしたので、「誰でも作れるようになった」のではなく「作れる人がめっちゃ簡単に作れるようになった」というのが実像に近い。

すべての人に開かれたインターネットが逆に断絶を深めてるみたいな皮肉が生成AIでもさらにすごい速度で展開されていくのだろうなと思った。
