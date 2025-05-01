
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

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: any;
  category: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  authors?: Author[];
  reports?: Report[];
}

export interface ArticleInput {
  id?: string;
  title: string;
  description: string;
  content: any;
  category: string;
  image_url?: string;
  published_at: string;
}
