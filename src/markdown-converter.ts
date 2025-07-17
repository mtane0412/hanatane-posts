/**
 * Markdown変換・保存ロジック
 */

import TurndownService from 'turndown';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { GhostPost, PostFrontmatter } from './types';

export class MarkdownConverter {
  public readonly contentPath: string;
  private turndownService: TurndownService;

  constructor(contentPath: string) {
    this.contentPath = contentPath;
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
    });

    // カスタムルールの追加（必要に応じて）
    this.setupTurndownRules();
  }

  private setupTurndownRules(): void {
    // Ghost独自のカードやHTML要素の変換ルールを追加できる
    // 例: ボタンカード、製品カードなど
  }

  convertToMarkdown(html: string | undefined): string {
    if (!html) {
      console.warn('HTML content is undefined or empty');
      return '';
    }
    return this.turndownService.turndown(html);
  }

  createFrontmatter(post: GhostPost): PostFrontmatter {
    const frontmatter: PostFrontmatter = {
      title: post.title,
      slug: post.slug,
      status: post.status,
      visibility: post.visibility,
      tags: post.tags?.map(tag => tag.name) || [],
      authors: post.authors?.map(author => author.name) || [],
      ghost_id: post.id,
      ghost_updated_at: post.updated_at,
    };

    // オプションフィールドの設定
    if (post.published_at) {
      frontmatter.published_at = post.published_at;
    }
    if (post.feature_image) {
      frontmatter.feature_image = post.feature_image;
    }
    if (post.custom_excerpt) {
      frontmatter.custom_excerpt = post.custom_excerpt;
    }
    if (post.meta_title) {
      frontmatter.meta_title = post.meta_title;
    }
    if (post.meta_description) {
      frontmatter.meta_description = post.meta_description;
    }
    if (post.og_image) {
      frontmatter.og_image = post.og_image;
    }
    if (post.og_title) {
      frontmatter.og_title = post.og_title;
    }
    if (post.og_description) {
      frontmatter.og_description = post.og_description;
    }
    if (post.twitter_image) {
      frontmatter.twitter_image = post.twitter_image;
    }
    if (post.twitter_title) {
      frontmatter.twitter_title = post.twitter_title;
    }
    if (post.twitter_description) {
      frontmatter.twitter_description = post.twitter_description;
    }

    return frontmatter;
  }

  async savePost(post: GhostPost): Promise<void> {
    try {
      // ディレクトリの作成
      await fs.mkdir(this.contentPath, { recursive: true });

      // ファイル名の生成（特殊文字を除去）
      const filename = this.sanitizeFilename(post.slug) + '.md';
      const filePath = path.join(this.contentPath, filename);

      // frontmatterとコンテンツの生成
      const frontmatter = this.createFrontmatter(post);
      if (!post.html) {
        throw new Error(`Post ${post.slug} has no HTML content`);
      }
      const markdownContent = this.convertToMarkdown(post.html);

      // ファイルの内容を生成
      const fileContent = matter.stringify(markdownContent, frontmatter);

      // ファイルの保存
      await fs.writeFile(filePath, fileContent, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save post ${post.slug}: ${(error as Error).message}`);
    }
  }

  private sanitizeFilename(slug: string): string {
    // ファイル名に使えない文字を置換
    return slug.replace(/[\/\\:*?"<>|]/g, '-');
  }

  async getExistingPosts(): Promise<Map<string, { slug: string; updated_at: string; filename: string }>> {
    const existingPosts = new Map<string, { slug: string; updated_at: string; filename: string }>();

    try {
      const files = await fs.readdir(this.contentPath);
      const markdownFiles = files.filter(file => file.endsWith('.md'));

      for (const filename of markdownFiles) {
        try {
          const filePath = path.join(this.contentPath, filename);
          const content = await fs.readFile(filePath, 'utf-8');
          const { data } = matter(content);
          const frontmatter = data as Partial<PostFrontmatter>;

          if (frontmatter.ghost_id && frontmatter.slug && frontmatter.ghost_updated_at) {
            existingPosts.set(frontmatter.ghost_id, {
              slug: frontmatter.slug,
              updated_at: frontmatter.ghost_updated_at,
              filename,
            });
          }
        } catch (error) {
          // 個別のファイルの読み取りエラーは無視
          console.error(`Failed to read ${filename}: ${(error as Error).message}`);
        }
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
      // ディレクトリが存在しない場合は空のMapを返す
    }

    return existingPosts;
  }

  async deletePost(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.contentPath, filename);
      await fs.unlink(filePath);
    } catch (error) {
      throw new Error(`Failed to delete post ${filename}: ${(error as Error).message}`);
    }
  }
}