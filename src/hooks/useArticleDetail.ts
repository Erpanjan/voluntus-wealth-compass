
import { useState, useEffect } from 'react';
import { articleService, Article } from '@/services/article';
import { useToast } from '@/hooks/use-toast';

export const useArticleDetail = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Add timeout to prevent infinite loading state
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (loading && retryCount === 0) {
      timeoutId = setTimeout(() => {
        if (loading) {
          console.log('Article loading timeout reached, forcing retry');
          setRetryCount(prev => prev + 1);
        }
      }, 5000); // 5 second timeout
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading, retryCount]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Enhanced slug processing for better URL handling
      let processedSlug = slug;
      
      // Handle different URL encoding scenarios
      try {
        // Try to decode URL encoding
        processedSlug = decodeURIComponent(slug);
        console.log(`Original slug: ${slug}, Decoded slug: ${processedSlug}`);
      } catch (e) {
        console.log('Failed to decode slug, using original:', slug);
        processedSlug = slug;
      }
      
      console.log(`Fetching article with processed slug: ${processedSlug}, retry count: ${retryCount}`);
      
      // Use the enhanced articleService with fuzzy matching
      const data = await articleService.getArticleBySlug(processedSlug);
      
      console.log("Raw article data received:", data);
      
      if (!data) {
        console.error("Article not found", { slug, processedSlug });
        throw new Error("Article not found");
      }
      
      // Ensure content is properly formatted
      if (data.content) {
        console.log("Content type:", typeof data.content);
        if (typeof data.content === 'string') {
          try {
            // If it's stored as a JSON string, parse it
            console.log("Attempting to parse content as JSON string");
            data.content = JSON.parse(data.content);
          } catch (e) {
            console.log("Content is not a valid JSON string, keeping as is");
            // Keep as string if not valid JSON
          }
        }
      } else {
        console.log("Content is empty or null, setting default");
        data.content = {};
      }
      
      console.log("Processed article data:", data);
      
      if (data.reports) {
        console.log("Article reports:", data.reports);
      } else {
        console.log("No reports found for this article");
      }
      
      // Set the article data
      setArticle(data);
    } catch (err) {
      console.error('Error fetching article details:', err);
      setError(err as Error);
      toast({
        title: "Error loading article",
        description: "There was a problem loading the article details. Please try again later.",
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
  }, [slug, retryCount]);

  return { 
    article, 
    loading, 
    error, 
    refetch: () => {
      console.log("Manually retrying article fetch");
      setRetryCount(prev => prev + 1);
    }
  };
};
