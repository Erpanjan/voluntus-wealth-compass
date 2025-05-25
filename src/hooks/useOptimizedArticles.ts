
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { articleService, Article } from '@/services/article';
import { useToast } from '@/hooks/use-toast';

interface ArticleCache {
  data: Article[];
  timestamp: number;
  page: number;
  totalCount: number;
}

const CACHE_KEY = 'articles_cache';
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export const useOptimizedArticles = (pageSize: number = 4) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  // Check cache first
  const getCachedData = useCallback((): ArticleCache | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsedCache: ArticleCache = JSON.parse(cached);
      const now = Date.now();
      
      if (now - parsedCache.timestamp > CACHE_TTL) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return parsedCache;
    } catch {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  const setCachedData = useCallback((data: ArticleCache) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, []);

  // Optimized query with caching
  const { data, isLoading, error, refetch } = useOptimizedQuery({
    queryKey: ['published-articles', currentPage, pageSize],
    queryFn: async () => {
      // Check cache first
      const cached = getCachedData();
      if (cached && cached.page === currentPage) {
        return cached;
      }

      const result = await articleService.getPublishedArticles(currentPage, pageSize);
      
      const cacheData: ArticleCache = {
        data: result.articles,
        timestamp: Date.now(),
        page: currentPage,
        totalCount: result.totalCount
      };

      setCachedData(cacheData);
      return cacheData;
    },
    priority: 'high',
    staleTime: CACHE_TTL,
    onError: (error) => {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error loading articles",
        description: "There was a problem loading the articles. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Memoized computed values
  const memoizedValues = useMemo(() => {
    if (!data) return {
      articles: [],
      totalCount: 0,
      totalPages: 0,
      hasMore: false
    };

    const totalPages = Math.ceil(data.totalCount / pageSize);
    const hasMore = (currentPage + 1) * pageSize < data.totalCount;

    return {
      articles: data.data,
      totalCount: data.totalCount,
      totalPages,
      hasMore
    };
  }, [data, currentPage, pageSize]);

  const loadMore = useCallback(() => {
    if (memoizedValues.hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [memoizedValues.hasMore, isLoading]);

  const refresh = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    setCurrentPage(0);
    refetch();
  }, [refetch]);

  return {
    ...memoizedValues,
    loading: isLoading,
    currentPage,
    loadMore,
    refresh,
    error
  };
};
