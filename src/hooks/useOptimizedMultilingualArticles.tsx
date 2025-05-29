
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
    priority: 'normal',
    staleTime: 2 * 60 * 1000, // 2 minutes for admin data
  });

  // Main query for current page with enhanced debugging
  const {
    data: currentPageData,
    isLoading,
    error,
    refetch
  } = createQuery(
    ['multilingual-articles', currentPage, pageSize],
    async () => {
      console.log(`🔄 [HOOK] Starting fetch for page ${currentPage}, pageSize ${pageSize}`);
      const result = await articleService.getMultilingualArticles(currentPage, pageSize);
      console.log(`✅ [HOOK] Fetch completed. Articles: ${result.articles.length}, Total: ${result.totalCount}`);
      return result;
    }
  );

  // Enhanced error handling with debugging
  useEffect(() => {
    if (error) {
      console.error('❌ [HOOK ERROR] Error fetching multilingual articles:', error);
      showErrorToast(
        "Error loading articles",
        "Failed to load articles. Please try again."
      );
    }
  }, [error, showErrorToast]);

  // Debug current page data
  useEffect(() => {
    console.log(`🔍 [HOOK DEBUG] Current page data changed:`, {
      hasData: !!currentPageData,
      articlesCount: currentPageData?.articles?.length || 0,
      totalCount: currentPageData?.totalCount || 0,
      isLoading
    });
  }, [currentPageData, isLoading]);

  // Memoized computed values with debugging
  const computedValues = useMemo(() => {
    console.log(`🧮 [HOOK COMPUTE] Computing values...`);
    
    if (!currentPageData) {
      console.log(`⚠️ [HOOK COMPUTE] No currentPageData, returning defaults`);
      return {
        articles: [],
        totalCount: 0,
        totalPages: 0
      };
    }

    const result = {
      articles: currentPageData.articles,
      totalCount: currentPageData.totalCount,
      totalPages: Math.ceil(currentPageData.totalCount / pageSize)
    };

    console.log(`✅ [HOOK COMPUTE] Computed values:`, result);
    return result;
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
    console.log(`🔄 [HOOK] Refresh called - resetting to page 0 and refetching`);
    setCurrentPage(0);
    refetch();
  }, [refetch]);

  const finalResult = {
    ...computedValues,
    loading: isLoading,
    currentPage,
    setCurrentPage,
    refresh,
    deleteArticle,
    togglePublishStatus,
  };

  console.log(`📤 [HOOK FINAL] Returning hook result:`, {
    articlesCount: finalResult.articles.length,
    loading: finalResult.loading,
    totalCount: finalResult.totalCount
  });

  return finalResult;
};
