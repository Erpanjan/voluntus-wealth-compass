
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/article';
import { MultilingualArticleInput } from '@/types/multilingual-article.types';

export const useMultilingualArticleActions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Navigate back to article management
  const navigateBack = () => {
    navigate('/admin/articles');
  };

  // Save article as draft
  const saveDraft = async (formData: MultilingualArticleInput, imageFile: File | null) => {
    if (submitting) return;
    
    setSubmitting(true);

    try {
      // Only require title for draft (either language)
      if (!formData.en.title?.trim() && !formData.zh.title?.trim()) {
        throw new Error('Please provide a title in at least one language for your article');
      }

      console.log('Saving multilingual draft with data:', {
        en_title: formData.en.title,
        zh_title: formData.zh.title,
        hasImage: !!imageFile
      });

      const result = await articleService.saveMultilingualArticle(
        {
          ...formData,
          id: id,
          // For drafts, set published_at to a future date
          published_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        },
        [], // No authors array needed
        imageFile,
        [] // No attachments
      );

      if (!result) {
        throw new Error('Failed to save article draft');
      }

      console.log('Multilingual draft saved successfully:', result);

      toast({
        title: 'Draft saved',
        description: 'Your article draft has been saved successfully.',
      });

      // If this is a new article, redirect to the edit page
      if (!id && result) {
        navigate(`/admin/articles/edit/${result}`);
      }
    } catch (error: any) {
      console.error('Error saving multilingual draft:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save article draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Publish article
  const publishArticle = async (formData: MultilingualArticleInput, imageFile: File | null) => {
    if (submitting) return;
    
    setSubmitting(true);

    try {
      // Require title and content in at least one language for publishing
      const hasEnglishContent = formData.en.title?.trim() && formData.en.content;
      const hasChineseContent = formData.zh.title?.trim() && formData.zh.content;
      
      if (!hasEnglishContent && !hasChineseContent) {
        throw new Error('Please provide title and content in at least one language');
      }

      console.log('Publishing multilingual article with data:', {
        en_title: formData.en.title,
        zh_title: formData.zh.title,
        hasImage: !!imageFile
      });

      const result = await articleService.saveMultilingualArticle(
        {
          ...formData,
          id: id,
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
    saveDraft,
    publishArticle,
  };
};
