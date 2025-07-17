/**
 * Ghost APIクライアントのテスト
 */

import { GhostClient } from '../src/ghost-client';
import { GhostPost } from '../src/types';

// モックデータ
const mockPost: GhostPost = {
  id: '1',
  uuid: 'uuid-1',
  title: 'Test Post',
  slug: 'test-post',
  html: '<p>This is a test post</p>',
  feature_image: 'https://example.com/image.jpg',
  featured: false,
  status: 'published',
  visibility: 'public',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  published_at: '2024-01-01T00:00:00.000Z',
  custom_excerpt: 'Test excerpt',
  authors: [{ id: '1', name: 'Test Author', slug: 'test-author' }],
  tags: [{ id: '1', name: 'Test Tag', slug: 'test-tag', visibility: 'public' }],
};

describe('GhostClient', () => {
  let client: GhostClient;
  const mockApiUrl = 'https://test.ghost.io';
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    client = new GhostClient(mockApiUrl, mockApiKey);
  });

  describe('constructor', () => {
    it('URLの末尾のスラッシュを削除する', () => {
      const clientWithSlash = new GhostClient('https://test.ghost.io/', mockApiKey);
      expect(clientWithSlash.apiUrl).toBe('https://test.ghost.io');
    });

    it('APIキーが設定される', () => {
      expect(client.adminApiKey).toBe(mockApiKey);
    });
  });

  describe('getPosts', () => {
    it('公開済みの記事を取得できる', async () => {
      // Admin APIのモック
      const mockApi = {
        posts: {
          browse: jest.fn().mockResolvedValue([mockPost]),
        },
      };
      jest.spyOn(client as any, 'getAdminApi').mockReturnValue(mockApi);

      const posts = await client.getPosts();
      
      expect(posts).toHaveLength(1);
      expect(posts[0]).toEqual(mockPost);
      expect(mockApi.posts.browse).toHaveBeenCalledWith({
        limit: 'all',
        include: 'authors,tags',
        formats: 'html',
        filter: 'status:published',
      });
    });

    it('下書きも含めて取得できる', async () => {
      const mockApi = {
        posts: {
          browse: jest.fn().mockResolvedValue([mockPost]),
        },
      };
      jest.spyOn(client as any, 'getAdminApi').mockReturnValue(mockApi);

      await client.getPosts({ includeDrafts: true });
      
      expect(mockApi.posts.browse).toHaveBeenCalledWith({
        limit: 'all',
        include: 'authors,tags',
        formats: 'html',
        filter: undefined,
      });
    });

    it('APIエラーを適切に処理する', async () => {
      const mockApi = {
        posts: {
          browse: jest.fn().mockRejectedValue(new Error('API Error')),
        },
      };
      jest.spyOn(client as any, 'getAdminApi').mockReturnValue(mockApi);

      await expect(client.getPosts()).rejects.toThrow('Failed to fetch posts: API Error');
    });
  });

  describe('getPages', () => {
    it('ページを取得できる', async () => {
      const mockPage = { ...mockPost, id: '2', slug: 'test-page' };
      const mockApi = {
        pages: {
          browse: jest.fn().mockResolvedValue([mockPage]),
        },
      };
      jest.spyOn(client as any, 'getAdminApi').mockReturnValue(mockApi);

      const pages = await client.getPages();
      
      expect(pages).toHaveLength(1);
      expect(pages[0].slug).toBe('test-page');
    });
  });

  describe('getPost', () => {
    it('IDで記事を取得できる', async () => {
      const mockApi = {
        posts: {
          read: jest.fn().mockResolvedValue(mockPost),
        },
      };
      jest.spyOn(client as any, 'getAdminApi').mockReturnValue(mockApi);

      const post = await client.getPost('1');
      
      expect(post).toEqual(mockPost);
      expect(mockApi.posts.read).toHaveBeenCalledWith({
        id: '1',
        include: 'authors,tags',
      });
    });

    it('記事が見つからない場合nullを返す', async () => {
      const mockApi = {
        posts: {
          read: jest.fn().mockRejectedValue({ message: 'Post not found' }),
        },
      };
      jest.spyOn(client as any, 'getAdminApi').mockReturnValue(mockApi);

      const post = await client.getPost('999');
      
      expect(post).toBeNull();
    });
  });
});