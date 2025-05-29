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
   * Safely process content - SIMPLIFIED to handle HTML strings directly
   */
  private safeProcessContent = (content: any): string => {
    console.log('🔍 [DEBUG] Processing content:', typeof content, content);
    
    // Handle null or undefined
    if (!content) {
      console.log('📝 [DEBUG] Content is null/undefined, returning empty string');
      return '';
    }
    
    // If it's already a string (HTML content), return it directly
    if (typeof content === 'string') {
      // Handle PostgreSQL's map[] format for empty JSONB fields
      if (content === 'map[]' || content.trim() === '') {
        console.log('📝 [DEBUG] Content is map[] or empty string, returning empty string');
        return '';
      }
      
      // If it looks like HTML or plain text, return as-is
      if (content.includes('<') || !content.startsWith('{')) {
        console.log('📝 [DEBUG] Content is HTML string, returning as-is:', content.substring(0, 100) + '...');
        return content;
      }
      
      // Try to parse as JSON if it looks like JSON
      try {
        const parsed = JSON.parse(content);
        console.log('📝 [DEBUG] Successfully parsed JSON string:', parsed);
        return this.extractContentFromObject(parsed);
      } catch (error) {
        console.warn('⚠️ [DEBUG] Failed to parse JSON string, returning as-is:', content.substring(0, 100) + '...');
        return content;
      }
    }
    
    // Handle objects (including already parsed JSON)
    if (typeof content === 'object') {
      console.log('📝 [DEBUG] Content is object, extracting content');
      return this.extractContentFromObject(content);
    }
    
    // Handle other types - convert to string
    console.log('📝 [DEBUG] Content is other type, converting to string:', typeof content);
    return String(content);
  };

  /**
   * Extract HTML content from object structures (like TipTap editor output)
   */
  private extractContentFromObject = (obj: any): string => {
    if (obj === null || obj === undefined) {
      return '';
    }
    
    // If it's a TipTap editor structure with content array
    if (obj.type && obj.content && Array.isArray(obj.content)) {
      // This would need proper TipTap to HTML conversion
      // For now, return a simple representation
      return this.convertTipTapToHTML(obj);
    }
    
    // If it's an object with HTML property
    if (obj.html && typeof obj.html === 'string') {
      return obj.html;
    }
    
    // If it's an object with content property
    if (obj.content && typeof obj.content === 'string') {
      return obj.content;
    }
    
    // If it's an object with value property
    if (obj.value && typeof obj.value === 'string') {
      return obj.value;
    }
    
    // Fallback: stringify the object
    return JSON.stringify(obj);
  };

  /**
   * Simple TipTap to HTML conversion (basic implementation)
   */
  private convertTipTapToHTML = (tipTapContent: any): string => {
    if (!tipTapContent.content || !Array.isArray(tipTapContent.content)) {
      return '';
    }
    
    // Very basic conversion - in a real app, you'd use TipTap's generateHTML
    let html = '';
    for (const node of tipTapContent.content) {
      if (node.type === 'paragraph') {
        html += '<p>';
        if (node.content && Array.isArray(node.content)) {
          for (const textNode of node.content) {
            if (textNode.type === 'text') {
              html += textNode.text || '';
            }
          }
        }
        html += '</p>';
      }
    }
    return html;
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
   * Get multilingual article by ID (admin) - SIMPLIFIED CONTENT PROCESSING
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
      console.log(`📊 [DEBUG] Raw article from database:`, {
        id: article.id,
        title_en: article.title_en,
        title_zh: article.title_zh,
        content_en_type: typeof article.content_en,
        content_zh_type: typeof article.content_zh,
        content_en_preview: article.content_en ? String(article.content_en).substring(0, 100) : 'null',
        content_zh_preview: article.content_zh ? String(article.content_zh).substring(0, 100) : 'null'
      });

      const content_en = this.safeProcessContent(article.content_en);
      const content_zh = this.safeProcessContent(article.content_zh);

      console.log(`📝 [DEBUG] Processed content:`, {
        content_en_length: content_en.length,
        content_zh_length: content_zh.length,
        content_en_preview: content_en.substring(0, 100) + '...',
        content_zh_preview: content_zh.substring(0, 100) + '...'
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
        content_en: content_en,
        content_zh: content_zh,
        category_en: article.category_en || '',
        category_zh: article.category_zh || '',
        author_name_en: article.author_name_en || '',
        author_name_zh: article.author_name_zh || '',
        authors: [],
        reports: this.safeArrayConvert<Report>(article.reports),
      };

      console.log(`✅ [DEBUG] Final processed article:`, {
        id: processedArticle.id,
        title_en: processedArticle.title_en,
        title_zh: processedArticle.title_zh,
        content_en_length: processedArticle.content_en.length,
        content_zh_length: processedArticle.content_zh.length
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
      
      // Try article-images bucket first, then article-assets as fallback
      let uploadData, uploadError;
      
      try {
        const { data, error } = await supabase.storage
          .from('article-images')
          .upload(fileName, imageFile);
        uploadData = data;
        uploadError = error;
      } catch (error) {
        console.log('article-images bucket not found, trying article-assets...');
        const { data, error: fallbackError } = await supabase.storage
          .from('article-assets')
          .upload(fileName, imageFile);
        uploadData = data;
        uploadError = fallbackError;
      }

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get public URL using the same bucket that worked
      let publicUrl;
      try {
        const { data: { publicUrl: url1 } } = supabase.storage
          .from('article-images')
          .getPublicUrl(fileName);
        publicUrl = url1;
      } catch {
        const { data: { publicUrl: url2 } } = supabase.storage
          .from('article-assets')
          .getPublicUrl(fileName);
        publicUrl = url2;
      }
      
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
      updated_at: new Date().toISOString(),
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
