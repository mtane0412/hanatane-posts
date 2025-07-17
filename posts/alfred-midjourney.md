---
title: AlfredからMidjourneyで画像生成する
slug: alfred-midjourney
status: published
visibility: public
tags:
  - 技術の話
  - Alfred
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec125
ghost_updated_at: '2024-01-31T02:29:28.000Z'
published_at: '2024-01-23T14:00:20.000Z'
feature_image: >-
  https://hanatane.net/content/images/2024/01/tanenobu_4407456978_a_man_who_wears_a_bowler_hat_with_a_purple__8a269a16-a6eb-4e2e-9a94-3303708f103f.png
custom_excerpt: AlfredからMidjourneyのNode.jsクライアントを利用してDiscord上で画像生成ができるようにしました
---
ここ最近のブログ記事のfeature imageは[Midjourney](https://www.midjourney.com/)で出力してみている。

Ghostは[Unsplash](https://unsplash.com/ja)がネイティブ統合されてるので高品質な写真を選ぶことができるのだけど色々と困る部分も増えてきた。

-   写真のみ
-   割と被ってきてGhost感のようなものが出てくる
-   Unsplashは解像度が統一されているわけではないのでバラバラになる
-   写真も微妙にテイストの統一が難しい
-   記事のテーマにあった画像を探すのに時間がかかる

publishの障壁を少しでも減らしたいという想いがあり、その点でUnsplashが統合されているのは魅力の一つだったのだが、それでもまだ減らしたいという感じ。

一方Midjourneyは解像度指定が可能であるし、promptを研究していけばある程度絵柄も統一できそうなのでしばらく模索している。

なかなかいい感じだが、記事を書いている最中にDiscordを起動→自分のDiscordサーバーを選択→midjourneyチャンネルを選択→promptを入力(細かいパラメーター)という手順も煩雑に感じてきた。

というわけで、[Alfred](https://www.alfredapp.com/)からMidjourneyのpromptを入力できるようにした。

MidjourneyにはAPIが公開されていないので、有志が作っているNode.jsクライアントを利用する。

[

GitHub - erictik/midjourney-api: MidJourney client. Unofficial Node.js client

MidJourney client. Unofficial Node.js client. Contribute to erictik/midjourney-api development by creating an account on GitHub.

![](https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg)GitHuberictik

![](https://opengraph.githubassets.com/548f30a732387d755c44d80b62e01bd97a37c4ceef734f993ab519bed63a2aef/erictik/midjourney-api)

](https://github.com/erictik/midjourney-api)

JavaScriptでMidjourneyにpromptを渡すことができるので、あとはこれをAlfredからシェルスクリプトで実行してしまえばよい。

![Alfred Workflowの図](https://i.gyazo.com/e6928e7fa311e44e378bf8002222492c.png)

Midjourneyの出力には結構時間がかかるので、実行時に生成開始のプッシュ通知、終了時にDiscordのMidjourneyチャンネルを開いた上でプッシュ通知を飛ばすようにしてみた。(下では録画中なので通知が見えていない & 長いので中間カットしてある)

0:00

/0:15

 1× 

すごい雑実装だけどやりたいことができていて今のところいい感じ。画面を移して所定の手順を踏むという手続きをスキップできているので脳の負荷が減っているのを感じる。

参考までにシェルスクリプトとTypeScriptのコードを置いておく。

```bash
#!/bin/bash

# 引数を変数に格納
query=$1

# 指定されたディレクトリに移動
cd /Users/hoge/fuga/midjourney-client/

# npx tsx cli.ts を引数付きで実行
npx tsx cli.ts $query
```

Run Script

```typescript
import "dotenv/config";
import { Midjourney } from './src';
/**
 *
 * a simple example of how to use the imagine command
 * ```
 * npx tsx example/imagine.ts
 * ```
 */
async function main() {
  const client = new Midjourney({
    ServerId: <string>process.env.SERVER_ID,
    ChannelId: <string>process.env.CHANNEL_ID,
    SalaiToken: <string>process.env.SALAI_TOKEN,
    Debug: true,
    Ws: false,
  });

  // シェルスクリプトの引数を取得
  const args = process.argv.slice(2);
  // 引数を文字列に変換
  const prompt = args.join(" ");

  console.log('prompt: ' + prompt);


  const msg = await client.Imagine(
  // とりあえずハードコードしちゃっている。
    `${prompt}, Illustration for blog header image, soft touch, colorful, simple backgrounds, --ar 16:9 --v 6.0`,
    (uri: string, progress: string) => {
      console.log("loading", uri, "progress", progress);
    }
  );
  console.log(JSON.stringify(msg));
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

cli.ts
