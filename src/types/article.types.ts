
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

// Language type
export type Language = 'en' | 'zh';

// Base article interface for display
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

// Multilingual article interface for database
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

// Response types for paginated results
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

// Options for article queries
export interface ArticleQueryOptions {
  limit?: number;
  includeUnpublished?: boolean;
}
