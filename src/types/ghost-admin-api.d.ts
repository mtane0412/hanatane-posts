/**
 * @tryghost/admin-api の型定義
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@tryghost/admin-api' {
  interface GhostAdminAPIOptions {
    url: string;
    key: string;
    version: string;
  }

  interface BrowseOptions {
    limit?: number | 'all';
    page?: number;
    filter?: string;
    include?: string;
    fields?: string;
    order?: string;
  }

  interface ReadOptions {
    id: string;
    include?: string;
  }

  class GhostAdminAPI {
    constructor(options: GhostAdminAPIOptions);

    posts: {
      browse(options?: BrowseOptions): Promise<any[]>;
      read(options: ReadOptions): Promise<any>;
      add(post: any): Promise<any>;
      edit(post: any, options?: any): Promise<any>;
      delete(options: { id: string }): Promise<void>;
    };

    pages: {
      browse(options?: BrowseOptions): Promise<any[]>;
      read(options: ReadOptions): Promise<any>;
      add(page: any): Promise<any>;
      edit(page: any, options?: any): Promise<any>;
      delete(options: { id: string }): Promise<void>;
    };

    tags: {
      browse(options?: BrowseOptions): Promise<any[]>;
      read(options: ReadOptions | { slug: string }): Promise<any>;
    };

    authors: {
      browse(options?: BrowseOptions): Promise<any[]>;
      read(options: ReadOptions | { slug: string }): Promise<any>;
    };
  }

  export = GhostAdminAPI;
}