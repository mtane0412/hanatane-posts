---
title: セルフホストGhostでMailgun一括送信のbatch sizeを設定する
slug: ghost-mailgun-setup
status: published
visibility: public
tags:
  - 技術の話
  - Ghost
authors:
  - たねのぶ
ghost_id: 67f288056986b90001f445b5
ghost_updated_at: '2025-04-07T02:24:44.000Z'
published_at: '2025-04-06T22:00:39.000Z'
feature_image: 'https://hanatane.net/content/images/2025/04/mailgun-setup.png'
custom_excerpt: >-
  GhostをセルフホストしてMailgunでニュースレター配信を試みたが、Mailgunの評価期間の制限で一括送信に失敗。Ghost側でbatchSizeの設定変更と、Mailgunサポート対応を含めた対策をまとめました。
---
以下の記事の補足でニュースレターの配信に使用しているMailgunの設定がうまくいっていませんでした。

[

Ghostをセルフホスト版に移行した

Ghost Pro(マネージド)からさくらのVPS(1GB)上のセルフホスト版に移行したメモ

![](https://hanatane.net/content/images/icon/icon512-3.png)はなしのタネたねのぶ

![](https://hanatane.net/content/images/thumbnail/c451f66e-de7a-4701-aa94-ecd8af8cf06e.webp)

](https://hanatane.net/ghost-migration-from-pro-to-selfhost/)

結論から言うと、Mailgun作りたての場合はbatch sizeを設定して少しずつ送信するようにするのが正解GhostをセルフホストしてMailgunでニュースレター配信を試みたが、評価期間の制限で一括送信に失敗。`bulkEmail__batchSize`の設定変更と、Mailgunサポート対応を含めた対策をまとめた技術メモ。

セルフホストするときに結構同じ轍を踏む人が多そうなのでメモしておきます。

## GhostのMailgunの送信方式

Ghostはデフォルトではメール配信サービスのMailgunを使用してメールを送っています。TransactionalとBulk Emailの二種類で、前者は登録確認など1人への送信に使われるものでSMTPを使用し、後者は記事配信で一斉送信に使用するのでMailgun API経由で配信します。昨今スパム判定がかなり厳しくなってきているので、ニュースレターのような多人数に確実に届けたい場合はMailgunのような外部サービスを使用する必要があります。

![](https://hanatane.net/content/images/2025/04/image.png)

[

Why do I have to set up Mailgun for newsletters?

Sending bulk email to many recipients using SMTP is not supported. In order to send newsletters from Ghost you’ll need to setup Bulk Mail with Mailgun.

![](https://hanatane.net/content/images/icon/favicon-17.ico)Ghost - The Professional Publishing Platform

![](https://hanatane.net/content/images/thumbnail/ghost-docs-2.png)

](https://ghost.org/docs/faq/mailgun-newsletters/)

## 記事の一括送信ができない

問題は設定したと思っていた一斉送信が実はうまくいっていなかったことでした。

Dockerのログを確認してみます。

```bash
INFO "GET /ghost/api/admin/emails/xxxx
[2025-03-23 10:01:15] ERROR status code 420
[2025-03-23 10:01:15] ERROR [BULK_EMAIL_DB_RETRY] Sending email batch xxxxx  - Failed (2th try)

[BULK_EMAIL_DB_RETRY] Sending email batch xxxxx  - Failed (2th try)

"Mailgun Error 420: Domain mg.hanatane.net is not allowed to send: recipient limit exceeded, try again after Sun, 23 Mar 2025 10:01:34 UTC"
"https://ghost.org/docs/newsletters/#bulk-email-configuration"
```

```bash
[2025-03-23 11:02:55] INFO Sending email to 16 recipients
[2025-03-23 11:02:55] INFO "GET /ghost/api/admin/emails/xxxxx/" 200 27ms
[2025-03-23 11:02:56] ERROR Forbidden
[2025-03-23 11:02:56] ERROR [BULK_EMAIL_DB_RETRY] Sending email batch xxxxx  - Failed (2th try)

[BULK_EMAIL_DB_RETRY] Sending email batch xxxxx  - Failed (2th try)

"Mailgun Error 403: Domain mg.hanatane.net is not allowed to send large batches yet"
"https://ghost.org/docs/newsletters/#bulk-email-configuration"
```

どうもアカウント作りたての場合は一度に大量に送れないようです。誰でもボコスカ送れるとそれはスパムやりたい放題なのでここは納得です。

## 一括送信のバッチサイズを設定する

対策を調べるとGhost側ではメール送信のバッチサイズを設定できるオプションがあるらしい。

[

Mailgun story, again

If you’re self-hosting you can set the batch size in config to get within your Mailgun limits whilst warming up your account. config.production.json { ... “bulkEmail”: { “batchSize”: 10 } } Just be sure to increase it over time as your account limits are raised (default and max is 1000) to keep your sending and database tables efficient.

![](https://hanatane.net/content/images/icon/f381b3b952df5ad42fe691a8b14aa7f0c96c461a_2_180x180.png)Ghost ForumKevin

![](https://hanatane.net/content/images/thumbnail/8d4e1be1543b3ed506f105953a0d062b84797e42.png)

](https://forum.ghost.org/t/mailgun-story-again/39665/16)

```yaml
bulkEmail__batchSize: 10
```

バッチサイズを10にすると、一応送信は可能になったものの、全部送信される前にエラーで中段されている模様。エラーログを見るとやっぱりまだバッチがでかすぎるみたいなことを言われているようでした。

### Mailgunの評価期間の制限

フォーラムの他の情報を見ても解決策はサポートに連絡することとあったのでサポートに連絡すると以下のことが返ってきました。

-   スパム対策が作動してアカウントが評価期間\[1\]に入っている
-   この期間中は以下の制限がある
    -   1時間100メッセージまで
    -   送信はメッセージごとに9人まで
    -   メール検証の無効化
-   解除を検討するからビジネス情報とか利用規約とか色々送れ

特にメッセージごとに9人という制限が重要で、フォーラムのサンプル値だった10ですら引っかかることになります。

一旦バッチサイズを5に設定するとなんとか送信されるようになりました。

```yaml
 bulkEmail__batchSize: 5
```

![](https://hanatane.net/content/images/2025/04/image-1.png)

Mailgunのサポートとはその後もやりとりしたのですが、まだ運用が短いので解除せず継続になったとのことでしばらく様子見が必要そうです。

📝

2025/4/7 追記: 5日後にサポートから連絡がきて運用確認後、制限が解除されたとの連絡がきました。やったね！
