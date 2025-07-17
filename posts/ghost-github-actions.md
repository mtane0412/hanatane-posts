---
title: Github ActionsでGhostテーマをデプロイする
slug: ghost-github-actions
status: published
visibility: public
tags:
  - 技術の話
  - Ghost
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec144
ghost_updated_at: '2025-03-30T14:09:54.000Z'
published_at: '2024-11-29T14:46:11.000Z'
feature_image: >-
  https://hanatane.net/content/images/2024/11/tanenobu_Ghost_Casper_Black_Cat_Characters_that_are_cartoon-l_8ea990aa-aeb8-4348-b9cc-795066fb52b0_1.png
custom_excerpt: Ghost公式のworkflowを用いてGithub Actionsからテーマを自動でデプロイしていきます。
---
このブログを更新していくテンションを上げるために[よさげな有料テーマ](https://aspect.priority.vision/)を導入しました。

もともとコードではなく記事を書くことに集中したいがためにフルマネージドのGhostを選択したのですが、運営しているとどうしてもCode Injectionだけでは対応できない部分にも手を加える必要が出てきます。今回の場合だと項目の日本語のローカライズであったり、トップページの著者一覧セクションが不要だったり。

ということでカスタムテーマを作成していくわけですが、GhostはWordPressと違って子テーマ的な機能がありません。これはShopifyなんかも同じで、子テーマ機能は結局親テーマが後方互換を考えなければならなかったりと開発速度を落としてしまったりとか色々問題があるからなんでしょう。というわけで改造テーマはGitで管理していきます。

Gitで管理するならば、リポジトリにプッシュした段階で自動でデプロイまでやってくれると楽ちんです。Ghostは公式でGithub Actionsのガイドを公開しているのでこれに従えば簡単でした。

[

Official Ghost + GitHub Integration

Set up simple continuous integration of your Ghost theme to deploy directly to your Ghost website with GitHub Actions. Share code snippets with GitHub Gists 👨‍💻

![](https://hanatane.net/content/images/icon/favicon-3.ico)Ghost - The Professional Publishing Platform

![](https://hanatane.net/content/images/thumbnail/ghost-integrations.png)

](https://ghost.org/integrations/github/)

Ghostの管理画面からCustom Integrationを作成してAdmin API keyとAPI URLを入手。

![](https://hanatane.net/content/images/2024/11/image-3.png)

Githubの方でSettings → Secrets and variables → Actionsで、`GHOST_ADMIN_API_URL` と `GHOST_ADMIN_API_KEY` に値を設定。

![](https://hanatane.net/content/images/2024/11/image-5.png)

リポジトリに公式のワークフローのYAMLを設置してプッシュ。

```.github/workflows/deploy-theme.yml
name: Deploy Theme
on:
  push:
    branches:
      - master
      - main
jobs:
  deploy:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Ghost Theme
        uses: TryGhost/action-deploy-theme@v1
        with:
          api-url: ${{ secrets.GHOST_ADMIN_API_URL }}
          api-key: ${{ secrets.GHOST_ADMIN_API_KEY }}
```

あとはプッシュすると自動でDeployされます。

![](https://hanatane.net/content/images/2024/11/image-4.png)

便利。
