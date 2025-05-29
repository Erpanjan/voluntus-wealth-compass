
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/article';

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
  const saveDraft = async (formData: any, imageFile: File | null) => {
    if (submitting) return;
    
    setSubmitting(true);

    try {
      // Validate that at least one language has a title
      if (!formData.en.title?.trim() && !formData.zh.title?.trim()) {
        throw new Error('Please provide a title in at least one language');
      }

      console.log('Saving multilingual draft with data:', {
        en: {
          title: formData.en.title,
          description: formData.en.description,
          category: formData.en.category,
          author_name: formData.en.author_name,
          hasContent: !!formData.en.content && formData.en.content !== '<p></p>'
        },
        zh: {
          title: formData.zh.title,
          description: formData.zh.description,
          category: formData.zh.category,
          author_name: formData.zh.author_name,
          hasContent: !!formData.zh.content && formData.zh.content !== '<p></p>'
        },
        hasImage: !!imageFile,
        published_at: formData.published_at
      });

      const result = await articleService.saveMultilingualArticle(
        {
          id: id,
          en: {
            title: formData.en.title?.trim() || '',
            description: formData.en.description?.trim() || '',
            content: formData.en.content || {},
            category: formData.en.category?.trim() || '',
            author_name: formData.en.author_name?.trim() || '',
          },
          zh: {
            title: formData.zh.title?.trim() || '',
            description: formData.zh.description?.trim() || '',
            content: formData.zh.content || {},
            category: formData.zh.category?.trim() || '',
            author_name: formData.zh.author_name?.trim() || '',
          },
          image_url: formData.image_url || '',
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
        description: 'Your multilingual article draft has been saved successfully.',
      });

      // If this is a new article, redirect to the edit page
      if (!id && result) {
        navigate(`/admin/articles/edit/${result}`);
      }
    } catch (error: any) {
      console.error('Error saving multilingual draft:', error);
      
      let errorMessage = 'Failed to save article draft. Please try again.';
      
      // Provide more specific error messages based on the error
      if (error.message?.includes('row-level security')) {
        errorMessage = 'Authentication error. Please log in again and try saving the draft.';
      } else if (error.message?.includes('violates not-null constraint')) {
        errorMessage = 'Missing required information. Please ensure you have provided a title.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Publish article
  const publishArticle = async (formData: any, imageFile: File | null) => {
    if (submitting) return;
    
    setSubmitting(true);

    try {
      // Validate that at least one language has title and content
      const hasEnglishContent = formData.en.title?.trim() && formData.en.content && formData.en.content !== '<p></p>';
      const hasChineseContent = formData.zh.title?.trim() && formData.zh.content && formData.zh.content !== '<p></p>';

      if (!hasEnglishContent && !hasChineseContent) {
        throw new Error('Please provide title and content in at least one language');
      }

      console.log('Publishing multilingual article with data:', {
        en: {
          title: formData.en.title,
          description: formData.en.description,
          category: formData.en.category,
          author_name: formData.en.author_name,
          hasContent: !!formData.en.content && formData.en.content !== '<p></p>'
        },
        zh: {
          title: formData.zh.title,
          description: formData.zh.description,
          category: formData.zh.category,
          author_name: formData.zh.author_name,
          hasContent: !!formData.zh.content && formData.zh.content !== '<p></p>'
        },
        hasImage: !!imageFile,
        published_at: formData.published_at
      });

      const result = await articleService.saveMultilingualArticle(
        {
          id: id,
          en: {
            title: formData.en.title?.trim() || '',
            description: formData.en.description?.trim() || '',
            content: formData.en.content || {},
            category: formData.en.category?.trim() || '',
            author_name: formData.en.author_name?.trim() || '',
          },
          zh: {
            title: formData.zh.title?.trim() || '',
            description: formData.zh.description?.trim() || '',
            content: formData.zh.content || {},
            category: formData.zh.category?.trim() || '',
            author_name: formData.zh.author_name?.trim() || '',
          },
          image_url: formData.image_url || '',
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
        description: 'Your multilingual article has been published successfully.',
      });

      // Redirect to article management
      navigate('/admin/articles');
    } catch (error: any) {
      console.error('Error publishing multilingual article:', error);
      
      let errorMessage = 'Failed to publish article. Please try again.';
      
      // Provide more specific error messages based on the error
      if (error.message?.includes('row-level security')) {
        errorMessage = 'Authentication error. Please log in again and try publishing the article.';
      } else if (error.message?.includes('violates not-null constraint')) {
        errorMessage = 'Missing required information. Please ensure you have provided all necessary fields.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
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
