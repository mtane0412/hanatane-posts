# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このリポジトリは、Ghost CMSのブログコンテンツをMarkdown形式でGitHubに同期するシステムです。Ghost Admin APIを使用して記事を取得し、HTMLをMarkdownに変換して保存します。

## 開発コマンド

### 基本コマンド
```bash
# 依存関係のインストール
npm install

# TypeScriptのビルド
npm run build

# 開発モードで同期実行
npm run dev

# ビルド後の同期実行
npm run sync

# テスト実行
npm test

# 単一テストファイルの実行
npm test -- tests/ghost-client.test.ts

# Lintチェック
npm run lint

# コードフォーマット
npm run format
```

### 環境変数の設定
`.env.example`をコピーして`.env`を作成し、以下の値を設定：
- `GHOST_API_URL`: GhostブログのURL
- `GHOST_ADMIN_API_KEY`: Admin APIキー
- `CONTENT_PATH`: Markdownファイルの保存先（デフォルト: ./posts）

## アーキテクチャ

### 主要クラス

1. **GhostClient** (`src/ghost-client.ts`)
   - Ghost Admin APIとの通信を担当
   - `getPosts()`と`getPages()`メソッドでコンテンツを取得

2. **MarkdownConverter** (`src/markdown-converter.ts`)
   - HTMLからMarkdownへの変換処理
   - frontmatterの生成とファイル保存を担当
   - Turndownライブラリを使用してHTML→Markdown変換

3. **PostSync** (`src/sync.ts`)
   - 同期処理のメインロジック
   - 新規・更新・削除の判定と実行
   - CLIオプションの処理（dry-run、drafts、pages）

### データフロー

1. `PostSync`が`GhostClient`を使用してGhostから記事を取得
2. 取得した記事を`MarkdownConverter`でMarkdown形式に変換
3. 既存ファイルと比較して新規・更新・削除を判定
4. 必要に応じてファイルシステムに変更を適用

### 型定義

- `src/types.ts`: Ghost APIのレスポンス型定義
- `src/types/turndown.d.ts`: Turndownライブラリの型定義

## テスト戦略

- 各クラスに対応するテストファイルが`tests/`ディレクトリに存在
- Jestのモック機能を使用して外部依存を分離
- テスト実行時は必ず`npm test`を使用

## GitHub Actions

`.github/workflows/sync-ghost-posts.yml`により自動同期が設定済み：
- 毎日午前3時（JST）に自動実行
- 手動実行も可能（dry-run、drafts、pagesオプション付き）
- 変更があれば自動的にコミット・プッシュ