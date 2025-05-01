
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
      
      console.log('Raw article data:', data);
      
      if (data && data.length > 0) {
        // Process the data to ensure correct typing
        const article: Article = {
          ...data[0],
          // Parse content if it's a string but should be JSON
          content: data[0].content,
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
        
        console.log('Processed article:', {
          title: article.title,
          contentType: typeof article.content,
          hasReports: article.reports && article.reports.length > 0
        });
        
        return article;
      }
      
      console.log('No article found with slug:', slug);
      return null;
    } catch (error) {
      console.error('Error in getArticleBySlug:', error);
      return null;
    }
  }
};
