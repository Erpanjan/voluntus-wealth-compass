
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { articlesService } from '@/services/articlesService';
import { MultilingualArticle } from '@/types/multilingual-article.types';

export const useArticlesManagement = () => {
  const [articles, setArticles] = useState<MultilingualArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const loadArticles = useCallback(async () => {
    console.log('🔄 [useArticlesManagement] Loading articles...');
    setLoading(true);
    
    try {
      const response = await articlesService.getMultilingualArticles(0, 50);
      setArticles(response.articles);
      setTotalCount(response.totalCount);
      console.log(`✅ [useArticlesManagement] Loaded ${response.articles.length} articles`);
    } catch (error) {
      console.error('❌ [useArticlesManagement] Error loading articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load articles. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteArticle = useCallback(async (id: string) => {
    try {
      await articlesService.deleteArticle(id);
      toast({
        title: 'Success',
        description: 'Article deleted successfully.'
      });
      loadArticles();
    } catch (error) {
      console.error('❌ [useArticlesManagement] Error deleting article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete article. Please try again.',
        variant: 'destructive'
      });
    }
  }, [loadArticles, toast]);

  const togglePublishStatus = useCallback(async (id: string, isPublished: boolean) => {
    try {
      await articlesService.togglePublishStatus(id, isPublished);
      toast({
        title: 'Success',
        description: `Article ${isPublished ? 'unpublished' : 'published'} successfully.`
      });
      loadArticles();
    } catch (error) {
      console.error('❌ [useArticlesManagement] Error toggling publish status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update article status. Please try again.',
        variant: 'destructive'
      });
    }
  }, [loadArticles, toast]);

  const refresh = useCallback(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return {
    articles,
    loading,
    totalCount,
    deleteArticle,
    togglePublishStatus,
    refresh
  };
};
