
import { useState, useEffect, useCallback } from 'react';
import { articleService, Article } from '@/services/article';
import { useToast } from '@/hooks/use-toast';

export const useArticleDetail = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchArticle = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching article with slug: ${slug}`);
      const startTime = performance.now();
      
      // Use the articleService to get the article by slug
      const data = await articleService.getArticleBySlug(slug);
      
      const endTime = performance.now();
      console.log(`Article fetch completed in ${(endTime - startTime).toFixed(2)}ms`);
      
      if (!data) {
        console.error("Article not found for slug:", slug);
        throw new Error("Article not found");
      }
      
      console.log("Article data retrieved:", {
        title: data.title,
        hasReports: data.reports && data.reports.length > 0,
        reportsCount: data.reports ? data.reports.length : 0
      });
      
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
  }, [slug, toast]);

  useEffect(() => {
    // Reset states when slug changes
    setLoading(true);
    setError(null);
    setArticle(null);
    
    if (slug) {
      fetchArticle();
    }
  }, [slug, fetchArticle]);

  return { 
    article, 
    loading, 
    error, 
    refetch: fetchArticle 
  };
};
