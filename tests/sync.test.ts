/**
 * 同期処理のメインロジックのテスト
 */

import { PostSync } from '../src/sync';
import { GhostClient } from '../src/ghost-client';
import { MarkdownConverter } from '../src/markdown-converter';
import { GhostPost, SyncOptions } from '../src/types';

jest.mock('../src/ghost-client');
jest.mock('../src/markdown-converter');

const mockPost1: GhostPost = {
  id: '1',
  uuid: 'uuid-1',
  title: 'Post 1',
  slug: 'post-1',
  html: '<p>Content 1</p>',
  feature_image: undefined,
  featured: false,
  status: 'published',
  visibility: 'public',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-15T00:00:00.000Z',
  published_at: '2024-01-01T00:00:00.000Z',
};

const mockPost2: GhostPost = {
  id: '2',
  uuid: 'uuid-2',
  title: 'Post 2',
  slug: 'post-2',
  html: '<p>Content 2</p>',
  feature_image: undefined,
  featured: false,
  status: 'published',
  visibility: 'public',
  created_at: '2024-01-02T00:00:00.000Z',
  updated_at: '2024-01-16T00:00:00.000Z',
  published_at: '2024-01-02T00:00:00.000Z',
};

describe('PostSync', () => {
  let postSync: PostSync;
  let mockGhostClient: jest.Mocked<GhostClient>;
  let mockMarkdownConverter: jest.Mocked<MarkdownConverter>;

  const options: SyncOptions = {
    apiUrl: 'https://test.ghost.io',
    adminApiKey: 'test-key',
    contentPath: './posts',
    includePages: false,
    includeDrafts: false,
  };

  beforeEach(() => {
    mockGhostClient = new GhostClient(options.apiUrl, options.adminApiKey) as jest.Mocked<GhostClient>;
    mockMarkdownConverter = new MarkdownConverter(options.contentPath) as jest.Mocked<MarkdownConverter>;
    
    postSync = new PostSync(options);
    (postSync as any).ghostClient = mockGhostClient;
    (postSync as any).markdownConverter = mockMarkdownConverter;
  });

  describe('sync', () => {
    it('新規記事を作成する', async () => {
      mockGhostClient.getPosts.mockResolvedValue([mockPost1]);
      mockMarkdownConverter.getExistingPosts.mockResolvedValue(new Map());
      mockMarkdownConverter.savePost.mockResolvedValue(undefined);

      const result = await postSync.sync();

      expect(mockMarkdownConverter.savePost).toHaveBeenCalledWith(mockPost1);
      expect(result).toEqual({
        created: ['post-1'],
        updated: [],
        deleted: [],
        errors: [],
      });
    });

    it('更新された記事を更新する', async () => {
      mockGhostClient.getPosts.mockResolvedValue([mockPost1]);
      mockMarkdownConverter.getExistingPosts.mockResolvedValue(
        new Map([
          ['1', { slug: 'post-1', updated_at: '2024-01-14T00:00:00.000Z', filename: 'post-1.md' }],
        ])
      );
      mockMarkdownConverter.savePost.mockResolvedValue(undefined);

      const result = await postSync.sync();

      expect(mockMarkdownConverter.savePost).toHaveBeenCalledWith(mockPost1);
      expect(result).toEqual({
        created: [],
        updated: ['post-1'],
        deleted: [],
        errors: [],
      });
    });

    it('最新の記事はスキップする', async () => {
      mockGhostClient.getPosts.mockResolvedValue([mockPost1]);
      mockMarkdownConverter.getExistingPosts.mockResolvedValue(
        new Map([
          ['1', { slug: 'post-1', updated_at: '2024-01-15T00:00:00.000Z', filename: 'post-1.md' }],
        ])
      );

      const result = await postSync.sync();

      expect(mockMarkdownConverter.savePost).not.toHaveBeenCalled();
      expect(result).toEqual({
        created: [],
        updated: [],
        deleted: [],
        errors: [],
      });
    });

    it('削除された記事を削除する', async () => {
      mockGhostClient.getPosts.mockResolvedValue([]);
      mockMarkdownConverter.getExistingPosts.mockResolvedValue(
        new Map([
          ['1', { slug: 'post-1', updated_at: '2024-01-15T00:00:00.000Z', filename: 'post-1.md' }],
        ])
      );
      mockMarkdownConverter.deletePost.mockResolvedValue(undefined);

      const result = await postSync.sync();

      expect(mockMarkdownConverter.deletePost).toHaveBeenCalledWith('post-1.md');
      expect(result).toEqual({
        created: [],
        updated: [],
        deleted: ['post-1'],
        errors: [],
      });
    });

    it('エラーを適切に処理する', async () => {
      mockGhostClient.getPosts.mockResolvedValue([mockPost1]);
      mockMarkdownConverter.getExistingPosts.mockResolvedValue(new Map());
      mockMarkdownConverter.savePost.mockRejectedValue(new Error('Save error'));

      const result = await postSync.sync();

      expect(result).toEqual({
        created: [],
        updated: [],
        deleted: [],
        errors: [{ slug: 'post-1', error: 'Save error' }],
      });
    });

    it('ページも同期する', async () => {
      const syncWithPages = new PostSync({ ...options, includePages: true });
      (syncWithPages as any).ghostClient = mockGhostClient;
      (syncWithPages as any).markdownConverter = mockMarkdownConverter;

      mockGhostClient.getPosts.mockResolvedValue([mockPost1]);
      mockGhostClient.getPages.mockResolvedValue([mockPost2]);
      mockMarkdownConverter.getExistingPosts.mockResolvedValue(new Map());
      mockMarkdownConverter.savePost.mockResolvedValue(undefined);

      const result = await syncWithPages.sync();

      expect(mockGhostClient.getPages).toHaveBeenCalled();
      expect(mockMarkdownConverter.savePost).toHaveBeenCalledTimes(2);
      expect(result.created).toContain('post-1');
      expect(result.created).toContain('post-2');
    });

    it('下書きも同期する', async () => {
      const syncWithDrafts = new PostSync({ ...options, includeDrafts: true });
      (syncWithDrafts as any).ghostClient = mockGhostClient;
      (syncWithDrafts as any).markdownConverter = mockMarkdownConverter;

      mockGhostClient.getPosts.mockResolvedValue([mockPost1]);
      mockMarkdownConverter.getExistingPosts.mockResolvedValue(new Map());
      mockMarkdownConverter.savePost.mockResolvedValue(undefined);

      await syncWithDrafts.sync();

      expect(mockGhostClient.getPosts).toHaveBeenCalledWith({ includeDrafts: true });
    });
  });

  describe('getDryRunReport', () => {
    it('ドライラン結果を報告する', async () => {
      mockGhostClient.getPosts.mockResolvedValue([mockPost1, mockPost2]);
      mockMarkdownConverter.getExistingPosts.mockResolvedValue(
        new Map([
          ['1', { slug: 'post-1', updated_at: '2024-01-14T00:00:00.000Z', filename: 'post-1.md' }],
          ['3', { slug: 'post-3', updated_at: '2024-01-10T00:00:00.000Z', filename: 'post-3.md' }],
        ])
      );

      const report = await postSync.getDryRunReport();

      expect(report.toCreate).toEqual(['post-2']);
      expect(report.toUpdate).toEqual(['post-1']);
      expect(report.toDelete).toEqual(['post-3']);
      expect(report.toSkip).toEqual([]);
    });
  });
});