
import { supabase } from '@/integrations/supabase/client';
import { Article, Language, PaginatedArticlesResponse } from '@/types/multilingual-article.types';

/**
 * Simple article service that directly calls Supabase functions
 * No class methods to avoid binding issues
 */
export const getPublishedArticlesByLanguage = async (
  page: number = 0, 
  pageSize: number = 4, 
  language: Language = 'en'
): Promise<PaginatedArticlesResponse> => {
  console.log(`🔍 [SimpleArticleService] Fetching articles: page=${page}, pageSize=${pageSize}, lang=${language}`);
  
  try {
    const { data, error } = await supabase.rpc('get_articles_by_language', {
      lang: language,
      page_num: page,
      page_size: pageSize
    });

    if (error) {
      console.error('❌ [SimpleArticleService] Database error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('⚠️ [SimpleArticleService] No articles found');
      return { articles: [], totalCount: 0 };
    }

    const totalCount = data[0]?.total_count || 0;
    const articles = data.map((article: any): Article => ({
      id: article.id,
      title: article.title || '',
      slug: article.slug,
      description: article.description || '',
      content: article.content || {},
      category: article.category || '',
      author_name: article.author_name || '',
      image_url: article.image_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      authors: [],
      reports: [],
    }));

    console.log(`✅ [SimpleArticleService] Successfully fetched ${articles.length} articles, total: ${totalCount}`);
    return { articles, totalCount };

  } catch (error) {
    console.error('💥 [SimpleArticleService] Error fetching articles:', error);
    throw error;
  }
};

export const getArticleBySlugAndLanguage = async (
  slug: string, 
  language: Language = 'en'
): Promise<Article | null> => {
  console.log(`🔍 [SimpleArticleService] Fetching article by slug: ${slug}, language: ${language}`);
  
  try {
    const { data, error } = await supabase.rpc('get_article_by_slug_and_language', {
      slug_param: slug,
      lang: language
    });

    if (error) {
      console.error('❌ [SimpleArticleService] Database error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('⚠️ [SimpleArticleService] Article not found');
      return null;
    }

    const article = data[0];
    
    // Safely handle reports data - ensure it's an array or default to empty array
    let reports = [];
    if (article.reports && Array.isArray(article.reports)) {
      reports = article.reports;
    } else if (article.reports && typeof article.reports === 'object') {
      // If it's a JSON object but not an array, try to extract array data
      reports = [];
    }

    const result: Article = {
      id: article.id,
      title: article.title || '',
      slug: article.slug,
      description: article.description || '',
      content: article.content || {},
      category: article.category || '',
      author_name: article.author_name || '',
      image_url: article.image_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      authors: [],
      reports: reports,
    };

    console.log(`✅ [SimpleArticleService] Successfully fetched article: ${result.title}`);
    return result;

  } catch (error) {
    console.error('💥 [SimpleArticleService] Error fetching article:', error);
    throw error;
  }
};
