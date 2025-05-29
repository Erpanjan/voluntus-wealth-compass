
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { unifiedArticleService } from '@/services/article/unifiedArticleService';
import { MultilingualArticleInput } from '@/types/multilingual-article.types';

export const useEditArticleActions = (articleId?: string) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Navigate back to article management
  const navigateBack = () => {
    navigate('/admin/articles');
  };

  // Update article as draft
  const updateDraft = async (formData: MultilingualArticleInput, imageFile: File | null) => {
    if (submitting || !articleId) return;
    
    setSubmitting(true);

    try {
      // Only require title for draft (either language)
      if (!formData.en.title?.trim() && !formData.zh.title?.trim()) {
        throw new Error('Please provide a title in at least one language for your article');
      }

      console.log('Updating multilingual draft with data:', {
        id: articleId,
        en_title: formData.en.title,
        zh_title: formData.zh.title,
        hasImage: !!imageFile
      });

      const result = await unifiedArticleService.saveMultilingualArticle(
        {
          ...formData,
          id: articleId,
          // For drafts, set published_at to a future date
          published_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        },
        [], // No authors array needed
        imageFile,
        [] // No attachments
      );

      if (!result) {
        throw new Error('Failed to update article draft');
      }

      console.log('Multilingual draft updated successfully:', result);

      toast({
        title: 'Draft updated',
        description: 'Your article draft has been updated successfully.',
      });

    } catch (error: any) {
      console.error('Error updating multilingual draft:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update article draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Update and publish article
  const updateAndPublish = async (formData: MultilingualArticleInput, imageFile: File | null) => {
    if (submitting || !articleId) return;
    
    setSubmitting(true);

    try {
      // Require title and content in at least one language for publishing
      const hasEnglishContent = formData.en.title?.trim() && formData.en.content;
      const hasChineseContent = formData.zh.title?.trim() && formData.zh.content;
      
      if (!hasEnglishContent && !hasChineseContent) {
        throw new Error('Please provide title and content in at least one language');
      }

      console.log('Publishing updated multilingual article with data:', {
        id: articleId,
        en_title: formData.en.title,
        zh_title: formData.zh.title,
        hasImage: !!imageFile
      });

      const result = await unifiedArticleService.saveMultilingualArticle(
        {
          ...formData,
          id: articleId,
          // For published articles, set published_at to now
          published_at: new Date().toISOString(),
        },
        [], // No authors array needed
        imageFile,
        [] // No attachments
      );

      if (!result) {
        throw new Error('Failed to publish article');
      }

      console.log('Multilingual article published successfully:', result);

      toast({
        title: 'Article published',
        description: 'Your article has been published successfully.',
      });

      // Redirect to article management
      navigate('/admin/articles');
    } catch (error: any) {
      console.error('Error publishing multilingual article:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    navigateBack,
    updateDraft,
    updateAndPublish,
  };
};
