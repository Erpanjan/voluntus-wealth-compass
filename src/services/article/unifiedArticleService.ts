
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
      title: article.title,
      slug: article.slug,
      description: article.description,
      content: processContent(article.content),
      category: article.category,
      author_name: article.author_name,
      image_url: article.image_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      authors: article.authors || [],
      reports: article.reports || [],
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
      title: article.title,
      slug: article.slug,
      description: article.description,
      content: processContent(article.content),
      category: article.category,
      author_name: article.author_name,
      image_url: article.image_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      authors: article.authors || [],
      reports: article.reports || [],
    };
  }

  /**
   * Get multilingual articles with pagination (admin)
   */
  async getMultilingualArticles(
    page: number = 0, 
    pageSize: number = 50
  ): Promise<PaginatedMultilingualArticlesResponse> {
    console.log(`Fetching multilingual articles: page=${page}, size=${pageSize}`);
    
    const { data, error } = await supabase.rpc('get_multilingual_articles_paginated', {
      page_num: page,
      page_size: pageSize
    });

    if (error) {
      console.error('Error fetching multilingual articles:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return { articles: [], totalCount: 0 };
    }

    const totalCount = data[0]?.total_count || 0;
    const articles = data.map((article: any): MultilingualArticle => ({
      id: article.id,
      slug: article.slug,
      image_url: article.image_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      title_en: article.title_en,
      title_zh: article.title_zh,
      description_en: article.description_en,
      description_zh: article.description_zh,
      content_en: processContent(article.content_en),
      content_zh: processContent(article.content_zh),
      category_en: article.category_en,
      category_zh: article.category_zh,
      author_name_en: article.author_name_en,
      author_name_zh: article.author_name_zh,
      authors: [],
      reports: article.reports || [],
    }));

    return { articles, totalCount };
  }

  /**
   * Get multilingual article by ID (admin)
   */
  async getMultilingualArticleById(id: string): Promise<MultilingualArticle | null> {
    console.log(`Fetching multilingual article by ID: ${id}`);
    
    const { data, error } = await supabase.rpc('get_article_by_id_multilingual', {
      article_id: id
    });

    if (error) {
      console.error('Error fetching multilingual article by ID:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const article = data[0];
    return {
      id: article.id,
      slug: article.slug,
      image_url: article.image_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      title_en: article.title_en,
      title_zh: article.title_zh,
      description_en: article.description_en,
      description_zh: article.description_zh,
      content_en: processContent(article.content_en),
      content_zh: processContent(article.content_zh),
      category_en: article.category_en,
      category_zh: article.category_zh,
      author_name_en: article.author_name_en,
      author_name_zh: article.author_name_zh,
      authors: [],
      reports: article.reports || [],
    };
  }

  /**
   * Save multilingual article
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

    // Generate slug from English title, fallback to Chinese
    const titleForSlug = articleData.en.title || articleData.zh.title || 'untitled';
    const slug = titleForSlug.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Prepare article data for database
    const dbData = {
      id: articleData.id,
      title: articleData.en.title || articleData.zh.title || '',
      title_en: articleData.en.title || '',
      title_zh: articleData.zh.title || '',
      description: articleData.en.description || articleData.zh.description || '',
      description_en: articleData.en.description || '',
      description_zh: articleData.zh.description || '',
      content: articleData.en.content || articleData.zh.content || {},
      content_en: articleData.en.content || {},
      content_zh: articleData.zh.content || {},
      category: articleData.en.category || articleData.zh.category || '',
      category_en: articleData.en.category || '',
      category_zh: articleData.zh.category || '',
      author_name: articleData.en.author_name || articleData.zh.author_name || '',
      author_name_en: articleData.en.author_name || '',
      author_name_zh: articleData.zh.author_name || '',
      image_url: imageUrl,
      slug: slug,
      published_at: articleData.published_at,
    };

    // Insert or update article
    const { data, error } = await supabase
      .from('articles')
      .upsert(dbData, { onConflict: 'id' })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving multilingual article:', error);
      throw error;
    }

    console.log('Multilingual article saved successfully:', data?.id);
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
