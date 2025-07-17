---
title: ドメイン認証用のWebサイトをAstroでサクっと作った
slug: quickly-built-domain-verification-site-with-astro
status: published
visibility: public
tags:
  - 技術の話
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec12d
ghost_updated_at: '2024-02-14T01:50:05.000Z'
published_at: '2024-02-14T01:50:05.000Z'
feature_image: >-
  https://hanatane.net/content/images/2024/02/tanenobu_6315664866_Astronaut_showing_identity_card._Illustrati_4c53404f-f4d4-43ea-9068-5b424aea1679.png
custom_excerpt: Astroで簡単に自分だけのドメイン認証サイトを作る方法、始めよう
---
分散型SNSが乱立してきたので、各種アカウントが自分のものであると証明しやすくなるようにドメインをとった。ドメインだけでもいいのだけど、せっかくなので自分の各種アカウントへのリンクを掲載するLink in bioのページにした。

パーソナルサイトなのでドメインは `mtane0412.me` にした。

[

Masayuki Tanenobu

Masayuki Tanenobu

![](https://mtane0412.me/favicon/safari-pinned-tab.svg)

![](https://mtane0412.me/opengraph.webp)

](https://mtane0412.me/)

経緯としては、Nostrのドメイン認証のときに[Github PagesでLink in bioを作っていた](https://github.com/mtane0412/mtane0412.github.io)のだが、先日一般公開されたBlueskyもカスタムドメインに対応していたので、せっかくなので独自ドメインをとってサイトも作り直しちゃおうと思い立った。

こういうちょっとしたものを作るのは枯れた技術のほうが良いなと思っていて、以前はHugoで作ってたのだけど、最近触り始めたAstroで作ってみることにした。

結論から言うと[Astro](https://astro.build/)はめちゃくちゃ作りやすかったので、もう全部これでいいなという感じだった。独自の構文という感じは少なくて、直感的なJavaScriptの構文で書けるし、[Astro icon](https://www.astroicon.dev/)なんかの便利なセットもあったのでアイコンも簡単に用意できたし、ドキュメントの日本語化もすごい進んでいる。

もっと複雑なことをやろうと思ったらReactとかの既存技術といくらでも組み合わせ可能なのも熱い。

さらに吐き出されるコードは基本的にゼロJSでパフォーマンスもめちゃくちゃいい。LighthouseでBest Practicesが減点くらってるのは調べてみるとバグらしくて悲しい…。

![Lighthouseスコア、満点](https://i.gyazo.com/159c73f7d96920c960ecb158bcfb0b48.png)

おまけのサイトができたので、本来の目的である各種ソーシャルメディアのアカウントがmtane0412.meの所有者である証明を行っていく。

[Nostr](https://nostter.app/npub1nca6cct4ce6zhm5mxhufqjym696jdlyr6h7zq76fqlw5p0gnnyus35j2v3)は [https://mtane0412.me/.well-known/nostr.json](https://mtane0412.me/.well-known/nostr.json) を参照してドメインの確認をとっている。(Nostr.comのほうはなかなか更新されてなくてよくわからない)

![Nostrのドメイン認証](https://i.gyazo.com/a5147e69808b32e72e1eea2630e07f15.png)

BlueskyはDNSでDIDを返してあげると認証されるDNS認証が一般的っぽいが、Nostrですでにファイル形式をやっていてなんとなく合わせたくなったので、こちらも [https://mtane0412.me/.well-known/atproto-did](https://mtane0412.me/.well-known/atproto-did) にDIDを置いておく。

[Bluesky](https://bsky.app/profile/mtane0412.me)は@以下がドメインになるので、個人はなんかあれだけど有名な公式アカウントとかはめちゃくちゃわかりやすくなるだろう。

![Blueskyのカスタムドメイン認証。](https://i.gyazo.com/b1b6b92564d28d50214e1203133d3263.png)

[Fedibird(Mastodon)](https://fedibird.com/@mtane0412)や[Misskey.io](https://misskey.io/@mtane0412)はリンク先のページに`rel="me"` でバックリンクがあると所有者確認が取れるようだ。

![misskey.ioの認証](https://i.gyazo.com/bccd5977d0fab70ada8e004461601f05.png)

![Fedibirdの認証](https://i.gyazo.com/478651c9e31baaf368aab23ac46b9411.png)

という感じで一通り作業終わり。僕の場合、ただの自己満足なんだけど、分散型の時代は色んなところにアカウントが散在する形になるのでこういった認証の方法を取っておいたほうがいい。有名な人はしばしば偽物が出現して、もともと活動していた著名なアカウントで新アカウントを言及するとかで認証してたけど、サービス側のこういう仕組みでわかりやすくするとよいのだろうな〜と思った。分散型の時代はいろいろな人がデジタルアイデンティティのために自分のサイトを持ったりするようになると、一昔前のWebっぽい感じになって楽しそうだなと思いました。
