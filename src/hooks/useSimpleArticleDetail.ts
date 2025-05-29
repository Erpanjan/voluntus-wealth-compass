
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
      console.warn('⚠️ [useSimpleArticleDetail] No slug provided');
      setLoading(false);
      return;
    }

    console.log(`🔄 [useSimpleArticleDetail] Loading article: ${slug}, lang: ${language}`);
    setLoading(true);
    setError(null);
    
    try {
      // Decode the slug in case it was URL encoded
      const decodedSlug = decodeURIComponent(slug);
      console.log(`🔄 [useSimpleArticleDetail] Decoded slug: ${decodedSlug}`);
      
      const result = await getArticleBySlugAndLanguage(decodedSlug, language);
      
      if (result) {
        setArticle(result);
        console.log(`✅ [useSimpleArticleDetail] Successfully loaded article: ${result.title}`);
      } else {
        console.log(`⚠️ [useSimpleArticleDetail] No article found for slug: ${decodedSlug}`);
        setArticle(null);
      }
    } catch (err) {
      const error = err as Error;
      console.error('❌ [useSimpleArticleDetail] Error loading article:', {
        slug: slug,
        decodedSlug: decodeURIComponent(slug),
        language: language,
        error: error.message,
        stack: error.stack
      });
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
