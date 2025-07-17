---
title: 自作体重計をつくる
slug: diy-scaler
status: published
visibility: public
tags:
  - 技術の話
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec117
ghost_updated_at: '2023-11-20T22:00:16.000Z'
published_at: '2023-11-20T22:00:16.000Z'
feature_image: 'https://hanatane.net/content/images/2023/11/IMG_4378.JPG'
custom_excerpt: M5Stack + Scale Kitを使った自作体重計で電子工作入門した
---
> 何も作らない人は、何ができるかではなく何を好むかで判断する。好みは視野を狭くし、いつか周りに誰もいなくなる。だから作ろう。

RubyプログラマのWhy The Lucky Stiffの言葉らしいです。好きと嫌い、快と不快という次元で世界を見るのはまさに生物の行動を形作っている根本です。何かを作るというのはそことは違った見方で世界を見るということになります。同じようなことを哲学者のシェーラーも言っていて、生物は環境に拘束されている一方で、人間は世界に開かれた、自由な態度がとれるみたいなことを言ってるみたいです。なんとなくそれっぽいかなぁと思って書きましたがわけわからないですね。

というわけで、Amazonでポチッとすれば安く手に入る体重計をわざわざ自作してみるおじさんが出現します。今回はたまたま手元に[M5Stack](https://www.switch-science.com/collections/m5stack)があったので、[M5 Scale Kit](https://www.switch-science.com/products/8014)をポチって作ってみることにしました。[先人の例](https://massa4649.com/iotweight_1/)を見たのでなんかいけるんじゃないかなという気になってしまったのが原因です。

まずはArduino IDEを入れてサンプルプログラムを走らせるところまで。かなり簡単に動かせるところまでいけるので、このプロダクトは本当に神です。

> はろわ [pic.twitter.com/KDWa6zmJb9](https://t.co/KDWa6zmJb9)
> 
> — たねのぶ (@mtane0412) [November 19, 2023](https://twitter.com/mtane0412/status/1726142945706017125?ref_src=twsrc%5Etfw)

次にSCALES KIT開封。

![](https://hanatane.net/content/images/2023/11/IMG_4371.jpeg)

表の構成を見ながらポチポチ繋いでいきます。

![](https://hanatane.net/content/images/2023/11/IMG_4373.jpeg)

とりあえず珪藻土バスマットにつけてみます。

![](https://hanatane.net/content/images/2023/11/IMG_4374.jpeg)

ここでテストしてたのですがどうも全然重さをとっていないみたいです。仕様書を見ると長辺50cmを超えちゃダメとあったので別の板でもやってみたのですが、変わらず。

今回接続しているのはGrove端子という「4端子の汎用コネクタ」らしいです。M5StackではA, B, Cの三種類あって本体横のはport A。サンプルプログラムはport Bなのでうまくいっていないようでした。

なーんだと思ったら電子工作詳しい人がサンプルプログラムのピン番号を変えれば動くよと教えてくれたので、そのとおりにやったら動きました。Lチカから入らずにいきなり体重計作ろうとしてる弊害ですね。

ともかく最初の入門として体重計っぽものができました。

> 体重計プロトタイプ、とりあえず5mmのアクリルがへし折れそうでした [pic.twitter.com/UFQjgAA7eA](https://t.co/UFQjgAA7eA)
> 
> — たねのぶ (@mtane0412) [November 19, 2023](https://twitter.com/mtane0412/status/1726239387875496058?ref_src=twsrc%5Etfw)

アクリル5mmが今にも割れそうなので使ってない珪藻土マットをいい感じにカットして合わせて使おうかなと思います。あとはプログラムの方も書き換えていい感じに体重データを利用できるようにしたいですね。

Web上のプログラミングと違って現実世界をセンシングできるようになると世界が広がりそうだなぁと思いました。(小並感)
