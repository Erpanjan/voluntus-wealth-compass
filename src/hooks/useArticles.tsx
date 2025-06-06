
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/article';
import { Article } from '@/types/multilingual-article.types';
import { normalizeArticleContent } from '@/utils/articleContentUtils';
import { useOptimizedQuery } from './useOptimizedQuery';

export const useArticles = () => {
  const { toast } = useToast();
  const [localArticles, setLocalArticles] = useState<Article[]>([]);

  const {
    data: articlesData,
    isLoading: loading,
    error,
    refetch
  } = useOptimizedQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      console.log('Fetching articles...');
      const data = await articleService.getMultilingualArticles();
      console.log('Articles fetched successfully:', data);
      
      // Convert multilingual articles to Article format
      const normalizedArticles = data.articles.map(article => 
        normalizeArticleContent(article, 'en')
      );
      
      setLocalArticles(normalizedArticles);
      return normalizedArticles;
    },
    priority: 'normal',
    cacheStrategy: 'normal',
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error fetching articles",
        description: "There was a problem retrieving the articles. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const deleteArticle = useCallback(async (id: string) => {
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

  const updateArticleStatus = useCallback(async (id: string, isPublished: boolean) => {
    try {
      await articleService.togglePublishStatus(id, isPublished);
      
      // Optimistically update local state
      setLocalArticles(prevArticles => prevArticles.map(article => {
        if (article.id === id) {
          const newPublishedAt = isPublished 
            ? new Date().toISOString() 
            : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
          
          return { ...article, published_at: newPublishedAt };
        }
        return article;
      }));
      
      toast({
        title: isPublished ? "Article published" : "Article unpublished",
        description: isPublished 
          ? "The article has been published successfully." 
          : "The article has been unpublished and is now a draft.",
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

  const refreshArticles = useCallback(() => {
    refetch();
  }, [refetch]);

  // Use local state if available for better responsiveness
  const currentArticles = localArticles.length > 0 ? localArticles : (articlesData || []);

  return {
    articles: currentArticles,
    loading,
    deleteArticle,
    updateArticleStatus,
    refreshArticles
  };
};
