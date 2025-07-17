---
title: NUCにProxmoxを入れて快適自宅サーバー環境を作る
slug: proxmox-nuc-home-server-setup
status: published
visibility: public
tags:
  - 技術の話
  - selfhosted
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec14b
ghost_updated_at: '2025-01-14T02:34:14.000Z'
published_at: '2025-01-13T23:00:56.000Z'
feature_image: 'https://hanatane.net/content/images/2025/01/IMG_5389-1-1.jpeg'
custom_excerpt: 「自宅サーバー環境を構築してみたい」と考えている方向けに、NUCとProxmoxを組み合わせた事例を紹介します
---
年末年始ひたすら自宅サーバーいじってたので「自宅サーバー環境を構築してみたい」と考えている方向けに、NUCとProxmoxを組み合わせた事例を紹介します。 初心者でも導入しやすい理由や、実際に使ってみて感じたメリットなどを解説するので、これから自宅サーバーを立ち上げようと思っている方の参考になれば嬉しいです。

## NUCとは

NUCはIntelが提唱した超小型PCのフォームファクタでIntelの純正NUCは撤退してしまったのだけど、主に中華系のメーカーがNUC規格の低価格ミニPCをたくさん出していて、アリエクに限らずAmazonでもN100系のCPUのものが2万円前後で手にいれることができる。

もともと自宅Kubernetesに興味があって色々調べる中で、[よく自宅サーバーのイベントを開いている富士通のスライド](https://www.slideshare.net/slideshow/k8svsphere-255776873/255776873)でNUCの存在を知って以来、ずっと気になっていたのだけど、[中華ミニPC](https://amzn.to/4gbUYL7)をついにブラックフライデーで購入して自宅サーバーで運用している。

![](https://hanatane.net/content/images/2025/01/IMG_5389.jpeg)

神棚に座する美しい配線。サーバールームどこかに作りたい。

## ハイパーバイザーとしてProxmoxを入れる

自宅サーバー勢はまずハイパーバイザーとかいうのを導入するらしい。ハイパーバイザーとは仮想化プラットフォームのなんかかっこいい呼び方のことらしい。サーバーに直接色々ぶち込むよりもリソース最適化ができたりルーティングが楽になったりといろいろ得するっぽい。

[

ハイパーバイザーとは？をわかりやすく解説 | Red Hat

ハイパーバイザーとは、仮想マシン (VM) を作成し、実行するソフトウェア。仮想マシンモニターとも呼ばれ、同じ物理マシン内で複数の異なる仮想環境を実行し、管理します。

![](https://hanatane.net/content/images/icon/favicon-4.ico)Red Hat

![](https://hanatane.net/content/images/thumbnail/logo-rh-og-image.png)

](https://www.redhat.com/ja/topics/virtualization/what-is-a-hypervisor)

無料のハイパーバイザーとしてvSphereとProxmoxが人気だったが、vSphereは2024年に無償版が提供終了になったのでProxmox一択になっている。

[

Proxmox Server Solutions

Proxmox develops powerful and efficient open-source server solutions like the Proxmox VE platform, Proxmox Backup Server, and Proxmox Mail Gateway.

![](https://hanatane.net/content/images/icon/favicon.svg)Proxmox

![](https://hanatane.net/content/images/thumbnail/Proxmox-logo-stacked-1240.png)

](https://www.proxmox.com/en/)

Proxmoxのインストールは基本的に次の記事に従えば簡単にできる。

[

冬休みに作るミニPC自宅サーバー上級編、SSD＋メモリ増設で最新Proxmox VE 8.1環境を堪能する！【イニシャルB】

先々週の本連載「冬休みに『初めての自宅サーバー作り』を、1.8万円で買ったN100ミニPCにCasaOSをセットアップ」の続きで、N100搭載ミニPC「GMKtec NucBox G3」を、本格的な自宅サーバーとして強化してみた。手のひらサイズの本体内にストレージ1TBとメモリ16GBを詰め込んで、複数のサーバーを動かしても耐え得る環境を用意した。

![](https://hanatane.net/content/images/icon/favicon-5.ico)INTERNET Watch株式会社インプレス

![](https://hanatane.net/content/images/thumbnail/002.JPG)

](https://internet.watch.impress.co.jp/docs/column/shimizu/1551702.html)

インストールが終わったときに`error: no suitable video mode found. booting in blind mode` というエラーが画面に表示されて非常に困ったのだが、どうもこれは接続したディスプレイがゲーミング対応でややこしいだけだったっぽい。インストールは正常だったのであとは電源に刺したまま運用してローカルのWebUIで運用できる。

![](https://hanatane.net/content/images/2025/01/image-4.png)

## Proxmoxを購入して実感したメリット

-   **1\. 仮想環境をインスタントに作ったり壊したりできる**
    -   GUIでポチポチするだけで、サーバー環境を何度でも気軽に作り直せる
    -   物理機器の準備や配線作業が不要で、時間の節約に
-   2\. **ローカルネットワークとの親和性が高い**
    -   Proxmox上の仮想マシンは通常のデバイス同様にIPが割り当てられる
    -   IP振られてるので静的DNSレコードで名前解決できる(例:`proxmox.home`)
    -   Cloudflare Tunnelを使えばインターネットから自宅サーバーへ安全にアクセス可能
-   3\. **コミュニティ製のスクリプトが充実**
    -   「[Proxmox VE Helper-Scripts](https://community-scripts.github.io/ProxmoxVE/)」でコピペするだけで一発でセルフホスト環境を構築可能
    -   Helper-Scriptsに登録されていないものは、scriptでDocker環境をまず構築してそこからDockerで導入という2ステップで大体いける
    -   OSSの大半が簡単に導入できるため、試したいものがあればすぐに着手できる

[

Proxmox VE Helper-Scripts

A Front-end for the Proxmox VE Helper-Scripts (Community) Repository. Featuring over 200+ scripts to help you manage your Proxmox VE environment.

![](https://hanatane.net/content/images/icon/favicon-7.ico)Proxmox VE Helper-ScriptsBram Suurd

![](https://hanatane.net/content/images/thumbnail/defaultimg-1.png)

](https://community-scripts.github.io/ProxmoxVE/)

## 現在走らせているサービス

毎日何かしら入れて試しているので動いているVM/LXCは15個くらいになった。個々のOSSの紹介は別記事にしたい。

![](https://hanatane.net/content/images/2025/01/image-2.png)

さすがに10個くらいのときから8GBだと心もとなくなってきたのでRAMを認識可能な最大である[32GBのもの](https://amzn.to/3DW2fkM)に換装した。これで動かなくなってきたらProxmoxノードを増やして拡張していけるのもよい部分。

![](https://hanatane.net/content/images/2025/01/IMG_5436.jpeg)

![](https://hanatane.net/content/images/2025/01/image-3.png)

## 今後やりたいこと

-   Proxmoxで試しているセルフホストOSSはここでも紹介していきたい
-   物理NASか仮想NASを加えてメディア系をローカルに集約したい
    -   特にSONY版nasneは近いうちにサポート終了するので録画体制を刷新したい
-   ローカルLLMを稼働させる
    -   CPUガン積みマシンかGPUが必要になるだろう
    -   Apple Siliconが案外コスパいいらしいのでMac miniも気になっている
-   シェアハウス生活を便利にする組み合わせを考える
-   個人用と住民用でネットワークを分ける
-   サーバールームちゃんと作りたい

もし他にも気になるOSSや、試してみたい構成があれば、ぜひコメントで教えてください！
