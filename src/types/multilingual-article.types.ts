
export interface Author {
  id: string;
  name: string;
  image_url?: string;
  bio?: string;
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  created_at: string;
}

// Unified multilingual article interface
export interface MultilingualArticle {
  id: string;
  slug: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  authors?: Author[];
  reports?: Report[];
  
  // English fields
  title_en?: string;
  description_en?: string;
  content_en?: any;
  category_en?: string;
  author_name_en?: string;
  
  // Chinese fields
  title_zh?: string;
  description_zh?: string;
  content_zh?: any;
  category_zh?: string;
  author_name_zh?: string;
}

// Language-specific article (for display)
export interface Article {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: any;
  category?: string;
  author_name?: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  authors?: Author[];
  reports?: Report[];
}

// Enhanced multilingual article with nested language structure
export interface MultilingualArticleWithNested extends MultilingualArticle {
  en: {
    title?: string;
    description?: string;
    content?: any;
    category?: string;
    author_name?: string;
  };
  zh: {
    title?: string;
    description?: string;
    content?: any;
    category?: string;
    author_name?: string;
  };
}

// Input types for creating/updating articles
export interface MultilingualArticleInput {
  id?: string;
  en: {
    title?: string;
    description?: string;
    content?: any;
    category?: string;
    author_name?: string;
  };
  zh: {
    title?: string;
    description?: string;
    content?: any;
    category?: string;
    author_name?: string;
  };
  image_url?: string;
  published_at: string;
}

// Legacy article input for backward compatibility
export interface ArticleInput {
  id?: string;
  title: string;
  description?: string;
  content: any;
  category?: string;
  author_name?: string;
  image_url?: string;
  published_at: string;
}

export interface ArticleQueryOptions {
  limit?: number;
  includeUnpublished?: boolean;
}

export interface PaginatedArticlesResponse {
  articles: Article[];
  totalCount: number;
  totalPages?: number;
}

export interface PaginatedMultilingualArticlesResponse {
  articles: MultilingualArticle[];
  totalCount: number;
  totalPages?: number;
}

// Language type
export type Language = 'en' | 'zh';
