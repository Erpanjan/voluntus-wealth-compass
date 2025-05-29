
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/services/article';

export const useMultilingualArticleData = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const isEditMode = !!id;

  // Load multilingual article data if in edit mode
  const loadArticleData = async () => {
    if (!isEditMode || !id) return null;
    
    try {
      console.log('Loading multilingual article data for ID:', id);
      const article = await articleService.getMultilingualArticleById(id);
      
      if (article) {
        console.log('Multilingual article loaded successfully:', article);
        return article;
      } else {
        console.error('Article not found with ID:', id);
        toast({
          title: 'Article Not Found',
          description: 'Could not find the article you are trying to edit.',
          variant: 'destructive',
        });
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching multilingual article:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch article data. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    isEditMode,
    loadArticleData
  };
};
