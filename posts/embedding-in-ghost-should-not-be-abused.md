---
title: Ghostで埋め込みを乱用すべきではない
slug: embedding-in-ghost-should-not-be-abused
status: published
visibility: public
tags:
  - Ghost
  - 技術の話
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec11f
ghost_updated_at: '2024-01-08T09:46:54.000Z'
published_at: '2024-01-08T09:46:54.000Z'
feature_image: >-
  https://hanatane.net/content/images/2024/01/18898959-564f-49b9-9960-8b6b2c8f46ef.webp
custom_excerpt: ニュースレターなのでメール配信を想定した記事作りが必要という話
---
前回の記事投稿時の発見。

Xで日々の活動を記録しておくと、振り返りやすく、記事に順序良く埋め込むことで簡単に時系列のメモが作成できるため、時間の節約に役立っていた。

しかし、Ghostで公開した記事は購読者へメールで送られるが、埋め込まれた画像が正しく表示されないことに気付いた。表示されるのは、Xの埋め込みスクリプトが適用される前の引用テキストだった。

![](https://i.gyazo.com/523e4fc155be1ceca743929ee7f9cc69.png)

これでは何が何だかわからない。調べてみると、セキュリティ的な理由でHTMLメールではiFrameやJavaScriptは無効化されることが多いようだ。Xは画像もScriptで展開しているのでこういう表示になってしまう。

[

Can I use embeds in email newsletters?

Most modern email clients disable dynamic embeds for security, find out how to work around this.

![](https://ghost.org/favicon.ico)Ghost Help CenterGhost

![](https://ghost.org/help/content/images/size/w1200/2023/05/help-site-cover-1.png)

](https://ghost.org/help/can-i-use-embeds-in-email-newsletters/)

埋め込みをメールでも正しく表示させたい場合はスクショを推奨している。前にXの埋め込み自体がうまく機能しなかったときもサポートにスクショを推奨されたがこういう理由もあったのだなぁと理解した。

考えてみると当たり前だが、しかしブログを書く感覚でやってるとハマりがちかもしれない。今後はニュースレターの作法も意識する必要があることがわかった。

なお、Youtubeとかはサムネイルを画像として貼ってクリックするとビデオプレイヤーに飛ばしてくれるという親切な設計になっているらしい。
