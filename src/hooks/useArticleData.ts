
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArticleData } from '@/types/supabase';
import { ArticleFormValues } from './useArticleForm';
import { fetchArticleById, saveArticle, extractContentHtml } from '@/services/mockArticleService';
import { getAuthorByArticleId } from '@/services/mockAuthorService';
import { format } from 'date-fns';

export const useArticleData = (id?: string) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [article, setArticle] = useState<ArticleData | null>(null);
  
  const isEditMode = !!id;
  
  const fetchArticle = async () => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const articleData = await fetchArticleById(id);
      
      if (articleData) {
        setArticle(articleData);
        
        // Convert content to HTML
        const contentHtml = extractContentHtml(articleData.content);
        
        const formData = {
          title: articleData.title,
          description: articleData.description || '',
          category: articleData.category || '',
          author: '', // Will be populated below
          image_url: articleData.image_url || '',
          published_at: format(new Date(articleData.published_at || new Date()), 'yyyy-MM-dd'),
        };
        
        // Fetch article author
        const authorData = await getAuthorByArticleId(id);
        if (authorData) {
          formData.author = authorData.name;
        }
        
        return { 
          article: articleData, 
          formData, 
          contentHtml 
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: 'Error',
        description: 'Failed to load article data',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveArticle = async (
    formData: ArticleFormValues, 
    htmlContent: string,
    imageUrl: string,
    publish: boolean
  ): Promise<boolean> => {
    setSubmitting(true);
    
    try {
      const articleId = await saveArticle(formData, htmlContent, imageUrl, publish, id);
      
      if (articleId) {
        toast({
          title: 'Success',
          description: publish 
            ? 'Article published successfully' 
            : (isEditMode ? 'Article updated successfully' : 'Article saved as draft'),
        });
        
        return true;
      }
      
      throw new Error('Failed to save article');
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    article,
    isEditMode,
    fetchArticle,
    saveArticle: handleSaveArticle
  };
};
