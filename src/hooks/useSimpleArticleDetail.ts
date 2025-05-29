
import { useState, useEffect } from 'react';
import { getArticleBySlugAndLanguage } from '@/services/simpleArticleService';
import { useToast } from '@/hooks/use-toast';
import { Language, Article } from '@/types/multilingual-article.types';

export const useSimpleArticleDetail = (slug: string, language: Language = 'en') => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadArticle = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    console.log(`🔄 [useSimpleArticleDetail] Loading article: ${slug}, lang: ${language}`);
    setLoading(true);
    setError(null);
    
    try {
      const decodedSlug = decodeURIComponent(slug);
      const result = await getArticleBySlugAndLanguage(decodedSlug, language);
      setArticle(result);
      console.log(`✅ [useSimpleArticleDetail] Loaded article: ${result?.title || 'Not found'}`);
    } catch (err) {
      const error = err as Error;
      console.error('❌ [useSimpleArticleDetail] Error loading article:', error);
      setError(error);
      toast({
        title: 'Error loading article',
        description: 'There was a problem loading the article details. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticle();
  }, [slug, language]);

  const refetch = () => {
    console.log('🔄 [useSimpleArticleDetail] Refetching article...');
    loadArticle();
  };

  return {
    article,
    loading,
    error,
    refetch,
    language
  };
};
