
import { supabase } from '@/integrations/supabase/client';
import { Article } from './types';

/**
 * Normalizes article content based on its type
 * @param content The article content to normalize
 * @returns Normalized content
 */
const normalizeContent = (content: any) => {
  try {
    if (!content) return {};
    
    if (typeof content === 'string') {
      try {
        // Try to parse as JSON if it's a string
        return JSON.parse(content);
      } catch (e) {
        // If not valid JSON, return as-is
        return content;
      }
    } else {
      // Already an object, return as-is
      return content;
    }
  } catch (error) {
    console.error('Error normalizing content:', error);
    return {};
  }
};

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
      console.log('Fetching all articles...');
      const { data, error } = await supabase.rpc('get_articles_with_authors');
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      console.log('Raw articles data:', data);
      
      // Process the data to ensure correct typing
      const processedData: Article[] = data?.map((item: any) => ({
        ...item,
        content: normalizeContent(item.content),
        authors: Array.isArray(item.authors) 
          ? item.authors.map((author: any) => ({
              id: author.id,
              name: author.name,
              image_url: author.image_url
            })) 
          : []
      })) || [];
      
      console.log('Processed articles data:', processedData);
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
      console.log('Fetching published articles...');
      const { data, error } = await supabase.rpc('get_articles_with_authors');
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      console.log('Raw published articles data:', data);
      
      // Process the data to ensure correct typing
      const processedData: Article[] = data?.map((item: any) => ({
        ...item,
        content: normalizeContent(item.content),
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
      const publishedArticles = processedData.filter((article: Article) => {
        return new Date(article.published_at) <= now;
      });
      
      console.log('Processed published articles data:', publishedArticles);
      return publishedArticles;
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
      console.log(`Fetching article with slug: ${slug}`);
      const { data, error } = await supabase.rpc('get_article_by_slug', {
        slug_param: slug
      });
      
      if (error) {
        console.error('Error fetching article:', error);
        throw error;
      }
      
      console.log('Raw article data:', data);
      
      if (data && data.length > 0) {
        // Process the data to ensure correct typing
        const article: Article = {
          ...data[0],
          content: normalizeContent(data[0].content),
          authors: Array.isArray(data[0].authors) 
            ? data[0].authors.map((author: any) => ({
                id: author.id,
                name: author.name,
                image_url: author.image_url
              })) 
            : [],
          reports: Array.isArray(data[0].reports) 
            ? data[0].reports.map((report: any) => ({
                id: report.id,
                title: report.title,
                description: report.description,
                file_url: report.file_url,
                created_at: report.created_at
              })) 
            : []
        };
        console.log('Processed article data:', article);
        return article;
      }
      
      console.log('No article found with this slug');
      return null;
    } catch (error) {
      console.error('Error in getArticleBySlug:', error, { slug });
      return null;
    }
  }
};
