
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { articleService, Article } from '@/services/article';

export const usePublishedArticles = (pageSize: number = 4) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();

  const fetchArticles = async (page: number = 0, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      }
      
      console.log(`Fetching published articles for page ${page} with pageSize ${pageSize}`);
      const result = await articleService.getPublishedArticles(page, pageSize);
      console.log('Published articles result:', result);
      
      if (append) {
        setArticles(prev => [...prev, ...result.articles]);
      } else {
        setArticles(result.articles);
      }
      
      setTotalCount(result.totalCount);
      setHasMore((page + 1) * pageSize < result.totalCount);
      setCurrentPage(page);
      
      console.log(`Loaded ${result.articles.length} articles, total: ${result.totalCount}, hasMore: ${(page + 1) * pageSize < result.totalCount}`);
    } catch (error) {
      console.error('Error fetching published articles:', error);
      toast({
        title: "Error loading articles",
        description: "There was a problem loading the articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchArticles(currentPage + 1, true);
    }
  };

  const refresh = () => {
    fetchArticles(0, false);
  };

  useEffect(() => {
    fetchArticles();
  }, [pageSize]);

  return {
    articles,
    loading,
    currentPage,
    totalCount,
    hasMore,
    loadMore,
    refresh,
    totalPages: Math.ceil(totalCount / pageSize)
  };
};
