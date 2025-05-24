
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/article';
import { Author } from '@/types/article.types';
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
    if (submitting) return; // Prevent double submission
    
    setSubmitting(true);

    try {
      // Validate required fields for draft
      if (!formData.title?.trim()) {
        throw new Error('Please provide a title for your article');
      }

      console.log('Saving draft with data:', {
        title: formData.title,
        authors: selectedAuthors.length,
        hasImage: !!imageFile,
        attachments: attachments.length
      });

      const result = await articleService.saveArticle(
        {
          id: id,
          title: formData.title.trim(),
          description: formData.description?.trim() || '',
          content: formData.content || '',
          category: formData.category || 'Uncategorized',
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

      console.log('Draft saved successfully:', result);

      toast({
        title: 'Draft saved',
        description: 'Your article draft has been saved successfully.',
      });

      // If this is a new article (no ID), redirect to the edit page
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

  // Publish article
  const publishArticle = async (formData: any, selectedAuthors: Author[], imageFile: File | null, attachments: Attachment[]) => {
    if (submitting) return; // Prevent double submission
    
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title?.trim()) {
        throw new Error('Please provide a title for your article');
      }
      if (!formData.description?.trim()) {
        throw new Error('Please provide a description for your article');
      }
      if (!formData.category?.trim()) {
        throw new Error('Please select a category for your article');
      }
      if (!formData.content || formData.content.trim() === '' || formData.content === '<p></p>') {
        throw new Error('Please add some content to your article');
      }
      if (selectedAuthors.length === 0) {
        throw new Error('Please select at least one author for your article');
      }

      console.log('Publishing article with data:', {
        title: formData.title,
        authors: selectedAuthors.length,
        hasImage: !!imageFile,
        attachments: attachments.length
      });

      const result = await articleService.saveArticle(
        {
          id: id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          content: formData.content,
          category: formData.category.trim(),
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
