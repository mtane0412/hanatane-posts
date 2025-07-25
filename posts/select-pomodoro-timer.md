---
title: ポモドーロタイマーを選ぶ
slug: select-pomodoro-timer
status: published
visibility: public
tags:
  - 技術の話
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec122
ghost_updated_at: '2024-02-01T14:49:18.000Z'
published_at: '2024-01-16T14:07:50.000Z'
feature_image: 'https://hanatane.net/content/images/2024/01/pomodoro.png'
custom_excerpt: 挫折に挫折し続けてきたポモドーロ・テクニックですが、自分なりによいやり方が見えてきました。
---
[ポモドーロ・テクニック](https://ja.wikipedia.org/wiki/%E3%83%9D%E3%83%A2%E3%83%89%E3%83%BC%E3%83%AD%E3%83%BB%E3%83%86%E3%82%AF%E3%83%8B%E3%83%83%E3%82%AF)、やってますか。僕はずっとやれてませんでした。時間をただ25分と5分に区切るだけで、集中できるようになるんだという程度の解像度で手を出したものだから、25分だらだらしてあげく5分しっかり休憩するただの自堕落な人間を生み出しただけでした。

時をしばらくして[井戸端](https://scrapbox.io/villagepump/)の人達が作業をポモドーロ単位で管理しているのを見て、再びポモドーロの夢を見始めました。最初に比べたらほんの少し解像度はあがっていて、少なくともポモドーロを終えたときのレビュー作業がとても重要だということは認識できていました。まず1日に何ポモドーロくらい集中できる時間が作れるのかというのを可視化して、次にポモドーロを増やすには、とか、限られたポモドーロを何に当てるかというのが重要なのだと思います。

昔から使ってる[Toggl](https://toggl.com/)がポモドーロタイマーを出していたのでまず第一候補だったのですが、Togglはツールの思想上すべての時間管理に手を出してしまいがちになってしまうことや、ポモドーロ機能も内部的には通常のTogglタイマーを使用しており、Apple Watchで見たときには通常のタイマー表示になっているという部分にオアアアー！となってしまったので見送りです。

![Mac上のTogglとFlowのスクリーンショット](https://i.gyazo.com/2cb718e85ad41ee94647f1a33c58b3a6.png)

左がToggl, 右下がFlow

ということで今回は[Flow](https://flowapp.info/)というアプリを試してみています。余計なものを廃したシンプルなデザインです。これがすごい大事で、他のアプリは作業内容について何かしら記入させるUIなのですが、Flowはぱっとみスタートストップくらいしか触るところがなさそうです。実は「Flow」がタイトル部分で変えられるのですが、今のところあんまり触らずそのまま使っています。とにかくタイマーがそこにありスタートするのみ。セッションごとにきちんとタイトル管理しようなどという認知的負荷の高い行動をデザイン的に防いでいる気がします。

![Mac上でAlfredからFlowを操作するGIFアニメーション](https://hanatane.net/content/images/2024/01/9badba12a064c301e3bd0d6a2009476d.gif)

Alfredでどの文脈でもタイマーをいじれる

FlowはURLスキーム対応していてAlfredも公式のワークフローがあるのでどのコンテキストにいてもタイマーを操作できてとても便利です。Togglはユーザー開発のものがあるのですが、地味に毎回インストールに苦労しているのでこりごり感なのと、Alfred経由でポモドーロタイマーを叩けなかったのも痛手でした。

[Flowのロードマップ](https://flowapp.info/roadmap/)を見ると、API実装やThingsとのintegrationなど、かなり期待できるものが予定されています。これはしっかり応援するに値するな、ということで早速買い切り版を買ってしまいました。

![Flowの統計画面](https://i.gyazo.com/60b99f396c7c69d7f4c02021df62e1f0.png)

Stats表示もシンプル

ポモドーロを実践すると大体同じ結論に至るようですが、自分は1日に集中できる時間を全然確保できていないのだなぁと痛感します。以前はここで自分が自堕落な人間であるという納得しやすい結論で逃げられていたのですが、今回はどのあたりをいじると自分のポモドーロ数を増やせるかという視点に立てているので少しはマシになってそうです。

ドラッカーも「私の観察によれば、成果をあげる者は仕事からスタートしない。時間からスタートする」みたいなことを言ってるみたいです。めちゃくちゃ高い成果をあげたいとかではないのですが、稼働時間限られてるので有効活用したいですね。さすドラ。

この記事は2ポモドーロで書きました。
