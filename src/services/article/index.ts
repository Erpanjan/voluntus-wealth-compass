
import { authorService } from '../authorService';
import { unifiedArticleService } from './unifiedArticleService';

// Re-export types from the unified types file
export type { 
  Author, 
  Article, 
  Report, 
  MultilingualArticle,
  MultilingualArticleInput,
  Language,
  PaginatedArticlesResponse,
  PaginatedMultilingualArticlesResponse
} from '@/types/article.types';

/**
 * Main article service using the unified implementation
 */
export const articleService = {
  // Primary multilingual operations
  getPublishedArticlesByLanguage: unifiedArticleService.getPublishedArticlesByLanguage,
  getArticleBySlugAndLanguage: unifiedArticleService.getArticleBySlugAndLanguage,
  getMultilingualArticles: unifiedArticleService.getMultilingualArticles,
  getMultilingualArticleById: unifiedArticleService.getMultilingualArticleById,
  saveMultilingualArticle: unifiedArticleService.saveMultilingualArticle,
  deleteArticle: unifiedArticleService.deleteArticle,
  togglePublishStatus: unifiedArticleService.togglePublishStatus,
  
  // Legacy compatibility methods (deprecated - use multilingual versions)
  getArticles: unifiedArticleService.getMultilingualArticles,
  saveArticle: unifiedArticleService.saveMultilingualArticle,
  getArticleById: async (id: string) => {
    const article = await unifiedArticleService.getMultilingualArticleById(id);
    return article ? {
      ...article,
      title: article.title_en || article.title_zh || '',
      description: article.description_en || article.description_zh || '',
      content: article.content_en || article.content_zh || {},
      category: article.category_en || article.category_zh || '',
      author_name: article.author_name_en || article.author_name_zh || '',
    } : null;
  },
  getPublishedArticles: (page?: number, pageSize?: number) => 
    unifiedArticleService.getPublishedArticlesByLanguage(page, pageSize, 'en'),
  getArticleBySlug: (slug: string) => 
    unifiedArticleService.getArticleBySlugAndLanguage(slug, 'en'),
  
  // Author operations
  getAuthors: authorService.getAuthors
};
