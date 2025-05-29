
export interface Author {
  id: string;
  name: string;
  image_url: string | null;
}

export interface Report {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: any;
  category: string | null;
  author_name: string | null;
  image_url: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  authors?: Author[];
  reports?: Report[];
  // Multilingual fields for admin
  title_en?: string;
  title_zh?: string;
  description_en?: string;
  description_zh?: string;
  content_en?: any;
  content_zh?: any;
  category_en?: string;
  category_zh?: string;
  author_name_en?: string;
  author_name_zh?: string;
}

export interface MultilingualArticleData {
  id?: string;
  en: {
    title: string;
    description: string;
    content: any;
    category: string;
    author_name: string;
  };
  zh: {
    title: string;
    description: string;
    content: any;
    category: string;
    author_name: string;
  };
  image_url: string;
  published_at: string;
}

export interface ArticlesResponse {
  articles: Article[];
  totalCount: number;
}
