
import { useState, useEffect, useCallback } from 'react';
import { articleService, Article } from '@/services/article';
import { useToast } from '@/hooks/use-toast';

export const useArticleDetail = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchArticle = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }
    
    try {
      // Start with fresh state
      setLoading(true);
      setError(null);
      
      console.log(`Fetching article with slug: ${slug}`);
      
      // Set a safety timeout to prevent infinite loading state
      const safetyTimeout = window.setTimeout(() => {
        console.warn("Article fetch timeout reached - forcing loading state to false");
        setLoading(false);
        setError(new Error("Request timeout - article took too long to load"));
        toast({
          title: "Loading timeout",
          description: "The article is taking longer than expected to load.",
          variant: "destructive",
        });
      }, 10000); // 10 seconds timeout
      
      setTimeoutId(safetyTimeout);
      
      // Use the articleService to get the article by slug
      const data = await articleService.getArticleBySlug(slug);
      
      // Clear the timeout since we got a response
      if (timeoutId) window.clearTimeout(timeoutId);
      
      if (!data) {
        console.error("Article not found for slug:", slug);
        throw new Error("Article not found");
      }
      
      console.log("Article data retrieved:", {
        title: data.title,
        hasContent: !!data.content,
        contentType: typeof data.content,
        contentSample: typeof data.content === 'string' ? data.content.substring(0, 100) : 'Object content',
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
      // Always make sure loading is set to false to prevent UI from being stuck
      setLoading(false);
      
      // Clear any pending timeout
      if (timeoutId) window.clearTimeout(timeoutId);
    }
  }, [slug, toast, timeoutId]);
  
  // Cleanup function to clear timeout when unmounting
  useEffect(() => {
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  useEffect(() => {
    // Reset states when slug changes
    setLoading(true);
    setError(null);
    setArticle(null);
    
    console.log(`Slug changed to: ${slug}, initiating article fetch`);
    
    if (slug) {
      fetchArticle();
    } else {
      console.warn("No slug provided, skipping article fetch");
      setLoading(false);
    }
  }, [slug, fetchArticle]);

  return { 
    article, 
    loading, 
    error, 
    refetch: fetchArticle 
  };
};
