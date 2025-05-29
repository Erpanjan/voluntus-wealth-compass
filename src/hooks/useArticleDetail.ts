
import { useState, useEffect } from 'react';
import { articleService } from '@/services/articleService';
import { Article, Language } from '@/types/article.types';

interface UseArticleDetailResult {
  article: Article | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useArticleDetail = (slug: string, language: Language = 'en'): UseArticleDetailResult => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await articleService.getArticleBySlugAndLanguage(slug, language);
      setArticle(result);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [slug, language]);

  return {
    article,
    loading,
    error,
    refetch: fetchArticle
  };
};
