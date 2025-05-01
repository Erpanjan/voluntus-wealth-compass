
import { useState, useEffect } from 'react';
import { articleService, Article } from '@/services/article';
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
      
      // Use the articleService to get the article by slug
      // This function already includes the reports in its response
      const data = await articleService.getArticleBySlug(slug);
      
      if (!data) {
        throw new Error("Article not found");
      }
      
      console.log("Complete article data:", data);
      
      if (data.reports) {
        console.log("Article reports:", data.reports);
      } else {
        console.log("No reports found for this article");
      }
      
      setArticle(data);
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
