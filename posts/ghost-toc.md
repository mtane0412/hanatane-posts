---
title: Ghostに目次をつける
slug: ghost-toc
status: published
visibility: public
tags:
  - 技術の話
  - Ghost
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec129
ghost_updated_at: '2024-02-03T12:55:30.000Z'
published_at: '2024-02-03T12:55:30.000Z'
feature_image: >-
  https://hanatane.net/content/images/2024/02/tanenobu_8411002113_a_casper_ghost_is_writing_table_of_contents_34bab1e0-de6c-42cc-8dfb-412322a16c6b.png
custom_excerpt: Ghostに目次(ToC)をつける
---
少し前から各記事に目次をつけるようにしてみた。

## やり方

-   Ghostは標準で目次(Table of Contents)を作る機能はなく、テーマに追加するしかない。
-   [Tocbot](https://tscanlin.github.io/tocbot/)を使うものが紹介されている
    -   テーマをいじる必要があるのでGhost Proの場合はCreator以上のプランが必要
-   作り方は公式のチュートリアル通りでOK(Tocbotのバージョンだけ最新にしとこう)

[

How to add a table of contents to your Ghost site

Let your readers know what to expect in your posts and give them quick links to navigate content quickly by adding a table of contents with the Tocbot library.

![](https://ghost.org/favicon.ico)TutorialsTeam Ghost

![](https://ghost.org/tutorials/content/images/size/w1200/2022/05/toc.jpg)

](https://ghost.org/tutorials/adding-table-of-contents/)

## 感想

できるだけシステム側をいじらないという方針だったが、デフォルトだと不便な部分もあるのでテーマを改造する必要が出てきた。テーマをいじれるのはやはりいいのだけど、今後のテーマアップデートがあったときにカスタムテーマと整合性を取ることを考えると少し億劫になる。

こうした公式のチュートリアルがいくつかあるのでそれに従って機能追加するとよい。Casperだと特に何も考えずにインストール可能。

GhostはWordPressに対するエンジニアの怒りが形になったものなので、安易なプラグインとして実装せずにこうした既存のライブラリを活用する形になっているのだと読んでいる。SaaS型のサービスとして提供しつつ、エンジニアの責任領域にユーザーを立ち入らせない工夫でGhostのシンプルさが担保されているのだろう。
