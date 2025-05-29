
import { supabase } from '@/integrations/supabase/client';
import { MultilingualArticle } from '@/types/multilingual-article.types';

export interface ArticlesResponse {
  articles: MultilingualArticle[];
  totalCount: number;
}

class ArticlesService {
  /**
   * Get all multilingual articles with pagination
   */
  async getMultilingualArticles(page: number = 0, pageSize: number = 50): Promise<ArticlesResponse> {
    console.log(`🔍 [ArticlesService] Fetching articles: page=${page}, pageSize=${pageSize}`);
    
    try {
      const { data, error } = await supabase.rpc('get_multilingual_articles_paginated', {
        page_num: page,
        page_size: pageSize
      });

      if (error) {
        console.error('❌ [ArticlesService] Database error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ [ArticlesService] No articles found');
        return { articles: [], totalCount: 0 };
      }

      const totalCount = data[0]?.total_count || 0;
      const articles = data.map((item: any): MultilingualArticle => ({
        id: item.id,
        slug: item.slug,
        image_url: item.image_url,
        published_at: item.published_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        title_en: item.title_en || '',
        title_zh: item.title_zh || '',
        description_en: item.description_en || '',
        description_zh: item.description_zh || '',
        content_en: this.processContent(item.content_en),
        content_zh: this.processContent(item.content_zh),
        category_en: item.category_en || '',
        category_zh: item.category_zh || '',
        author_name_en: item.author_name_en || '',
        author_name_zh: item.author_name_zh || '',
        authors: [],
        reports: []
      }));

      console.log(`✅ [ArticlesService] Successfully fetched ${articles.length} articles`);
      return { articles, totalCount };

    } catch (error) {
      console.error('💥 [ArticlesService] Error fetching articles:', error);
      throw error;
    }
  }

  /**
   * Delete an article
   */
  async deleteArticle(id: string): Promise<void> {
    console.log(`🗑️ [ArticlesService] Deleting article: ${id}`);
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ [ArticlesService] Error deleting article:', error);
      throw error;
    }

    console.log('✅ [ArticlesService] Article deleted successfully');
  }

  /**
   * Toggle publish status
   */
  async togglePublishStatus(id: string, isPublished: boolean): Promise<void> {
    console.log(`🔄 [ArticlesService] Toggling publish status for ${id}: ${!isPublished}`);
    
    const published_at = !isPublished 
      ? new Date().toISOString()
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days in future

    const { error } = await supabase
      .from('articles')
      .update({ published_at })
      .eq('id', id);

    if (error) {
      console.error('❌ [ArticlesService] Error toggling publish status:', error);
      throw error;
    }

    console.log('✅ [ArticlesService] Publish status toggled successfully');
  }

  /**
   * Process content safely
   */
  private processContent(content: any): any {
    if (!content) return {};
    if (typeof content === 'string' && content === 'map[]') return {};
    if (typeof content === 'object') return content;
    return {};
  }
}

export const articlesService = new ArticlesService();
