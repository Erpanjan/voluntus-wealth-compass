
import { useEffect } from 'react';
import { articleService } from '@/services/article';
import { useBaseArticleOperations } from './useBaseArticleOperations';
import { Language } from '@/types/multilingual-article.types';
import { processContent } from '@/utils/articleContentUtils';

export const useArticleDetailByLanguage = (slug: string, language: Language = 'en') => {
  const { createQuery, showErrorToast } = useBaseArticleOperations({
    priority: 'high',
    retry: 2,
  });

  const {
    data: article,
    isLoading: loading,
    error,
    refetch
  } = createQuery(
    ['article-detail-by-language', slug, language],
    async () => {
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
      
      // Process content
      const processedData = {
        ...data,
        content: processContent(data.content)
      };
      
      console.log("Processed article data:", processedData);
      
      if (processedData.reports) {
        console.log("Article reports:", processedData.reports);
      } else {
        console.log("No reports found for this article");
      }
      
      return processedData;
    },
    { enabled: !!slug }
  );

  // Handle errors with useEffect
  useEffect(() => {
    if (error) {
      console.error('Error fetching article details by language:', error);
      showErrorToast(
        "Error loading article",
        "There was a problem loading the article details. Please try again later."
      );
    }
  }, [error, showErrorToast]);

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
