
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/articleService';
import { Author } from '@/services/articleService';
import { Attachment } from './useArticleAttachments';

export const useArticleActions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Navigate back to article management
  const navigateBack = () => {
    navigate('/admin/articles');
  };

  // Save article as draft
  const saveDraft = async (formData: any, selectedAuthors: Author[], imageFile: File | null, attachments: Attachment[]) => {
    setSubmitting(true);

    try {
      const result = await articleService.saveArticle(
        {
          id: id,
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          // For drafts, set published_at to a future date
          published_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days from now
        },
        selectedAuthors.map(author => author.id),
        imageFile,
        attachments
      );

      if (!result) {
        throw new Error('Failed to save article draft');
      }

      toast({
        title: 'Draft saved',
        description: 'Your article draft has been saved successfully.',
      });

      // If this is a new article (no ID), redirect to the edit page
      if (!id && result) {
        navigate(`/admin/articles/edit/${result}`);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: 'Error',
        description: 'Failed to save article draft.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Publish article
  const publishArticle = async (formData: any, selectedAuthors: Author[], imageFile: File | null, attachments: Attachment[]) => {
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.content) {
        throw new Error('Please fill out all required fields');
      }

      const result = await articleService.saveArticle(
        {
          id: id,
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          // For published articles, set published_at to now
          published_at: new Date().toISOString(),
        },
        selectedAuthors.map(author => author.id),
        imageFile,
        attachments
      );

      if (!result) {
        throw new Error('Failed to publish article');
      }

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
        description: error.message || 'Failed to publish article.',
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
