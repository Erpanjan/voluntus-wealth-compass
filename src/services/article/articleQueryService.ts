
import { supabase } from '@/integrations/supabase/client';
import { Article } from './types';

/**
 * Handles all query operations for articles
 */
export const articleQueryService = {
  /**
   * Get all articles with their authors
   * @returns List of all articles with author information
   */
  async getArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase.rpc('get_articles_with_authors');
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      // Process the data to ensure correct typing
      const processedData: Article[] = data?.map((item: any) => ({
        ...item,
        authors: Array.isArray(item.authors) 
          ? item.authors.map((author: any) => ({
              id: author.id,
              name: author.name,
              image_url: author.image_url
            })) 
          : []
      })) || [];
      
      return processedData;
    } catch (error) {
      console.error('Error in getArticles:', error);
      return [];
    }
  },

  /**
   * Get published articles for public consumption
   * @returns List of published articles
   */
  async getPublishedArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase.rpc('get_articles_with_authors');
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      console.log('Raw published articles data:', data);
      
      // Process the data to ensure correct typing
      const processedData: Article[] = data?.map((item: any) => ({
        ...item,
        // Ensure content is properly normalized
        content: this._normalizeContent(item.content),
        authors: Array.isArray(item.authors) 
          ? item.authors.map((author: any) => ({
              id: author.id,
              name: author.name,
              image_url: author.image_url
            })) 
          : []
      })) || [];
      
      // Filter to only return published articles (where published_at is in the past)
      const now = new Date();
      return processedData.filter((article: Article) => {
        return article.published_at && new Date(article.published_at) <= now;
      });
    } catch (error) {
      console.error('Error in getPublishedArticles:', error);
      return [];
    }
  },

  /**
   * Get a single article by slug
   * @param slug The article slug to fetch
   * @returns The article with that slug or null if not found
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      console.log(`Fetching article by slug: ${slug}`);
      const { data, error } = await supabase.rpc('get_article_by_slug', {
        slug_param: slug
      });
      
      if (error) {
        console.error('Error fetching article:', error);
        throw error;
      }
      
      console.log('Raw article data from DB:', data);
      
      if (!data || data.length === 0) {
        console.log('No article found with slug:', slug);
        return null;
      }
      
      const rawArticle = data[0];
      console.log('Content type from DB:', typeof rawArticle.content);
      console.log('Raw content value:', rawArticle.content);
      
      // Process the data to ensure correct typing
      const article: Article = {
        ...rawArticle,
        // Normalize content to proper format
        content: this._normalizeContent(rawArticle.content),
        authors: Array.isArray(rawArticle.authors) 
          ? rawArticle.authors.map((author: any) => ({
              id: author.id,
              name: author.name,
              image_url: author.image_url
            })) 
          : [],
        reports: Array.isArray(rawArticle.reports) 
          ? rawArticle.reports.map((report: any) => ({
              id: report.id,
              title: report.title,
              description: report.description,
              file_url: report.file_url,
              created_at: report.created_at
            })) 
          : []
      };
      
      console.log('Processed article:', {
        title: article.title,
        contentType: typeof article.content,
        contentIsString: typeof article.content === 'string',
        hasReports: article.reports && article.reports.length > 0,
        contentSample: typeof article.content === 'string' 
          ? article.content.substring(0, 50) + '...'
          : 'Object content'
      });
      
      return article;
    } catch (error) {
      console.error('Error in getArticleBySlug:', error);
      return null;
    }
  },
  
  /**
   * Helper function to normalize content to string if it's currently an object
   * Handles different possible content formats from the database
   */
  _normalizeContent(content: any): string {
    if (content === null || content === undefined) {
      return '';
    }
    
    // If already a string, return as is
    if (typeof content === 'string') {
      return content;
    }
    
    // If it's an object, try to stringify it
    if (typeof content === 'object') {
      try {
        // Handle Supabase RPC JSONB content that might be pre-stringified
        // For objects, we want proper HTML if available
        if (content.html) {
          return content.html;
        } else if (content.text) {
          return content.text;
        } else {
          return JSON.stringify(content);
        }
      } catch (e) {
        console.error('Error normalizing content:', e);
        return JSON.stringify(content);
      }
    }
    
    // Default fallback
    return String(content);
  }
};
