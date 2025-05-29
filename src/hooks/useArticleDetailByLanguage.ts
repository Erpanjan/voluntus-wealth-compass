
import { useToast } from '@/hooks/use-toast';
import { articleService, Article } from '@/services/article';
import { useOptimizedQuery } from './useOptimizedQuery';
import { useEffect } from 'react';

export const useArticleDetailByLanguage = (slug: string, language: string = 'en') => {
  const { toast } = useToast();

  const {
    data: article,
    isLoading: loading,
    error,
    refetch
  } = useOptimizedQuery({
    queryKey: ['article-detail-by-language', slug, language],
    queryFn: async () => {
      if (!slug) {
        throw new Error('No slug provided');
      }

      console.log(`Fetching article with slug: ${slug} for language: ${language}`);
      
      // Properly decode the slug in case it was URL encoded
      const decodedSlug = decodeURIComponent(slug);
      console.log(`Decoded slug: ${decodedSlug}`);
      
      const data = await articleService.getArticleBySlugAndLanguage(decodedSlug, language);
      
      if (!data) {
        console.error("Article not found", { slug, decodedSlug, language });
        throw new Error("Article not found");
      }
      
      // Ensure content is properly formatted
      if (data.content) {
        console.log("Content type:", typeof data.content);
        if (typeof data.content === 'string') {
          try {
            console.log("Attempting to parse content as JSON string");
            data.content = JSON.parse(data.content);
          } catch (e) {
            console.log("Content is not a valid JSON string, keeping as is");
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
      
      return data;
    },
    enabled: !!slug,
    priority: 'high',
    cacheStrategy: 'aggressive',
    retry: 2,
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (error) {
      console.error('Error fetching article details by language:', error);
      toast({
        title: "Error loading article",
        description: "There was a problem loading the article details. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleRefetch = () => {
    console.log("Manually retrying article fetch by language");
    refetch();
  };

  return { 
    article: article || null, 
    loading, 
    error, 
    refetch: handleRefetch,
    language
  };
};
