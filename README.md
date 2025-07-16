# Ghost Posts Sync

Ghostブログの記事をMarkdown形式でGitHubリポジトリに同期するシステムです。

## 特徴

- Ghost Admin APIを使用して記事を取得
- HTMLからMarkdownへの自動変換
- frontmatterによるメタデータ管理
- GitHub Actionsによる定期同期
- 新規作成・更新・削除の自動検知
- ドライランモードでの事前確認

## セットアップ

### 1. Ghost Admin APIキーの取得

1. Ghost管理画面にログイン
2. Settings > Integrations > + Add custom integration
3. 統合名を入力（例：GitHub Sync）
4. Admin API KeyとAPI URLをコピー

### 2. リポジトリの設定

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/hanatane-posts.git
cd hanatane-posts

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .envファイルを編集してGhost APIの情報を入力
```

### 3. GitHub Secretsの設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下を追加：

- `GHOST_API_URL`: GhostブログのURL（例：https://your-blog.ghost.io）
- `GHOST_ADMIN_API_KEY`: Ghost Admin APIキー

## 使用方法

### ローカルでの実行

```bash
# TypeScriptをビルド
npm run build

# 同期を実行
npm run sync

# ドライランモード（変更内容の確認のみ）
node dist/sync.js --dry-run

# 開発モード（TypeScriptを直接実行）
npm run dev
```

### GitHub Actionsでの自動実行

- 毎日午前3時（JST）に自動実行
- Actions タブから手動実行も可能
- 手動実行時のオプション：
  - Dry run mode: 変更内容の確認のみ
  - Include drafts: 下書き記事も同期
  - Include pages: ページも同期

## 開発

### テストの実行

```bash
# すべてのテストを実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジレポート
npm run test:coverage
```

### コード品質

```bash
# Lintチェック
npm run lint

# Lintエラーを自動修正
npm run lint:fix

# コードフォーマット
npm run format

# 型チェック
npm run typecheck
```

## ファイル構造

```
posts/
├── post-slug-1.md
├── post-slug-2.md
└── ...
```

各Markdownファイルには以下のfrontmatterが含まれます：

```yaml
---
title: 記事タイトル
slug: post-slug
published_at: '2024-01-01T00:00:00.000Z'
status: published
visibility: public
tags:
  - タグ1
  - タグ2
authors:
  - 著者名
feature_image: https://example.com/image.jpg
custom_excerpt: 記事の概要
ghost_id: '1234567890'
ghost_updated_at: '2024-01-15T00:00:00.000Z'
---

記事本文...
```

## 注意事項

- Ghost独自のカード（ボタン、製品カードなど）は通常のMarkdownに変換されます
- 複雑なレイアウトは簡略化される場合があります
- 画像URLは元のGhostサーバーのURLがそのまま使用されます

## ライセンス

ISC