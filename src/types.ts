/**
 * Ghost APIとMarkdown同期システムの型定義
 */

export interface GhostPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  mobiledoc?: string;
  feature_image?: string;
  featured: boolean;
  status: 'published' | 'draft' | 'scheduled';
  visibility: 'public' | 'members' | 'paid' | 'tiers';
  created_at: string;
  updated_at: string;
  published_at?: string;
  custom_excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  authors?: GhostAuthor[];
  tags?: GhostTag[];
  primary_author?: GhostAuthor;
  primary_tag?: GhostTag;
  url?: string;
  excerpt?: string;
}

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  email?: string;
  profile_image?: string;
  bio?: string;
  website?: string;
  location?: string;
  facebook?: string;
  twitter?: string;
}

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  feature_image?: string;
  visibility: 'public' | 'internal';
  meta_title?: string;
  meta_description?: string;
}

export interface PostFrontmatter {
  title: string;
  slug: string;
  published_at?: string;
  status: 'published' | 'draft' | 'scheduled';
  visibility: 'public' | 'members' | 'paid' | 'tiers';
  tags?: string[];
  authors?: string[];
  feature_image?: string;
  custom_excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  ghost_id: string;
  ghost_updated_at: string;
  ghost_cards?: GhostCard[];
}

export interface GhostCard {
  type: string;
  content: Record<string, unknown>;
}

export interface SyncOptions {
  apiUrl: string;
  adminApiKey: string;
  contentPath: string;
  includePages?: boolean;
  includeDrafts?: boolean;
}

export interface SyncResult {
  created: string[];
  updated: string[];
  deleted: string[];
  errors: Array<{ slug: string; error: string }>;
}