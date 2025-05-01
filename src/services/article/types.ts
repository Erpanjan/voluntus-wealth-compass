
import { Author, Article, Report } from '@/types/article.types';

// Re-export types
export type { Author, Article, Report };

// Define additional type exports if needed for article services
export interface ArticleQueryOptions {
  limit?: number;
  includeUnpublished?: boolean;
}
