
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
  getPublishedArticles: articleQueryService.getPublishedArticles,
  getArticleBySlug: articleQueryService.getArticleBySlug,
  
  // Mutation operations
  saveArticle: articleMutationService.saveArticle,
  deleteArticle: articleMutationService.deleteArticle,
  togglePublishStatus: articleMutationService.togglePublishStatus,
  
  // Author operations
  getAuthors: authorService.getAuthors
};
