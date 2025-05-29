
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/article';
import { useOptimizedQuery } from './useOptimizedQuery';

interface MultilingualArticle {
  id: string;
  title_en: string;
  title_zh: string;
  slug: string;
  description_en: string;
  description_zh: string;
  content_en: any;
  content_zh: any;
  category_en: string;
  category_zh: string;
  author_name_en: string;
  author_name_zh: string;
  image_url: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export const useMultilingualArticles = () => {
  const { toast } = useToast();
  const [localArticles, setLocalArticles] = useState<MultilingualArticle[]>([]);

  const {
    data: articles = [],
    isLoading: loading,
    error,
    refetch
  } = useOptimizedQuery({
    queryKey: ['multilingual-articles'],
    queryFn: async () => {
      console.log('Fetching multilingual articles...');
      const data = await articleService.getMultilingualArticles();
      console.log('Multilingual articles fetched successfully:', data);
      setLocalArticles(data);
      return data;
    },
    priority: 'normal',
    cacheStrategy: 'normal',
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (error) {
      console.error('Error fetching multilingual articles:', error);
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
      const success = await articleService.deleteArticle(id);
      
      if (success) {
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
      } else {
        throw new Error("Failed to delete article");
      }
      
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
      const success = await articleService.togglePublishStatus(id, isPublished);
      
      if (success) {
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
      } else {
        throw new Error("Failed to update article status");
      }
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
  const currentArticles = localArticles.length > 0 ? localArticles : articles;

  return {
    articles: currentArticles,
    loading,
    deleteArticle,
    updateArticleStatus,
    refreshArticles
  };
};
