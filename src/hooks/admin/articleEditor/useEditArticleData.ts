
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { unifiedArticleService } from '@/services/article/unifiedArticleService';
import { useMultilingualForm } from './useMultilingualForm';
import { useArticleImage } from './useArticleImage';

export const useEditArticleData = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { form } = useMultilingualForm();
  const { loadImageData } = useArticleImage();

  // Load article data ONCE on mount
  useEffect(() => {
    const loadArticleData = async () => {
      if (!id) {
        toast({
          title: 'Error',
          description: 'No article ID provided',
          variant: 'destructive',
        });
        return;
      }

      try {
        console.log(`🔍 [EDIT] Loading article data for ID: ${id}`);
        
        const article = await unifiedArticleService.getMultilingualArticleById(id);

        if (!article) {
          toast({
            title: 'Article Not Found',
            description: 'Could not find the article you are trying to edit.',
            variant: 'destructive',
          });
          return;
        }

        console.log(`📊 [EDIT] Article loaded:`, {
          id: article.id,
          title_en: article.title_en,
          title_zh: article.title_zh,
          content_en_length: article.content_en.length,
          content_zh_length: article.content_zh.length,
          content_en_preview: article.content_en.substring(0, 100),
          content_zh_preview: article.content_zh.substring(0, 100)
        });

        // Load existing image if available
        if (article.image_url) {
          loadImageData(article.image_url);
        }

        // Content is now guaranteed to be a string from the service layer
        const formData = {
          en: {
            title: article.title_en || '',
            description: article.description_en || '',
            content: article.content_en || '', // Direct string assignment
            category: article.category_en || '',
            author_name: article.author_name_en || '',
          },
          zh: {
            title: article.title_zh || '',
            description: article.description_zh || '',
            content: article.content_zh || '', // Direct string assignment
            category: article.category_zh || '',
            author_name: article.author_name_zh || '',
          },
          image_url: article.image_url || '',
          published_at: article.published_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        };

        console.log(`✅ [EDIT] Setting form with processed data:`, {
          en_content_length: formData.en.content.length,
          zh_content_length: formData.zh.content.length,
          en_content_preview: formData.en.content.substring(0, 100),
          zh_content_preview: formData.zh.content.substring(0, 100)
        });
        
        form.reset(formData);

        console.log(`🎯 [EDIT] Form data set successfully`);

      } catch (error) {
        console.error('💥 [EDIT] Error loading article:', error);
        toast({
          title: 'Error',
          description: 'Failed to load article data. Please try again.',
          variant: 'destructive',
        });
      }
    };

    loadArticleData();
  }, [id, toast, form, loadImageData]);

  return { articleId: id };
};
