---
title: Ghostをセルフホスト版に移行した
slug: ghost-migration-from-pro-to-selfhost
status: published
visibility: public
tags:
  - 技術の話
  - Ghost
authors:
  - たねのぶ
ghost_id: 67dc2acf43dc2a0001d2fe0d
ghost_updated_at: '2025-04-08T15:02:28.000Z'
published_at: '2025-03-23T08:52:57.000Z'
feature_image: >-
  https://hanatane.net/content/images/2025/03/c451f66e-de7a-4701-aa94-ecd8af8cf06e.webp
custom_excerpt: Ghost Pro(マネージド)からさくらのVPS(1GB)上のセルフホスト版に移行したメモ
---
このブログで使っているGhostを有料のマネージド版から自分でVPSサーバーを借りてセルフホスト版に移行したので、移行手順等を含めて記録しておきます。

## モチベーション

短く言うと、自分に発破をかける意図でマネージドプランをやったけどどうにもうまくいってないので、一旦運営コストを下げるために移行しました。

それまでStarterプラン(年間108ドル)だったのが、APIさえも使えずかなり不便だったため、意を決してCreatorプラン(年間300ドル)に2024/3/25に移行していました。運用コストをかけることでしっかり回収するように自分を誘導したかったのですが、この1年を振り返るとなかなか継続的なアウトプットには繋がらなかったという感じで申し訳ないです。

ありがたいことに支援してくださっている方のおかげで300ドルはペイすることができました。2年目、気を引き締め直して継続するかどうかを悩んだのですが、プランの維持でいっぱいいっぱいよりも別のことに使えた方がベターだと考え、収支バランスを見直すことにしました。

もう1点、マネージドにすることでメンテナンスを省力化することができるというものがあったのですが、昨今はDockerのようなコンテナ技術によってセルフホストも格段に楽になったのも大きな理由の一つです。

## VPSサーバー選定

自宅サーバーを色々いじっているので自宅でも良いかと思ったのですが、Stripeなどの決済が絡むので可用性の低い状態で運用するのは望ましくないと考えたのでサーバーを借りることにしました。

AWSやGCPなどのIaaSも検討しましたが、サービス規模的にはVPSで十分です。Ghostの場合はRAM1GBで借りている人が多かった印象なので、TokyoリージョンのあるVPSを中心に検討しましたが、どこも価格的には大きく違いはなく5ドルです。

Linodeはスペック面でも色々と魅力的だったのですが、なんとなくさくらインターネットの田中さんをタイムラインで見る機会が最近多いのでさくらのVPSにしようと思いました。2018年まで使っていたみたいなので7年ぶりです。

## 移行手順

### さくらのVPSにdebian+docker環境でGhostをインストール

自宅サーバーで使っているProxmoxがdebianがデフォ、RasbianもdebianベースなのでVPSもdebianにして統一しました。

OSインストール時にGithubの公開鍵をインポートしてくれる機能があって、細かいところで便利じゃーんって思ったけどログインしたら鍵がなかった。一体どういうことだったんだろう…(いつものようにshellで入れた)

![](https://hanatane.net/content/images/2025/03/image-4.png)

標準的なセットアップなので詳細は割愛。なお、さくらのVPSにはパケットフィルターのような機能が提供されているが、無効にしてOSレベルで設定しておいたほうがよいらしい。Dockerはこれを見ればOK。

[

Debian

Learn how to install Docker Engine on Debian. These instructions cover the different installation methods, how to uninstall, and next steps.

![](https://hanatane.net/content/images/icon/docs@2x.ico)Docker Documentation

![](https://hanatane.net/content/images/thumbnail/thumbnail.webp)

](https://docs.docker.com/engine/install/debian/)

あとはDocker HubからGhostの公式イメージを入れる。

[https://hub.docker.com/\_/ghost](https://hub.docker.com/_/ghost)

```yml
services:

  ghost:
    image: ghost:latest
    restart: always
    ports:
      - 8080:2368
    environment:
      # see https://ghost.org/docs/config/#configuration-options
      database__client: mysql
      database__connection__host: db
      database__connection__user: root
      database__connection__password: example
      database__connection__database: ghost
      # this url value is just an example, and is likely wrong for your environment!
      url: http://localhost:8080
      # contrary to the default mentioned in the linked documentation, this image defaults to NODE_ENV=production (so development mode needs to be explicitly specified if desired)
      #NODE_ENV: development
    volumes:
      - ghost:/var/lib/ghost/content

  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - db:/var/lib/mysql

volumes:
  ghost:
  db:
```

imageをlatestにして、credentialsを適当に変えて `docker compose up -d`で立ち上がる。楽ちん。

多分手順的にはこの段階でHTTPS化しておいたほうがよい。(後述)

Ghostの環境ができたらmigration作業に入ります。

### member以外のマイグレーション

以下のガイドはセルフホストGhostからGhost Pro(マネージド)への移行ですが参考になります。Ghostの管理画面からダウンロードできるものがほとんどですが、images/とmedia/の中の画像ファイルだけはGhostサポート経由じゃないといけないのでghost.ioのサイトアドレスを添えてサポートにメールを出せばOK(全部入りのバックアップzipがもらえます)。

[

How to migrate data from Ghost to Ghost

Everything you need to know about working with the Ghost professional publishing platform.

![](https://hanatane.net/content/images/icon/favicon-9.ico)Ghost - The Professional Publishing Platform

![](https://hanatane.net/content/images/thumbnail/ghost-docs.png)

](https://ghost.org/docs/migration/ghost/)

リモート先のdockerの中にファイルを送るのよく理解していなかったので調べながらやりました。

```zsh
scp images.zip {さくらのVPS}:~/ghost/images.zip
scp media.zip {さくらのVPS}:~/ghost/media.zip
```

vpsにsshして

```bash
cd ghost

# 解凍
unzip '*.zip'
docker ps # コンテナ名確認 ここではghost-ghost-1

# Dockerに転送
docker cp images/ ghost-ghost-1:/var/lib/ghost/content/
docker cp media/ ghost-ghost-1:/var/lib/ghost/content/

# パーミッション変更
docker exec ghost-ghost-1 chown -R node:node /var/lib/ghost/content/images
docker exec ghost-ghost-1 chown -R node:node /var/lib/ghost/content/media
```

ここまでやると画像がちゃんと表示されるはず。

![](https://hanatane.net/content/images/2025/03/image-5.png)

### ドメイン切り替え & HTTPS化

memberのマイグレーションにはStripeの再接続が絡んでくるので、この段階でドメインを移行してHTTPS化しておくことにしました。

Cloudflareのドメインを使っているのですが、Ghost ProのときはProxyを使えなかったのが、セルフホストだと使用できるようです。といっても、モードはフル(Cloudflareとオリジンサーバーの間もTLS保護が必要)が必要なので、どちらにせよVPS上で証明書をいい感じにしないといけません。

一昔前ならCertbotを使ってLet's Encryptの自動更新設定などをしていたわけですが、今はOSSのCaddyを使って短いファイルをかけば終わりです。インストールもdocker-compose.ymlにCaddyを追加するだけ。楽ですね。

Caddyfileにはシンプルにwwwありとなしに設定。こう書いてしまうと証明書が２つ発行されてしまうようなのですが、Cloudflareでwwwからネイキッドドメインの方に転送をかけているからか、Caddyでもリダイレクトかけたらなんか挙動が怪しかったのでまぁいいかという感じです。

```plain
hanatane.net, www.hanatane.net {
    reverse_proxy localhost:8080
}
```

### memberの移行

さて、memberの移行はStripeと接続しているメンバーがいる場合はちょっと難しいので手順を確認。

[

How to reinstall Ghost

Find out how to get access to new features by reinstalling Ghost so you can update to the latest major version.

![](https://hanatane.net/content/images/icon/favicon-10.ico)Ghost - The Professional Publishing Platform

![](https://hanatane.net/content/images/thumbnail/ghost-docs-1.png)

](https://ghost.org/docs/reinstall/)

まずはmemberをexportしておく。このままimportしようとしてもStripeと接続されているユーザーはimportできないので注意。

まず、旧サイトの方からStripeの接続を切る必要がある。接続を切るには有料メンバーを削除する必要がある。ドキュメントにあるようにstatusがpaidやcomplimentaryのメンバーを削除するとStripeから切断できるようになる。Stripeと切断してもStripeのサブスクリプションは継続される。

旧サイトの[webhook](https://dashboard.stripe.com/webhooks)が残っているので忘れずに切断しておく。

旧サイトとStripeが切断できたので、管理UIの方で新サイトの方でStripeに再接続する。接続先は旧サイトと同じものを使う。

新サイトと接続ができたらmemberをimportする正常に有料メンバーもimportできていることを確認。

### Mailgunの設定

ニュースレター機能のために[Mailgun](https://www.mailgun.com/)を設定します。Mailgunは無料で1日100通までなのでこれ以上の規模の場合は有料を検討します。現在の環境で大量送信するメールを到達させるにはMailgunのようなサービスを使うのが必要です。

Add payment info nowのチェックを外してユーザー登録すると無料で登録できます。

ドメインを1つ接続します。Mailgun用の適当のサブドメインを設定。DKIM keyを自動設定するオプションができていたので利用しました。

![](https://hanatane.net/content/images/2025/03/image-6.png)

📝

追記: Mailgunはスパム対策のため新規作成直後はbatch sizeを設定して徐々にウォームアップしておくのが良さそうです。以下の記事を参照。

[

セルフホストGhostでMailgun一括送信のbatch sizeを設定する

GhostをセルフホストしてMailgunでニュースレター配信を試みたが、Mailgunの評価期間の制限で一括送信に失敗。Ghost側でbatchSizeの設定変更と、Mailgunサポート対応を含めた対策をまとめました。

![](https://hanatane.net/content/images/icon/icon512-4.png)はなしのタネたねのぶ

![](https://hanatane.net/content/images/thumbnail/mailgun-setup.png)

](https://hanatane.net/ghost-mailgun-setup/)

DNS設定が色々表示されるのでCloudflareの方に設定しておきます。しばらくするとCheckが押せるようになります。

Ghost側の設定は送信用のアドレスをMailgunのSMTPで作成しているものと一致させるのとdocker-compose.ymlに設定を追加しました。

[

Dockerで動かすGhostに Mailgunを使って mailの設定をする - Qiita

Ghost では mail の設定が必須です。後回しにしていてとても後悔したので、手順を書いておきます。Ghost での mail 設定について、公式では Maiilgunの使用が推奨されています。…

![](https://hanatane.net/content/images/icon/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)Qiitayukigandhi

![](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-user-contents.imgix.net%2Fhttps%3A%2F%2Fcdn.qiita.com%2Fassets%2Fpublic%2Farticle-ogp-background-afbab5eb44e0b055cce1258705637a91.png%3Fixlib%3Drb-4.0.0%26w%3D1200%26blend64%3DaHR0cHM6Ly9xaWl0YS11c2VyLXByb2ZpbGUtaW1hZ2VzLmltZ2l4Lm5ldC9odHRwcyUzQSUyRiUyRnFpaXRhLWltYWdlLXN0b3JlLnMzLmFtYXpvbmF3cy5jb20lMkYwJTJGMjI1NzExJTJGcHJvZmlsZS1pbWFnZXMlMkYxNTEzOTMwNzQzP2l4bGliPXJiLTQuMC4wJmFyPTElM0ExJmZpdD1jcm9wJm1hc2s9ZWxsaXBzZSZmbT1wbmczMiZzPTE2OWIxYzg3MDMzZWE3ZDk2Yjg3ODE1ZjI0ZTNjODUw%26blend-x%3D120%26blend-y%3D467%26blend-w%3D82%26blend-h%3D82%26blend-mode%3Dnormal%26s%3D4522966dc65ca30310f4be71598c4d40?ixlib=rb-4.0.0&w=1200&fm=jpg&mark64=aHR0cHM6Ly9xaWl0YS11c2VyLWNvbnRlbnRzLmltZ2l4Lm5ldC9-dGV4dD9peGxpYj1yYi00LjAuMCZ3PTk2MCZoPTMyNCZ0eHQ9RG9ja2VyJUUzJTgxJUE3JUU1JThCJTk1JUUzJTgxJThCJUUzJTgxJTk5R2hvc3QlRTMlODElQUIlMjBNYWlsZ3VuJUUzJTgyJTkyJUU0JUJEJUJGJUUzJTgxJUEzJUUzJTgxJUE2JTIwbWFpbCVFMyU4MSVBRSVFOCVBOCVBRCVFNSVBRSU5QSVFMyU4MiU5MiVFMyU4MSU5OSVFMyU4MiU4QiZ0eHQtYWxpZ249bGVmdCUyQ3RvcCZ0eHQtY29sb3I9JTIzMUUyMTIxJnR4dC1mb250PUhpcmFnaW5vJTIwU2FucyUyMFc2JnR4dC1zaXplPTU2JnR4dC1wYWQ9MCZzPTEyZTNhZjU0ZDA4OWEwMzBiYzEwNGIwYzZjNjYyZGY2&mark-x=120&mark-y=112&blend64=aHR0cHM6Ly9xaWl0YS11c2VyLWNvbnRlbnRzLmltZ2l4Lm5ldC9-dGV4dD9peGxpYj1yYi00LjAuMCZ3PTgzOCZoPTU4JnR4dD0lNDB5dWtpZ2FuZGhpJnR4dC1jb2xvcj0lMjMxRTIxMjEmdHh0LWZvbnQ9SGlyYWdpbm8lMjBTYW5zJTIwVzYmdHh0LXNpemU9MzYmdHh0LXBhZD0wJnM9Y2RlZjg4ZDY3YjljMTEyMGJjODRkZDBkMjIwZDg2Nzg&blend-x=242&blend-y=480&blend-w=838&blend-h=46&blend-fit=crop&blend-crop=left%2Cbottom&blend-mode=normal&s=44b5120ecc5c08dd05d1b44d5db6399f)

](https://qiita.com/yukigandhi/items/4b46cb8f3e62a25cbb0d)

### swapを追加

ここにきて動作がかなり不安定でCPU timeもかなり発生していたのでメモリ不足を疑った。調べてみるとGhost, MySQL, Caddyで1GBをいっぱいいっぱいで使用している。

![](https://hanatane.net/content/images/2025/03/image-8.png)

RAM1GBでGhostを動かしているユーザーはほとんどSwapを使っていて、さくらのVPSでは初期設定でSwapが有効化されていないのでこれを有効化した。これはさくらのVPSのマニュアル通りでOKでした。

[

swapfileの追加

目次: 対象の標準OS, swapfileの追加- スワップが存在しない事を確認, スワップファイルを作成, スワップファイルの有効化.. 「さくらのVPS」の標準OSで swapfile を利…

![](https://hanatane.net/content/images/icon/favicon.png)さくらの VPS マニュアル

![](https://hanatane.net/content/images/thumbnail/ogp_vps.png)

](https://manual.sakura.ad.jp/vps/os-packages/add-swapfile.html?gad_source=1&gclid=Cj0KCQjw4v6-BhDuARIsALprm321PN9XU1YqOTj8rTxnlxj0cQNXquAkPRjg__AO8glOLthVGV8Xq1QaAgOLEALw_wcB)

![](https://hanatane.net/content/images/2025/03/image-10.png)

Swap領域を作ってからは安定した。

![](https://hanatane.net/content/images/2025/03/image-7.png)

### Cloudflareのキャッシュ設定

Cloudflareのドメインを使っているので、Cloudflare周りをうまく設定するとパフォーマンスを無料で上げることができる。Ghost Proの方はこの辺のCDN設定も含まれているので、せっかくなのでできることはやっておこう。

CloudflareのDNS設定でProxyをオン、TLSのEncryptionモードはFull(Strict)にすることで、Cloudflareの恩恵をフルに受けつつGhostを正常に表示できる。

加えてキャッシュルールを以下の通りに従って設定する。

[

How to Optimize Cloudflare Caching for Blazing Fast Ghost Blog

Updated guide to get the best performance possible for your ghost blog with Cloudflare.

![](https://hanatane.net/content/images/icon/Gemini_Generated_Image_dmypwxdmypwxdmyp.jpeg)The TechWeirdoDr. Shounak Pal

![](https://hanatane.net/content/images/thumbnail/Add-a-heading_20240507_012342_0000.png)

](https://www.techweirdo.net/optimize-cloudflare-caching-for-blazing-fast-ghost-blog/)

サイト変更時のWebhookでキャシュを削除するCloudflare Workersも設定しておく。

[

Autopurge CDN cache for Ghost blogs (Cloudflare / Bunny CDN)

In this post, we automate cache purging from CDNs for ghost blogs.

![](https://hanatane.net/content/images/icon/Gemini_Generated_Image_dmypwxdmypwxdmyp-1.jpeg)The TechWeirdoDr. Shounak Pal

![](https://hanatane.net/content/images/thumbnail/Automatically-Purge-CDN-cache-for-Ghost-Blogs.webp)

](https://www.techweirdo.net/autopurge-cdn-cache-for-ghost-blogs/)

うまくエコシステムを活用できるなぁと思った。

## 今回採用しなかったもの

### Pintura

Ghost Proの方ではPinturaという画像エディタを使っていますが、[Ghost用のライフタイムプラン](https://pqina.nl/pintura/ghost/)が用意されています。ライフタイムといっても1年間のアップデートに限られているので何回か購入し直すような形になるでしょう。

iPhoneから直接アップロードして適当に切り抜いてと便利ではあるのですが、今回は一旦見送りました。

### Cloudinary

GhostはAdminからメディアをアップロードしたときに自動で圧縮するわけではなく、テーマからの呼び出しに応じて必要なファイルを作成する方式のようです。よくiPhoneからUniversal Clipboard経由で画像をペーストするので、2MB以上のファイルがかなりあって、少ないSSD容量を圧迫していく恐れがあります。

GhostはCloudinaryのAdapterがあって、内部ストレージを使用せずにCloudinaryにアップロードできるようになります。色々な便利機能を差し置いても、単純にストレージ容量の節約になるのは良さそうだと思いました。

ただGhostの公式Dockerイメージをそのまま使えなくなるので更新周りの作業が重くなりそうだなと思って今回は見送りました。Cloudinaryを使う場合はGhost CLIを使うのが良さそうです。

[

Official Ghost + Cloudinary Integration

Use Cloudinary in tandem with Ghost either on-the-fly or with a full media library. Automate processing and optimisation of images & video. Find out how 👉

![](https://hanatane.net/content/images/icon/favicon-11.ico)Ghost - The Professional Publishing Platform

![](https://hanatane.net/content/images/thumbnail/ghost-integrations-1.png)

](https://ghost.org/integrations/cloudinary/)

[

GitHub - eexit/ghost-storage-cloudinary: :rocket: A fully-featured and deeply tested Cloudinary Ghost storage adapter

:rocket: A fully-featured and deeply tested Cloudinary Ghost storage adapter - eexit/ghost-storage-cloudinary

![](https://hanatane.net/content/images/icon/pinned-octocat-093da3e6fa40.svg)GitHubeexit

![](https://hanatane.net/content/images/thumbnail/ghost-storage-cloudinary)

](https://github.com/eexit/ghost-storage-cloudinary)

## 感想

-   Dockerでめちゃくちゃ楽になった
-   Cloudflare以外を使う理由がないくらいに便利
-   サーバーをいじるのはやはり麻薬

支出の改善だけで終わらず、この1年は思ったようなアウトプットができなかったのをしっかり反省して次の1年にもっとうまく運用したいと思います。皆さん支援ありがとうございました。
