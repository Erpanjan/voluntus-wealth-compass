
import { useState, useEffect, useMemo } from 'react';
import { getPublishedArticlesByLanguage } from '@/services/simpleArticleService';
import { useToast } from '@/hooks/use-toast';
import { Language } from '@/types/multilingual-article.types';

export const useSimplePublishedArticles = (pageSize: number = 4, language: Language = 'en') => {
  const [currentPage, setCurrentPage] = useState(0);
  const [articles, setArticles] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Reset page when language changes
  useEffect(() => {
    setCurrentPage(0);
  }, [language]);

  // Load articles function
  const loadArticles = async () => {
    console.log(`🔄 [useSimplePublishedArticles] Loading articles: page=${currentPage}, size=${pageSize}, lang=${language}`);
    setLoading(true);
    setError(null);
    
    try {
      const response = await getPublishedArticlesByLanguage(currentPage, pageSize, language);
      setArticles(response.articles);
      setTotalCount(response.totalCount);
      console.log(`✅ [useSimplePublishedArticles] Loaded ${response.articles.length} articles, total: ${response.totalCount}`);
    } catch (err) {
      const error = err as Error;
      console.error('❌ [useSimplePublishedArticles] Error loading articles:', error);
      setError(error);
      toast({
        title: 'Error loading articles',
        description: 'There was a problem loading the articles. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load articles when dependencies change
  useEffect(() => {
    loadArticles();
  }, [currentPage, pageSize, language]);

  // Memoized computed values
  const computedValues = useMemo(() => {
    return {
      totalPages: Math.ceil(totalCount / pageSize),
      hasMore: (currentPage + 1) * pageSize < totalCount
    };
  }, [totalCount, currentPage, pageSize]);

  const refresh = () => {
    console.log('🔄 [useSimplePublishedArticles] Refreshing articles...');
    setCurrentPage(0);
    loadArticles();
  };

  return {
    articles,
    loading,
    error,
    totalCount,
    totalPages: computedValues.totalPages,
    hasMore: computedValues.hasMore,
    currentPage,
    setCurrentPage,
    refresh,
    language,
  };
};
