
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SAMPLE_ARTICLES } from '@/data/sampleArticles';

export const useArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // Placeholder for when the actual database tables are created
      // This would normally be a Supabase call to fetch articles
      // const { data, error } = await supabase
      //   .rpc('get_articles_with_authors');
      
      // For now, we'll use sample data
      setTimeout(() => {
        setArticles(SAMPLE_ARTICLES);
        setLoading(false);
      }, 800); // Simulate loading
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        // Placeholder for when the actual database tables are created
        // This would normally be a Supabase call to delete an article
        // const { error } = await supabase
        //   .from('articles')
        //   .delete()
        //   .eq('id', id);
          
        // For now, we'll just filter the articles array
        setArticles(articles.filter(article => article.id !== id));
        
        toast({
          title: "Article deleted",
          description: "The article has been deleted successfully.",
        });
        
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
      // Placeholder for when the actual database tables are created
      // This would normally be a Supabase call to update an article's status
      // const { error } = await supabase
      //   .from('articles')
      //   .update({ published_at: isPublished ? new Date().toISOString() : null })
      //   .eq('id', id);
      
      // For now, we'll just update the articles array
      setArticles(articles.map(article => {
        if (article.id === id) {
          // If publishing, set published_at to current time
          // If unpublishing, set published_at to future time (making it a draft)
          const newPublishedAt = isPublished 
            ? new Date().toISOString() 
            : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days in the future
          
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
    updateArticleStatus
  };
};
