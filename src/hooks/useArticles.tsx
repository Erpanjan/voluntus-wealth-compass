import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { articleService, Article } from '@/services/article';

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articleService.getArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error fetching articles",
        description: "There was a problem retrieving the articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const success = await articleService.deleteArticle(id);
        
        if (success) {
          setArticles(prevArticles => prevArticles.filter(article => article.id !== id));
          
          toast({
            title: "Article deleted",
            description: "The article has been deleted successfully.",
          });
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
    }
    return false;
  };

  const updateArticleStatus = async (id: string, isPublished: boolean) => {
    try {
      const success = await articleService.togglePublishStatus(id, isPublished);
      
      if (success) {
        // Update articles array
        setArticles(prevArticles => prevArticles.map(article => {
          if (article.id === id) {
            // Update published_at based on isPublished
            const newPublishedAt = isPublished 
              ? new Date().toISOString() 
              : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days future
            
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
  };

  return {
    articles,
    loading,
    deleteArticle,
    updateArticleStatus,
    refreshArticles: fetchArticles
  };
};
