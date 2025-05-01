
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

  return {
    articles,
    loading,
    deleteArticle
  };
};
