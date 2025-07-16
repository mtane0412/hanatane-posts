/**
 * Ghost記事の同期処理メインロジック
 */

import { GhostClient } from './ghost-client';
import { MarkdownConverter } from './markdown-converter';
import { SyncOptions, SyncResult } from './types';
import * as dotenv from 'dotenv';

export class PostSync {
  private ghostClient: GhostClient;
  private markdownConverter: MarkdownConverter;
  private options: SyncOptions;

  constructor(options: SyncOptions) {
    this.options = options;
    this.ghostClient = new GhostClient(options.apiUrl, options.adminApiKey);
    this.markdownConverter = new MarkdownConverter(options.contentPath);
  }

  async sync(): Promise<SyncResult> {
    const result: SyncResult = {
      created: [],
      updated: [],
      deleted: [],
      errors: [],
    };

    try {
      // Ghost から記事を取得
      const posts = await this.ghostClient.getPosts({ 
        includeDrafts: this.options.includeDrafts 
      });

      // ページも含める場合
      let allPosts = [...posts];
      if (this.options.includePages) {
        const pages = await this.ghostClient.getPages({ 
          includeDrafts: this.options.includeDrafts 
        });
        allPosts = [...posts, ...pages];
      }

      // 既存のMarkdownファイルを取得
      const existingPosts = await this.markdownConverter.getExistingPosts();

      // 各記事を処理
      for (const post of allPosts) {
        try {
          const existing = existingPosts.get(post.id);

          if (!existing) {
            // 新規作成
            await this.markdownConverter.savePost(post);
            result.created.push(post.slug);
          } else if (new Date(post.updated_at) > new Date(existing.updated_at)) {
            // 更新
            await this.markdownConverter.savePost(post);
            result.updated.push(post.slug);
            existingPosts.delete(post.id);
          } else {
            // スキップ（最新）
            existingPosts.delete(post.id);
          }
        } catch (error) {
          result.errors.push({
            slug: post.slug,
            error: (error as Error).message,
          });
        }
      }

      // 残った既存ファイルは削除対象
      for (const existing of existingPosts.values()) {
        try {
          await this.markdownConverter.deletePost(existing.filename);
          result.deleted.push(existing.slug);
        } catch (error) {
          result.errors.push({
            slug: existing.slug,
            error: (error as Error).message,
          });
        }
      }
    } catch (error) {
      throw new Error(`Sync failed: ${(error as Error).message}`);
    }

    return result;
  }

  async getDryRunReport(): Promise<{
    toCreate: string[];
    toUpdate: string[];
    toDelete: string[];
    toSkip: string[];
  }> {
    const report = {
      toCreate: [] as string[],
      toUpdate: [] as string[],
      toDelete: [] as string[],
      toSkip: [] as string[],
    };

    // Ghost から記事を取得
    const posts = await this.ghostClient.getPosts({ 
      includeDrafts: this.options.includeDrafts 
    });

    let allPosts = [...posts];
    if (this.options.includePages) {
      const pages = await this.ghostClient.getPages({ 
        includeDrafts: this.options.includeDrafts 
      });
      allPosts = [...posts, ...pages];
    }

    // 既存のMarkdownファイルを取得
    const existingPosts = await this.markdownConverter.getExistingPosts();

    // 各記事をチェック
    for (const post of allPosts) {
      const existing = existingPosts.get(post.id);

      if (!existing) {
        report.toCreate.push(post.slug);
      } else if (new Date(post.updated_at) > new Date(existing.updated_at)) {
        report.toUpdate.push(post.slug);
        existingPosts.delete(post.id);
      } else {
        report.toSkip.push(post.slug);
        existingPosts.delete(post.id);
      }
    }

    // 残った既存ファイルは削除対象
    for (const existing of existingPosts.values()) {
      report.toDelete.push(existing.slug);
    }

    return report;
  }
}

// CLIエントリーポイント
if (require.main === module) {
  dotenv.config();

  const options: SyncOptions = {
    apiUrl: process.env.GHOST_API_URL || '',
    adminApiKey: process.env.GHOST_ADMIN_API_KEY || '',
    contentPath: process.env.CONTENT_PATH || './posts',
    includePages: process.env.INCLUDE_PAGES === 'true',
    includeDrafts: process.env.INCLUDE_DRAFTS === 'true',
  };

  if (!options.apiUrl || !options.adminApiKey) {
    console.error('GHOST_API_URL and GHOST_ADMIN_API_KEY must be set');
    process.exit(1);
  }

  const sync = new PostSync(options);

  // ドライランモード
  if (process.argv.includes('--dry-run')) {
    sync.getDryRunReport()
      .then(report => {
        console.log('=== Dry Run Report ===');
        console.log(`To create: ${report.toCreate.length} posts`);
        report.toCreate.forEach(slug => console.log(`  + ${slug}`));
        console.log(`To update: ${report.toUpdate.length} posts`);
        report.toUpdate.forEach(slug => console.log(`  ~ ${slug}`));
        console.log(`To delete: ${report.toDelete.length} posts`);
        report.toDelete.forEach(slug => console.log(`  - ${slug}`));
        console.log(`To skip: ${report.toSkip.length} posts`);
      })
      .catch(error => {
        console.error('Dry run failed:', error);
        process.exit(1);
      });
  } else {
    // 実際の同期
    sync.sync()
      .then(result => {
        console.log('=== Sync Result ===');
        console.log(`Created: ${result.created.length} posts`);
        console.log(`Updated: ${result.updated.length} posts`);
        console.log(`Deleted: ${result.deleted.length} posts`);
        
        if (result.errors.length > 0) {
          console.error(`\nErrors: ${result.errors.length}`);
          result.errors.forEach(err => {
            console.error(`  ${err.slug}: ${err.error}`);
          });
        }
      })
      .catch(error => {
        console.error('Sync failed:', error);
        process.exit(1);
      });
  }
}