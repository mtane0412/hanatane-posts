/**
 * Ghost Admin APIクライアント
 */

import GhostAdminAPI from '@tryghost/admin-api';
import { GhostPost } from './types';

export class GhostClient {
  public readonly apiUrl: string;
  public readonly adminApiKey: string;
  private adminApi: GhostAdminAPI | null = null;

  constructor(apiUrl: string, adminApiKey: string) {
    this.apiUrl = apiUrl.replace(/\/$/, ''); // 末尾のスラッシュを削除
    this.adminApiKey = adminApiKey;
  }

  private getAdminApi(): GhostAdminAPI {
    if (!this.adminApi) {
      this.adminApi = new GhostAdminAPI({
        url: this.apiUrl,
        key: this.adminApiKey,
        version: 'v5.0',
      });
    }
    return this.adminApi;
  }

  async getPosts(options: { includeDrafts?: boolean } = {}): Promise<GhostPost[]> {
    try {
      const api = this.getAdminApi();
      const browseOptions: Record<string, unknown> = {
        limit: 'all',
        include: 'authors,tags',
        formats: 'html',
      };

      if (!options.includeDrafts) {
        browseOptions.filter = 'status:published';
      }

      const posts = await api.posts.browse(browseOptions);
      return posts as GhostPost[];
    } catch (error) {
      throw new Error(`Failed to fetch posts: ${(error as Error).message}`);
    }
  }

  async getPages(options: { includeDrafts?: boolean } = {}): Promise<GhostPost[]> {
    try {
      const api = this.getAdminApi();
      const browseOptions: Record<string, unknown> = {
        limit: 'all',
        include: 'authors,tags',
        formats: 'html',
      };

      if (!options.includeDrafts) {
        browseOptions.filter = 'status:published';
      }

      const pages = await api.pages.browse(browseOptions);
      return pages as GhostPost[];
    } catch (error) {
      throw new Error(`Failed to fetch pages: ${(error as Error).message}`);
    }
  }

  async getPost(id: string): Promise<GhostPost | null> {
    try {
      const api = this.getAdminApi();
      const post = await api.posts.read({
        id,
        include: 'authors,tags',
      });
      return post as GhostPost;
    } catch {
      // 記事が見つからない場合はnullを返す
      return null;
    }
  }

  async getPage(id: string): Promise<GhostPost | null> {
    try {
      const api = this.getAdminApi();
      const page = await api.pages.read({
        id,
        include: 'authors,tags',
      });
      return page as GhostPost;
    } catch {
      // ページが見つからない場合はnullを返す
      return null;
    }
  }
}