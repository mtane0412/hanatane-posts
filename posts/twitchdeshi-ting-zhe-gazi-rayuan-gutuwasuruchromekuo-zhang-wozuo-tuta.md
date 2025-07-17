---
title: Twitchで視聴者が自ら猿ぐつわするChrome拡張を作った
slug: twitchdeshi-ting-zhe-gazi-rayuan-gutuwasuruchromekuo-zhang-wozuo-tuta
status: published
visibility: public
tags:
  - 技術の話
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec118
ghost_updated_at: '2023-12-04T01:13:52.000Z'
published_at: '2023-12-03T23:00:04.000Z'
feature_image: >-
  https://hanatane.net/content/images/2023/12/52886f6b-7bdc-437b-8284-458c3a826555.webp
---
ChatGPTでプログラミングの恩恵にかつてないレベルでアクセスできているはずだと考えているので、最近はそういうsurveyを繰り返し行っています。Tampermonkeyはフィジカル空間で交流する人とかには眼の前でデモンストレーションとかもやったりするのですが、というかこれChrome拡張も作れるなと思ったので作ってみました。

## 目的

1.  ChatGPTアシストのもとでChrome拡張を作れることのデモンストレーション
2.  Twitchのチャットで視聴者側が要注意ワードに気づけるようにする

2について、拡張を作る上でなにかネタはないかなと思っていてXのTLを眺めていたらちょうどTwitchの初見詐欺に関するお気持ちが流れてきたのでこれに関連する拡張を作ってみようと思いました。

初見詐欺問題は簡単に言うと初見じゃないにも関わらず初見ですと挨拶するような行為を指していて、どの配信でも一人はやっているのを見かけるくらいのネタなのですが、これを猛烈に嫌う配信者もいる感じです。

初見詐欺のように嫌われがちな行動はいくつかありますが、問題は配信者は十人十色で、それぞれの配信でなんとなく許されている行動や即BANレベルで禁止されている行為まで多種多様です。なので配信者が気持ちよく配信できるように双方協力してコミュニケーションしていくというのは結構大変なことなのです。

コミュニケーションの問題の多くは配信側でモデレーションを行っていくほかないと思いますが、初見詐欺については「初見」という単語がほぼ使われることが特徴です。なのでWataxさんの記事にあるように特定ワードで数秒タイムアウトというのは一定の効果が見込めるかと思います。

[

初見詐欺にどう向き合うか？｜wataxxx

こんにちはWataxxxです 皆さんは”初見詐欺”という言葉を聞いたことがあるのでしょうか？ ユーザー生放送においてその番組が初見でないにもかかわらず初見であるとコメントすること。 主に故意に初見だと名乗る場合のことを言う。 たまにその番組に来たことあるのにそのことを忘れ初見だと言ってしまう人もいるようである。 ニコニコ大百科、初見詐欺より X（旧Twitter）でもTLに定期的なお気持ちが流れてくるのですが、初見詐欺を何故行うのか？どう向き合うのか？について書いてみたいと思います 初見詐欺は何故おきる？ 初見ではないのに初見を名乗る事によって認識してもらいたいという承認欲

![](https://assets.st-note.com/poc-image/manual/note-common-images/production/icons/apple-touch-icon.png)note（ノート）wataxxx

![](https://assets.st-note.com/production/uploads/images/119516484/rectangle_large_type_2_61330219585cba023fd863bc75298964.png?fit=bounds&quality=85&width=1280)

](https://note.com/wataxxx/n/nb7dd808ac799)

さて、配信者側でモデレーションを行っていくのが正攻法である一方で、同じことを視聴者側のモデレーションとして実装できないかな？というのが今回のアイデアの発端です。実用性は後述するようにあんまりないです。

## できたもの

[

Twitch Chat Self Moderator

Manage forbidden words in Twitch chat based on streamer tags.

![](https://ssl.gstatic.com/chrome/webstore/images/icon_144px.png)Chrome Web Store

![](https://lh3.googleusercontent.com/VvDaY28Rgl6JAMsquDuTtN_tAZ0kIEIenb1YwgKeX61Ze8EibRevooFza7umeZIaKTujF7AA9y-CKl0UyTxhLxRf=w128-h128-e365-rj-sc0x00ffffff)

](https://chromewebstore.google.com/detail/twitch-chat-self-moderato/jcbhcgdilhchpnadjnaffbkfficlnfcb?hl=ja)

Twitchの配信タグベースで要注意ワードを設定して、チャット送信前に気付けるようにする拡張です。

-   要注意ワードを**特定の配信タグ**に基づいて設定できる
    -   すべての配信についても設定できる
-   チャット入力で要注意ワードが含まれたら赤い警告色になる
-   その状態でチャットを送信しようとすると、確認ダイアログが出る
    -   確認をした上で送信する
-   その他
    -   登録ワード削除機能(タグごと一括)

> Twitch視聴者が自分で要注意ワードを猿ぐつわできるChrome拡張作った。GPTでまじで敷居下がってる [pic.twitter.com/uZApEy6Y2k](https://t.co/uZApEy6Y2k)
> 
> — たねのぶ (@mtane0412) [November 23, 2023](https://twitter.com/mtane0412/status/1727693426966315123?ref_src=twsrc%5Etfw)

## 細かい部分

### 拡張のアイコンもChatGPT作

ある程度機能ができて登録する段になったときに拡張機能のアイコンもChatGPT作に作ってもらった。便利。(おかげでプロンプト全体をシェアできなくなってしまったが…)

![](https://i.gyazo.com/2f9c48a9f96b8f99a4bdbd6840b62673.png)

### Chrome Web Storeの公開も強力

Chrome Web Storeに公開するにあたって色々と記入しなければなりませんが、一緒に開発してきたChatGPTは拡張の内容も熟知しているのでかなり的確に書いてくれます。

![](https://i.gyazo.com/d955412ea5e7f50c52f6a8ac1546c5c1.png)

### なぜタグベースか

Twitchは配信者が自由に設定できるタグがあり、その中でもNoBackseating(指示禁止)やNoSpoilers(ネタバレ禁止)があったり、BackseatingAllowed(指示OK)といったタグが使われています。拡張でこれらのタグを認識した上で特定のルールを適用できるようにしたら楽です。

逆に配信者ベースで設定できないようにしているのは、まず視聴者の行動様式をある程度抽象化したほうがよいだろうなという思想が入っています。

### なぜチャット送信できるようにしているか

ワードベースの機械的なフィルタは限界があるので、要注意ワードが含まれている場合でも確認ダイアログで「はい」を選べば送信できるようにしました。(たとえば「初見」で設定すると「最初見たとき」も引っかかっちゃいます。)

### 実用性

ほぼないです。初見詐欺はわかりやすいかもですが、特定単語をフィルタすれば防げることはそんなにないはずです。

仮にこれが効果的にworkしたとしても、本当に必要な人はこれを入れないという問題があります。

## Chrome拡張開発 with ChatGPT

### 総評: Chrome拡張作れるようになった

Chrome拡張は以前ネタで作ったことがありますが、今回全て忘れた状態で公開するところまで半日もかからずにいけたのはChatGPTのパワーを感じました。

[

スクールアイドルが生えてくるChrome拡張を作った | 初歩からの無職

ラブライブ！ Advent Calendar 2018 9日目

![](https://mtane0412.com/icons/icon-192x192.png?v=fd789631a690ce071bfe2b320715f642)mtane0412mtane0412

![](https://images.ctfassets.net/73t6m5k7x51e/2r0RFBdY1yQCOJLykEsUqj/9f0f1c2cd2e879f959c660b453900852/movie1-1024x576.png)

](https://mtane0412.com/chrome-extension-to-grow-school-idols/)

「ChatGPTを使えば誰でも楽に作れる」と言いたいところでしたが、今回TwitchはSPAを使っている都合上、ストレートにコードが動かなかったので確かに大変な部分もあったのですが、そこもChatGPTと相談しながらコードを修正していくことができたのでやはり強力です。

Tampermonkeyによって改善できる範囲が自分や知り合いくらいだとすれば、Chrome拡張としてリリースすることができればもっと広い範囲にcontributeできる可能性があります。ちょっとワクワクするのでアイデアを考えてしまいますね。

### 効率的な学習になった

今回ChatGPTと一緒にコードを書くだけでかなりのことを学べました。

-   Chrome拡張の仕様
    -   popupとcontentまでは以前触ったことがあったがbackgroundのややこしい当たりはChatGPT様々だった
-   SPAに対する対処法
    -   ページ遷移をしているようでしていないのでMutationObserver使うなど
-   TwitchのSlateの仕様
    -   たまに入力がおかしくなるときの状態がわかった
-   MacのChromeとSafariではkeydownでEnterを取るとIMEの変換の確定でEnterが誤作動してしまう
    -   これがGhostのエディタやDiscordのフォーラムでの挙動の原因だった

## 今後: AIモデレーターのモデレーションを人間モデレーターがレビューする

この拡張自体は使い物にならないですが、ChatGPTを使ったモデレーションには非常に可能性を感じています。LLMによって機械的なルールでは実現できないモデレーションが可能になるのと、事前に与える情報によって精度がかなり上がりそうです。上では抽象化が求められますが、こっちでは具体的であればあるほどよいのが強いポイントだと思います。親しい人に「こういうことがあって嫌だったんだよね…」と話すのに似てますね。

> AIが素晴らしいの、具体例を入力すればするほど出力がよくなるので、「これやめて」の積み重ねが財産になる [https://t.co/f786nG9bkd](https://t.co/f786nG9bkd) [pic.twitter.com/jG525ULv25](https://t.co/jG525ULv25)
> 
> — たねのぶ (@mtane0412) [November 20, 2023](https://twitter.com/mtane0412/status/1726568276417773766?ref_src=twsrc%5Etfw)

ネックはトークン単位の課金となるのでここに工夫が求められる点です。Llama2のような無料のLLMを使えばなんとかなりそうですが、日本語的にはいまいちで、日本語を追加学習したELYZAあたりを試してみたいかもです。

どうしてもGPT4相当の性能を求める場合は、視聴者に対して信頼度のようなパラメータを降ってチャンネルでの行動に対して一定の信頼度を獲得した人についてはモデレーションをオフにしたりとかでできるんじゃないかなと考えました。果たしてそういうモデレーション方式がうまくいくのかということと、大手の配信だと結局APIコールが巨大なままになりそうなのでこれも色々難しいポイントがありそうです。

このあたり、Twitch公式が何らかの形で実装してくるんじゃないかな～とも思ってます。人間のモデレーターが配信者に変わってモデレーションをするというのはどちらもTwitch上で活動する人間である以上思ったよりも難しい場面も多いので、モデレーションをAIがやって人間モデレーターがレビューして配信者を助けるような構造がうまくworkするのではないかなあと思います。​色々楽しみですね。
