
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/articleService';
import { useOptimizedQuery } from './useOptimizedQuery';
import { 
  MultilingualArticle, 
  Article, 
  Language,
  PaginatedArticlesResponse,
  PaginatedMultilingualArticlesResponse
} from '@/types/article.types';

interface UseUnifiedArticlesConfig {
  mode: 'public' | 'admin';
  language?: Language;
  pageSize?: number;
  initialPage?: number;
}

interface UseUnifiedArticlesResult {
  articles: Article[] | MultilingualArticle[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  refresh: () => void;
  deleteArticle: (id: string) => Promise<boolean>;
  togglePublishStatus: (id: string, isPublished: boolean) => Promise<boolean>;
}

export const useUnifiedArticles = (config: UseUnifiedArticlesConfig): UseUnifiedArticlesResult => {
  const { mode, language = 'en', pageSize = mode === 'public' ? 4 : 50, initialPage = 0 } = config;
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [localArticles, setLocalArticles] = useState<Article[] | MultilingualArticle[]>([]);

  // Dynamic query key based on mode
  const queryKey = mode === 'admin' 
    ? ['multilingual-articles', currentPage, pageSize]
    : ['public-articles', language, currentPage, pageSize];

  // Dynamic query function based on mode
  const queryFn = useCallback(async () => {
    if (mode === 'admin') {
      const result = await articleService.getMultilingualArticles(currentPage, pageSize);
      setLocalArticles(result.articles);
      return result;
    } else {
      const result = await articleService.getPublishedArticlesByLanguage(currentPage, pageSize, language);
      setLocalArticles(result.articles);
      return result;
    }
  }, [mode, currentPage, pageSize, language]);

  const {
    data: articlesData,
    isLoading: loading,
    error,
    refetch
  } = useOptimizedQuery({
    queryKey,
    queryFn,
    priority: 'normal',
    cacheStrategy: 'normal',
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error loading articles",
        description: "There was a problem retrieving the articles. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Memoized computed values
  const computedValues = useMemo(() => {
    const data = articlesData || { articles: [], totalCount: 0 };
    return {
      articles: localArticles.length > 0 ? localArticles : data.articles,
      totalCount: data.totalCount,
      totalPages: Math.ceil(data.totalCount / pageSize)
    };
  }, [articlesData, localArticles, pageSize]);

  // Delete article function
  const deleteArticle = useCallback(async (id: string): Promise<boolean> => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return false;
    }

    try {
      await articleService.deleteArticle(id);
      
      // Optimistically update local state
      setLocalArticles(prevArticles => 
        prevArticles.filter(article => article.id !== id)
      );
      
      toast({
        title: "Article deleted",
        description: "The article has been deleted successfully.",
      });
      
      // Refetch to ensure consistency
      setTimeout(() => refetch(), 100);
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error deleting article",
        description: "An error occurred while deleting the article.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refetch]);

  // Toggle publish status function
  const togglePublishStatus = useCallback(async (id: string, isPublished: boolean): Promise<boolean> => {
    try {
      await articleService.togglePublishStatus(id, !isPublished);
      
      // Optimistically update local state
      setLocalArticles(prevArticles => prevArticles.map(article => {
        if (article.id === id) {
          const newPublishedAt = isPublished 
            ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
            : new Date().toISOString();
          
          return { ...article, published_at: newPublishedAt };
        }
        return article;
      }));
      
      toast({
        title: isPublished ? "Article unpublished" : "Article published",
        description: isPublished 
          ? "The article has been unpublished and is now a draft." 
          : "The article has been published successfully.",
      });
      
      // Refetch to ensure consistency
      setTimeout(() => refetch(), 100);
      return true;
    } catch (error) {
      console.error('Error updating article status:', error);
      toast({
        title: "Error updating article",
        description: "An error occurred while updating the article's status.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refetch]);

  const refresh = useCallback(() => {
    setCurrentPage(0);
    refetch();
  }, [refetch]);

  return {
    ...computedValues,
    loading,
    currentPage,
    setCurrentPage,
    refresh,
    deleteArticle,
    togglePublishStatus,
  };
};
