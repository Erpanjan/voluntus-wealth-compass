
import { useState, useEffect } from 'react';
import { articleService, Article } from '@/services/articleService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      
      if (!data) {
        throw new Error("Article not found");
      }
      
      // Ensure we fetch the reports/attachments data
      if (data && data.id) {
        try {
          const { data: reports, error: reportsError } = await supabase
            .from('reports')
            .select('*')
            .eq('article_id', data.id);
          
          if (!reportsError && reports) {
            console.log("Reports fetched:", reports);
            data.reports = reports;
          } else if (reportsError) {
            console.error('Error fetching article attachments:', reportsError);
          }
        } catch (attachmentError) {
          console.error('Error in attachment fetch process:', attachmentError);
        }
      }
      
      console.log("Complete article data:", data);
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
