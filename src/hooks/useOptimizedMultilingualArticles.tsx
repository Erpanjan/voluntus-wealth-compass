
import { useState, useEffect, useMemo, useCallback } from 'react';
import { articleService } from '@/services/article';
import { useBaseArticleOperations } from './useBaseArticleOperations';
import { MultilingualArticle } from '@/types/multilingual-article.types';

interface UseOptimizedMultilingualArticlesResult {
  articles: MultilingualArticle[];
  loading: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  refresh: () => void;
  deleteArticle: (id: string) => Promise<void>;
  togglePublishStatus: (id: string, isPublished: boolean) => Promise<void>;
}

export const useOptimizedMultilingualArticles = (
  pageSize: number = 50
): UseOptimizedMultilingualArticlesResult => {
  const [currentPage, setCurrentPage] = useState(0);
  const { createQuery, showErrorToast, showSuccessToast } = useBaseArticleOperations({
    priority: 'medium',
    staleTime: 2 * 60 * 1000, // 2 minutes for admin data
  });

  // Main query for current page
  const {
    data: currentPageData,
    isLoading,
    error,
    refetch
  } = createQuery(
    ['multilingual-articles', currentPage, pageSize],
    () => articleService.getMultilingualArticles(currentPage, pageSize)
  );

  // Error handling
  useEffect(() => {
    if (error) {
      console.error('Error fetching multilingual articles:', error);
      showErrorToast(
        "Error loading articles",
        "Failed to load articles. Please try again."
      );
    }
  }, [error, showErrorToast]);

  // Memoized computed values
  const computedValues = useMemo(() => {
    if (!currentPageData) {
      return {
        articles: [],
        totalCount: 0,
        totalPages: 0
      };
    }

    return {
      articles: currentPageData.articles,
      totalCount: currentPageData.totalCount,
      totalPages: Math.ceil(currentPageData.totalCount / pageSize)
    };
  }, [currentPageData, pageSize]);

  // Delete article function
  const deleteArticle = useCallback(async (id: string) => {
    try {
      await articleService.deleteArticle(id);
      showSuccessToast("Article deleted", "The article has been deleted successfully.");
      refetch();
    } catch (error) {
      console.error('Error deleting article:', error);
      showErrorToast("Error", "Failed to delete article. Please try again.");
    }
  }, [refetch, showSuccessToast, showErrorToast]);

  // Toggle publish status function
  const togglePublishStatus = useCallback(async (id: string, isPublished: boolean) => {
    try {
      await articleService.togglePublishStatus(id, !isPublished);
      showSuccessToast(
        isPublished ? "Article unpublished" : "Article published",
        `The article has been ${isPublished ? 'unpublished' : 'published'} successfully.`
      );
      refetch();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      showErrorToast("Error", "Failed to update article status. Please try again.");
    }
  }, [refetch, showSuccessToast, showErrorToast]);

  const refresh = useCallback(() => {
    setCurrentPage(0);
    refetch();
  }, [refetch]);

  return {
    ...computedValues,
    loading: isLoading,
    currentPage,
    setCurrentPage,
    refresh,
    deleteArticle,
    togglePublishStatus,
  };
};
