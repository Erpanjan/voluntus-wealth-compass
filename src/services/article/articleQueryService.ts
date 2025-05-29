
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
   * Get a single article by ID for editing (returns all language data)
   * @param id The article ID to fetch
   * @returns Single article with all multilingual data
   */
  async getMultilingualArticleById(id: string): Promise<any | null> {
    try {
      console.log(`Fetching multilingual article with ID: ${id}`);
      const { data, error } = await supabase.rpc('get_article_by_id_multilingual', {
        article_id: id
      });
      
      if (error) {
        console.error('Error fetching multilingual article by ID:', error);
        throw error;
      }
      
      console.log('Raw multilingual article data by ID:', data);
      
      if (data && data.length > 0) {
        const rawArticle = data[0] as any;
        const article = {
          id: rawArticle.id,
          en: {
            title: rawArticle.title_en || '',
            description: rawArticle.description_en || '',
            content: normalizeContent(rawArticle.content_en),
            category: rawArticle.category_en || '',
            author_name: rawArticle.author_name_en || '',
          },
          zh: {
            title: rawArticle.title_zh || '',
            description: rawArticle.description_zh || '',
            content: normalizeContent(rawArticle.content_zh),
            category: rawArticle.category_zh || '',
            author_name: rawArticle.author_name_zh || '',
          },
          slug: rawArticle.slug,
          image_url: rawArticle.image_url || '',
          published_at: rawArticle.published_at,
          created_at: rawArticle.created_at,
          updated_at: rawArticle.updated_at,
          reports: normalizeReports(rawArticle.reports)
        };
        
        console.log('Processed multilingual article by ID:', article);
        return article;
      }
      
      console.log('No multilingual article found with this ID');
      return null;
    } catch (error) {
      console.error('Error in getMultilingualArticleById:', error, { id });
      return null;
    }
  },

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
        const rawArticle = data[0] as any; // Cast to any to access all properties
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
   * Get published articles by language for public consumption (with pagination)
   * @param page Page number (0-based)
   * @param pageSize Number of articles per page
   * @param language Language code ('en' or 'zh')
   * @returns List of published articles with pagination info
   */
  async getPublishedArticlesByLanguage(page: number = 0, pageSize: number = 4, language: string = 'en'): Promise<{ articles: Article[], totalCount: number }> {
    try {
      console.log(`Fetching published articles page ${page} with size ${pageSize} for language ${language}`);
      const { data, error } = await supabase.rpc('get_articles_by_language', {
        lang: language,
        page_num: page,
        page_size: pageSize
      });
      
      if (error) {
        console.error('Error fetching published articles by language:', error);
        throw error;
      }
      
      console.log('Raw published articles data by language:', data);
      
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
        authors: [],
        reports: []
      }));
      
      // Get total count from first item (all items have same total_count)
      const totalCount = data[0]?.total_count || 0;
      
      console.log('Processed published articles data by language:', processedData);
      console.log('Total published articles count for language:', totalCount);
      
      return { articles: processedData, totalCount };
    } catch (error) {
      console.error('Error in getPublishedArticlesByLanguage:', error);
      return { articles: [], totalCount: 0 };
    }
  },

  /**
   * Get published articles for public consumption (with pagination) - legacy method
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
   * Get a single article by slug and language
   * @param slug The article slug to fetch
   * @param language Language code ('en' or 'zh')
   * @returns The article with that slug or null if not found
   */
  async getArticleBySlugAndLanguage(slug: string, language: string = 'en'): Promise<Article | null> {
    try {
      console.log(`Fetching article with slug: ${slug} for language: ${language}`);
      const { data, error } = await supabase.rpc('get_article_by_slug_and_language', {
        slug_param: slug,
        lang: language
      });
      
      if (error) {
        console.error('Error fetching article by slug and language:', error);
        throw error;
      }
      
      console.log('Raw article data by slug and language:', data);
      
      if (data && data.length > 0) {
        const rawArticle = data[0] as any;
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
        console.log('Processed article data by slug and language:', article);
        return article;
      }
      
      console.log('No article found with this slug and language');
      return null;
    } catch (error) {
      console.error('Error in getArticleBySlugAndLanguage:', error, { slug, language });
      return null;
    }
  },

  /**
   * Get a single article by slug (legacy method)
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
        const rawArticle = data[0] as any; // Cast to any to access all properties
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
