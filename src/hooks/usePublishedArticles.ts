
import { useState, useEffect } from 'react';
import { articleService, Article } from '@/services/articleService';
import { useToast } from '@/hooks/use-toast';

export const usePublishedArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articleService.getPublishedArticles();
      setArticles(data);
    } catch (err) {
      console.error('Error fetching published articles:', err);
      setError(err as Error);
      toast({
        title: "Error loading articles",
        description: "There was a problem loading the articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return { articles, loading, error, refetch: fetchArticles };
};
