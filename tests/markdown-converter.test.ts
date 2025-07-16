/**
 * Markdown変換・保存ロジックのテスト
 */

import { MarkdownConverter } from '../src/markdown-converter';
import { GhostPost } from '../src/types';
import fs from 'fs/promises';
import path from 'path';

// モックの設定
jest.mock('fs/promises');
jest.mock('turndown', () => {
  return jest.fn().mockImplementation(() => ({
    turndown: jest.fn((html: string) => {
      // 簡単なHTML→Markdown変換のモック
      return html
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\n\n')
        .replace(/<strong>/g, '**')
        .replace(/<\/strong>/g, '**')
        .replace(/<em>/g, '*')
        .replace(/<\/em>/g, '*')
        .trim();
    }),
  }));
});

const mockPost: GhostPost = {
  id: '1',
  uuid: 'uuid-1',
  title: 'Test Post',
  slug: 'test-post',
  html: '<p>This is a <strong>test</strong> post with <em>emphasis</em></p>',
  feature_image: 'https://example.com/image.jpg',
  featured: false,
  status: 'published',
  visibility: 'public',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-15T12:00:00.000Z',
  published_at: '2024-01-01T00:00:00.000Z',
  custom_excerpt: 'Test excerpt',
  authors: [{ id: '1', name: 'Test Author', slug: 'test-author' }],
  tags: [
    { id: '1', name: 'JavaScript', slug: 'javascript', visibility: 'public' },
    { id: '2', name: 'Testing', slug: 'testing', visibility: 'public' },
  ],
};

describe('MarkdownConverter', () => {
  let converter: MarkdownConverter;
  const mockContentPath = '/test/posts';

  beforeEach(() => {
    converter = new MarkdownConverter(mockContentPath);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('コンテンツパスが設定される', () => {
      expect(converter.contentPath).toBe(mockContentPath);
    });
  });

  describe('convertToMarkdown', () => {
    it('HTMLをMarkdownに変換する', () => {
      const markdown = converter.convertToMarkdown(mockPost.html);
      expect(markdown).toBe('This is a **test** post with *emphasis*');
    });

    it('空のHTMLを処理できる', () => {
      const markdown = converter.convertToMarkdown('');
      expect(markdown).toBe('');
    });

    it('複雑なHTMLを変換できる', () => {
      const html = '<p>Paragraph 1</p><p>Paragraph 2</p>';
      const markdown = converter.convertToMarkdown(html);
      expect(markdown).toBe('Paragraph 1\n\nParagraph 2');
    });
  });

  describe('createFrontmatter', () => {
    it('Ghostの記事からfrontmatterを生成する', () => {
      const frontmatter = converter.createFrontmatter(mockPost);
      
      expect(frontmatter.title).toBe('Test Post');
      expect(frontmatter.slug).toBe('test-post');
      expect(frontmatter.published_at).toBe('2024-01-01T00:00:00.000Z');
      expect(frontmatter.status).toBe('published');
      expect(frontmatter.visibility).toBe('public');
      expect(frontmatter.tags).toEqual(['JavaScript', 'Testing']);
      expect(frontmatter.authors).toEqual(['Test Author']);
      expect(frontmatter.feature_image).toBe('https://example.com/image.jpg');
      expect(frontmatter.custom_excerpt).toBe('Test excerpt');
      expect(frontmatter.ghost_id).toBe('1');
      expect(frontmatter.ghost_updated_at).toBe('2024-01-15T12:00:00.000Z');
    });

    it('オプションフィールドがない場合も処理できる', () => {
      const minimalPost: GhostPost = {
        ...mockPost,
        feature_image: undefined,
        custom_excerpt: undefined,
        tags: undefined,
        authors: undefined,
        published_at: undefined,
      };

      const frontmatter = converter.createFrontmatter(minimalPost);
      
      expect(frontmatter.feature_image).toBeUndefined();
      expect(frontmatter.custom_excerpt).toBeUndefined();
      expect(frontmatter.tags).toEqual([]);
      expect(frontmatter.authors).toEqual([]);
      expect(frontmatter.published_at).toBeUndefined();
    });
  });

  describe('savePost', () => {
    it('記事をMarkdownファイルとして保存する', async () => {
      const expectedPath = path.join(mockContentPath, 'test-post.md');

      await converter.savePost(mockPost);

      expect(fs.mkdir).toHaveBeenCalledWith(mockContentPath, { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledWith(
        expectedPath,
        expect.stringContaining('title: Test Post'),
        'utf-8'
      );
      
      // ファイル内容の詳細な検証
      const fileContent = (fs.writeFile as jest.Mock).mock.calls[0][1];
      expect(fileContent).toContain('slug: test-post');
      expect(fileContent).toContain('status: published');
      expect(fileContent).toContain('ghost_id: \'1\'');
      expect(fileContent).toContain('This is a **test** post with *emphasis*');
      expect(fileContent).toContain('JavaScript');
      expect(fileContent).toContain('Testing');
    });

    it('ファイル名に使えない文字を処理する', async () => {
      const postWithSpecialChars: GhostPost = {
        ...mockPost,
        slug: 'test/post:with*special|chars',
      };

      await converter.savePost(postWithSpecialChars);

      const expectedPath = path.join(mockContentPath, 'test-post-with-special-chars.md');
      expect(fs.writeFile).toHaveBeenCalledWith(
        expectedPath,
        expect.any(String),
        'utf-8'
      );
    });

    it('保存エラーを適切に処理する', async () => {
      (fs.writeFile as jest.Mock).mockRejectedValue(new Error('Write error'));

      await expect(converter.savePost(mockPost)).rejects.toThrow(
        'Failed to save post test-post: Write error'
      );
    });
  });

  describe('getExistingPosts', () => {
    it('既存の記事を読み取る', async () => {
      const mockFiles = ['post-1.md', 'post-2.md', 'not-a-post.txt'];
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.readFile as jest.Mock)
        .mockResolvedValueOnce(`---
title: Post 1
slug: post-1
ghost_id: '1'
ghost_updated_at: '2024-01-01T00:00:00.000Z'
---

Content 1`)
        .mockResolvedValueOnce(`---
title: Post 2
slug: post-2
ghost_id: '2'
ghost_updated_at: '2024-01-02T00:00:00.000Z'
---

Content 2`);

      const existingPosts = await converter.getExistingPosts();

      expect(existingPosts.size).toBe(2);
      expect(existingPosts.get('1')).toEqual({
        slug: 'post-1',
        updated_at: '2024-01-01T00:00:00.000Z',
        filename: 'post-1.md',
      });
      expect(existingPosts.get('2')).toEqual({
        slug: 'post-2',
        updated_at: '2024-01-02T00:00:00.000Z',
        filename: 'post-2.md',
      });
    });

    it('ディレクトリが存在しない場合は空のMapを返す', async () => {
      (fs.readdir as jest.Mock).mockRejectedValue({ code: 'ENOENT' });

      const existingPosts = await converter.getExistingPosts();

      expect(existingPosts.size).toBe(0);
    });

    it('不正なMarkdownファイルをスキップする', async () => {
      const mockFiles = ['invalid.md'];
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.readFile as jest.Mock).mockResolvedValue('Invalid content without frontmatter');

      const existingPosts = await converter.getExistingPosts();

      expect(existingPosts.size).toBe(0);
    });
  });

  describe('deletePost', () => {
    it('記事を削除する', async () => {
      const filename = 'test-post.md';
      const expectedPath = path.join(mockContentPath, filename);

      await converter.deletePost(filename);

      expect(fs.unlink).toHaveBeenCalledWith(expectedPath);
    });

    it('削除エラーを適切に処理する', async () => {
      (fs.unlink as jest.Mock).mockRejectedValue(new Error('Delete error'));

      await expect(converter.deletePost('test.md')).rejects.toThrow(
        'Failed to delete post test.md: Delete error'
      );
    });
  });
});