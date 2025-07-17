---
title: Apple MusicからYoutube Musicにプレイリストを移行する
slug: migration-from-apple-music-to-youtube
status: published
visibility: public
tags:
  - 技術の話
authors:
  - たねのぶ
ghost_id: 67e95fb46986b90001f44461
ghost_updated_at: '2025-03-30T23:00:54.000Z'
published_at: '2025-03-30T23:00:54.000Z'
feature_image: 'https://hanatane.net/content/images/2025/03/apple-music-to-youtube-music-1.png'
custom_excerpt: Apple MusicからYoutume Musicへプレイリストを移行したのですが、意外とハマりどころが多かったので共有しておきます。
---
月末でPaypayステップを達成するためにiTunesにチャージしたところ、Apple Musicの1ヶ月間無料をもらえたので、Apple MusicからYoutume Musicへプレイリストを移行しました。意外とハマりどころが多かったので共有しておきます。

## 前提 & 注意事項

### Apple Musicの有効なサブスクが必要

もともと放送大学の学割を使ってApple Musicを月500円で利用していたのですが、最大4年間の期間が終わったのでYoutubeに1本化しました。その際にプレイリストの移行を忘れていたので移行方法を以下のページで確認しました。

[

Apple Music のプレイリストのコピーを別のサービスに転送する - Apple サポート (日本)

Apple の「データとプライバシー」ページから、Apple Music で作成したプレイリストを YouTube Music に転送するようリクエストすることができます。

![](https://hanatane.net/content/images/icon/favicon-12.ico)Apple Support



](https://support.apple.com/ja-jp/120030)

> Apple Music または iTunes Match の有効なサブスクリプションが必要です。

これは絶対にEUあたりに鉄槌を下してほしいものです。

基本的にはサブスクが有効なうちに作業しますが、僕のように逃してしまった場合は無料体験の機会を逃さずに実行するようにしましょう。

### Safariで作業したほうがよいかも

今回途中までMacのChromeで作業していたのですが、Googleアカウント認証の段階で謎にシャットダウンされてしまったのでSafariの方で作業しました。

## 移行手順

[https://privacy.apple.com/](https://privacy.apple.com/) にアクセスします。

「データのコピーを転送」をクリック

![](https://hanatane.net/content/images/2025/03/image-17.png)

Apple Musicのプレイリストを選択

![](https://hanatane.net/content/images/2025/03/image-18.png)

プレイリストの書き出し

![](https://hanatane.net/content/images/2025/03/image-19.png)

ここでChromeだとエラーが出たのでSafariの方で進めました。(なので英語UIになっています)

GoogleのOAuthログイン画面が出るので移行したいGoogleアカウントで認証すると確認画面が出ます。

![](https://hanatane.net/content/images/2025/03/image-20.png)

エクスポートを確認するとリクエストが受理されます。

![](https://hanatane.net/content/images/2025/03/image-21.png)

メールを確認しにいくと既に完了したメールが出ていました。曲データをエクスポートしているわけではないので速いと思います。

Youtubeの方でも確認。

![](https://hanatane.net/content/images/2025/03/image-22.png)

あとついでにAppleの無料サブスクも忘れずに解除しておきます。

![](https://hanatane.net/content/images/2025/03/image-23.png)

## 所感

音楽サブスクについて考える機会になりましたが、米国でYouTube Premium Liteのような音楽特典を削った廉価プランが出ているのを見ると、「音楽をサブスクで聞く時代も転換期が来ているのかな？」と感じました。僕自身は音楽をそんなに聴く方ではないのですが、これからはセルフホストで音楽を所有する時代に立ち戻るのかもしれません。

Appleに関しては戦争状態となっているSpotifyへのエクスポートがないあたりにメイクアメリカグレートアゲインを感じました。
