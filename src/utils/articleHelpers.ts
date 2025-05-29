
import { MultilingualArticle, Article, Language, MultilingualArticleWithNested } from '@/types/article.types';

/**
 * Convert multilingual article to single-language article for display
 */
export const normalizeArticleContent = (
  article: MultilingualArticle, 
  language: Language
): Article => {
  const isZh = language === 'zh';
  
  return {
    id: article.id,
    slug: article.slug,
    title: isZh 
      ? (article.title_zh || article.title_en || 'Untitled')
      : (article.title_en || article.title_zh || 'Untitled'),
    description: isZh 
      ? (article.description_zh || article.description_en || '')
      : (article.description_en || article.description_zh || ''),
    content: isZh 
      ? (article.content_zh || article.content_en || {})
      : (article.content_en || article.content_zh || {}),
    category: isZh 
      ? (article.category_zh || article.category_en || '')
      : (article.category_en || article.category_zh || ''),
    author_name: isZh 
      ? (article.author_name_zh || article.author_name_en || '')
      : (article.author_name_en || article.author_name_zh || ''),
    image_url: article.image_url,
    published_at: article.published_at,
    created_at: article.created_at,
    updated_at: article.updated_at,
    authors: article.authors,
    reports: article.reports,
  };
};

/**
 * Convert flat multilingual article to nested structure for forms
 */
export const convertToNestedStructure = (article: MultilingualArticle): MultilingualArticleWithNested => {
  return {
    ...article,
    en: {
      title: article.title_en,
      description: article.description_en,
      content: article.content_en,
      category: article.category_en,
      author_name: article.author_name_en,
    },
    zh: {
      title: article.title_zh,
      description: article.description_zh,
      content: article.content_zh,
      category: article.category_zh,
      author_name: article.author_name_zh,
    },
  };
};

/**
 * Check if article is published
 */
export const isArticlePublished = (publishedAt: string): boolean => {
  return new Date(publishedAt) <= new Date();
};

/**
 * Get primary language content from multilingual article
 */
export const getPrimaryLanguageContent = (article: MultilingualArticle): { language: Language; hasContent: boolean } => {
  const hasEnglish = !!(article.title_en && article.title_en.trim());
  const hasChinese = !!(article.title_zh && article.title_zh.trim());
  
  if (hasEnglish) return { language: 'en', hasContent: true };
  if (hasChinese) return { language: 'zh', hasContent: true };
  
  return { language: 'en', hasContent: false };
};

/**
 * Safe content processing for different data types
 */
export const processContent = (content: any): any => {
  if (!content) return {};
  
  if (typeof content === 'string') {
    if (content === 'map[]' || content.trim() === '') return {};
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  }
  
  if (typeof content === 'object' && content !== null) {
    if (Array.isArray(content)) {
      return content.map(item => processContent(item));
    }
    
    const processed: any = {};
    for (const [key, value] of Object.entries(content)) {
      processed[key] = value === 'map[]' ? {} : 
        (typeof value === 'object' && value !== null ? processContent(value) : value);
    }
    return processed;
  }
  
  return content;
};
