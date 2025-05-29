
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
  getArticleById: articleQueryService.getArticleById,
  getMultilingualArticleById: articleQueryService.getMultilingualArticleById, // New multilingual function
  getPublishedArticles: articleQueryService.getPublishedArticles,
  getPublishedArticlesByLanguage: articleQueryService.getPublishedArticlesByLanguage, // New language-aware function
  getArticleBySlug: articleQueryService.getArticleBySlug,
  getArticleBySlugAndLanguage: articleQueryService.getArticleBySlugAndLanguage, // New language-aware function
  
  // Mutation operations
  saveArticle: articleMutationService.saveArticle,
  saveMultilingualArticle: articleMutationService.saveMultilingualArticle, // New multilingual function
  deleteArticle: articleMutationService.deleteArticle,
  togglePublishStatus: articleMutationService.togglePublishStatus,
  
  // Author operations
  getAuthors: authorService.getAuthors
};
