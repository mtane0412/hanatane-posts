---
title: Umamiを無料で導入してシンプルなインサイトを得る
slug: try-umami
status: published
visibility: public
tags:
  - 技術の話
  - Ghost
authors:
  - たねのぶ
ghost_id: 67e7e699fb5e110001e00f6b
ghost_updated_at: '2025-03-29T23:00:30.000Z'
published_at: '2025-03-29T23:00:30.000Z'
feature_image: 'https://hanatane.net/content/images/2025/03/umami.png'
custom_excerpt: >-
  初心者には複雑なGoogle
  Analyticsの代わりに、シンプルで使いやすいアクセス解析ツール「Umami」を導入。導入方法や設定のポイントをまとめました。
---
サイト運営をするうえでGoogle Analytics導入は決まり切ったセットアップの一つになっていますが、一方で導入したあとちゃんと「解析」できているところは少ないと思います。Google Analyticsは第一義的にはプロ用途のものであり、必ずしも初心者にとって使いやすいわけではありません。とりあえず見て「ふーん」となる情報を見るのにも、細かい設定が必要だったりします。

というわけで、シンプル&プライバシー重視な[Umami](https://umami.is/)というアクセス解析ツールを導入しました。Google Analyticsの代替としてPlausibleと並んで有名なツールで、クラウド版とセルフホスト版があります。今回はクラウド版の無料プランで試していますが、本格運用する場合はVPSでセルフホストするか[pikapods](https://www.pikapods.com/)などのマネージドサービスを利用するのが良さそうです。

ちなみに[Plausible](https://plausible.io/)も最初検討したのですが、クラウド版の無料プランがないことと、DBに高速処理が可能なClickHouseを採用しておりセルフホストする際の要求スペックが高くなることなどを踏まえてUmamiの方を試すことにしました。

## Umamiの設定

### Ghostへの導入

Ghostへの導入はUmami Cloudへの登録時に出るJavaScriptコードを<head>内に配置するだけでOKです。

![](https://hanatane.net/content/images/2025/03/image-12.png)

### 自分を除外する

自分のアクセスをデータから除外する設定ですが、ブラウザのlocalStorageを使用する方法で面白いなと思いました。ブラウザごと、プロファイルごとにConsoleから設定する必要​あります。

[

Exclude my own visits – Docs - Umami

Umami is a simple, fast, privacy-friendly alternative to Google Analytics.

![](https://hanatane.net/content/images/icon/apple-touch-icon-1.png)Umami

![](http://localhost:3000/opengraph-image-j8qpfc.png?5cc23a73895b1195)

](https://umami.is/docs/exclude-my-own-visits)

```shell
localStorage.setItem('umami.disabled', 1);
```

### 外部リンクを記録する

Umamiにもイベントトラッキング機能があります。細かいイベントを記録することもできますが、さしあたっては外部リンクを踏んだイベントをガイド通りに導入。

```html
<script type="text/javascript">
  (() => {
    const name = 'outbound-link-click';
    document.querySelectorAll('a').forEach(a => {
      if (a.host !== window.location.host && !a.getAttribute('data-umami-event')) {
        a.setAttribute('data-umami-event', name);
        a.setAttribute('data-umami-event-url', a.href);
      }
    });
  })();
</script>
```

[

Track outbound links – Docs - Umami

Umami is a simple, fast, privacy-friendly alternative to Google Analytics.

![](https://hanatane.net/content/images/icon/apple-touch-icon-3.png)Umami

![](http://localhost:3000/opengraph-image-j8qpfc.png?5cc23a73895b1195)

](https://umami.is/docs/track-outbound-links)

### CloudflareのLocationヘッダーを有効化する

Cloudflareを使用している場合、Location headerを有効化することでより細かい地域情報が取れるようなので設定しておきました。

![](https://hanatane.net/content/images/2025/03/image-13.png)

[

Enable Cloudflare headers – Docs - Umami

Umami is a simple, fast, privacy-friendly alternative to Google Analytics.

![](https://hanatane.net/content/images/icon/apple-touch-icon-4.png)Umami

![](http://localhost:3000/opengraph-image-j8qpfc.png?5cc23a73895b1195)

](https://umami.is/docs/enable-cloudflare-headers)

## Umamiを見る

### 直感的で見やすい

Umamiのダッシュボードはユニークユーザーとview数の見分け方もシンプルで期間指定もわかりやすいです。

![](https://hanatane.net/content/images/2025/03/image-14.png)

### セッション単位の閲覧も可能

セッションごとの情報と見たページなどの行動履歴も直感的で見やすくなっている。

![](https://hanatane.net/content/images/2025/03/image-15.png)

### 詳細な比較

期間比較もかなり充実している印象で、想像以上に細かい部分が見れる。

![](https://hanatane.net/content/images/2025/03/image-16.png)

## 所感

Google Analyticsは初心者が初見で見たいデータを決して見ることはできないのに対して、Umamiはポチポチしていれば必要なデータが見れるのが良さそうです。APIを使用して定期的にレポートを送信する運用なども良さそうです。

PlausibleやUmamiが台頭してきているのは、Googleのアテンションエコノミーに対するカウンターの動きとしてみるべきで、EUでGoogle AnalyticsがGDPR違反となっているのも大きな契機になっています。Googleが果たす役割は依然として大きいですが、我々がGoogleに支払っているコストを認識しながらWeb運営をしていくことが大事であり、こういったGoogleオルタナティブを検証していくことは大事だなと思いました。
