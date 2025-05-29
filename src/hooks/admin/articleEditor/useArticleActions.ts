
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/article';
import { ArticleInput } from '@/types/multilingual-article.types';

export const useArticleActions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Navigate back to article management
  const navigateBack = () => {
    navigate('/admin/articles');
  };

  // Save article as draft - convert to multilingual format
  const saveDraft = async (formData: any, imageFile: File | null) => {
    if (submitting) return;
    
    setSubmitting(true);

    try {
      // Only require title for draft
      if (!formData.title?.trim()) {
        throw new Error('Please provide a title for your article');
      }

      console.log('Saving draft with data:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        author_name: formData.author_name,
        hasImage: !!imageFile
      });

      // Convert legacy format to multilingual format
      const multilingualData = {
        id: id,
        en: {
          title: formData.title.trim(),
          description: formData.description?.trim() || '',
          content: formData.content || '',
          category: formData.category?.trim() || '',
          author_name: formData.author_name?.trim() || '',
        },
        zh: {
          title: '',
          description: '',
          content: '',
          category: '',
          author_name: '',
        },
        // For drafts, set published_at to a future date
        published_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      };

      const result = await articleService.saveMultilingualArticle(
        multilingualData,
        [], // No authors array needed
        imageFile,
        [] // No attachments
      );

      if (!result) {
        throw new Error('Failed to save article draft');
      }

      console.log('Draft saved successfully:', result);

      toast({
        title: 'Draft saved',
        description: 'Your article draft has been saved successfully.',
      });

      // If this is a new article, redirect to the edit page
      if (!id && result) {
        navigate(`/admin/articles/edit/${result}`);
      }
    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save article draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Publish article - convert to multilingual format
  const publishArticle = async (formData: any, imageFile: File | null) => {
    if (submitting) return;
    
    setSubmitting(true);

    try {
      // Only require title and content for publishing
      if (!formData.title?.trim()) {
        throw new Error('Please provide a title for your article');
      }
      if (!formData.content || formData.content.trim() === '' || formData.content === '<p></p>') {
        throw new Error('Please add some content to your article');
      }

      console.log('Publishing article with data:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        author_name: formData.author_name,
        hasImage: !!imageFile
      });

      // Convert legacy format to multilingual format
      const multilingualData = {
        id: id,
        en: {
          title: formData.title.trim(),
          description: formData.description?.trim() || '',
          content: formData.content,
          category: formData.category?.trim() || '',
          author_name: formData.author_name?.trim() || '',
        },
        zh: {
          title: '',
          description: '',
          content: '',
          category: '',
          author_name: '',
        },
        // For published articles, set published_at to now
        published_at: new Date().toISOString(),
      };

      const result = await articleService.saveMultilingualArticle(
        multilingualData,
        [], // No authors array needed
        imageFile,
        [] // No attachments
      );

      if (!result) {
        throw new Error('Failed to publish article');
      }

      console.log('Article published successfully:', result);

      toast({
        title: 'Article published',
        description: 'Your article has been published successfully.',
      });

      // Redirect to article management
      navigate('/admin/articles');
    } catch (error: any) {
      console.error('Error publishing article:', error);
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
