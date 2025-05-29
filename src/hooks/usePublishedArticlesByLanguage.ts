
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { articleService, Article } from '@/services/article';
import { useOptimizedQuery } from './useOptimizedQuery';

export const usePublishedArticlesByLanguage = (pageSize: number = 4, language: string = 'en') => {
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  // Reset page when language changes
  useEffect(() => {
    setCurrentPage(0);
  }, [language]);

  // Main query for current page
  const {
    data: currentPageData,
    isLoading,
    error,
    refetch
  } = useOptimizedQuery({
    queryKey: ['published-articles-by-language', currentPage, pageSize, language],
    queryFn: () => articleService.getPublishedArticlesByLanguage(currentPage, pageSize, language),
    priority: 'high',
    cacheStrategy: 'aggressive',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Prefetch next page for better UX
  const nextPage = currentPage + 1;
  const hasNextPage = currentPageData && (nextPage * pageSize < currentPageData.totalCount);
  
  useOptimizedQuery({
    queryKey: ['published-articles-by-language', nextPage, pageSize, language],
    queryFn: () => articleService.getPublishedArticlesByLanguage(nextPage, pageSize, language),
    enabled: hasNextPage,
    priority: 'low',
    cacheStrategy: 'aggressive',
  });

  // Error handling
  useEffect(() => {
    if (error) {
      console.error('Error fetching published articles by language:', error);
      toast({
        title: "Error loading articles",
        description: "There was a problem loading the articles. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Memoized computed values
  const computedValues = useMemo(() => {
    if (!currentPageData) {
      return {
        articles: [],
        totalCount: 0,
        totalPages: 0,
        hasMore: false
      };
    }

    return {
      articles: currentPageData.articles,
      totalCount: currentPageData.totalCount,
      totalPages: Math.ceil(currentPageData.totalCount / pageSize),
      hasMore: (currentPage + 1) * pageSize < currentPageData.totalCount
    };
  }, [currentPageData, currentPage, pageSize]);

  const loadMore = () => {
    if (computedValues.hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setCurrentPage(0);
    refetch();
  };

  return {
    ...computedValues,
    loading: isLoading,
    currentPage,
    setCurrentPage,
    loadMore,
    refresh,
    language,
  };
};
