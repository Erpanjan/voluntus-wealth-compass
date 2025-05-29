
import { authorService } from '../authorService';
import { articleQueryService } from './articleQueryService';
import { articleMutationService } from './articleMutationService';
export type { Author, Article, Report } from './types';

/**
 * Main article service that combines query and mutation operations
 */
export const articleService = {
  // Query operations
  getArticles: articleQueryService.getArticles,
  getMultilingualArticles: articleQueryService.getMultilingualArticles, // New multilingual function
  getArticleById: articleQueryService.getArticleById,
  getMultilingualArticleById: articleQueryService.getMultilingualArticleById,
  getPublishedArticles: articleQueryService.getPublishedArticles,
  getPublishedArticlesByLanguage: articleQueryService.getPublishedArticlesByLanguage,
  getArticleBySlug: articleQueryService.getArticleBySlug,
  getArticleBySlugAndLanguage: articleQueryService.getArticleBySlugAndLanguage,
  
  // Mutation operations
  saveArticle: articleMutationService.saveArticle,
  saveMultilingualArticle: articleMutationService.saveMultilingualArticle,
  deleteArticle: articleMutationService.deleteArticle,
  togglePublishStatus: articleMutationService.togglePublishStatus,
  
  // Author operations
  getAuthors: authorService.getAuthors
};
