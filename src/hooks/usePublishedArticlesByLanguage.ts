
import { useState, useEffect, useMemo } from 'react';
import { articleService } from '@/services/article';
import { useBaseArticleOperations } from './useBaseArticleOperations';
import { Language } from '@/types/multilingual-article.types';

export const usePublishedArticlesByLanguage = (pageSize: number = 4, language: Language = 'en') => {
  const [currentPage, setCurrentPage] = useState(0);
  const { createQuery, showErrorToast } = useBaseArticleOperations({
    priority: 'high',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
  } = createQuery(
    ['published-articles-by-language', currentPage, pageSize, language],
    () => articleService.getPublishedArticlesByLanguage(currentPage, pageSize, language)
  );

  // Prefetch next page for better UX
  const nextPage = currentPage + 1;
  const hasNextPage = currentPageData && (nextPage * pageSize < currentPageData.totalCount);
  
  createQuery(
    ['published-articles-by-language', nextPage, pageSize, language],
    () => articleService.getPublishedArticlesByLanguage(nextPage, pageSize, language),
    { enabled: hasNextPage, priority: 'low' }
  );

  // Error handling
  useEffect(() => {
    if (error) {
      console.error('Error fetching published articles by language:', error);
      showErrorToast(
        "Error loading articles",
        "There was a problem loading the articles. Please try again."
      );
    }
  }, [error, showErrorToast]);

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
