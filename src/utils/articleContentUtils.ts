
import { MultilingualArticle, Article, Language } from '@/types/multilingual-article.types';

/**
 * Normalize article content for display based on language preference
 */
export const normalizeArticleContent = (
  article: MultilingualArticle, 
  language: Language = 'en'
): Article => {
  const getFieldWithFallback = (
    primaryField: string | undefined,
    fallbackField: string | undefined
  ): string => {
    if (primaryField && primaryField.trim()) {
      return primaryField;
    }
    return fallbackField || '';
  };

  const getContentWithFallback = (
    primaryContent: any,
    fallbackContent: any
  ): any => {
    if (primaryContent && 
        (typeof primaryContent === 'object' || 
         (typeof primaryContent === 'string' && primaryContent.trim()))) {
      return primaryContent;
    }
    return fallbackContent || {};
  };

  if (language === 'zh') {
    return {
      id: article.id,
      title: getFieldWithFallback(article.title_zh, article.title_en),
      slug: article.slug,
      description: getFieldWithFallback(article.description_zh, article.description_en),
      content: getContentWithFallback(article.content_zh, article.content_en),
      category: getFieldWithFallback(article.category_zh, article.category_en),
      author_name: getFieldWithFallback(article.author_name_zh, article.author_name_en),
      image_url: article.image_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      authors: article.authors,
      reports: article.reports,
    };
  } else {
    return {
      id: article.id,
      title: getFieldWithFallback(article.title_en, article.title_zh),
      slug: article.slug,
      description: getFieldWithFallback(article.description_en, article.description_zh),
      content: getContentWithFallback(article.content_en, article.content_zh),
      category: getFieldWithFallback(article.category_en, article.category_zh),
      author_name: getFieldWithFallback(article.author_name_en, article.author_name_zh),
      image_url: article.image_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      authors: article.authors,
      reports: article.reports,
    };
  }
};

/**
 * Check if article has content in the specified language
 */
export const hasContentInLanguage = (
  article: MultilingualArticle, 
  language: Language
): boolean => {
  if (language === 'zh') {
    return !!(article.title_zh?.trim() && article.content_zh);
  } else {
    return !!(article.title_en?.trim() && article.content_en);
  }
};

/**
 * Get available languages for an article
 */
export const getAvailableLanguages = (article: MultilingualArticle): Language[] => {
  const languages: Language[] = [];
  
  if (hasContentInLanguage(article, 'en')) {
    languages.push('en');
  }
  
  if (hasContentInLanguage(article, 'zh')) {
    languages.push('zh');
  }
  
  return languages;
};

/**
 * Process content for safe rendering
 */
export const processContent = (content: any): any => {
  if (!content) return {};
  
  // Handle string content
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  }
  
  // Handle object content
  if (typeof content === 'object') {
    return content;
  }
  
  return {};
};
