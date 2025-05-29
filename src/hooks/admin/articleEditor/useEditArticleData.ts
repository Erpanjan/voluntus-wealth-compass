
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
        console.log(`🔍 Loading article data for ID: ${id}`);
        
        const article = await unifiedArticleService.getMultilingualArticleById(id);

        if (!article) {
          toast({
            title: 'Article Not Found',
            description: 'Could not find the article you are trying to edit.',
            variant: 'destructive',
          });
          return;
        }

        console.log(`📊 Raw article data:`, article);

        // Load existing image if available
        if (article.image_url) {
          loadImageData(article.image_url);
        }

        // Extract content directly - handle both string and object cases
        const extractContent = (content: any) => {
          console.log('🔍 Extracting content:', { content, type: typeof content });
          
          // If it's already a string, use it directly
          if (typeof content === 'string') {
            return content;
          }
          
          // If it's an object with a value property, extract that
          if (content && typeof content === 'object' && content.value) {
            return content.value;
          }
          
          // If it's an object but not the expected format, stringify it
          if (content && typeof content === 'object') {
            return JSON.stringify(content);
          }
          
          // Default to empty string
          return '';
        };

        const contentEn = extractContent(article.content_en);
        const contentZh = extractContent(article.content_zh);

        console.log('📝 Extracted content:', {
          contentEn: contentEn.substring(0, 100) + '...',
          contentZh: contentZh.substring(0, 100) + '...',
          contentEnLength: contentEn.length,
          contentZhLength: contentZh.length
        });

        // Set form data directly with extracted content
        const formData = {
          en: {
            title: article.title_en || '',
            description: article.description_en || '',
            content: contentEn,
            category: article.category_en || '',
            author_name: article.author_name_en || '',
          },
          zh: {
            title: article.title_zh || '',
            description: article.description_zh || '',
            content: contentZh,
            category: article.category_zh || '',
            author_name: article.author_name_zh || '',
          },
          image_url: article.image_url || '',
          published_at: article.published_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        };

        console.log(`✅ Setting form with data:`, formData);
        
        form.reset(formData);

      } catch (error) {
        console.error('💥 Error loading article:', error);
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
