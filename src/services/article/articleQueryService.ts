
import { supabase } from '@/integrations/supabase/client';
import { Article, Author, Report } from './types';

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
 * Safely converts Json data to Author array
 */
const normalizeAuthors = (authorsData: any): Author[] => {
  try {
    if (!authorsData) return [];
    
    if (Array.isArray(authorsData)) {
      return authorsData.map((author: any) => ({
        id: author.id || '1',
        name: author.name || '',
        image_url: author.image_url || undefined,
        bio: author.bio || undefined
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error normalizing authors:', error);
    return [];
  }
};

/**
 * Safely converts Json data to Report array
 */
const normalizeReports = (reportsData: any): Report[] => {
  try {
    if (!reportsData) return [];
    
    if (Array.isArray(reportsData)) {
      return reportsData.map((report: any) => ({
        id: report.id || '',
        title: report.title || '',
        description: report.description || undefined,
        file_url: report.file_url || '',
        created_at: report.created_at || ''
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error normalizing reports:', error);
    return [];
  }
};

/**
 * Handles all query operations for articles
 */
export const articleQueryService = {
  /**
   * Get a single article by ID (optimized for edit mode)
   * @param id The article ID to fetch
   * @returns Single article with author information
   */
  async getArticleById(id: string): Promise<Article | null> {
    try {
      console.log(`Fetching article with ID: ${id}`);
      const { data, error } = await supabase.rpc('get_article_by_id', {
        article_id: id
      });
      
      if (error) {
        console.error('Error fetching article by ID:', error);
        throw error;
      }
      
      console.log('Raw article data by ID:', data);
      
      if (data && data.length > 0) {
        const rawArticle = data[0];
        const article: Article = {
          id: rawArticle.id,
          title: rawArticle.title,
          slug: rawArticle.slug,
          description: rawArticle.description || '',
          content: normalizeContent(rawArticle.content),
          category: rawArticle.category || '',
          author_name: rawArticle.author_name || '',
          image_url: rawArticle.image_url || '',
          published_at: rawArticle.published_at,
          created_at: rawArticle.created_at,
          updated_at: rawArticle.updated_at,
          authors: normalizeAuthors(rawArticle.authors),
          reports: normalizeReports(rawArticle.reports)
        };
        
        console.log('Processed article by ID:', article);
        return article;
      }
      
      console.log('No article found with this ID');
      return null;
    } catch (error) {
      console.error('Error in getArticleById:', error, { id });
      return null;
    }
  },

  /**
   * Get all articles with their authors (with pagination support)
   * @param page Page number (0-based)
   * @param pageSize Number of articles per page
   * @returns List of articles with pagination info
   */
  async getArticles(page: number = 0, pageSize: number = 50): Promise<Article[]> {
    try {
      console.log(`Fetching articles page ${page} with size ${pageSize}`);
      const { data, error } = await supabase.rpc('get_articles_with_authors_paginated', {
        page_num: page,
        page_size: pageSize
      });
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      console.log('Raw articles data:', data);
      
      // Process the data to ensure correct typing
      const processedData: Article[] = data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.description || '',
        content: normalizeContent(item.content),
        category: item.category || '',
        author_name: item.author_name || '',
        image_url: item.image_url || '',
        published_at: item.published_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        authors: normalizeAuthors(item.authors),
        reports: [] // Reports not included in this query
      })) || [];
      
      console.log('Processed articles data:', processedData);
      return processedData;
    } catch (error) {
      console.error('Error in getArticles:', error);
      return [];
    }
  },

  /**
   * Get published articles for public consumption (with pagination)
   * @param page Page number (0-based)
   * @param pageSize Number of articles per page
   * @returns List of published articles with pagination info
   */
  async getPublishedArticles(page: number = 0, pageSize: number = 4): Promise<{ articles: Article[], totalCount: number }> {
    try {
      console.log(`Fetching published articles page ${page} with size ${pageSize}`);
      const { data, error } = await supabase.rpc('get_published_articles_paginated', {
        page_num: page,
        page_size: pageSize
      });
      
      if (error) {
        console.error('Error fetching published articles:', error);
        throw error;
      }
      
      console.log('Raw published articles data:', data);
      
      if (!data || data.length === 0) {
        return { articles: [], totalCount: 0 };
      }
      
      // Process the data to ensure correct typing
      const processedData: Article[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.description || '',
        content: normalizeContent(item.content),
        category: item.category || '',
        author_name: item.author_name || '',
        image_url: item.image_url || '',
        published_at: item.published_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        authors: normalizeAuthors(item.authors),
        reports: [] // Reports not included in this query
      }));
      
      // Get total count from first item (all items have same total_count)
      const totalCount = data[0]?.total_count || 0;
      
      console.log('Processed published articles data:', processedData);
      console.log('Total published articles count:', totalCount);
      
      return { articles: processedData, totalCount };
    } catch (error) {
      console.error('Error in getPublishedArticles:', error);
      return { articles: [], totalCount: 0 };
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
        const rawArticle = data[0];
        // Process the data to ensure correct typing
        const article: Article = {
          id: rawArticle.id,
          title: rawArticle.title,
          slug: rawArticle.slug,
          description: rawArticle.description || '',
          content: normalizeContent(rawArticle.content),
          category: rawArticle.category || '',
          author_name: rawArticle.author_name || '',
          image_url: rawArticle.image_url || '',
          published_at: rawArticle.published_at,
          created_at: rawArticle.created_at,
          updated_at: rawArticle.updated_at,
          authors: normalizeAuthors(rawArticle.authors),
          reports: normalizeReports(rawArticle.reports)
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
