
import { useState, useEffect } from 'react';
import { articleService, Article } from '@/services/articleService';
import { useToast } from '@/hooks/use-toast';

export const useArticleDetail = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articleService.getArticleBySlug(slug);
      setArticle(data);
      
      if (!data) {
        throw new Error("Article not found");
      }
    } catch (err) {
      console.error('Error fetching article details:', err);
      setError(err as Error);
      toast({
        title: "Error loading article",
        description: "There was a problem loading the article details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  return { article, loading, error, refetch: fetchArticle };
};
