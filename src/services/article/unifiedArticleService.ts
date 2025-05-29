import { supabase } from '@/integrations/supabase/client';
import { 
  MultilingualArticle, 
  Article, 
  Language, 
  MultilingualArticleInput,
  PaginatedArticlesResponse,
  PaginatedMultilingualArticlesResponse,
  Author,
  Report
} from '@/types/multilingual-article.types';
import { normalizeArticleContent, processContent } from '@/utils/articleContentUtils';

class UnifiedArticleService {
  /**
   * Safely convert database array field to typed array
   */
  private safeArrayConvert = <T>(field: any): T[] => {
    if (Array.isArray(field)) {
      return field;
    }
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  /**
   * Safely process content with enhanced handling for PostgreSQL data types
   */
  private safeProcessContent = (content: any): any => {
    console.log('🔍 [DEBUG] Processing content:', typeof content, content);
    
    // Handle null or undefined
    if (!content) {
      console.log('📝 [DEBUG] Content is null/undefined, returning empty object');
      return {};
    }
    
    // Handle PostgreSQL's map[] format for empty JSONB fields
    if (typeof content === 'string') {
      if (content === 'map[]' || content.trim() === '') {
        console.log('📝 [DEBUG] Content is map[] or empty string, returning empty object');
        return {};
      }
      
      try {
        const parsed = JSON.parse(content);
        console.log('📝 [DEBUG] Successfully parsed JSON string:', parsed);
        return this.processContentRecursively(parsed);
      } catch (error) {
        console.warn('⚠️ [DEBUG] Failed to parse JSON string, returning as-is:', content);
        return content;
      }
    }
    
    // Handle objects (including already parsed JSON)
    if (typeof content === 'object') {
      console.log('📝 [DEBUG] Content is object, processing recursively');
      return this.processContentRecursively(content);
    }
    
    // Handle other types
    console.log('📝 [DEBUG] Content is other type, returning as-is:', typeof content);
    return content;
  };

  /**
   * Recursively process content object to handle nested structures
   */
  private processContentRecursively = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return {};
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.processContentRecursively(item));
    }
    
    if (typeof obj === 'object') {
      const processed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && value === 'map[]') {
          processed[key] = {};
        } else if (typeof value === 'object') {
          processed[key] = this.processContentRecursively(value);
        } else {
          processed[key] = value;
        }
      }
      return processed;
    }
    
    return obj;
  };

  /**
   * Get published articles by language with pagination
   */
  async getPublishedArticlesByLanguage(
    page: number = 0, 
    pageSize: number = 4, 
    language: Language = 'en'
  ): Promise<PaginatedArticlesResponse> {
    console.log(`Fetching published articles: page=${page}, size=${pageSize}, lang=${language}`);
    
    const { data, error } = await supabase.rpc('get_articles_by_language', {
      lang: language,
      page_num: page,
      page_size: pageSize
    });

    if (error) {
      console.error('Error fetching published articles by language:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return { articles: [], totalCount: 0 };
    }

    const totalCount = data[0]?.total_count || 0;
    const articles = data.map((article: any): Article => ({
      id: article.id,
      title: article.title || '',
      slug: article.slug,
      description: article.description || '',
      content: this.safeProcessContent(article.content),
      category: article.category || '',
      author_name: article.author_name || '',
      image_url: article.image_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      authors: this.safeArrayConvert<Author>(article.authors),
      reports: this.safeArrayConvert<Report>(article.reports),
    }));

    return { articles, totalCount };
  }

  /**
   * Get article by slug and language
   */
  async getArticleBySlugAndLanguage(
    slug: string, 
    language: Language = 'en'
  ): Promise<Article | null> {
    console.log(`Fetching article by slug: ${slug}, language: ${language}`);
    
    const { data, error } = await supabase.rpc('get_article_by_slug_and_language', {
      slug_param: slug,
      lang: language
    });

    if (error) {
      console.error('Error fetching article by slug and language:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const article = data[0];
    return {
      id: article.id,
      title: article.title || '',
      slug: article.slug,
      description: article.description || '',
      content: this.safeProcessContent(article.content),
      category: article.category || '',
      author_name: article.author_name || '',
      image_url: article.image_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      authors: this.safeArrayConvert<Author>(article.authors),
      reports: this.safeArrayConvert<Report>(article.reports),
    };
  }

  /**
   * Get multilingual articles with pagination (admin) - ENHANCED WITH DEBUGGING
   */
  async getMultilingualArticles(
    page: number = 0, 
    pageSize: number = 50
  ): Promise<PaginatedMultilingualArticlesResponse> {
    console.log(`🔍 [DEBUG] Fetching multilingual articles: page=${page}, size=${pageSize}`);
    
    try {
      const { data, error } = await supabase.rpc('get_multilingual_articles_paginated', {
        page_num: page,
        page_size: pageSize
      });

      console.log(`🔍 [DEBUG] Raw response from database:`, { data, error });

      if (error) {
        console.error('❌ [ERROR] Database error fetching multilingual articles:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log(`⚠️ [WARNING] No data returned from database`);
        return { articles: [], totalCount: 0 };
      }

      console.log(`📊 [DEBUG] Database returned ${data.length} articles`);
      console.log(`📊 [DEBUG] First article sample:`, data[0]);

      const totalCount = data[0]?.total_count || 0;
      console.log(`📊 [DEBUG] Total count from database: ${totalCount}`);

      const articles = data.map((article: any, index: number): MultilingualArticle => {
        console.log(`🔄 [DEBUG] Processing article ${index + 1}:`, {
          id: article.id,
          title_en: article.title_en,
          title_zh: article.title_zh,
          hasContent_en: !!article.content_en,
          hasContent_zh: !!article.content_zh
        });

        const processedArticle: MultilingualArticle = {
          id: article.id,
          slug: article.slug,
          image_url: article.image_url,
          published_at: article.published_at,
          created_at: article.created_at,
          updated_at: article.updated_at,
          title_en: article.title_en || '',
          title_zh: article.title_zh || '',
          description_en: article.description_en || '',
          description_zh: article.description_zh || '',
          content_en: this.safeProcessContent(article.content_en),
          content_zh: this.safeProcessContent(article.content_zh),
          category_en: article.category_en || '',
          category_zh: article.category_zh || '',
          author_name_en: article.author_name_en || '',
          author_name_zh: article.author_name_zh || '',
          authors: [],
          reports: this.safeArrayConvert<Report>(article.reports),
        };

        console.log(`✅ [DEBUG] Processed article ${index + 1}:`, {
          id: processedArticle.id,
          title_en: processedArticle.title_en,
          title_zh: processedArticle.title_zh
        });

        return processedArticle;
      });

      console.log(`✅ [DEBUG] Successfully processed ${articles.length} articles`);
      console.log(`📤 [DEBUG] Returning response:`, { 
        articlesCount: articles.length, 
        totalCount 
      });

      return { articles, totalCount };

    } catch (error) {
      console.error('💥 [FATAL ERROR] Exception in getMultilingualArticles:', error);
      throw error;
    }
  }

  /**
   * Get multilingual article by ID (admin) - FIXED METHOD
   */
  async getMultilingualArticleById(id: string): Promise<MultilingualArticle | null> {
    console.log(`🔍 [DEBUG] Fetching multilingual article by ID: ${id}`);
    
    try {
      const { data, error } = await supabase.rpc('get_article_by_id_multilingual', {
        article_id: id
      });

      console.log(`🔍 [DEBUG] Raw response from get_article_by_id_multilingual:`, { data, error });

      if (error) {
        console.error('❌ [ERROR] Database error fetching multilingual article by ID:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log(`⚠️ [WARNING] No article found with ID: ${id}`);
        return null;
      }

      const article = data[0];
      console.log(`📊 [DEBUG] Processing article data:`, {
        id: article.id,
        title_en: article.title_en,
        title_zh: article.title_zh,
        hasContent_en: !!article.content_en,
        hasContent_zh: !!article.content_zh
      });

      const processedArticle: MultilingualArticle = {
        id: article.id,
        slug: article.slug,
        image_url: article.image_url,
        published_at: article.published_at,
        created_at: article.created_at,
        updated_at: article.updated_at,
        title_en: article.title_en || '',
        title_zh: article.title_zh || '',
        description_en: article.description_en || '',
        description_zh: article.description_zh || '',
        content_en: this.safeProcessContent(article.content_en),
        content_zh: this.safeProcessContent(article.content_zh),
        category_en: article.category_en || '',
        category_zh: article.category_zh || '',
        author_name_en: article.author_name_en || '',
        author_name_zh: article.author_name_zh || '',
        authors: [],
        reports: this.safeArrayConvert<Report>(article.reports),
      };

      console.log(`✅ [DEBUG] Successfully processed multilingual article:`, {
        id: processedArticle.id,
        title_en: processedArticle.title_en,
        title_zh: processedArticle.title_zh,
        content_en_keys: processedArticle.content_en ? Object.keys(processedArticle.content_en) : [],
        content_zh_keys: processedArticle.content_zh ? Object.keys(processedArticle.content_zh) : []
      });

      return processedArticle;

    } catch (error) {
      console.error('💥 [FATAL ERROR] Exception in getMultilingualArticleById:', error);
      throw error;
    }
  }

  /**
   * Save multilingual article - CLEANED UP FOR PURE MULTILINGUAL SCHEMA
   */
  async saveMultilingualArticle(
    articleData: MultilingualArticleInput,
    authors: any[] = [],
    imageFile: File | null = null,
    attachments: any[] = []
  ): Promise<string | null> {
    console.log('Saving multilingual article:', articleData);

    let imageUrl = articleData.image_url || '';

    // Handle image upload if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error('Failed to upload image');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;
    }

    // Generate slug from English title, fallback to Chinese (handled by trigger now)
    const titleForSlug = articleData.en.title || articleData.zh.title || 'untitled';
    const slug = titleForSlug.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Prepare article data for database - only multilingual fields
    const dbData = {
      id: articleData.id,
      // Multilingual fields
      title_en: articleData.en.title || '',
      title_zh: articleData.zh.title || '',
      description_en: articleData.en.description || '',
      description_zh: articleData.zh.description || '',
      content_en: articleData.en.content || {},
      content_zh: articleData.zh.content || {},
      category_en: articleData.en.category || '',
      category_zh: articleData.zh.category || '',
      author_name_en: articleData.en.author_name || '',
      author_name_zh: articleData.zh.author_name || '',
      // Common fields
      image_url: imageUrl,
      slug: slug, // Will be overridden by trigger if needed
      published_at: articleData.published_at,
    };

    console.log(`📝 [SAVE DEBUG] Prepared clean multilingual article data:`, dbData);

    // Insert or update article
    const { data, error } = await supabase
      .from('articles')
      .upsert(dbData, { onConflict: 'id' })
      .select('id')
      .single();

    if (error) {
      console.error('❌ [SAVE ERROR] Error saving multilingual article:', error);
      throw error;
    }

    console.log('✅ [SAVE SUCCESS] Multilingual article saved successfully:', data?.id);
    return data?.id || null;
  }

  /**
   * Delete article
   */
  async deleteArticle(id: string): Promise<void> {
    console.log(`Deleting article: ${id}`);
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      throw error;
    }

    console.log('Article deleted successfully');
  }

  /**
   * Toggle publish status
   */
  async togglePublishStatus(id: string, isPublished: boolean): Promise<void> {
    console.log(`Toggling publish status for article ${id}: ${isPublished}`);
    
    const published_at = isPublished 
      ? new Date().toISOString()
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days in future

    const { error } = await supabase
      .from('articles')
      .update({ published_at })
      .eq('id', id);

    if (error) {
      console.error('Error toggling publish status:', error);
      throw error;
    }

    console.log('Publish status toggled successfully');
  }
}

export const unifiedArticleService = new UnifiedArticleService();
