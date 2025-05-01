
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/articleService';

export const useArticleActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  // Navigation functions
  const navigateBack = () => {
    navigate('/admin/articles');
  };

  // Save as draft function
  const saveDraft = async (formData: any, authorIds: string[], imageFile: File | null, attachments: any[]) => {
    setSubmitting(true);
    
    try {
      const slug = await articleService.saveArticle(
        {
          ...formData,
          published_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days future
        },
        authorIds,
        imageFile,
        attachments
      );
      
      if (!slug) {
        throw new Error("Failed to save draft");
      }
      
      toast({
        title: 'Draft Saved',
        description: 'Your article draft has been saved.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the draft.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };
  
  // Publish function
  const publishArticle = async (formData: any, authorIds: string[], imageFile: File | null, attachments: any[]) => {
    setSubmitting(true);
    
    try {
      const slug = await articleService.saveArticle(
        {
          ...formData,
          published_at: new Date().toISOString(), // Publish immediately
        },
        authorIds,
        imageFile,
        attachments
      );
      
      if (!slug) {
        throw new Error("Failed to publish article");
      }
      
      toast({
        title: 'Article Published',
        description: `The article has been published successfully.`,
      });
      
      navigate('/admin/articles');
      return true;
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while publishing the article.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };
  
  return {
    submitting,
    navigateBack,
    saveDraft,
    publishArticle
  };
};
